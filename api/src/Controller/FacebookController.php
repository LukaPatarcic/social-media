<?php
namespace App\Controller;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Client\Provider\FacebookClient;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\FacebookUser;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FacebookController extends BaseController
{
    /**
     * Link to this controller to start the "connect" process
     *
     * @Route("/connect/facebook", name="connect_facebook_start")
     * @param ClientRegistry $clientRegistry
     * @return RedirectResponse
     */
    public function connectAction(ClientRegistry $clientRegistry)
    {
        // on Symfony 3.3 or lower, $clientRegistry = $this->get('knpu.oauth2.registry');

        // will redirect to Facebook!
        return $clientRegistry
            ->getClient('facebook_main') // key used in config/packages/knpu_oauth2_client.yaml
            ->redirect([
                'public_profile', 'email' // the scopes you want to access
            ])
            ;
    }

    /**
     * After going to Facebook, you're redirected back here
     * because this is the "redirect_route" you configured
     * in config/packages/knpu_oauth2_client.yaml
     *
     * @Route("/connect/facebook/check", name="connect_facebook_check")
     * @param ClientRegistry $clientRegistry
     * @return JsonResponse
     */
    public function connectCheckAction(ClientRegistry $clientRegistry)
    {
        // ** if you want to *authenticate* the user, then
        // leave this method blank and create a Guard authenticator
        // (read below)

        /** @var FacebookClient $client */
        $client = $clientRegistry->getClient('facebook_main');

        try {
            // the exact class depends on which provider you're using
            /** @var FacebookUser $user */
            $user = $client->fetchUser();
            $data = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail()
            ];

            // do something with all this new power!
            // e.g. $name = $user->getFirstName();
            return $this->json($data, Response::HTTP_OK);
            // ...
        } catch (IdentityProviderException $e) {
            // something went wrong!
            // probably you should return the reason to the user
            return $this->json([],Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/connect/facebook/get/user", name="connect_facebook_get_user")
     * @throws \Facebook\Exceptions\FacebookSDKException
     * @IsGranted("ROLE_USER")
     */
    public function getFacebookUser(Request $request)
    {
        $accessToken = $request->headers->get('facebook-access-token');
        if(!$accessToken) {
            return $this->json(['error' => 'Access token is required']);
        }

        $fb = new Facebook([
            'app_id' => '1189985861185629',
            'app_secret' => '26d71f5fa6f3c7decd1b3af3ea4528eb',
            'default_graph_version' => 'v5.0',
        ]);

        try {
            // Returns a `Facebook\FacebookResponse` object
            $response = $fb->get('me?fields=id,name,about,address,email,first_name,gender,hometown,last_name,picture.type(large),birthday,age_range,friends{picture,name}', $accessToken);
            return $this->json($response->getDecodedBody());

        } catch(FacebookResponseException $e) {
            return $this->json([],Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch(FacebookSDKException $e) {
            return $this->json([],Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}