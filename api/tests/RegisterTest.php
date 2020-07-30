<?php

namespace App\Tests;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class RegisterTest extends TestCase
{
    /**
     * @dataProvider RegisterTestDataProvider
     * @param $data
     * @param $assert
     */
    public function testRegistration($data,$assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json']
        ]);
        $request = $client->post($_ENV['BACKEND_URL'].'register',[
            'json' => $data[0],
            'http_errors' => false
        ]);

        $this->assertEquals($assert[1],$request->getStatusCode());
        $this->assertEquals($assert[0],$request->getBody()->getContents());
    }

    public function RegisterTestDataProvider()
    {
        return [
            [
                [
                    ['firstName' => 'Asd', 'lastName' => 'Asd','email' => 'email@mail.com','password' => ['first' => 'asd', 'second' => 'asd']]
                ],
                [
                    json_encode(['error' => ['That email is already registered']]),
                    400
                ]
            ],
            [
                [
                    ['firstName' => '', 'lastName' => '','email' => 'email','password' => ['first' => 'asd', 'second' => 'asdd']]
                ],
                [
                    json_encode(['error' => ["Please enter your first name","Please enter your last name","Please enter a valid email address","Passwords do not match"]]),
                    400
                ]
            ]
        ];
    }

}
