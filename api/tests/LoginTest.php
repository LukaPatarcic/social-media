<?php

namespace App\Tests;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\RequestOptions;
use PHPUnit\Framework\TestCase;

class LoginTest extends TestCase
{
    /**
     * @param $data
     * @param $assert
     * @dataProvider LoginTestDataProvider
     */
    public function testLogin($data,$assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json']
        ]);
        $request = $client->post($_ENV['BACKEND_URL'].'login',[
            'json' => $data[0],
            'http_errors' => false
        ]);
        $this->assertEquals($assert[1],$request->getStatusCode());
        if($request->getStatusCode() > 300) {
            $this->assertEquals($assert[0],$request->getBody()->getContents());
        }
    }

    public function LoginTestDataProvider()
    {
        return [
            [
                [
                    ['email' => '', 'password' => '']
                ],
                [
                    json_encode(['error' => 'Empty email or password']),
                    400
                ]
            ],
            [
                [
                    ['email' => 'asd', 'password' => 'asd']
                ],
                [
                    json_encode(['error' => 'Invalid email or password']),
                    400
                ]
            ],
            [
                [
                    ['asd' => 'asd', 'asd' => 'asd']
                ],
                [
                    json_encode(['error' => 'Empty email or password']),
                    400
                ]
            ],
            [
                [
                    ["email" => "patarcic98@gmail.com","password" =>"punopetica98"]
                ],
                [
                    json_encode([]),
                    201
                ]
            ]
        ];
    }

}
