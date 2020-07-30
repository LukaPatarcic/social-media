<?php

namespace App\Tests\Services;

use App\Services\PushNotification;
use PHPUnit\Framework\TestCase;

class PushNotificationTest extends TestCase
{
    /**
     * @param $data
     * @param $assert
     * @dataProvider PushNotificationDataProvider
     */
    public function testPushNotifications($data,$assert)
    {
        $notification = new PushNotification();
        $notification->setTitle($data['title'])->setBody($data['message'])->setToMultiple($data['notification']);
        $send = $notification->sendNotification();
        $this->assertEquals($assert[0],$send['success']);
    }

    public function PushNotificationDataProvider()
    {
        return [
            [
                [
                    "title" => "Title",
                    "message" => "Message",
                    "notification" => ["fL4buLoXTMi71lGpVeKWeT:APA91bFv2O6qHMi6Jr5e5LYd1T9qdRpAVVIKjPvRULxPqnP1tJf9cW7PbcgrNX24KYZm_fZxOYmqUHx1VQ-zDs-qmU3fP_r8GC0BEW4bPQawZjcBB26O__agnJ8FWgG0ebVtOWuOGivS"]
                ],
                [
                    1
                ]
            ],
            [
                [
                    "title" => "tit",
                    "message" => "Mess",
                    "notification" => ["asd"]
                ],
                [
                    0
                ]
            ]
        ];
    }

}
