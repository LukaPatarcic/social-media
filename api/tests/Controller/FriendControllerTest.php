<?php

namespace App\Tests\Controller;

use App\Controller\FriendController;
use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class FriendControllerTest extends TestCase
{

    /**
     * @param $data
     * @param $assert
     * @dataProvider DeleteFriendTestDataProvider
     */
    public function testDeleteFriend($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODEyNzUxOTUsImV4cCI6MTYyNDUxOTk5NSwiaWQiOjI0fQ.TNlSaQthDElGK780avs2s9nUWbfdhAf6HV2Sg0v28GbTjlQtKHrUB1eg7OgUP2dje-Sz0NTkAZuv4iLUM575O9Rvub5teRxmlZGVFtcimz7krnwwcxPQLpu1XbEL91IGyfXs56dvlCdSxUAbtryGFZoM4GARfDBrdof4QeeOsDckXtx1L_Xl0ibydb0SxdQs9wnSTCqGpEMdTifYhy2mO1mEh1lpdahiYJDjLfKm5pAN7dAztajaRfO1Xkv8pqtQNULI3IjdzUKqc2GI6sAThloyyNtCHXzq3wOSb1g9BHmDIAbO84o9U64kV32Bxj-IBu4mE83yyXhA0bbOUgZ8VzIlwU5v7wvY8KlxMxlG2Cs9pOzguNknZ8VNwXbnraCMsjaPrrpoiCQCu04P22Ax6nmG5e8wt8UK-ViM12X6laxwDlHEpdcoj4GgPpW3kGt0X3xnrWBZXfs6A9rBXFRLuUvOeZMESrw47wa94f2zu2E2naiLGO94eSTY7LKP5L2OFCzoo0BpMGPq17O49Khu6lQyFjml5JJgyPR11HxromnVdsYToJnS0V7udgkIR_KnMLMsIQYdvdJNAgYqm9oX9JAxOgx1Yd1i1Q8zrylJSKlH5jKPYOJFtCghgsLvbSNjfTUaoubSkB0n7uZGg2_G6xxV5KMSToZtTAsNRh5qHRA']
        ]);
        $request = $client->delete($_ENV['BACKEND_URL'] . 'friend/' . $data['id'], [
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());

    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider ListFollowingTestDataProvider
     */
    public function testListFollowing($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->get($_ENV['BACKEND_URL'] . 'following', [
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider ListFollowersTestDataProvider
     */
    public function testListFollowers($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->get($_ENV['BACKEND_URL'] . 'followers', [
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    public function DeleteFriendTestDataProvider()
    {
        return [
            [
                [
                    "id" => 1
                ],
                [
                    404
                ]
            ]
        ];
    }

    public function ListFollowingTestDataProvider()
    {
        return [
            [
                [],
                [
                    200
                ]
            ]
        ];
    }

    public function ListFollowersTestDataProvider()
    {
        return [
            [
                [],
                [
                    200
                ]
            ]
        ];
    }
}
