<?php

namespace App\Tests\Controller;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class ProfileControllerTest extends TestCase
{

    public function testUser()
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->get($_ENV['BACKEND_URL'] . 'user', [
            'http_errors' => false
        ]);

        $this->assertEquals(200, $request->getStatusCode());
    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider EditProfilePictureTestDataProvider
     */
    public function testEditProfilePicture($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->patch($_ENV['BACKEND_URL'] . 'user/edit/picture', [
            'json' => $data,
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider EditProfileTestDataProvider
     */
    public function testUserEdit($data, $assert)
    {
        $client = new Client([
            'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODM1OTY0NTksImV4cCI6MTYyNjg0MTI1OSwiaWQiOjI0fQ.qN13ue92SWrNkvrvVMPPXnKn8VtToqaGWPauzQ77w_MK02iMW7z_b4MN32dl8yhuQx0DcNXgS6o2EvzqRdu0f3WxKkBMxKHC0NeI9I-DLbJ5TAZUfwJdx0UZWBB6ExtZObZoK_0ic-0U9HIac_EfPJFMoLTUhC1hmBShZT5wy-yMPbHHtBNpwk4WYCrfIBtfduMgpbf4Y3_DOL-vRrxnOnOQpk59C6pSPcAP-9RlFyUCH2Jt5o8-bLkFF1FGeU-R83xb_denUyYD4luLNcNlMhq_SYfxFcmYQGJvmC0ngxY7q82CcvXPjYWlKk1ecJ-3GtmXtyLIBHs4GdLX7uqZRYOSAMglrR6bgG5S5QhWEHE4N_Gji0amrzCttcsVRgMPr7KkmWLBD6Px3K1fzt9yvI75UjVqO47Jos8WE7jiRDHeXi10siSMbHfF-Fcs8kR6Xd085H-wHY7fkeyRPNDuotzoKxFxmRdMizSJcWdEpaFlVSvW3SDXETj_6dPmobuZ56mrE1BLoIzp1D3Rvzn4UvthjjXtdFlOtFGZ-W-BvwHecqL_4xffBjCkhAdZen13rSjr7X7ZA1dtfQ2KU5rGPg-w6o9hr7qvQ9oTdGd_rQpGXAZ8qjxjGGYBH_X65BkqMxqFA1eF5F-fOZs6BR24gRr7Evzwo5yd8WYVREOHMgc']
        ]);
        $request = $client->patch($_ENV['BACKEND_URL'] . 'user/edit', [
            'json' => $data,
            'http_errors' => false
        ]);

        $this->assertEquals($assert[0], $request->getStatusCode());
    }

    public function EditProfilePictureTestDataProvider()
    {
        return [
            [
                [
                    "image" => "asd"
                ],
                [400]
            ],
            [
                [
                    "image" => "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCABkAGQDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAwQHAQL/xAA7EAACAQMDAgQEAwUGBwAAAAABAgMABBEFEiEGMRMiQVEHFGFxIzKhFYGRktEWM0JSsfBUYmSys9Lh/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAMCAQQF/8QAHhEBAAICAgMBAAAAAAAAAAAAAAECAxESITFBUQT/2gAMAwEAAhEDEQA/AOzUpSgUpSgUpSgUpSgUpSgUpSgUpSgrt/1509paSyXlzcRRQyGJ5fkpjGGBKkbguDyCO9asvxO6Shs47yXUJ0t5ThJWspwrd+x2c9j/AArQvOkdcknkEQ0ySEzu6mWR1Yq0zSjsvBBb3I47V9SdMdQzWvysltopi8TeAJZAV85bAIXgc4P0oMo+LvQxIA1kkn/pZv8A0rLL8VOjYLprWXVJFnR9jRmzm3Bu2MbO9QGt/DvX9ZtJ7YHR7dJirZUuSGBXzfk7naf5jXuu/D3X9cijjJ0m1WO4WdTA7qwwWJAOzjO4c/8AKKC0H4g9OqrsZ7wBJBEx/Z9x5XPZT5O/I4+te2fxA6avr4WVvezGczi32taTKFkOcKSVAB4Pf2qAn6L6jkjuI45dPjW5lWR/x3LDBQna2zIyY19f3etZ7To7W01BHmXSo7b9pJqDmJ5Wk3Akt3ABznHbgcc96C0nqLSV1V9La7C3SNtZGRgAdm/G4jbnbzjPavo6/pQvhZfOx+OVDBecYILZ3duwJ7+lQ+o9BafqWs3eqSXdzHLdA7hGEGPwhH327sYGcZxn0rWHwy0gRxp81d/hMGU7l7gsRkYwRljweOKC1/O2n/FQ/m2/3g7+335FfB1G0W5kt3mVJItu4P5R5u2CeD+6qyfhrpDvM8txcyNMzvltvlZhjI47/WtzWuh9M12+mu7uSbfMmwhduF8hUEZHcA5+9BJX2v6Xplz8ve3XgP4bSZdGCkAFj5sYzgE4znisH9rdC2xs1+EWUMVd43VfLncCSMAja3B547Vh1npK31y/NzdX10ENs1v4C7NgDAgkZUkN25B9AO1ab9AWcu0S6jeyIVmEiN4ZEjSk73/Lwx3YyMYHHvQWDTtUstWtBdWM4mi3Fc4III7gg4IP3pWDRNFh0Oya2imlnMkrSySykbnZu54AHoOwpQSVKUoFasmpWcM7wS3EaSoocqxwcHsf0rLNPFbxNJK6oqjJJNUPVHlvZpbjavjufwyWIAHoDj0FRy5eHhutdugV7WhpUYWyidpA8hRQ5U5BYAA49u1b1Vidxth7SlK6FeBlbsQftUV1HrEeh6TLeSSqjY2RKf8AG57AfWuZrbaldxS3kMzR+bew8bDEk+wqWTJwnWlKU5e3YqVz3oTqi4+ZfS9VuMhzm3eR8nPqpP6iuhVutotG4ZtWazqSlKVpkqu6/fyif5aOQoqgFtpwST6GrFVM1zI1m6weSV/7RUM8zFem6RuUe4WXk8/evGZ8qTjvgH2rPPatatEVYSxyoHViMfetZpDJjaoG1ge9fPnp6I7ZY2McmVZlJOchjU/a390NAvXSUmaBGZHbkjjI79+aghbTCA3TFdgYLj3z7VI2W5dB1ebI/uTx9lP9avhmYsnfwjtO601y48O2e1tfGdwgkYnHOO4H3qfvb+90qDxtV1nT7VT2xbsSftluf4VzXStTNtfC8nLtHABKwHqAV/pWj1X1Umtah88QCpUeEmMlF+vua9M5PiE9Q6D1dHK3T1tdSX8d9BJcxEb4E27WPccZBx6/Woh9Pa0sJIrJVVnbzM3c/U1z/T9buL25hsXZvAWVGWMcAedf610BtQ8HbHM673G5Qfap5p6VxT7Vi8tG09WlkfxHJ7jsK6x0Vdz33SVjcXLl5WVgWPcgOwH6AVyjqHUTPOsbgIgOAPeuo9Atu6LsD7+J/wCRq5+fe1c/cQsdKUr2PKVVtfspE1BrkjMcuMH6gYx+lWmsU9vHcxGOVcqankpzrpqs6lT7p0udKswiMDbO0b57Z4NaqWczwyTomIoyuc+hJ9KtN9pEK6XLDbRYbIcepYj/AOcV5JZP/Z4W8UZ8QquVxgk5BNeW2CZnv4pGTUK+xU2EMJLmUuZD7Bew/wBKlbXTLh+m7yGMDxbpGCZOO4wK349EtGhg8VSXjjCbgcZFSSqFUKBgDgCq48UxO5YtbbmZ+GmqGzmVbu3Ek0ZjIYnCg+vbntUFL8H+ojGEF7YtgYB2lePbIFdknvLa2ZVnnjjL52hmwTj2rGmp2Mqb47uF1AzlXBGM4/1q3CGduGr8PtY6f1ANdvBOzGMLFEWJcGRe3H0q/r0LeTzC7uJId4TEceT5R9auR1PT9iObyDa/5TvHP2r4bUrSeKRLW+tzKFODvBC+xNZnHEzuXYtrw5xpnRLdTahNLc3PgWtrLsZY+WcgdgfQc966Zp9hbaZYxWVpGI4IRhVH+/eoXQn0rQ9PuM6lBKS5mldDx2Hb37VNR6jZSyrFHdwvI2dqBwScDJ4+1dx041dvblLZpSlUYR2rJd+C8trklIJQEXOWcgbePuDWk8XUUsoBmjjjBXOzbngrk5I9cNx9az6nba1LOz6ferEm0KEZVI7Nk8jOc7cc478VitLPqBblludRRrcoQrhF3htvBIxjuT/IvuaDHfQ9SGWZ7O4jx5xCG2gDJXbkYOcAN6+tevb9R+Nvju4wGIJVlVlXluAOD/lyc1iNr1Y0PN9brLg/kC7cnBGcr2GWH7lPvX1Z6VrUd7Cbi8LQRyu5IZedwfkjb3yy/TjtQZLW316ERlpUZnuQ825gfw8KCBxx/iIx9Pc1PVV3s+sfliF1G2M3GCFUDtzny/U/yj3NWWJWSJFdy7AAFjjJPvxQROtXthaXUHzNm9xMBuQqudoyMmo7do6X0qDTrhkaOIbAg2HPmGB7jj+J9iatG1d27aN2MZxzivaCq3d7ppt0ZdHm8oLIAu0gqTxxnHb+BraE2kWzG2XSpFjmbwspENjdx78Dv/s1YKUFb+Z0V98S6TIwLhTtjXDHsMc/X9Tnsce22o6NDdxvHpssM7bQGMQDDOQOc+g/QirGFCjCgAD0FeFVLBiBkdj7UH1SlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKD/2Q=="
                ],
                [200]
            ]
        ];
    }

    public function EditProfileTestDataProvider()
    {
        return [
            [
                [
                    "asd" => "asd"
                ],
                [400]
            ],
            [
                [
                    "firstName" => "Luka",
                    "lastName" => "Patarcic",
                    "email" => "patarcic98@gmail.com",
                    "profileName" => "Khallion98",
                    "password" => [
                        "first" => "punopetica98",
                        "second" => "punopetica98"
                    ]
                ],
                [200]
            ]
        ];
    }
}
