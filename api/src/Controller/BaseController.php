<?php


namespace App\Controller;


use App\Entity\PushNotification;
use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;

abstract class BaseController extends AbstractController
{
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

    public function saveNotificationKey($notification,$user) {
        $notificationKeyExists = $this->getDoctrine()->getRepository(PushNotification::class)->findOneBy(['phone' => $notification,'user' => $user]);
        if(!$notificationKeyExists) {
            $notificationKey = new PushNotification();
            $notificationKey->setUser($user)
                ->setPhone($notification);
            $user->addPushNotification($notificationKey);

            $this->getDoctrine()->getManager()->persist($notificationKey);
        }
    }

}