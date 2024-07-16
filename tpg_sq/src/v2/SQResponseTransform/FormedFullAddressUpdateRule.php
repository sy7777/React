<?php

    namespace Drupal\tpg_sq\v2\SQResponseTransform;

    use Drupal\tpg_sq\v2\SQResponseTransform\SqTransformRule;

    class FormedFullAddressUpdateRule implements SqTransformRule
    {
        public function __construct()
        {
            return $this;
        }

        /**
         * @param $sqResponse
         * @return mixed
         */
        public function execute($sqResponse)
        {
            $fullAddress = isset($_REQUEST['fullAddress']) ? $_REQUEST['fullAddress'] : false;

            if ($fullAddress !== false)
            {
                $sqResponse['formed_fulladdress'] = $fullAddress;
            }

            return $sqResponse;
        }
    }
