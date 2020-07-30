<?php


namespace App\Services;


use App\Entity\User;
use PHPUnit\Framework\TestCase;

class ImageTest extends TestCase
{

    /**
     * @param $data
     * @dataProvider ImageTestDataProvider
     */
    public function testGetProfilePicture($data)
    {
        $image = Image::getProfilePicture($data['username'],$data['profilePicture'],$data['width'],$data['height']);

        $this->assertEquals($data['expected'],gettype($image));
    }

    public function ImageTestDataProvider(): array
    {
        return [
            [
                [
                    'username' => 'Khallion98',
                    'profilePicture' => '5f2266e722bbf.jpg',
                    'width' => 45,
                    'height' => 45,
                    'expected' => 'string'
                ],
            ],
            [
                [
                    'username' => '',
                    'profilePicture' => '',
                    'width' => 20,
                    'height' => 20,
                    'expected' => 'NULL'
                ]
            ],
            [
                [
                    'username' => 'asd',
                    'profilePicture' => 'das',
                    'width' => 20,
                    'height' => 20,
                    'expected' => 'NULL'
                ]
            ]

        ];

    }
}