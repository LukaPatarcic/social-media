<?php

namespace App\Controller;

use App\Entity\Friendship;
use App\Entity\FriendshipRequest;
use App\Entity\User;
use App\Form\FriendshipFormType;
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
     * @return JsonResponse
     */
    public function listFollowers(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        $offset = $request->query->getInt('offset',0);
        /** @var FriendshipRequest $requests */
        $friends = $this->getDoctrine()->getRepository(Friendship::class)->findUsersFollowing($user,10,$offset);
        if(!$friends) {
            return  $this->json([], Response::HTTP_NO_CONTENT);
        }
        $data = [];
        foreach ($friends as $friend) {
            $data[] = [
                'firstName' => $friend['firstName'],
                'lastName' => $friend['lastName'],
                'profileName' => $friend['profileName'],
                'createdAt' => $friend['createdAt'],
                'profilePicture' => Image::getProfilePicture($friend['profileName'],$friend['profilePicture'],45,45)
            ];
        }

        return  $this->json($data,Response::HTTP_OK,[]);
    }

    /**
     * @Route("/followers", name="followers_list", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function listFollowing(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        $offset = $request->query->getInt('offset',0);
        /** @var FriendshipRequest $requests */
        $friends = $this->getDoctrine()->getRepository(Friendship::class)->findUsersFollowers($user,10,$offset);
        if(!$friends) {
            return  $this->json([], Response::HTTP_NO_CONTENT);
        }
        $data = [];
        foreach ($friends as $friend) {
            $data[] = [
                'firstName' => $friend['firstName'],
                'lastName' => $friend['lastName'],
                'profileName' => $friend['profileName'],
                'createdAt' => $friend['createdAt'],
                'profilePicture' => Image::getProfilePicture($friend['profileName'],$friend['profilePicture'],45,45)
            ];
        }

        return  $this->json($data,Response::HTTP_OK,[]);
    }


    /**
     * @Route("/friend", name="friend_delete", methods={"DELETE"})
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteFriend(Request $request)
    {
        $data = json_decode($request->getContent(),true);
        if(!$data['id']) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $friendRequest = $this->getDoctrine()
            ->getRepository(FriendshipRequest::class)
            ->findOneBy(['id' => $data['id']]);
        $this->getDoctrine()->getManager()->remove($friendRequest);
        $this->getDoctrine()->getManager()->flush();

        return $this->json(['success' => 1], Response::HTTP_OK);
    }

}
