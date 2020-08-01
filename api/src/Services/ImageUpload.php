<?php


namespace App\Services;


class ImageUpload
{
    private $postsPath;
    private $profilePicPath;
    private array $uploadedImagesNameArray;

    public function __construct($user)
    {
        $this->postsPath = 'assets/images/posts/'.strtolower($user).'/';
        $this->profilePicPath = 'assets/images/profilePicture/'.strtolower($user).'/';
        $this->uploadedImagesNameArray = [];

    }

    private function validateImage(string $image): bool
    {
        if(!preg_match('#^data:image/\w+;base64,#i',$image)) {
            $image = 'data:image/jpeg;base64,'.$image;
        }

        try {
            $response = (bool)exif_imagetype($image);
        } catch (\Exception $exception) {
            $response = false;
        }
        return $response;
    }

    public function uploadImages(array $images): bool
    {
        if(!file_exists($this->postsPath)) {
            mkdir($this->postsPath,0777,true);
        }
        foreach ($images as $image) {
            if($this->validateImage($image)) {
                $name = $this->generateUniqueName();
                $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));;
                $upload = file_put_contents($this->postsPath.$name,$data);
                if($upload) {
                    $this->uploadedImagesNameArray[] = $name;
                }
            }
        }

        return true;
    }

    public function uploadProfilePic($image): bool
    {
        if(!file_exists($this->profilePicPath)) {
            mkdir($this->profilePicPath,0777,true);
        }

        if($this->validateImage($image)) {
            $name = $this->generateUniqueName();
            $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));;
            $upload = file_put_contents($this->profilePicPath.$name,$data);
            if($upload) {
                $this->uploadedImagesNameArray[] = $name;
                return true;
            }
        }

        return false;
    }

    public function getUploadedImagesNames(): array
    {
        return $this->uploadedImagesNameArray;
    }

    public function getAllAbsoluteUrlsToImages(): array
    {
        $images = [];
        foreach ($this->uploadedImagesNameArray as $name)
        {
            $images[] = $this->postsPath.$name;
        }

        return $images;
    }

    private function generateUniqueName(): string
    {
        return uniqid().'.jpg';
    }

}