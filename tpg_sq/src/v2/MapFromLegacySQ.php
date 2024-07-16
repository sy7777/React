<?php

namespace Drupal\tpg_sq\v2;
use Drupal\tpg_sq\v2\AddressDetails;

class MapFromLegacySQ
{
    private $legacyAddressBreakdown;

    /**
     * MapFromLegacySQ constructor.
     * @param $legacyAddressFields
     */
    public function __construct($legacyAddressFields)
    {
        $this->legacyAddressBreakdown = (array) $legacyAddressFields;
        return $this;
    }

    /**
     * @param \Drupal\tpg_sq\v2\AddressDetails $addressDetails
     * @return \Drupal\tpg_sq\v2\AddressDetails
     */
    public function returnMappedData(AddressDetails $addressDetails)
    {
        $addressDetails->streetNumber   =  $this->legacyAddressBreakdown['Building number (First)'];
        $addressDetails->streetNumber2  =  $this->legacyAddressBreakdown['Building number (Last)'];
        $addressDetails->unitNumber     =  $this->legacyAddressBreakdown['Flat/Unit (Number)'];
        $addressDetails->unitType       =  $this->legacyAddressBreakdown['Flat/Unit (Type)'];
        $addressDetails->allotmentNumber=  $this->legacyAddressBreakdown['Allotment (Number)'];
        $addressDetails->allotmentType  =  $this->legacyAddressBreakdown['Allotment (Type)'];
        $addressDetails->unitType       =  $this->legacyAddressBreakdown['Flat/Unit (Type)'];
        $addressDetails->streetName     = $this->legacyAddressBreakdown['Street (Name)'];
        $addressDetails->streetType     = $this->legacyAddressBreakdown['Street (Type)'];
        $addressDetails->suburb         = $this->legacyAddressBreakdown['Locality'];
        $addressDetails->state          = $this->legacyAddressBreakdown['State code'];
        $addressDetails->postcode       = $this->legacyAddressBreakdown['Postcode'];

        return $addressDetails;
    }
}
