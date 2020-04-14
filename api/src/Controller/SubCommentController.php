<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentLike;
use App\Entity\Post;
use App\Entity\SubComment;
use App\Form\CommentType;
use App\Form\SubCommentType;
use App\Services\PushNotification;
use Doctrine\ORM\NonUniqueResultException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class CommentController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class SubCommentController extends BaseController
{
    /**
     * @Route("/subcomment/{id}", name="sub_comment_post_list", methods={"GET"})
     * @param $id
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function subCommentPostList($id, Request $request)
    {
        $offset = $request->query->getInt('offset') ?? 0;
        $limit = $request->query->getInt('limit') ? $request->query->getInt('limit') : 3;
        $sort = $request->query->getInt('sort') ? $request->query->getInt('sort') : 'ASC';

        $comment = $this->getDoctrine()->getRepository(Comment::class)->findOneBy(['id' => $id]);
        if (!$comment) {
            return $this->json([], Response::HTTP_BAD_REQUEST);
        }

        $subComments = $this->getDoctrine()->getRepository(SubComment::class)->findByComment($comment, $limit, $offset, $sort);

        if (!$subComments) {
            return $this->json([], Response::HTTP_OK);
        }
        $data = [];
        foreach ($subComments as $key => $value) {
            $data[$key]['id'] = $value['id'];
            $data[$key]['firstName'] = $value['firstName'];
            $data[$key]['lastName'] = $value['lastName'];
            $data[$key]['profileName'] = $value['profileName'];
            $data[$key]['text'] = $value['text'];
            $data[$key]['createdAt'] = $value['createdAt'];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    /**
     * @Route("/subcomment", name="sub_comment_add", methods={"POST"})
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function subCommentAdd(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $subComment = new SubComment();
        $form = $this->createForm(SubCommentType::class, $subComment);
        $form->submit($data);

        if ($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $subComment->setUser($user);


//        $comment = $this->getDoctrine()->getRepository(Comment::class)->findOneBy(['id' => $data['id']]);
//        $sendTo = $post->getUser()->getPushNotifications()->toArray();
//
//        $notification = new PushNotification();
//        $notification->setTitle('Comment');
//        $notification->setBody($user->getFirstName() . ' ' . $user->getLastName() . '(' . $user->getProfileName() . ') has commented on your post');
//        $notification->setToMultiple($sendTo);
//        $notification->sendNotification();
        $em = $this->getDoctrine()->getManager();
        $em->persist($subComment);
        $em->flush();

        $com['id'] = $subComment->getId();
        $com['firstName'] = $subComment->getUser()->getFirstName();
        $com['lastName'] = $subComment->getUser()->getLastName();
        $com['profileName'] = $subComment->getUser()->getProfileName();
        $com['text'] = $subComment->getText();
        $com['createdAt'] = $subComment->getCreatedAt();

        return $this->json(['success' => 1, 'comment' => $com], Response::HTTP_OK);
    }
}
