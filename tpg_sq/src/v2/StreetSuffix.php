<?php

namespace Drupal\tpg_sq\v2;

use Drupal\tpg_sq\v2\Types;

class StreetSuffix extends Types
{

    protected function initTypes()
    {
        $streetSuffix = array();
        $streetSuffix["N"] = "North";
        $streetSuffix["E"] = "East";
        $streetSuffix["W"] = "West";
        $streetSuffix["S"] = "South";
        $streetSuffix["CN"] = "Central";
        $streetSuffix["SE"] = "South East";
        $streetSuffix["DE"] = "Deviation";
        $streetSuffix["SW"] = "South West";
        $streetSuffix["UP"] = "Upper";
        $streetSuffix["EX"] = "Extension";
        $streetSuffix["LR"] = "Lower";
        $streetSuffix["IN"] = "Inner";
        $streetSuffix["ML"] = "Mall";
        $streetSuffix["OF"] = "Off";
        $streetSuffix["ON"] = "On";
        $streetSuffix["NE"] = "North East";
        $streetSuffix["OP"] = "Overpass";
        $streetSuffix["NW"] = "North West";
        $streetSuffix["OT"] = "Outer";

        $this->types = $streetSuffix;
    }
}

?>
