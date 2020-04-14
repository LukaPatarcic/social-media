<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentLike;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class CommentLikeController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class CommentLikeController extends AbstractController
{
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

        return $this->json(['success' => 1]);
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

        return $this->json(['success' => 1]);
    }
}
