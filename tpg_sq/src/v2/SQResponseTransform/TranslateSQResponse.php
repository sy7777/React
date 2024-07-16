<?php

namespace Drupal\tpg_sq\v2\SQResponseTransform;

class TranslateSQResponse
{
    private $oneSqResponse;
    private $rules;

    public function __construct($oneSqResponse)
    {
        $this->oneSqResponse = json_decode($oneSqResponse, true);
        return $this;
    }


    /**
     * @param $class
     * @return $this
     */
    public function setRules($class)
    {
        if (class_exists($class))
        {
            $this->rules[] = $class;
        }
        return $this;
    }

    /**
     * @return $this
     */
    public function execute()
    {
        foreach ($this->rules as $index => $rule)
        {
            $this->oneSqResponse = (new $rule)->execute($this->oneSqResponse);
        }
        return $this;
    }

    /**
     * @return false|string
     */
    public function returnResponse()
    {
        return json_encode($this->oneSqResponse);
    }
}

?>
