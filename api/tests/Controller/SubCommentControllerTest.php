<?php

namespace App\Tests\Controller;

use App\Controller\SubCommentController;
use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class SubCommentControllerTest extends TestCase
{

    /**
     * @param $data
     * @param $assert
     * @dataProvider SubCommentPostListTestDataProvider
     */
    public function testSubCommentPostList($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->get($_ENV['BACKEND_URL'] . 'subcomment/' . $data['id'], [
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    public function testDeleteSubComment()
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->delete($_ENV['BACKEND_URL'] . 'subcomment/1', [
            'http_errors' => false
        ]);

        $this->assertEquals(404, $request->getStatusCode());
    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider SubCommentAddTestDataProvider
     */
    public function testSubCommentAdd($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->post($_ENV['BACKEND_URL'] . 'subcomment', [
            'json' => $data,
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    public function SubCommentPostListTestDataProvider()
    {
        return [
            [
                ['id' => 1],
                [200]
            ],
            [
                ['id' => 999],
                [404]
            ]
        ];
    }

    public function SubCommentAddTestDataProvider()
    {
        return [
            [
                [
                    "comment" => 1,
	                "text" => "Hello World3"
                ],
                [201]
            ],
            [
                [
                    "comment" => 9999,
	                "text" => "Hello World3"
                ],
                [400]
            ],
            [
                [
                    "a"
                ],
                [400]
            ]
        ];
    }
}
