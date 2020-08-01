<?php


namespace App\Controller;


use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Services\DataTransformer;
use App\Services\Image;
use App\Services\ImageUpload;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class ProfileController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class ProfileController extends BaseController
{
    /**
     * @Route("/user", name="user_profile", methods={"GET"})
     * @param Request $request
     * @param DataTransformer $transformer
     * @return JsonResponse
     */
    public function user(Request $request, DataTransformer $transformer)
    {
        $profileName = $request->query->get('profileName') ? $request->query->getAlnum('profileName') : $this->getUser()->getProfileName();
        /*** User $user*/
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['profileName' => $profileName]);

        $data = $transformer->profileListDataTransformer($user);

        return $this->json($data,Response::HTTP_OK,[]);
    }

    /**
     * @Route("/user/edit", name="user_edit", methods={"PATCH"})
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @return JsonResponse
     */
    public function userEdit(Request $request, UserPasswordEncoderInterface $passwordEncoder)
    {
        $data = json_decode($request->getContent(),true);
        /** * @User $user */
        $user = $this->getUser();

        if(!$this->checkIfInArray($data)) {
            return $this->json([],Response::HTTP_BAD_REQUEST);
        }

        $user->setProfileName($data['profileName'] ?? $user->getProfileName())
            ->setEmail($data['email'] ?? $user->getEmail())
            ->setFirstName($data['firstName'] ?? $user->getFirstName())
            ->setLastName($data['lastName'] ?? $user->getLastName());
        if(isset($data['password']['first'])) {
            $password = $passwordEncoder->encodePassword($user, $data['password']['first']);
            $user->setPassword($password);
        }

        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->submit($data);

        if($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->getDoctrine()->getManager()->flush();
        return $this->json(['success' => 1],Response::HTTP_OK);
    }

    /**
     * @Route("/user/edit/picture", name="user_edit_profile_picture", methods="PATCH")
     * @param Request $request
     * @return JsonResponse
     */
    public function editProfilePicture(Request $request)
    {
        $data = json_decode($request->getContent(),true);
        $user = $this->getUser();

        $image = new ImageUpload($user->getProfileName());
        $upload = $image->uploadProfilePic($data['image'] ?? '');
        if($upload) {
            $user->setProfilePicture($image->getUploadedImagesNames()[0]);
            $this->getDoctrine()->getManager()->flush();
            return $this->json(['success' => 1],Response::HTTP_OK);
        }

        return $this->json(['error' => 'Oops... Something went wrong!'],Response::HTTP_BAD_REQUEST);
    }

    private function checkIfInArray(array $array): bool
    {
        $check = ['profileName','firstName','lastName','email','password'];
        $arrayKeys = array_keys($array);
        if(array_diff($check,$arrayKeys)) {
            return false;
        }

        return true;
    }
}