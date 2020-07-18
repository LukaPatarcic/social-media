<?php


namespace App\Services;


use App\Entity\User;

class Image
{

    public static function getProfilePicture($username, $profilePicture, int $max_width,int $max_height)
    {
        if(!$profilePicture) {
            return null;
        }

        $filename = 'assets/images/profilePicture/'.strtolower($username).'/'.$profilePicture;
        list($orig_width, $orig_height) = getimagesize($filename);

        $width = $orig_width;
        $height = $orig_height;

        # taller
        if ($height > $max_height) {
            $width = ($max_height / $height) * $width;
            $height = $max_height;
        }

        # wider
        if ($width > $max_width) {
            $height = ($max_width / $width) * $height;
            $width = $max_width;
        }

        $image_p = imagecreatetruecolor($width, $height);


        $image = Image::getResource($filename);

        imagecopyresampled($image_p, $image, 0, 0, 0, 0,
            $width, $height, $orig_width, $orig_height);

        ob_start();
        imagejpeg($image_p);
        $contents = ob_get_contents();
        ob_end_clean();

        $dataUri = "data:image/jpeg;base64," . base64_encode($contents);
        return $dataUri;
    }

    private static function getResource($filename)
    {
        $type = exif_imagetype($filename);
        switch ($type) {
            case 1:
                return imagecreatefromgif($filename);
            break;
            case 2:
                return imagecreatefromjpeg($filename);
            break;
            case 3:
                return imagecreatefrompng($filename);
            break;
            default:
                return imagecreatefromstring($filename);

        }
    }

}