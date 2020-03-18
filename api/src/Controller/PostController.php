<?php

namespace App\Controller;

use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
use App\Form\PostType;
use App\Form\RegistrationFormType;
use App\Services\PushNotification;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class PostController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class PostController extends BaseController
{
    /**
     * @Route("/post", name="post_feed_list", methods={"GET"})
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function postsFeedList(Request $request)
    {
        $user = $this->getUser();
        $offset = $request->query->getInt('offset') ?? null;
        $posts = $this->getDoctrine()->getRepository(Post::class)->findFeedPosts($user,10,$offset);
        $data = [];
        foreach ($posts as $k => $post) {
            $data[$k]['id'] = $post->getId();
            $data[$k]['firstName'] = $post->getUser()->getFirstName();
            $data[$k]['lastName'] = $post->getUser()->getLastName();
            $data[$k]['profileName'] = $post->getUser()->getProfileName();
            $data[$k]['text'] = $post->getText();
            $data[$k]['createdAt'] = $post->getCreatedAt();
            $data[$k]['likes'] = count($post->getLikePosts());
            $data[$k]['liked'] = (bool)$this->getDoctrine()->getRepository(LikePost::class)->findIfUserLikedPost($user,$post);
        }

        return $this->json($data,Response::HTTP_OK);
    }

    /**
     * @Route("/post/{$id}", name="post_id", methods={"GET"})
     * @param Post $post
     * @return JsonResponse|Response
     */
    public function postShow(Post $post)
    {
        return $this->json($post,Response::HTTP_OK);
    }

    /**
     * @Route("/post/user", name="post_feed", methods={"GET"})
     * @return JsonResponse|Response
     */
    public function postUser()
    {
        $user = $this->getUser();
        $posts = $this->getDoctrine()->getRepository(Post::class)->findUsersPosts($user);
        $data = [];
        foreach ($posts as $k => $post) {
            $data[$k]['id'] = $post->getId();
            $data[$k]['firstName'] = $post->getUser()->getFirstName();
            $data[$k]['lastName'] = $post->getUser()->getLastName();
            $data[$k]['profileName'] = $post->getUser()->getProfileName();
            $data[$k]['text'] = $post->getText();
            $data[$k]['createdAt'] = $post->getCreatedAt();
            $data[$k]['likes'] = count($post->getLikePosts());
            $data[$k]['liked'] = (bool)$this->getDoctrine()->getRepository(LikePost::class)->findIfUserLikedPost($user,$post);
        }


        return $this->json($data,Response::HTTP_OK);
    }



    /**
     * @Route("/post", name="post_add", methods={"POST"})
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function postsAdd(Request $request)
    {
        $data = json_decode($request->getContent(),true);
        $user = $this->getUser();

        $post = new Post();
        $form = $this->createForm(PostType::class, $post);
        $form->submit($data);

        if($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_OK);
        }
        $post->setUser($user);

        $friends = $user->getFriendsWithMe()->toArray();
        $sendTo = [];
        foreach ($friends as $friend) {
            $devices = $friend->getUser()->getPushNotifications()->toArray();;
            foreach ($devices as $device) {
                $sendTo[] = $device->getPhone();
            }
        }

        $notification = new PushNotification();
        $notification->setTitle('Post');
        $notification->setBody($user->getFirstName().' '.$user->getLastName().'('.$user->getProfileName().') has posted on their timeline');
        $notification->setToMultiple($sendTo);
        $notification->sendNotification();

        $em = $this->getDoctrine()->getManager();
        $em->persist($post);
        $em->flush();

        return $this->json(['success' => 1],Response::HTTP_OK);
    }
}
