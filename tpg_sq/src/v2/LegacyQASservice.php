<?php

namespace Drupal\tpg_sq\v2;

use Drupal\tpg_sq\v2\OneSqEnv;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Client;

define ('QAS_API', 'api/qas');

class LegacyQASservice
{
    private $apiClient;
    public function __construct()
    {
        $this->apiClient = new Client();
        return $this;
    }

    /**
     * @param string $id
     * @param $address
     * @return bool|string
     */
    public function returnQAS($id = '', $address = '')
    {
        try
        {
            $id         = urlencode($id);
            $address    = urlencode($address);
            $r          = urlencode(QAS_API);
            $url = OneSqEnv::returnQASEndpoint() . "?r=" . $r . "&id=" . $id ."&addr=" . $address;

            $request = $this->apiClient->get($url);
            $body = $request->getBody();

            return $body->getContents();
        }
        catch (\Exception $e)
        {
            echo $e->getMessage();
            return false;
        }
    }


}

?>
