<?php


namespace App\Controller;


use App\Entity\Message;
use App\Repository\MessageRepository;
use App\Services\Image;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class MessageController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class MessageController extends BaseController
{
    /**
     * @Route("/message/users", name="message_users", methods="GET")
     */
    public function getUsers()
    {
        $user = $this->getUser();
        $data = $this->getDoctrine()->getRepository(Message::class)->findUsersByUser($user);
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
            $message = $this->getDoctrine()
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
        return $this->json($users);
    }

    /**
     * @Route("/message", name="message_get", methods="GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function getMessages(Request $request)
    {
        $user = $this->getUser();
        $friend = $request->query->getInt('id',0);
        $offset = $request->query->getInt('offset',0);

        if(!$friend) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }

        $messages = $this->getDoctrine()->getRepository(Message::class)->findMessages($user,$friend,$offset);
        foreach ($messages as $key => $message) {
            $profilePicture = Image::getProfilePicture($message['profileName'],$message['profilePicture'],45,45);
            unset($messages[$key]['profilePicture']);
            $messages[$key]['profilePicture'] = $profilePicture;
            $messages[$key]['isMe'] = $user->getProfileName() == $message['profileName'] ? true : false;
        }

        return $this->json($messages);
    }

}