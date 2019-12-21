<?php


namespace App\Controller;


use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;

abstract class BaseController extends AbstractController
{

    /**
     * @param Request $request
     * @return User|null
     */
    public function getApiUser(Request $request)
    {
        $token = $request->headers->get('X-AUTH-TOKEN');
        /** * @var User $user */
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['token' => $token]);
        return $user;
    }

    /**
     * @param FormInterface $form
     * @return array
     */
    public function getErrorMessages(FormInterface $form) {
        $errors = [];
        foreach ($form->getErrors(true, true) as $error) {
            $errors[] = $error->getMessage();
        }

        return $errors;
    }

}