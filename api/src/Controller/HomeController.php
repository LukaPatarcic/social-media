<?php


namespace App\Controller;


use App\Services\PushNotification;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends BaseController
{

    /**
     * @Route("/notification/test")
     */
    public function index()
    {
        $notifiaction = new PushNotification();
        $notifiaction->setToMultiple(
            ['fOUc691rRYmOUXPEc3_Ota:APA91bHRhTusdM4Rewiu4K31msLqUXH8SriPq3UbRin8jpXjXnWQto7OSG5ipmGdb_kkgBEVJikBmeeYxy5f9Mcfko_yXjd2ZkQzkaAAQcjZir9fIHBKXCCyIjuFuKu2hadW4hIHc4iI']);
        $response = $notifiaction->setTitle('Test Title')
            ->setBody('Test Body aaaaa')
            ->sendNotification();
        return $this->json($response);

    }
}