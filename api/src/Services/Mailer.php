<?php


namespace App\Services;


use Swift_Mailer;
use Symfony\Bundle\TwigBundle\DependencyInjection\TwigExtension;
use Symfony\Bundle\TwigBundle\TwigBundle;
use Twig\Environment;

class Mailer
{
    /**
     * @var Swift_Mailer
     */
    private $mailer;
    /**
     * @var Environment
     */
    private $twig;

    public function __construct(Swift_Mailer $mailer, Environment $twig)
    {
        $this->mailer = $mailer;
        $this->twig = $twig;
    }

    public function verificationEmail(string $email, string  $verificationCode): bool
    {
        $message = (new \Swift_Message('Account Verification'))
            ->setFrom('luka@lukaku.tech','noreply')
            ->setTo($email)
            ->setBody(
                $this->twig->render(
                    'emails/registration.html.twig', [
                        'email' => $email,
                        'verificationCode' => $verificationCode
                    ]
                ),
                'text/html'
            );

        return (bool)$this->mailer->send($message);
    }
}