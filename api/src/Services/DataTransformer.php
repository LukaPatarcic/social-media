<?php


namespace App\Services;

use App\Entity\Comment;
use App\Entity\Message;
use App\Entity\Post;
use App\Entity\SubComment;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class DataTransformer
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function commentAddDataTransformer(Comment $comment, User $user): array
    {
        $com['id'] = $comment->getId();
        $com['userId'] = $user->getId();
        $com['firstName'] = $comment->getUser()->getFirstName();
        $com['lastName'] = $comment->getUser()->getLastName();
        $com['profileName'] = $comment->getUser()->getProfileName();
        $com['profilePicture'] = Image::getProfilePicture($comment->getUser()->getProfileName(),$comment->getUser()->getProfilePicture(),40,40);
        $com['text'] = $comment->getText();
        $com['createdAt'] = $comment->getCreatedAt();
        $com['subCommentCount'] = 0;
        $com['subComments'] = [];
        $com['likes'] = $comment->getLikes()->count();
        $com['liked'] = false;

        return $com;
    }

    public function commentListDataTransformer($comments)
    {
        $data = [];
        foreach ($comments as $key => $value) {
            $data[$key]['id'] = $value['id'];
            $data[$key]['userId'] = $value['userId'];
            $data[$key]['firstName'] = $value['firstName'];
            $data[$key]['lastName'] = $value['lastName'];
            $data[$key]['profileName'] = $value['profileName'];
            $data[$key]['profilePicture'] = Image::getProfilePicture($value['profileName'],$value['profilePicture'],35,35);
            $data[$key]['text'] = $value['text'];
            $data[$key]['createdAt'] = $value['createdAt'];
            $data[$key]['subCommentCount'] = (int)$value['subCommentCount'];
            $data[$key]['subComments'] = [];
            $data[$key]['likes'] = (int)$value['likes'];
            $data[$key]['liked'] = (bool)$value['liked'];
        }

        return $data;
    }

    public function friendListDataTransformer($friends)
    {
        $data = [];
        foreach ($friends as $friend) {
            $data[] = [
                'id' => $friend['id'],
                'firstName' => $friend['firstName'],
                'lastName' => $friend['lastName'],
                'profileName' => $friend['profileName'],
                'createdAt' => $friend['createdAt'],
                'profilePicture' => Image::getProfilePicture($friend['profileName'],$friend['profilePicture'],45,45)
            ];
        }

        return $data;
    }

    public function messageUsersListDataTransformer($data,$user)
    {
        $users = [];
        foreach ($data as $key => $value) {
            if($value['fromUserProfileName'] == $user->getProfileName()) {
                unset($data[$key]['fromUserProfileName']);
                unset($data[$key]['fromUserProfilePicture']);
            }
            if ($value['toUserProfileName'] == $user->getProfileName()) {
                unset($data[$key]['toUserProfileName']);
                unset($data[$key]['toUserProfilePicture']);
            }

        }
        $keyCounter = 0;
        foreach ($data as $key => $value) {
            $message = $this->entityManager
                ->getRepository(Message::class)
                ->findLastUsersMessage($value['fromUserId'],$value['toUserId']);
            $id = $user->getId() == $value['fromUserId'] ? $value['toUserId'] : $value['fromUserId'];
            $profileName = $user->getId() == $value['fromUserId'] ? $value['toUserProfileName'] : $value['fromUserProfileName'];
            $firstName = $user->getId() == $value['fromUserId'] ? $value['toUserFirstName'] : $value['fromUserFirstName'];
            $lastName = $user->getId() == $value['fromUserId'] ? $value['toUserLastName'] : $value['fromUserLastName'];
            $profilePicture = $user->getId() == $value['fromUserId'] ? $value['toUserProfilePicture'] : $value['fromUserProfilePicture'];
            $userData = [
                'id' => $id,
                'profileName' => $profileName,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'profilePicture' => Image::getProfilePicture($profileName,$profilePicture,45,45)
            ];
            $ifProfileAlreadyInArray = array_column($users, 'profileName');
            if(in_array($profileName,$ifProfileAlreadyInArray)) {
                unset($ifProfileAlreadyInArray);
                continue;
            }
            $users[$keyCounter] = array_merge($message[0],$userData);
            $keyCounter = $keyCounter+1;
        }
        return $users;
    }

    public function messageListDataTransformer($messages,$user)
    {
        foreach ($messages as $key => $message) {
            $profilePicture = Image::getProfilePicture($message['profileName'],$message['profilePicture'],45,45);
            unset($messages[$key]['profilePicture']);
            $messages[$key]['profilePicture'] = $profilePicture;
            $messages[$key]['isMe'] = $user->getProfileName() == $message['profileName'] ? true : false;
        }

        return $messages;
    }

    public function messageAddDataTransformer($message)
    {
        return [
            "id" => $message->getId(),
            "fromUser" => $message->getFromUser()->getId(),
            "toUser" => $message->getToUser()->getId(),
            "message" => $message->getMessage(),
            "createdAt" => $message->getCreatedAt(),
            "firstName" => $message->getFromUser()->getFirstName(),
            "lastName" => $message->getFromUser()->getLastName(),
            "profileName" => $message->getFromUser()->getProfileName(),
            "profilePicture" => Image::getProfilePicture($message->getFromUser()->getProfileName(),$message->getFromUser()->getProfilePicture(),45,45),
        ];
    }

    public function postListDataTransformer($posts,$user)
    {
        $data = [];
        foreach ($posts as $k => $post) {
            $data[$k]['id'] = $post['postId'];
            $data[$k]['userId'] = $post['userId'];
            $data[$k]['firstName'] = $post['firstName'];
            $data[$k]['lastName'] =$post['lastName'];
            $data[$k]['profileName'] =$post['profileName'];
            $data[$k]['text'] = $post['text'];
            $data[$k]['profilePicture'] = Image::getProfilePicture($post['profileName'],$post['profilePicture'],45,45);
            $data[$k]['createdAt'] = $post['createdAt'];
            $data[$k]['likes'] = intval($post['likes']);
            $data[$k]['liked'] = (bool)$post['liked'];
            $data[$k]['images'] = unserialize($post['images']) ?? [];
            $comment = $this->entityManager->getRepository(Comment::class)->findByPost($post['postId'],$user,1,0,'DESC') ?? null;
            $data[$k]['comments'] = [];
            if($comment) {
                $data[$k]['comments'][0] = [
                    'id' => intval($comment['id']),
                    'firstName' => $comment['firstName'],
                    'lastName' => $comment['lastName'],
                    'profileName' => $comment['profileName'],
                    'profilePicture' => Image::getProfilePicture($comment['profileName'],$comment['profilePicture'],45,45),
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

        return $data;
    }

    public function postAddDataTransformer(Post $post,$images)
    {
        return [
            'id' => $post->getId(),
            'userId' => $post->getUser()->getId(),
            'firstName' =>  $post->getUser()->getFirstName(),
            'lastName' => $post->getUser()->getLastName(),
            'profileName' => $post->getUser()->getProfileName(),
            'text' =>  $post->getText(),
            'createdAt' =>  $post->getCreatedAt(),
            'images' => $images,
            'likes' =>  0,
            'liked' =>  false,
            'comments' => [],
            'commentCount' => 0
        ];
    }

    public function profileListDataTransformer($user)
    {
        return [
            'id' => $user->getId(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'profilePicture' => Image::getProfilePicture($user->getProfileName(),$user->getProfilePicture(),100,100),
            'profileName' =>$user->getProfileName(),
            'followers' => $user->getFriendsWithMe()->count(),
            'following' => $user->getFriends()->count()
        ];
    }

    public function searchQueryDataTransformer($q,$user)
    {
        $friends = $user->getFriends()->toArray();
        $requests = $user->getFromUser()->toArray();

        foreach ($q as $k=>$value) {
            if(!$friends) {
                $q[$k]['following'] = false;
            } else {
                foreach ($friends as $friend) {
                    if ($friend->getFriend()->getId() == $value['id']) {
                        $q[$k]['following'] = true;
                        break;
                    } else {
                        $q[$k]['following'] = false;
                    }
                }
            }

            if(!$requests) {
                $q[$k]['requested'] = false;
            } else {

                foreach($requests as $request) {
                    if($request->getToUser()->getId() == $value['id']) {
                        $q[$k]['requested'] = true;
                        break;
                    } else {
                        $q[$k]['requested'] = false;
                    }
                }

            }

            $q[$k]['profilePicture'] = Image::getProfilePicture($value['profileName'],$value['profilePicture'],45,45);
        }

        return $q;
    }

    public function subCommentListDataTransformer($subComments)
    {
        $data = [];
        foreach ($subComments as $key => $value) {
            $data[$key]['id'] = $value['id'];
            $data[$key]['userId'] = $value['userId'];
            $data[$key]['firstName'] = $value['firstName'];
            $data[$key]['lastName'] = $value['lastName'];
            $data[$key]['profileName'] = $value['profileName'];
            $data[$key]['profilePicture'] = Image::getProfilePicture($value['profileName'],$value['profilePicture'],45,45);
            $data[$key]['text'] = $value['text'];
            $data[$key]['createdAt'] = $value['createdAt'];
        }

        return $data;
    }

    public function subCommentAddDataTransformer(SubComment $subComment)
    {
        $com['id'] = $subComment->getId();
        $com['userId'] = $subComment->getUser()->getId();
        $com['firstName'] = $subComment->getUser()->getFirstName();
        $com['lastName'] = $subComment->getUser()->getLastName();
        $com['profileName'] = $subComment->getUser()->getProfileName();
        $com['text'] = $subComment->getText();
        $com['profilePicture'] = Image::getProfilePicture($subComment->getUser()->getProfileName(),$subComment->getUser()->getProfilePicture(),30,30);
        $com['createdAt'] = $subComment->getCreatedAt();

        return $com;
    }
}