<?php


namespace App\Controller;


use App\Entity\User;
use App\Form\RegistrationFormType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class EditProfileController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class UserEditController extends BaseController
{
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

        $user->setProfileName($data['profileName'])
            ->setEmail($data['email'])
            ->setFirstName($data['firstName'])
            ->setLastName($data['lastName']);
        if($data['password']['first']) {
            $password = $passwordEncoder->encodePassword($user, $data['password']['first']);
            $user->setPassword($password);
        }

        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->submit($data);

        if($errors = $this->getErrorMessages($form)) {
            return $this->json(['error' => $errors], Response::HTTP_BAD_REQUEST);
        }


        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return $this->json(['success' => 1],Response::HTTP_OK);

    }

}