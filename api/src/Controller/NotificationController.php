<?php


namespace App\Controller;


use App\Services\PushNotification;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class NotificationController extends BaseController
{

    /**
     * @Route("/push/notification/friend/request/send")
     * @param Request $request
     * @param PushNotification $notification
     * @return JsonResponse
     */
    public function sendMessage(Request $request, PushNotification $notification)
    {
        $data = json_decode($request->getContent(),true);
        $notification->setTo($data['to']);
        $notification->setTitle('New Follower')
            ->setMessage($data['name'].' started following you');
        $send = $notification->message();

        return $this->json($send);
    }

}