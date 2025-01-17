<?php

namespace App\Controller;

use App\Entity\LikePost;
use App\Entity\Post;
use App\Form\PostType;
use App\Services\DataTransformer;
use App\Services\Image;
use App\Services\ImageUpload;
use App\Services\PushNotification;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
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
     * @param DataTransformer $transformer
     * @return JsonResponse|Response
     */
    public function postsFeedList(Request $request, DataTransformer $transformer)
    {
        $user = $this->getUser();
        $offset = $request->query->getInt('offset',0);
        $profile = $request->query->get('profile') ? $request->query->get('profile') : null;
        $posts = $this->getDoctrine()->getRepository(Post::class)->findPosts($user,10,$offset,$profile);
        $data = $transformer->postListDataTransformer($posts,$user);

        return $this->json($data,Response::HTTP_OK);
    }

    /**
     * @Route("/post", name="post_add", methods={"POST"})
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse|Response
     */
    public function postsAdd(Request $request, DataTransformer $transformer)
    {
        $data = json_decode($request->getContent(),true);

        if(!$data) {
            return  $this->json([],Response::HTTP_BAD_REQUEST);
        }
        $user = $this->getUser();
        $post = new Post();
        $form = $this->createForm(PostType::class, $post);
        $form->submit(['text' => $data['text']]);

        if($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $images = new ImageUpload($user->getProfileName());
        $images->uploadImages($data['images'] ?? []);
        $post->setText($data['text']);
        $post->setImages($images->getUploadedImagesNames());
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
        $data = $transformer->postAddDataTransformer($post,$images->getAllAbsoluteUrlsToImages());

        return $this->json(['success' => 1,'post' => $data],Response::HTTP_OK);
    }

    /**
     * @Route("/like/post", name="like_get", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function likeGet(Request $request)
    {
        $id = $request->query->getInt('id');
        $offset = $request->query->getInt('offset',0);
        $post = $this->getDoctrine()->getRepository(Post::class)->findOneBy(['id' => $id]);
        if(!isset($id)) {
            return $this->json(['error' => 'Bad request',Response::HTTP_BAD_REQUEST]);
        }
        if(!$post) {
            return $this->json(['error' => 'Post not found',Response::HTTP_NOT_FOUND]);
        }
        $likes = $this->getDoctrine()->getRepository(LikePost::class)->findByPost($post,$offset,10);
        foreach ($likes as $key => $like) {
            $likes[$key]['profilePicture'] = Image::getProfilePicture($like['profileName'],$like['profilePicture'],45,45);
        }

        return $this->json($likes,Response::HTTP_OK);
    }

    /**
     * @Route("/post/{id}", name="post_delete", methods={"DELETE"})
     * @param Post $post
     * @return JsonResponse
     */
    public function deletePost(Post $post)
    {
        $user = $this->getUser();
        if($user->getId() !== $post->getUser()->getId()) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }

        $this->getDoctrine()->getManager()->remove($post);
        $this->getDoctrine()->getManager()->flush();

        return $this->json([],Response::HTTP_OK);
    }

    /**
     * @Route("/like/post", name="like_post_add", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
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
            return $this->json(['error' => 'Post does not exist'],Response::HTTP_NOT_FOUND);
        }
        $liked = $this->getDoctrine()->getRepository(LikePost::class)->findOneBy(['post' => $post, 'user' => $user]);
        if($liked) {
            return $this->json(['error' => 'Post already liked'],Response::HTTP_BAD_REQUEST);
        }

        $userTo = $post->getUser()->getPushNotifications();
        $sendTo = [];
        foreach ($userTo as $val) {
            $sendTo[] = $val->getPhone();
        }
        $notification = new PushNotification();
        $notification->setTitle('Post');
        $notification->setBody($user->getFirstName().' '.$user->getLastName().'('.$user->getProfileName().') liked your post');
        $notification->setToMultiple($sendTo);
        $notification->sendNotification();

        $like = new LikePost();
        $like->setUser($user)->setPost($post);
        $post->addLikePost($like);
        $em = $this->getDoctrine()->getManager();
        $em->persist($like);
        $em->flush();

        return $this->json([],Response::HTTP_CREATED);
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
