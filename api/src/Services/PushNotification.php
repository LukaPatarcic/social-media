<?php


namespace App\Services;


class PushNotification
{
    /**
     * @var mixed
     */
    private $apiKey;

    /**
     * @var array
     */
    private $headers;

    /**
     * @var array
     */
    private $fields;
    /**
     * @var string
     */
    private $url;

    public function __construct($url = 'https://fcm.googleapis.com/fcm/send')
    {
        $this->url = $url;
        $this->apiKey = $_ENV['ANDROID_PUSH_NOTIFICATION_API_KEY'];
        $this->headers = [
            'Authorization: key=' .$this->apiKey,
            'Content-Type: application/json'
        ];
    }

    public function setTo($to)
    {
        $this->fields['to'] = $to;
    }

    public function setTitle($title)
    {
        $this->fields['notification']['title'] = $title;

        return $this;
    }

    public function setMessage($message)
    {
        $this->fields['notification']['message'] = $message;

        return $this;
    }


    public function message()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->fields));
        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result,true);
    }


}