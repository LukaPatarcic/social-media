<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SecurityController extends AbstractController
{

    /**
     * @Route("/register/email")
     * @param Request $request
     * @return Response
     */
    public function emailValidation(Request $request)
    {
        $email = $request->getContent();
        $exists = $this->getDoctrine()->getRepository(User::class)->findOneBy(['email' => $email]);
        if($exists) {
            return $this->json([],Response::HTTP_BAD_REQUEST);

        }
        return $this->json([],Response::HTTP_OK);
    }

    /**
     * @Route("/register", name="app_register")
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @return Response
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder): Response
    {
        $data = json_decode($request->getContent(),true);
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->submit($data);

        if($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors]);
        }

        $password = $passwordEncoder->encodePassword($user, $data['password']['first']);
        $user->setPassword($password);

        // 4) save the User!
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
     * @return Response
     * @throws Exception
     */
    public function login(Request $request, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $passwordEncoder): Response
    {
        $data = json_decode($request->getContent(),true);
        if (empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'Empty username or password'], Response::HTTP_BAD_REQUEST);
        }
        $userRepo = $entityManager->getRepository(User::class);
        $user = $userRepo->findOneBy(['email' => $data['email']]);
        if(!$user) {
            return $this->json(['error' => 'Invalid username'],Response::HTTP_BAD_REQUEST);
        }

        // Check if the password inserted is correct
        if (!$passwordEncoder->isPasswordValid($user, $data['password'])) {
            return $this->json(['error' => 'Invalid password'], Response::HTTP_BAD_REQUEST);
        }
        $token = hash('sha256',$user->getEmail().bin2hex(random_bytes(64)));
        $user->setToken($token);
        $user->setExpiresAt(new \DateTime('+8 hours'));
        $entityManager->flush();

        return $this->json([
            'token' => $token
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

    private function getErrorMessages(FormInterface $form) {
        $errors = [];

        foreach ($form->getErrors() as $key => $error) {
            if ($form->isRoot()) {
                $errors[] = 'Oops... Something went wrong!';
            } else {
                $errors[] = $error->getMessage();
            }
        }

        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors = $this->getErrorMessages($child);
            }
        }

        return $errors;
    }
}
