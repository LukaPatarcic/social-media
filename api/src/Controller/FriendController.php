<?php

namespace App\Controller;

use App\Entity\FriendRequest;
use App\Entity\Friendship;
use App\Entity\FriendshipRequest;
use App\Entity\User;
use App\Form\FriendRequestType;
use App\Form\FriendshipFormType;
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
     * @Route("/friend", name="friend_list", methods={"GET"})
     * @return JsonResponse
     */
    public function listFriend()
    {
        /** @var User $user */
        $user = $this->getUser();
        /** @var FriendshipRequest $requests */
        $friends = $this->getDoctrine()->getRepository(Friendship::class)->findUsersFriends($user);
        if(!$friends) {
            return  $this->json([], Response::HTTP_NO_CONTENT);
        }

        return  $this->json($friends,Response::HTTP_OK,[],[
            'groups' => ['user_info']
        ]);
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
