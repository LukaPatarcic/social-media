<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SearchController extends AbstractController
{
    /**
     * @Route("/search", name="search")
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = $request->query->get('search');
        if(!$data) {
            return $this->json(['error' => 'Bad request'], Response::HTTP_BAD_REQUEST);
        }
        $q = $this->getDoctrine()->getRepository(User::class)->findByQuery($data);
        if(!$q) {
            return  $this->json([],Response::HTTP_OK);
        }
        return $this->json($q,Response::HTTP_OK);
    }
}
