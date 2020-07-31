<?php

namespace App\Tests\Controller;

use App\Controller\CommentController;
use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class CommentControllerTest extends TestCase
{

    /**
     * @param $data
     * @param $assert
     * @dataProvider CommentPostListTestDataProvider
     */
    public function testCommentPostList($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODEyNzUxOTUsImV4cCI6MTYyNDUxOTk5NSwiaWQiOjI0fQ.TNlSaQthDElGK780avs2s9nUWbfdhAf6HV2Sg0v28GbTjlQtKHrUB1eg7OgUP2dje-Sz0NTkAZuv4iLUM575O9Rvub5teRxmlZGVFtcimz7krnwwcxPQLpu1XbEL91IGyfXs56dvlCdSxUAbtryGFZoM4GARfDBrdof4QeeOsDckXtx1L_Xl0ibydb0SxdQs9wnSTCqGpEMdTifYhy2mO1mEh1lpdahiYJDjLfKm5pAN7dAztajaRfO1Xkv8pqtQNULI3IjdzUKqc2GI6sAThloyyNtCHXzq3wOSb1g9BHmDIAbO84o9U64kV32Bxj-IBu4mE83yyXhA0bbOUgZ8VzIlwU5v7wvY8KlxMxlG2Cs9pOzguNknZ8VNwXbnraCMsjaPrrpoiCQCu04P22Ax6nmG5e8wt8UK-ViM12X6laxwDlHEpdcoj4GgPpW3kGt0X3xnrWBZXfs6A9rBXFRLuUvOeZMESrw47wa94f2zu2E2naiLGO94eSTY7LKP5L2OFCzoo0BpMGPq17O49Khu6lQyFjml5JJgyPR11HxromnVdsYToJnS0V7udgkIR_KnMLMsIQYdvdJNAgYqm9oX9JAxOgx1Yd1i1Q8zrylJSKlH5jKPYOJFtCghgsLvbSNjfTUaoubSkB0n7uZGg2_G6xxV5KMSToZtTAsNRh5qHRA']
        ]);
        $request = $client->get($_ENV['BACKEND_URL'] . 'comment/' . $data['id'], [
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider CommentPostAddTestDataProvider
     */
    public function testCommentAdd($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODEyNzUxOTUsImV4cCI6MTYyNDUxOTk5NSwiaWQiOjI0fQ.TNlSaQthDElGK780avs2s9nUWbfdhAf6HV2Sg0v28GbTjlQtKHrUB1eg7OgUP2dje-Sz0NTkAZuv4iLUM575O9Rvub5teRxmlZGVFtcimz7krnwwcxPQLpu1XbEL91IGyfXs56dvlCdSxUAbtryGFZoM4GARfDBrdof4QeeOsDckXtx1L_Xl0ibydb0SxdQs9wnSTCqGpEMdTifYhy2mO1mEh1lpdahiYJDjLfKm5pAN7dAztajaRfO1Xkv8pqtQNULI3IjdzUKqc2GI6sAThloyyNtCHXzq3wOSb1g9BHmDIAbO84o9U64kV32Bxj-IBu4mE83yyXhA0bbOUgZ8VzIlwU5v7wvY8KlxMxlG2Cs9pOzguNknZ8VNwXbnraCMsjaPrrpoiCQCu04P22Ax6nmG5e8wt8UK-ViM12X6laxwDlHEpdcoj4GgPpW3kGt0X3xnrWBZXfs6A9rBXFRLuUvOeZMESrw47wa94f2zu2E2naiLGO94eSTY7LKP5L2OFCzoo0BpMGPq17O49Khu6lQyFjml5JJgyPR11HxromnVdsYToJnS0V7udgkIR_KnMLMsIQYdvdJNAgYqm9oX9JAxOgx1Yd1i1Q8zrylJSKlH5jKPYOJFtCghgsLvbSNjfTUaoubSkB0n7uZGg2_G6xxV5KMSToZtTAsNRh5qHRA']
        ]);
        $request = $client->post($_ENV['BACKEND_URL'] . 'comment', [
            'json' => $data,
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    public function CommentPostListTestDataProvider()
    {
        return [
            [
                [
                    'id' => 161
                ],
                [
                    200
                ]
            ],
            [
                [
                    'id' => 999
                ],
                [
                    400
                ]
            ]
        ];
    }

    public function CommentPostAddTestDataProvider()
    {
        return [
            [
                [
                    "post" => "161",
                    "text" => "Hello World3"
                ],
                [
                    201
                ],
                [
                    "post" => null,
                    "text" => null
                ],
                [
                    400
                ],
                [
                    "asd" => "asd"
                ],
                [
                    400
                ]
            ]
        ];
    }
}
