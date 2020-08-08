<?php

namespace App\Tests\Services;

use App\Services\Mailer;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MailerTest extends KernelTestCase
{
    private $mailer;
    private $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->mailer = self::$container->get('swiftmailer.mailer.default');
        $this->twig = self::$container->get('twig');
    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider TestContactEmailDataProvider
     */
    public function testContactEmail($data, $assert)
    {
        $mailer = new Mailer($this->mailer, $this->twig);
        $send = $mailer->contactEmail($data);
        $this->assertEquals($assert[0],$send);
    }

    /**
     * @param $data
     * @param $assert
     * @dataProvider TestVerificationEmailDataProvider
     */
    public function testVerificationEmail($data, $assert)
    {
        $mailer = new Mailer($this->mailer, $this->twig);
        $send = $mailer->verificationEmail($data['email'], $data['fullName'], $data['verification']);
        $this->assertEquals($assert[0],$send);

    }

    public function TestContactEmailDataProvider()
    {
        return [
            [
                [
                    "name" => "Name",
                    "email" => "patarcic98@gmail.com",
                    "subject" => "Subject",
                    "message" => "Message"
                ],
                [
                    true
                ]
            ],
            [
                [
                    "ad" => "asd",
                    "email" => "asd",
                    "subject" => "messsage"
                ],
                [
                    false
                ]
            ]
        ];
    }


    public function TestVerificationEmailDataProvider()
    {
        return [
            [
                [
                    "email" => "patarcic98@gmail.com",
                    "fullName" => "Full Name",
                    "verification" => "sdjhgjshdjkhsdjhfjkhsjkdfhjk"
                ],
                [
                    true
                ]
            ],
            [
                [
                    "email" => "asd",
                    "fullName" => "Full Name",
                    "verification" => "sdjhgjshdjkhsdjhfjkhsjkdfhjk"
                ],
                [
                    false
                ]
            ]
        ];
    }
}
