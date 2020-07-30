<?php

namespace App\Tests;

use App\Services\ImageUpload;
use PHPUnit\Framework\TestCase;

class ImageUploadTest extends TestCase
{

    /**
     * @param $data
     * @dataProvider ImageUploadProfilePictureDataProvider
     */
    public function testUploadProfilePic($data)
    {
        $upload = new ImageUpload($data['username']);
        $response = $upload->uploadProfilePic($data['profilePicture']);

        $this->assertEquals($data['expected'],$response);
    }

    /**
     * @param $data
     * @dataProvider ImageUploadPicturesDataProvider
     */
    public function testUploadImages($data)
    {
        $upload = new ImageUpload($data['username']);
        $response = $upload->uploadImages($data['images']);

        $this->assertEquals($data['expected'],$response);
    }

    public function ImageUploadProfilePictureDataProvider(): array
    {
        return [
            [
                [
                    'username' => 'Khallion98',
                    'profilePicture' => 'data:image/jpeg;base64,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',
                    'expected' => true
                ],
            ],
            [
                [
                    'username' => 'asd',
                    'profilePicture' => 'asd',
                    'expected' => true
                ]
            ]

        ];

    }

    public function ImageUploadPicturesDataProvider()
    {
        return [
            [
                [
                    'username' => 'Khallion98',
                    'images' => ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAZABkAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8UooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvfk+FnhHykzZXJbau7/AEpq8Br6xT/VJ/ur/wCg0Acd/wAKr8I/8+Vz/wCBTUf8Kr8I/wDPlc/+BTV07xXv25JUuYvsu1t8DQ7mb+7tfd8v/fLfxf8AAXzXSwQtKYpmUfwojM3/AHytAHK/8Kr8I/8APlc/+BTUf8Kr8I/8+Vz/AOBTV1n2hdyr5U3Ks33G+WnJKruy7HVlVW+Zf97/AOJoA8a+Jfg3RvDWm6fc6XFNE00zo6vLv3fLurzavaPjT/yANK/6+n/9AryTStLm1a4eKF4o0jiaaWWVmVI0X7zNtoApUV0SeF7eVpZodcsX02FA8t5tddm5iqrs253na3y/3RQ3hJw0s/8AalkNPFv9qS92uyOm9U+6F3K25vmXHy0Ac7RXRp4OvpLiJEubSSOZofJnjdijrK+wMPl3fK2d2VzUf/CH6t9pntkiR547iKFFVvlm83fsdG+7s2o3zUAYFFb76BokZ2P4ssvMXh9trOy5/wBlgnzD3ooAwK+sU/1Sf7q/+g18nrE7LuCMy/7tfUaavpflJ/xNNP8Aur/y9J/8VQBaVvNd1DKyL8u5X+bd/Ev/AKDUa2cKqq/P8q7VZpWZv++t1Rf2tpa9NU0//wACU/8AiqlS/sXXcl9aMrfxLcJ/8VQBKkSoz4ZuW3bWb7vy/wANSVVfVNORtr6nYq391rlF/wDZqZ/a+l/9BXT/APwKT/4qgDgfjT/yANK/6+n/APQK8r0LUrWwmuI762e4sbyLybhEfY4XcrK6N6qVDfN8tem/GC8tLzRNMS0u7e4dbh2ZYJVfau3/AGa8eZWU7Su1qAOrTVPDFqtxptvbau2l3exp5Xki85XTdtZVC7cfMwZSed38O3mzB4l8PeVNpc1pqcWi/ZmhiMTo9w5aVX3tu2qv3B8q1xdFAHZWni7TrWW1ijs7mG0s3t/KXesrsqXDSuzN8vzNu+7UOneN5rKyit5rZLhre7SaJ3+80S7/AN0zf3fnbb/d3NXJ0UAegad4q0DTLJLa0v8AxbbRD5vJtzE6Ix+8Ax685orz+igCaG8uIE2RvtX/AGlVqf8A2ld/89R/3wtVqKALP9pXf/PUf98LR/aV3/z1H/fC1WooAs/2ld/89R/3wtH9pXf/AD1H/fC1WooAs/2ld/8APUf98LVeSV5XZ3bcxpKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k='],
                    'expected' => true
                ],
            ],
            [
                [
                    'username' => 'asd',
                    'images' => ['asd'],
                    'expected' => true
                ],
            ],
        ];
    }
}
