<?php


namespace App\Controller;


use App\Entity\Message;
use App\Entity\User;
use App\Form\MessageType;
use App\Repository\MessageRepository;
use App\Services\DataTransformer;
use App\Services\Image;
use App\Services\PushNotification;
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
     * @param DataTransformer $transformer
     * @return JsonResponse
     */
    public function getUsers(DataTransformer $transformer)
    {
        $user = $this->getUser();
        $data = $this->getDoctrine()->getRepository(Message::class)->findUsersByUser($user);

        if(!$data) {
            return $this->json([],Response::HTTP_NOT_FOUND);
        }

        $users = $transformer->messageUsersListDataTransformer($data,$user);
        return $this->json($users,Response::HTTP_OK);
    }

    /**
     * @Route("/message", name="message_get", methods="GET")
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse
     */
    public function getMessages(Request $request, DataTransformer $transformer)
    {
        $user = $this->getUser();
        $friend = $request->query->getInt('id',0);
        $offset = $request->query->getInt('offset',0);

        if(!$friend) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }

        $messages = $this->getDoctrine()->getRepository(Message::class)->findMessages($user,$friend,$offset);

        if(!$messages) {
            return $this->json([],Response::HTTP_NOT_FOUND);
        }

        $response = $transformer->messageListDataTransformer($messages,$user);

        return $this->json($response, Response::HTTP_OK);
    }

    /**
     * @Route("/message", name="message_post", methods="POST")
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse
     */
    public function postMessage(Request $request, DataTransformer $transformer)
    {
        $data = json_decode($request->getContent(),true);
        $user = $this->getUser();
        $message = new Message();
        $form = $this->createForm(MessageType::class,$message);
        $form->submit($data);

        if($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_BAD_REQUEST);
        }
        $toUser = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data['toUser']]);

        $devices = $toUser->getPushNotifications()->toArray();
        $sendTo = [];
        foreach ($devices as $device) {
            $sendTo[] = $device->getPhone();
        }
        $notification = new PushNotification();
        $notification->setTitle('Message');
        $notification->setBody($user->getFirstName().' '.$user->getLastName().'('.$user->getProfileName().') has sent you a message');
        $notification->setToMultiple($sendTo);
        $notification->sendNotification();


        $message->setFromUser($user);
        $em = $this->getDoctrine()->getManager();
        $em->persist($message);
        $em->flush();
        $response = $transformer->messageAddDataTransformer($message);

        return $this->json($response,Response::HTTP_CREATED);

    }

}