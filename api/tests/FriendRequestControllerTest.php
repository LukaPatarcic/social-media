<?php

namespace App\Tests;

use GuzzleHttp\Psr7\Request;
use PHPUnit\Framework\TestCase;

class FriendRequestControllerTest extends TestCase
{

    /**
     * @param $data
     * @dataProvider FriendRequestControllerTestDataProvider
     */
//    public function testAddFriendRequest($data)
//    {
//        $client = new \GuzzleHttp\Client();
//        $request =$client->post('http://localhost:8000/friend/request',[]);
//        $this->assertTrue(['asd'],$request->getBody());
//    }

//    public function testListFriendRequests()
//    {
//
//    }
//
//    public function testDeleteFriendRequest()
//    {
//
//    }
//
//    public function testAcceptFriendRequest()
//    {
//
//    }

    public function FriendRequestControllerTestDataProvider(): array
    {
        return [
            [
                [
                    'value' => true
                ],
                [
                    'value' => false
                ]
            ]

        ];

    }
}
