<?php

namespace App\Controller;

use App\Entity\LikePost;
use App\Entity\Post;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class LikePostController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class LikePostController extends BaseController
{
    /**
     * @Route("/like/post", name="like_post_add", methods={"POST"})
     */
    public function likeAdd(Request $request)
    {
        $user = $this->getUser();
        $id = json_decode($request->getContent(),true);
        if(!isset($id['id'])) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $post = $this->getDoctrine()->getRepository(Post::class)->findOneBy(['id' => $id['id']]);
        if(!$post) {
            return $this->json(['error' => 'Post does not exist'],Response::HTTP_BAD_REQUEST);
        }
        $liked = $this->getDoctrine()->getRepository(LikePost::class)->findOneBy(['post' => $post, 'user' => $user]);
        if($liked) {
            return $this->json(['error' => 'Post already liked'],Response::HTTP_BAD_REQUEST);
        }
        $like = new LikePost();
        $like->setUser($user)
            ->setPost($post);
        $post->addLikePost($like);
        $em = $this->getDoctrine()->getManager();
        $em->persist($like);
        $em->flush();

        return $this->json([],Response::HTTP_OK);
    }

    /**
     * @Route("/like/post", name="like_post_delete", methods={"DELETE"})
     * @param Request $request
     * @return JsonResponse
     */
    public function likeDelete(Request $request)
    {
        $user = $this->getUser();
        $id = json_decode($request->getContent(),true);
        if(!isset($id['id'])) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $post = $this->getDoctrine()->getRepository(Post::class)->findOneBy(['id' => $id['id']]);
        if(!$post) {
            return $this->json(['error' => 'Post does not exist'],Response::HTTP_BAD_REQUEST);
        }
        $liked = $this->getDoctrine()->getRepository(LikePost::class)->findOneBy(['post' => $post, 'user' => $user]);
        if(!$liked) {
            return $this->json(['error' => 'Something went wrong...'],Response::HTTP_BAD_REQUEST);
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($liked);
        $em->flush();

        return $this->json([],Response::HTTP_OK);
    }
}
