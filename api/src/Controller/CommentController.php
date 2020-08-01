<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentLike;
use App\Entity\Post;
use App\Form\CommentType;
use App\Services\DataTransformer;
use App\Services\Image;
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
     * @param DataTransformer $transformer
     * @return JsonResponse|Response
     * @throws NonUniqueResultException
     */
    public function commentPostList($id, Request $request, DataTransformer $transformer)
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
        $data = $transformer->commentListDataTransformer($comments);

        return $this->json($data, Response::HTTP_OK);
    }

    /**
     * @Route("/comment/{id}", name="comment_remove", methods={"DELETE"})
     * @param Comment $comment
     * @return JsonResponse
     */
    public function commentRemove(Comment $comment)
    {
        $user = $this->getUser();

        if($user->getId() !== $comment->getUser()->getId()) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }

        $this->getDoctrine()->getManager()->remove($comment);
        $this->getDoctrine()->getManager()->flush();

        return $this->json([],Response::HTTP_OK);
    }

    /**
     * @Route("/comment", name="comment_add", methods={"POST"})
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse|Response
     */
    public function commentAdd(Request $request, DataTransformer $transformer)
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);
        $form->submit($data);

        if ($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_BAD_REQUEST);
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

        $com = $transformer->commentAddDataTransformer($comment,$user);
        return $this->json(['success' => 1, 'comment' => $com], Response::HTTP_CREATED);
    }

    /**
     * @Route("/comment/like", name="comment_like_add", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function commentLikeAdd(Request $request)
    {
        $data = json_decode($request->getContent(),true);
        if(!isset($data['id']))
            return $this->json(['error' => 'Bad request'],Response::HTTP_BAD_REQUEST);

        $user = $this->getUser();
        $comment = $this->getDoctrine()->getRepository(Comment::class)->findOneBy(['id' => $data['id']]);

        if(!$comment) {
            return $this->json(['error' => 'Comment not found'],Response::HTTP_NOT_FOUND);
        }

        $commentLiked = $this->getDoctrine()->getRepository(CommentLike::class)->findOneBy(['comment' => $comment,'user' => $user]);
        if($commentLiked) {
            return $this->json(['error' => 'Comment already liked'],Response::HTTP_BAD_REQUEST);
        }

        $commentLike = new CommentLike();
        $commentLike->setComment($comment)
            ->setUser($user);
        $em = $this->getDoctrine()->getManager();
        $em->persist($commentLike);
        $em->flush();

        return $this->json(['success' => 1],Response::HTTP_CREATED);
    }

    /**
     * @Route("/comment/like", name="comment_like_remove", methods={"DELETE"})
     * @param Request $request
     * @return JsonResponse
     */
    public function commentLikeRemove(Request $request)
    {
        $data = json_decode($request->getContent(),true);
        $user = $this->getUser();
        $comment = $this->getDoctrine()->getRepository(Comment::class)->findOneBy(['id' => $data['id']]);

        if(!$comment) {
            return $this->json([],Response::HTTP_NOT_FOUND);
        }

        $commentLike = $this->getDoctrine()->getRepository(CommentLike::class)->findOneBy(['comment' => $comment,'user' => $user]);
        $em = $this->getDoctrine()->getManager();
        $em->remove($commentLike);
        $em->flush();

        return $this->json([],Response::HTTP_NO_CONTENT);
    }
}
