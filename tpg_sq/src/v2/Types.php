<?php

namespace Drupal\tpg_sq\v2;


abstract class Types
{

    protected $types = [];

    public function __construct()
    {
        $this->initTypes();
        return $this;
    }

    abstract protected function initTypes();

    public function returnMatchingType($type)
    {
        return array_key_exists($type, $this->types) ? $this[$type] : $type;
    }

}

?>
