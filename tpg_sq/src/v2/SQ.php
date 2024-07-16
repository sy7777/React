<?php

namespace Drupal\tpg_sq\v2;

use Drupal\tpg_sq\v2\Model;

class SQ extends Model
{
    public $addressDetails;
    public $brand;
    public $gnafid;
    public $locationId;

    public function __construct(AddressDetails $address, $brand = 'TPG', $gnafid = '', $locationId = '')
    {
        $this->addressDetails      = $address->returnSanitizedPropertiesObject();
        $this->brand        = $brand;
        $this->gnafid       = $gnafid;
        $this->locationId   = $locationId;

        parent::__construct();
    }
}

?>
