<?php

    namespace Drupal\tpg_sq\v2;

    use Drupal\tpg_sq\v2\Model;
    use Drupal\tpg_sq\v2\UnitTypes;
    use Drupal\tpg_sq\v2\LevelTypes;
    use Drupal\tpg_sq\v2\StreetSuffix;
    use Drupal\tpg_sq\v2\StreetTypes;

    class AddressDetails extends Model
    {
        public $allotmentNumber;
        public $allotmentType;
        public $buildingLevelNumber;
        public $buildingLevelType;
        public $buildingName;
        public $latitude;
        public $longitude;
        public $postcode;
        public $state;
        public $streetName;
        public $streetNumber;
        public $streetNumber2;
        public $streetNumberSuffix;
        public $streetType;
        public $streetTypeSuffix;
        public $suburb;
        public $unitNumber;
        public $unitNumberPreSuffix;
        public $unitNumberSuffix;
        public $unitType;

        /**
         * @param $property
         * @param $value
         */
        public function __set($property, $value)
        {
            if (property_exists($this, $property))
            {
                switch($property)
                {
                    case "unitType":
                        $value = (new UnitTypes())->returnMatchingType($value);
                        break;
                    case "streetType":
                        $value = (new StreetTypes())->returnMatchingType($value);
                        break;
                    case "streetTypeSuffix":
                        $value = (new StreetSuffix())->returnMatchingType($value);
                        break;
                    case "buildingLevelType":
                        $value = (new LevelTypes())->returnMatchingType($value);
                        break;
                    default:
                }
            }

            parent::__set($property, $value);
        }
    }


?>
