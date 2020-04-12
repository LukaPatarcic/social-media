<?php


namespace App\Controller;


use App\Services\Mailer;
use App\Services\PushNotification;
use Symfony\Component\Routing\Annotation\Route;
use Twig\Environment;

class HomeController extends BaseController
{

    /**
     * @Route("/test/notification")
     */
    public function notificationTest()
    {
        $notification = new PushNotification();
        $notification->setToMultiple(
            ['fOUc691rRYmOUXPEc3_Ota:APA91bHRhTusdM4Rewiu4K31msLqUXH8SriPq3UbRin8jpXjXnWQto7OSG5ipmGdb_kkgBEVJikBmeeYxy5f9Mcfko_yXjd2ZkQzkaAAQcjZir9fIHBKXCCyIjuFuKu2hadW4hIHc4iI']);
        $response = $notification->setTitle('Test Title')
            ->setBody('Test Body aaaaa')
            ->sendNotification();
        return $this->json($response);

    }

    /**
     * @Route("/test/email")
     */
    public function emailTest(\Swift_Mailer $mailer,Environment $environment)
    {
        $mail = new Mailer($mailer,$environment);
        $send = $mail->verificationEmail('patarcic98@gmail.com','Luka Patarcic','test',);
        return $this->json($send);

    }

    /**
     * @Route("/test/mobileAppRedirect")
     */
    public function mobileAppRedirectTest()
    {
       return $this->render('redirectToMobile.html.twig');

    }
}