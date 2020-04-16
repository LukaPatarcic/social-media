<?php

namespace App\Controller;

use App\Entity\FriendRequest;
use App\Entity\Friendship;
use App\Entity\FriendshipRequest;
use App\Entity\User;
use App\Form\FriendRequestType;
use App\Form\FriendshipFormType;
use App\Services\PushNotification;
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
class FriendRequestController extends BaseController
{
    /**
     * @Route("/friend/request", name="friend_request_list", methods={"GET"})
     * @return JsonResponse
     */
    public function listFriendRequests()
    {
        /** @var User $user */
        $user = $this->getUser();
        /** @var FriendshipRequest $requests */
        $requests = $this->getDoctrine()->getRepository(FriendshipRequest::class)->findUsersFriends($user);

        if(!$requests) {
            return  $this->json([], Response::HTTP_OK);
        }

        return  $this->json($requests,Response::HTTP_OK);
    }

    /**
     * @Route("/friend/request", name="friend_request_add", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function addFriendRequest(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(),true);
        $friend = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data['id']]);
        $friendship = new FriendshipRequest();
        $friendship->setFromUser($user)
            ->setToUser($friend);

        $friendRequest = $this->getDoctrine()
            ->getRepository(FriendshipRequest::class)
            ->findBy(['fromUser' => $user->getId(), 'toUser' => $friend->getId()]);
        if($friendRequest) {
            return $this->json(['error' => 'Friend Request Already Sent'], Response::HTTP_BAD_REQUEST);
        }

        $devices = $friend->getPushNotifications()->toArray();
        $sendTo = [];
        foreach ($devices as $device) {
            $sendTo[] = $device->getPhone();
        }
        $notification = new PushNotification();
        $notification->setTitle('Follower Request');
        $notification->setBody($user->getFirstName().' '.$user->getLastName().'('.$user->getProfileName().') has sent you a follow request');
        $notification->setToMultiple($sendTo);
        $notification->sendNotification();

        $em = $this->getDoctrine()->getManager();
        $em->persist($friendship);
        $em->flush();

        return $this->json(['success' => 1], Response::HTTP_CREATED);
    }

    /**
     * @Route("/friend/request", name="friend_request_delete", methods={"DELETE"})
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteFriendRequest(Request $request)
    {
        $data = json_decode($request->getContent(),true);

        if(!$data['id']) {
            return $this->json(['error' => 'Bad request'],Response::HTTP_BAD_REQUEST);
        }

        $friendRequest = $this->getDoctrine()
            ->getRepository(FriendshipRequest::class)
            ->findOneBy(['id' => $data['id']]);

        if(!$friendRequest) {
            return $this->json(['error' => 'Follow request not found'],Response::HTTP_BAD_REQUEST);
        }

        $this->getDoctrine()->getManager()->remove($friendRequest);
        $this->getDoctrine()->getManager()->flush();

        return $this->json(['success' => 1],Response::HTTP_OK);
    }

    /**
     * @Route("/friend/request", name="friend_request_accept", methods={"PATCH"})
     * @param Request $request
     * @return Response
     */
    public function acceptFriendRequest(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(),true);
        if(!isset($data['id'])) {
            return  $this->json(['error' => 'Bad request'],Response::HTTP_BAD_REQUEST);
        }

        $friendRequest = $this->getDoctrine()->getRepository(FriendshipRequest::class)->findOneBy(['id' => $data['id'], 'toUser' => $user->getId()]);

        if(!$friendRequest) {
            return  $this->json(['error' => 'Follow request not found'], Response::HTTP_NOT_FOUND);
        }

        $friendship = new Friendship();
        $friendship->setUser($friendRequest->getFromUser())
            ->setFriend($friendRequest->getToUser());

        $message = 'You have accepted '.$friendRequest->getFromUser()->getProfileName().' request';

        $this->getDoctrine()->getManager()->remove($friendRequest);
        $this->getDoctrine()->getManager()->persist($friendship);
        $this->getDoctrine()->getManager()->flush();

        return  $this->json(['success' => $message],Response::HTTP_CREATED);
    }
}
