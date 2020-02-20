<?php

namespace App\Controller;

use App\Entity\PushNotification;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\JwtTokenAuthenticator;
use App\Services\Mailer;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\LcobucciJWTEncoder;
use Mobile_Detect;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SecurityController extends BaseController
{
    /**
     * @Route("/test")
     */
    public function test()
    {
        return $this->json(['message' => 'Hello from API']);
    }

    /**
     * @Route("/register", name="app_register")
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param Mailer $mailer
     * @return Response
     * @throws Exception
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, Mailer $mailer): Response
    {
        $data = json_decode($request->getContent(),true);;
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->submit($data);

        if($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors]);
        }

        $password = $passwordEncoder->encodePassword($user, $data['password']['first']);
        $user->setPassword($password)
            ->setDeletesIn(new DateTime('+ 1 day'))
            ->setVerificationCode(hash('sha256',$user->getEmail().bin2hex(random_bytes(32))));

        $sendMail = $mailer->verificationEmail($user->getEmail(),$user->getVerificationCode());
        if(!$sendMail) {
            return $this->json(['error' => ['Oops something went wrong please try again later...']]);
        }
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['success' => 1]);
    }

    /**
     * @Route("/login", name="app_login")
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param JWTEncoderInterface $encoder
     * @return Response
     * @throws \Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTEncodeFailureException
     */
    public function login(Request $request,
                          EntityManagerInterface $entityManager,
                          UserPasswordEncoderInterface $passwordEncoder,
                          JWTEncoderInterface $encoder
    ): Response
    {
        $data = json_decode($request->getContent(),true);
        if (empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'Empty email or password'], Response::HTTP_BAD_REQUEST);
        }
        $userRepo = $entityManager->getRepository(User::class);
        /** @var User $user */
        $user = $userRepo->findOneBy(['email' => $data['email'],'isVerified' => 1]);
        if(!$user) {
            return $this->json(['error' => 'Invalid email'],Response::HTTP_BAD_REQUEST);
        }

        // Check if the password inserted is correct
        if (!$passwordEncoder->isPasswordValid($user, $data['password'])) {
            return $this->json(['error' => 'Invalid password'], Response::HTTP_BAD_REQUEST);
        }
        //encode JWT
        $token = $encoder->encode(['id' => $user->getId()]);

        if(isset($data['notificationKey'])) {
           $this->saveNotificationKey($data['notificationKey'],$user);
        }

        $entityManager->flush();

        return $this->json([
            'token' => $token
        ],Response::HTTP_CREATED);
    }

    /**
     * @Route("/logout", name="app_logout")
     * @throws Exception
     */
    public function logout()
    {
        throw new Exception('This method can be blank - it will be intercepted by the logout key on your firewall');
    }

    /**
     * @Route("/logout/android", name="app__android_logout", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAndroid(Request $request)
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(),true);
        $phone = $this->getDoctrine()->getRepository(PushNotification::class)->findOneBy(['user' => $user,'phone' => $data['phone']]);
        if(!$phone) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->remove($phone);
        $em->flush();

        return $this->json([],Response::HTTP_OK);
    }

    /**
     * @Route("/email/verify/{verificationCode}", methods={"GET"})
     * @param User $user
     * @return RedirectResponse|Response
     */
    public function emailVerification(User $user)
    {
        $user->setIsVerified(1)
            ->setDeletesIn(null)
            ->setVerificationCode(null);
        $this->getDoctrine()->getManager()->flush();

        $detect = new Mobile_Detect;
        if($detect->isMobile() or $detect->isTablet()) {
            return $this->render('redirectToMobile.html.twig');
        }
        return $this->redirect($_ENV['FRONTEND_URL']);
    }

    /**
     * @Route("/password/forgotten", name="forgotten_password")
     * @throws Exception
     */
    public function forgottenPassword(Request $request, Mailer $mailer)
    {
        $data = json_decode($request->getContent(),true);
        $sendMail = $mailer->forgottenPasswordEmail($data['email']);
    }
}
