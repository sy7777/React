<?php

namespace Drupal\tpg_sq\v2;

class Model
{
    public function __construct() {}

    /**
     * @param $property
     * @param $value
     */
    public function __set($property, $value)
    {
        if (property_exists($this, $property))
        {
            $this->$property = $value;
        }
    }

    /**
     * @param $property
     * @return mixed
     */
    public function __get($property)
    {
        try {
            if (property_exists($this, $property))
            {
                return $this->property;
            }
            else
            {
                throw new \Exception($property . " does not exist");
            }
        }
        catch (\Exception $e)
        {
            echo $e->getMessage();
        }
        return false;
    }

    /**
     * @return array
     */
    public function returnPropertiesObject()
    {
        return get_object_vars($this);
    }

    public function returnSanitizedPropertiesObject()
    {
        $properties = $this->returnPropertiesObject();
        return array_filter($properties, function($propertyValue) {
            return !empty($propertyValue);
        });
    }

    /**
     * @return false|string
     */
    public function toJsonString()
    {
        return json_encode($this->returnSanitizedPropertiesObject());
    }

}

?>
