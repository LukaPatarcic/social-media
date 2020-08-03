<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentLike;
use App\Entity\Post;
use App\Entity\SubComment;
use App\Form\CommentType;
use App\Form\SubCommentType;
use App\Services\DataTransformer;
use App\Services\Image;
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
     * @param DataTransformer $transformer
     * @return JsonResponse|Response
     */
    public function subCommentPostList($id, Request $request, DataTransformer $transformer)
    {
        $offset = $request->query->getInt('offset') ?? 0;
        $limit = $request->query->getInt('limit') ? $request->query->getInt('limit') : 3;
        $sort = $request->query->getInt('sort') ? $request->query->getInt('sort') : 'ASC';

        $comment = $this->getDoctrine()->getRepository(Comment::class)->findOneBy(['id' => $id]);
        if (!$comment) {
            return $this->json([], Response::HTTP_NOT_FOUND);
        }

        $subComments = $this->getDoctrine()->getRepository(SubComment::class)->findByComment($comment, $limit, $offset, $sort);

        if (!$subComments) {
            return $this->json([], Response::HTTP_NO_CONTENT);
        }
        $data = $transformer->subCommentListDataTransformer($subComments);

        return $this->json($data, Response::HTTP_OK);
    }

    /**
     * @Route("/subcomment", name="sub_comment_add", methods={"POST"})
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse|Response
     */
    public function subCommentAdd(Request $request, DataTransformer $transformer)
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

        $comment = $this->getDoctrine()->getRepository(Comment::class)->findOneBy(['id' => $data['comment']]);

        if(!$comment) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $arr = $comment->getUser()->getPushNotifications()->toArray();
        $sendTo = [];
        foreach ($arr as $value) {
            $sendTo[] = $value->getPhone();
        }

        $notification = new PushNotification();
        $notification->setTitle('Comment');
        $notification->setBody($user->getFirstName() . ' ' . $user->getLastName() . '(' . $user->getProfileName() . ') has replied to your comment');
        $notification->setToMultiple($sendTo);
        $notification->sendNotification();
        $em = $this->getDoctrine()->getManager();
        $em->persist($subComment);
        $em->flush();

       $comment = $transformer->subCommentAddDataTransformer($subComment);

        return $this->json(['success' => 1, 'comment' => $comment], Response::HTTP_CREATED);
    }

    /**
     * @Route("/subcomment/{id}", name="delete_subcomment", methods={"DELETE"})
     * @param SubComment $subComment
     * @return JsonResponse
     */
    public function deleteSubComment(SubComment $subComment)
    {
        $user = $this->getUser();

        if($user->getId() != $subComment->getUser()->getId()) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }

        $this->getDoctrine()->getManager()->remove($subComment);
        $this->getDoctrine()->getManager()->flush();

        return $this->json(['success' => 1],Response::HTTP_OK);
    }
}
