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
        $mail = new Mailer($mailer,$environment);
        $send = $mail->contactEmail($data);

        if(!$send) {
            return $this->json([],Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['success' => 1], Response::HTTP_OK);

    }

}