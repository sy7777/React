<?php

namespace Drupal\tpg_sq\v2;

use Drupal\tpg_sq\v2\Types;

class UnitTypes extends Types
{
    protected function initTypes()
    {
        $unitTypeCode["ANT"]  = "Antenna";
        $unitTypeCode["APT"]  = "Apartment";
        $unitTypeCode["ATM"]  = "AutomatedTellerMachine";
        $unitTypeCode["BBQ"]  = "Barbecue";
        $unitTypeCode["BLDG"] = "Building";
        $unitTypeCode["BNGW"] = "Bungalow";
        $unitTypeCode["BTSD"] = "Boatshed";
        $unitTypeCode["CAGE"] = "Cage";
        $unitTypeCode["CARP"] = "Carpark";
        $unitTypeCode["CARS"] = "Carspace";
        $unitTypeCode["CLUB"] = "Club";
        $unitTypeCode["COOL"] = "Coolroom";
        $unitTypeCode["CTGE"] = "Cottage";
        $unitTypeCode["DUPL"] = "Duplex";
        $unitTypeCode["FCTY"] = "Factory";
        $unitTypeCode["FLAT"] = "Flat";
        $unitTypeCode["GRGE"] = "Garage";
        $unitTypeCode["HALL"] = "Hall";
        $unitTypeCode["HSE"]  = "House";
        $unitTypeCode["KSK"]  = "Kiosk";
        $unitTypeCode["LBBY"] = "Lobby";
        $unitTypeCode["LOFT"] = "Loft";
        $unitTypeCode["LOT"]  = "Lot";
        $unitTypeCode["LSE"]  = "Lease";
        $unitTypeCode["MBTH"] = "MarineBerth";
        $unitTypeCode["MSNT"] = "Maisonette";
        $unitTypeCode["OFFC"] = "Office";
        $unitTypeCode["RESV"] = "Reserve";
        $unitTypeCode["ROOM"] = "Room";
        $unitTypeCode["SE"]   = "Suite";
        $unitTypeCode["SHED"] = "Shed";
        $unitTypeCode["SHOP"] = "Shop";
        $unitTypeCode["SHRM"] = "Showroom";
        $unitTypeCode["SIGN"] = "Sign";
        $unitTypeCode["SITE"] = "Site";
        $unitTypeCode["STLL"] = "Stall";
        $unitTypeCode["STOR"] = "Store";
        $unitTypeCode["STR"]  = "Strataunit";
        $unitTypeCode["STU"]  = "Studio";
        $unitTypeCode["SUBS"] = "Substation";
        $unitTypeCode["TNCY"] = "Tenancy";
        $unitTypeCode["TNHS"] = "Townhouse";
        $unitTypeCode["TWR"]  = "Tower";
        $unitTypeCode["UNIT"] = "Unit";
        $unitTypeCode["VLLA"] = "Villa";
        $unitTypeCode["VLT"]  = "Vault";
        $unitTypeCode["WARD"] = "Ward";
        $unitTypeCode["WHSE"] = "Warehouse";
        $unitTypeCode["WKSH"] = "Workshop";

        $this->types = $unitTypeCode;
    }
}

?>
