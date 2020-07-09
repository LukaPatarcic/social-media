<?php


namespace App\Services;


class ImageUpload
{
    private $images;
    private $dirPath;

    public function __construct($user)
    {
        $this->dirPath = 'assets/images/posts/'.strtolower($user).'/';
        $this->uploadedImagesNameArray = [];

    }

    private function validateImage(string $image): bool
    {
        return (bool)exif_imagetype($image);
    }

    private function base64decode(string $image)
    {
        $filePath = tempnam(sys_get_temp_dir(), 'tmp_post_image');
        $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));;
        file_put_contents($filePath, $data);

    }

    public function uploadImages($images): bool
    {
        if(!file_exists($this->dirPath)) {
            mkdir($this->dirPath,0777,true);
        }
        foreach ($images as $image) {
            if($this->validateImage($image)) {
                $name = $this->generateUniqueName();
                $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));;
                $upload = file_put_contents($this->dirPath.$name,$data);
                if($upload) {
                    $this->uploadedImagesNameArray[] = $name;
                }
            }
        }

        return true;
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
            $images[] = $this->dirPath.$name;
        }

        return $images;
    }

    private function generateUniqueName(): string
    {
        return uniqid().'.jpg';
    }

}