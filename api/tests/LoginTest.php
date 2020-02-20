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
        $request = $client->post('http://localhost:8000/login',[
            'json' => $data[0],
            'http_errors' => false
        ]);

        $this->assertEquals($assert[1],$request->getStatusCode());
        if($request->getStatusCode() !== 200) {
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
                    json_encode(['error' => 'Invalid email']),
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
                    ['email' => 'patarcic98@gmail.com', 'password' => 'punopetica98']
                ],
                [
                    json_encode(["token" => "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODIyMzE0MzUsImV4cCI6MTYyNTQ3NjIzNSwiaWQiOjI0fQ.JRZGwu_2mNGJ37qmxaUo4pbOZ0Q5wY9E5_sOF33UYuSRrBb5mYFnygxhRgDlE_Qq8zIKZSpEM7-HtmwASYRU2MiQGd3rciQpLHd5lggsiT1bwQ5_DtuAJjrhy1ieVIyOlb_xZ8Tgh9yXqA_sz4q7vVJdB7SUCHQt3zFKZzixdzpEfpqlKisdg9JmH_vxJ4kjX5-ALT3dzRlcm-1EbrfWhJgODjXyRmqzidzBeyq2haAaVvpcWEHstriAvlVr7X-9Pnh-WGor_4tsUwiLoeFNNyxrLfe7CKXKuGM8YKAT8fnpW4GG-LyJo35xko-vre1QYOY1ixqPIG7wTN1mOhS8S7RNrJjtKdStKEqfgg9nd1r8YU0kWUlkGjQpZxs4ZsP9bosLQe2hHjainu4TSQBeutN2IjJWPqI1LK1RGNwcgu-0eHAyBpQqc9Rqf2vkmnWqapL76LB0MdN-vb1KBVGpGguZBU1uMxnrwRKBzYa98m-B0xN6UPHtM4dfJINLc9boxDrwAjt_WFzcj9O68QxhdkbEDiOj_kDISXAkV6aGBcpRFh-gpZQlsQX8pHfPjUGwVh76V675xy-JlsPobpRZy-rMMHRuTWTcY3C8MuM3zbCSqvDjDAz_A5XuPq4XXZqNJL91AMeVpMy_6ofeKqES85j5uJbkgqFmfLpdsjgB2Es"]),
                    200
                ]
            ]
        ];
    }

}
