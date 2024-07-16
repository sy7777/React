<?php

    namespace Drupal\tpg_sq\v2;

    use Drupal\tpg_sq\v2\Types;

    class LevelTypes extends Types
    {

        protected function initTypes()
        {
            $leveltype = array();
            $leveltype["B"]    = "Basement";
            $leveltype["FL"]   = "Floor";
            $leveltype["G"]    = "Ground";
            $leveltype["L"]    = "Level";
            $leveltype["LB"]   = "Lobby";
            $leveltype["LG"]   = "Lower Ground Floor";
            $leveltype["M"]    = "Mezzanine";
            $leveltype["P"]    = "Parking";
            $leveltype["PTHS"] = "Penthouse";
            $leveltype["PLF"]  = "Platform";
            $leveltype["PDM"]  = "Podium";
            $leveltype["RT"]   = "Rooftop";
            $leveltype["SB"]   = "Sub-Basement";
            $leveltype["UG"]   = "Upper Ground Floor";

            $this->types = $leveltype;
        }
    }

?>
