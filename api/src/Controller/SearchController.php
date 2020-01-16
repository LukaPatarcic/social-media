<?php

namespace App\Controller;

use App\Entity\User;
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
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $user = $this->getApiUser($request);
        $data = $request->query->get('search');

        $q = $this->getDoctrine()->getRepository(User::class)->findByQuery($data,$user);

        if(!$q) {
            return  $this->json([],Response::HTTP_OK);
        }

        $friends = $user->getFriends()->toArray();
        $requests = $user->getFromUser()->toArray();

        foreach ($q as $k=>$value) {
            if(!$friends) {
                $q[$k]['following'] = false;
            } else {
                foreach ($friends as $friend) {
                    if ($friend->getFriend()->getId() == $value['id']) {
                        $q[$k]['following'] = true;
                        break;
                    } else {
                        $q[$k]['following'] = false;
                    }
                }
            }

            if(!$requests) {
                $q[$k]['requested'] = false;
            } else {

                foreach($requests as $request) {
                    if($request->getToUser()->getId() == $value['id']) {
                        $q[$k]['requested'] = true;
                        break;
                    } else {
                        $q[$k]['requested'] = false;
                    }
                }

            }
        }

        return $this->json($q,Response::HTTP_OK,[],[
            ObjectNormalizer::GROUPS => ['search'],
        ]);
    }
}
