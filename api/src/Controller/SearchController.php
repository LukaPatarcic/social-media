<?php

namespace App\Controller;

use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
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
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $user = $this->getUser();
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

            $q[$k]['profilePicture'] = Image::getProfilePicture($value['profileName'],$value['profilePicture'],45,45);
        }

        return $this->json($q,Response::HTTP_OK);
    }

    /**
     * @Route("/search/user/{profileName}", name="search_user")
     * @param string $profileName
     * @return JsonResponse
     */
    public function searchForUser( string $profileName)
    {
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['profileName' => $profileName]);
        if(!$user) {
            return  $this->json([],Response::HTTP_NOT_FOUND);
        }
        $me = $this->getUser();

        $followers = $user->getFriendsWithMe()->toArray();
        $followersArray = [];
        if(!$followers) {
            $followersArray['followers'] = [];
        }
        foreach ($followers as $follower) {
            $followersArray['followers'][] = [
                'id' => $follower->getUser()->getId(),
                'firstName' => $follower->getUser()->getFirstName(),
                'lastName' => $follower->getUser()->getLastName(),
                'profileName' =>$follower->getUser()->getProfileName(),
            ];
        }

        $following = $user->getFriends()->toArray();
        $followingArray = [];
        if(!$following) {
            $followingArray['following'] = [];
        }
        foreach ($following as $follow) {
            $followingArray['following'][] = [
                'id' => $follow->getFriend()->getId(),
                'firstName' => $follow->getFriend()->getFirstName(),
                'lastName' => $follow->getFriend()->getLastName(),
                'profileName' =>$follow->getFriend()->getProfileName(),
            ];
        }

        $posts = $this->getDoctrine()->getRepository(Post::class)->findUsersPosts($user);
        $postsArray = [];
        if(!$posts) {
            $postsArray['posts'] = [];
        }
        foreach ($posts as $k => $post) {
            $postsArray['posts'][$k]['id'] = $post->getId();
            $postsArray['posts'][$k]['firstName'] = $post->getUser()->getFirstName();
            $postsArray['posts'][$k]['lastName'] = $post->getUser()->getLastName();
            $postsArray['posts'][$k]['profileName'] = $post->getUser()->getProfileName();
            $postsArray['posts'][$k]['text'] = $post->getText();
            $postsArray['posts'][$k]['createdAt'] = $post->getCreatedAt();
            $postsArray['posts'][$k]['likes'] = count($post->getLikePosts());
            $postsArray['posts'][$k]['liked'] = (bool)$this->getDoctrine()->getRepository(LikePost::class)->findIfUserLikedPost($me,$post);
        }

        $userInfo['user'] = [
            'id' => $user->getId(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'profileName' =>$user->getProfileName(),
            'followerCount' => count($followersArray['followers']),
            'followingCount' => count($followingArray['following'])
        ];

        return $this->json(array_merge($userInfo,$followersArray,$followingArray,$postsArray),Response::HTTP_OK,[]);
    }
}
