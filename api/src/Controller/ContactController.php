<?php


namespace App\Controller;


use App\Services\Mailer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Twig\Environment;

class ContactController extends BaseController
{
    /**
     * @Route("/contact", name="app_contact", methods={"POST"})
     * @param \Swift_Mailer $mailer
     * @param Environment $environment
     * @param Request $request
     * @return JsonResponse
     */
    public function contact(\Swift_Mailer $mailer, Environment $environment, Request $request)
    {
        $data = json_decode($request->getContent(),true);

        if(!$data) {
            return $this->json(['error' => 'Bad request'],Response::HTTP_BAD_REQUEST);
        }

        $allowedKeys = ['email','message','name','subject'];
        foreach ($data as $key => $value) {
            if(!in_array($key,$allowedKeys)) {
                return $this->json(['error' => 'Oops... something went wrong please try again later!'],Response::HTTP_BAD_REQUEST);
            }
        }

        $mail = new Mailer($mailer,$environment);
        $send = $mail->contactEmail($data);

        if(!$send) {
            return $this->json(['error' => 'Oops... something went wrong please try again later!'],Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['success' => 'Mail sent successfully'], Response::HTTP_OK);

    }

}