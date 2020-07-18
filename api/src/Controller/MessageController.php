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
        foreach ($data as $key => $value) {
            $message = $this->getDoctrine()
                ->getRepository(Message::class)
                ->findLastUsersMessage($value['fromUserId'],$value['toUserId']);
            $profileName = $value['fromUserProfileName'] ?? $value['toUserProfileName'];
            if(isset($value['fromUserProfilePicture']) || isset($value['toUserProfilePicture'])) {
                $profilePicture = $value['fromUserProfilePicture'] ?? $value['toUserProfilePicture'];
            } else {
                $profilePicture = null;
            }
            $userData = [
                'profileName' => $profileName,
                'profilePicture' => Image::getProfilePicture($profileName,$profilePicture,45,45)
            ];
            $users[] = array_merge($message[0],$userData);
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
            $fromUserPicture = Image::getProfilePicture($message['fromUserProfileName'],$message['fromUserProfilePicture'],30,30);
            $toUserPicture = Image::getProfilePicture($message['toUserProfileName'],$message['toUserProfilePicture'],30,30);
            unset($messages[$key]['fromUserProfilePicture']);
            unset($messages[$key]['toUserProfilePicture']);
            $messages[$key]['fromUserProfilePicture'] = $fromUserPicture;
            $messages[$key]['toUserProfilePicture'] = $toUserPicture;
        }

        return $this->json($messages);
    }

}