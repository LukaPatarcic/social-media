<?php

namespace App\Controller;

use App\Entity\FriendRequest;
use App\Entity\Friendship;
use App\Entity\User;
use App\Form\FriendRequestType;
use App\Form\FriendshipFormType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class FriendController
 * @package App\Controller
 * @IsGranted("ROLE_API_USER")
 */
class FriendController extends BaseController
{
    /**
     * @Route("/friend", name="friend_list", methods={"GET"})
     */
    public function listFriend(Request $request)
    {
        /** @var User $user */
        $user = $this->getApiUser($request);
        $friends = $this->getDoctrine()->getRepository(Friendship::class)->findUsersFriends();
        dd($friends);
        if(!$friends) {
            return $this->json([], Response::HTTP_NO_CONTENT);
        }

        return $this->json($friends,Response::HTTP_OK);
    }

    /**
     * @Route("/friend", name="friend_add", methods={"POST"})
     */
    public function addFriend(Request $request)
    {
        /** @var User $user */
        $user = $this->getApiUser($request);
        $data = json_decode($request->getContent(),true);
        $friend = $this->getDoctrine()->getRepository(User::class)->findOneBy(['profileName' => $data['profileName']]);
        $friendship = new Friendship();
        $friendship->setUser($user)
            ->setFriend($friend);

        $following = $this->getDoctrine()->getRepository(Friendship::class)->findBy(['user' => $user, 'friend' => $friend]);
        if($following) {
            return $this->json(['error' => 'Already following'], Response::HTTP_BAD_REQUEST);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($friendship);
        $em->flush();

        return $this->json(['success' => 1], Response::HTTP_CREATED);
    }

    /**
     * @Route("/friend", name="friend_delete", methods={"DELETE"})
     */
    public function deleteFriend()
    {
        return $this->render('friend/index.html.twig', [
            'controller_name' => 'FriendController',
        ]);
    }

    /**
     * @Route("/friend", name="friend_accept", methods={"PATCH"})
     */
    public function acceptFriend()
    {
        return $this->render('friend/index.html.twig', [
            'controller_name' => 'FriendController',
        ]);
    }
}
