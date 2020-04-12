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

    public function verificationEmail(string $email, string $fullName, string  $verificationCode)
    {
        return $this->mailTemplate(
            'Account Verification',
            'emails/registration.html.twig',
            [
                'fullName' => $fullName,
                'verification' => $_ENV['BACKEND_URL'].'email/verify/'.$verificationCode,
                'email' => $email
            ]
        );
    }

    public function forgottenPasswordEmail(string $email)
    {
        return $this->mailTemplate(
            'Forgotten Password',
            'emails/forgottenPassword.html.twig',
            ['email' => $email]
        );
    }


    public function contactEmail(array $data)
    {
        return $this->mailTemplate(
            'Contact Message',
            'emails/contact.html.twig', $data
        );
    }

    private function mailTemplate(string $subject, string $twigTemplate, array $data): bool
    {
        $message = (new \Swift_Message($subject))
            ->setFrom('luka@lukaku.tech','noreply')
            ->setTo($data['email'])
            ->setBody(
                $this->twig->render($twigTemplate, $data),
                'text/html'
            );

        return (bool)$this->mailer->send($message);
    }
}