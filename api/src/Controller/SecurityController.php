<?php

namespace App\Controller;

use App\Entity\PushNotification;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Services\Mailer;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTEncodeFailureException;
use Mobile_Detect;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SecurityController extends BaseController
{
    /**
     * @Route("/auth")
     * @IsGranted("ROLE_USER")
     */
    public function auth()
    {
        return $this->json(['success' => 1]);
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
            return $this->json(['error' => $errors],Response::HTTP_BAD_REQUEST);
        }

        $password = $passwordEncoder->encodePassword($user, $data['password']['first']);
        $user->setPassword($password)
            ->setDeletesIn(new DateTime('+ 1 day'))
            ->setVerificationCode(hash('sha256',$user->getEmail().bin2hex(random_bytes(32))));

        $sendMail = $mailer->verificationEmail($user->getEmail(),$user->getFullName(),$user->getVerificationCode());
        if(!$sendMail) {
            return $this->json(['error' => ['Oops something went wrong please try again later...']],Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['success' => 1],Response::HTTP_CREATED);
    }

    /**
     * @Route("/login", name="app_login", methods={"POST"})
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param JWTEncoderInterface $encoder
     * @return Response
     * @throws JWTEncodeFailureException
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
        $user = $userRepo->findOneBy(['email' => $data['email']]);

        if(!$user) {
            return $this->json(['error' => 'Invalid email or password'],Response::HTTP_BAD_REQUEST);
        }

        if(!$user->getIsVerified()) {
            return $this->json(['error' => 'You need to verify your account to log in'],Response::HTTP_BAD_REQUEST);
        }

        // Check if the password inserted is correct
        if (!$passwordEncoder->isPasswordValid($user, $data['password'])) {
            return $this->json(['error' => 'Invalid email or password'], Response::HTTP_BAD_REQUEST);
        }
        //encode JWT
        $token = $encoder->encode(['id' => $user->getId()]);

        if(isset($data['notificationKey'])) {
           $this->saveNotificationKey($data['notificationKey'],$user);
        }

        $entityManager->flush();

        return $this->json(['token' => $token,'user' => $user],Response::HTTP_CREATED,[],[
            'groups' => 'user_info'
        ]);
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
     * @IsGranted("ROLE_USER")
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
     * @return RedirectResponse|Response
     */
    public function emailVerification(string $verificationCode)
    {
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['verificationCode' => $verificationCode]);
        if(!$user) {
            return $this->json(['error' => 'Verification code is invalid'],Response::HTTP_BAD_REQUEST);
        }
        $user->setIsVerified(1)
            ->setDeletesIn(null)
            ->setVerificationCode(null);
        $this->getDoctrine()->getManager()->flush();

        $detect = new Mobile_Detect;
        if($detect->isMobile() or $detect->isTablet()) {
            return $this->render('redirectToMobile.html.twig');
        }
        return $this->redirect($_ENV['FRONTEND_URL'].'login?verified=true');
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

    /**
     * @Route("/verify/user", name="verify_user", methods={"POST"})
     */
    public function verifyUser(Request $request)
    {
        $data = json_decode($request->getContent(),true);
        if(!isset($data['profileName']) || !isset($data['email']) || (!isset($data['secret']) && $data!='app')) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $repository = $this->getDoctrine()->getRepository(User::class);
        $profileName = $repository->findOneBy(['profileName' => $data['profileName']]);
        $email = $repository->findOneBy(['email' => $data['email']]);

        return $this->json(['profileName' => (bool)$profileName, 'email' => (bool)$email]);
    }
}
