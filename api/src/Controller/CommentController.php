<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentLike;
use App\Entity\Post;
use App\Form\CommentType;
use App\Services\PushNotification;
use Doctrine\ORM\NonUniqueResultException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Class CommentController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class CommentController extends BaseController
{
    /**
     * @Route("/comment/{id}", name="comment_post_list", methods={"GET"})
     * @param $id
     * @param Request $request
     * @return JsonResponse|Response
     * @throws NonUniqueResultException
     */
    public function commentPostList($id, Request $request)
    {
        $offset = $request->query->getInt('offset') ?? 0;
        $limit = $request->query->getInt('limit') ? $request->query->getInt('limit') : 10;
        $sort = $request->query->getInt('sort') ? $request->query->getInt('sort') : 'DESC';
        $user = $this->getUser();
        $post = $this->getDoctrine()->getRepository(Post::class)->findOneBy(['id' => $id]);
        if (!$post) {
            return $this->json([], Response::HTTP_BAD_REQUEST);
        }

        $comments = $this->getDoctrine()->getRepository(Comment::class)->findByPost($post, $user, $limit, $offset, $sort);

        if (!$comments) {
            return $this->json([], Response::HTTP_OK);
        }
        $data = [];
        foreach ($comments as $key => $value) {
            $data[$key]['id'] = $value['id'];
            $data[$key]['firstName'] = $value['firstName'];
            $data[$key]['lastName'] = $value['lastName'];
            $data[$key]['profileName'] = $value['profileName'];
            $data[$key]['text'] = $value['text'];
            $data[$key]['createdAt'] = $value['createdAt'];
            $data[$key]['subCommentCount'] = (int)$value['subCommentCount'];
            $data[$key]['subComments'] = [];
            $data[$key]['likes'] = (int)$value['likes'];
            $data[$key]['liked'] = (bool)$value['liked'];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    /**
     * @Route("/comment", name="comment_add", methods={"POST"})
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function commentAdd(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);
        $form->submit($data);

        if ($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_OK);
        }

        $comment->setUser($user);

        $post = $this->getDoctrine()->getRepository(Post::class)->findOneBy(['id' => $data['post']]);
        $sendTo = $post->getUser()->getPushNotifications()->toArray();

        $notification = new PushNotification();
        $notification->setTitle('Comment');
        $notification->setBody($user->getFirstName() . ' ' . $user->getLastName() . '(' . $user->getProfileName() . ') has commented on your post');
        $notification->setToMultiple($sendTo);
        $notification->sendNotification();
        $em = $this->getDoctrine()->getManager();
        $em->persist($comment);
        $em->flush();

        $com['id'] = $comment->getId();
        $com['firstName'] = $comment->getUser()->getFirstName();
        $com['lastName'] = $comment->getUser()->getLastName();
        $com['profileName'] = $comment->getUser()->getProfileName();
        $com['text'] = $comment->getText();
        $com['createdAt'] = $comment->getCreatedAt();
        $com['subCommentCount'] = 0;
        $com['subComments'] = [];
        $com['likes'] = $comment->getLikes()->count();
        $com['liked'] = (bool)$this->getDoctrine()->getRepository(CommentLike::class)->findOneBy(['user' => $user, 'comment' => $comment]) ?? false;

        return $this->json(['success' => 1, 'comment' => $com], Response::HTTP_OK);
    }
}
