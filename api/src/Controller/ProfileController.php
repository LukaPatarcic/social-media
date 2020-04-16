<?php


namespace App\Controller;


use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ProfileController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class ProfileController extends BaseController
{
    /**
     * @Route("/user", name="user_profile", methods={"GET"})
     * @return JsonResponse
     */
    public function user(Request $request)
    {
        $profileName = $request->query->get('profileName','');
        /*** User $user*/
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['profileName' => $profileName]);

        $data = [
            'id' => $user->getId(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'profileName' =>$user->getProfileName(),
            'followers' => $user->getFriendsWithMe()->count(),
            'following' => $user->getFriends()->count()
        ];

        return $this->json($data,Response::HTTP_OK,[]);
    }

}