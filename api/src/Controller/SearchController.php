<?php

namespace App\Controller;

use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
use App\Services\DataTransformer;
use App\Services\Image;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class SearchController extends BaseController
{
    /**
     * @Route("/search", name="search")
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse
     */
    public function index(Request $request, DataTransformer $transformer)
    {
        $user = $this->getUser();
        $data = $request->query->get('search');

        $q = $this->getDoctrine()->getRepository(User::class)->findByQuery($data,$user);

        if(!$q) {
            return  $this->json([],Response::HTTP_OK);
        }

        $q = $transformer->searchQueryDataTransformer($q,$user);

        return $this->json($q,Response::HTTP_OK);
    }
}
