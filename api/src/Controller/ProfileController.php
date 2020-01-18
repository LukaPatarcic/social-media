<?php


namespace App\Controller;


use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends BaseController
{
    /**
     * @Route("/user", name="user_profile", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function user(Request $request)
    {
        $me = $this->getApiUser($request);

        $followers = $me->getFriendsWithMe()->toArray();
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

        $following = $me->getFriends()->toArray();
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

        $posts = $this->getDoctrine()->getRepository(Post::class)->findUsersPosts($me);
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
            'id' => $me->getId(),
            'firstName' => $me->getFirstName(),
            'lastName' => $me->getLastName(),
            'profileName' =>$me->getProfileName(),
            'followerCount' => count($followersArray['followers']),
            'followingCount' => count($followingArray['following'])
        ];

        return $this->json(array_merge($userInfo,$followersArray,$followingArray,$postsArray),Response::HTTP_OK,[]);
    }

}