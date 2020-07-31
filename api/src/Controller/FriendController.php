<?php

namespace App\Controller;

use App\Entity\Friendship;
use App\Entity\FriendshipRequest;
use App\Entity\User;
use App\Form\FriendshipFormType;
use App\Services\DataTransformer;
use App\Services\Image;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class FriendRequestController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class FriendController extends BaseController
{
    /**
     * @Route("/following", name="following_list", methods={"GET"})
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse
     */
    public function listFollowing(Request $request, DataTransformer $transformer)
    {
        /** @var User $user */
        $user = $this->getUser();
        $offset = $request->query->getInt('offset',0);
        /** @var FriendshipRequest $requests */
        $friends = $this->getDoctrine()->getRepository(Friendship::class)->findUsersFollowing($user,10,$offset);
        if(!$friends) {
            return  $this->json([], Response::HTTP_NO_CONTENT);
        }
        $data = $transformer->friendListDataTransformer($friends);

        return  $this->json($data,Response::HTTP_OK);
    }

    /**
     * @Route("/followers", name="followers_list", methods={"GET"})
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse
     */
    public function listFollowers(Request $request, DataTransformer $transformer)
    {
        /** @var User $user */
        $user = $this->getUser();
        $offset = $request->query->getInt('offset',0);
        /** @var FriendshipRequest $requests */
        $friends = $this->getDoctrine()->getRepository(Friendship::class)->findUsersFollowers($user,10,$offset);
        if(!$friends) {
            return  $this->json([], Response::HTTP_NO_CONTENT);
        }

        $data = $transformer->friendListDataTransformer($friends);

        return  $this->json($data,Response::HTTP_OK);
    }


    /**
     * @Route("/friend/{id}", name="friend_delete", methods={"DELETE"})
     * @param $id
     * @return JsonResponse
     */
    public function deleteFriend($id)
    {
        $user = $this->getUser();
        if(!$id) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $friend = $this->getDoctrine()
            ->getRepository(Friendship::class)
            ->findOneBy(['user' => $user,'friend' => $id]);

        if(!$friend) {
            return $this->json([],Response::HTTP_NOT_FOUND);
        }
        $this->getDoctrine()->getManager()->remove($friend);
        $this->getDoctrine()->getManager()->flush();

        return $this->json(['success' => 1], Response::HTTP_NO_CONTENT);
    }

}
