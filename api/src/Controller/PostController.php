<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
use App\Form\PostType;
use App\Form\RegistrationFormType;
use App\Services\PushNotification;
use Doctrine\ORM\NonUniqueResultException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\DateTime;

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
     * @throws NonUniqueResultException
     */
    public function postsFeedList(Request $request)
    {
        $user = $this->getUser();
        $offset = $request->query->getInt('offset',0);
        $onlyMe = $request->query->getBoolean('onlyMe',false);
        $posts = $this->getDoctrine()->getRepository(Post::class)->findPosts($user,10,$offset,$onlyMe);
        $data = [];
        foreach ($posts as $k => $post) {
            $data[$k]['id'] = +$post['postId'];
            $data[$k]['firstName'] = $post['firstName'];
            $data[$k]['lastName'] =$post['lastName'];
            $data[$k]['profileName'] =$post['profileName'];
            $data[$k]['text'] = $post['text'];
            $data[$k]['createdAt'] = $post['createdAt'];
            $data[$k]['likes'] = intval($post['likes']);
            $data[$k]['liked'] = (bool)$post['liked'];
            $comment = $this->getDoctrine()->getRepository(Comment::class)->findByPost($post['postId'],$user,1,0,'DESC') ?? null;
            $data[$k]['comment'] = null;
            if($comment) {
                $data[$k]['comment'] = [
                    'id' => intval($comment['id']),
                    'firstName' => $comment['firstName'],
                    'lastName' => $comment['lastName'],
                    'profileName' => $comment['profileName'],
                    'text' => $comment['text'],
                    'createdAt' => $comment['createdAt'],
                    'likes' => intval($comment['likes']),
                    'liked' => (bool)$comment['liked'],
                    'subCommentCount' => intval($comment['subCommentCount']),
                    'subComments' => []
                ];
            }
            $data[$k]['commentCount'] = intval($post['commentCount']);
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
     * @Route("/post/{$id}/likes", name="post_likes", methods={"GET"})
     */
    public function postLikes($id, Request $request)
    {
        $offset = $request->query->getInt('offset',0);
        $limit = $request->query->getInt('limit',10);
        $likes = $this->getDoctrine()->getRepository(Post::class)->findPostLikes($id,$offset,$limit,'ASC');
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
