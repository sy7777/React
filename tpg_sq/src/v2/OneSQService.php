<?php

namespace Drupal\tpg_sq\v2;

use Drupal\tpg_sq\v2\LegacyQASservice;

class OneSQService
{
    private $QASservice;

    public function __construct()
    {
        $this->QASservice = new LegacyQASservice();
    }

    /**
     * @param $id
     * @param $address
     * @return array
     */
    public function returnQAS($id, $address)
    {
        $addresses  = json_decode( $this->QASservice->returnQAS($id, $address) );

        $result = array_map(function($addr) {
            return $addr->text;
        }, $addresses);

        return $result;
    }

    /**
     * @param $address
     * @return bool
     */
    public function returnAddressId($address)
    {
        $address = json_decode( $this->QASservice->returnQAS('', $address) );
        if (count($address) > 0)
        {
            return $address[0]->id;
        }
        return false;
    }

    public function returnAddressBreakdown($addressId)
    {
        return json_decode( $this->QASservice->returnQAS( $addressId ) );
    }


    /**
     * @return bool
     */
    static public function isQAS()
    {
        return (isset($_GET['term']) && $_GET['term'] != '');
    }

    /**
     * @return bool
     */
    static public function isSQ()
    {
        return (isset($_GET['addr']) && $_GET['addr'] != '');
    }

}
