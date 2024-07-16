<?php

    namespace Drupal\tpg_sq\v2\SQResponseTransform;

    use Drupal\tpg_sq\v2\SQResponseTransform\SqTransformRule;

    class RemoveNBNaddrlistWhenEmptyRule implements SqTransformRule
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
            if (array_key_exists('NBN', $sqResponse))
            {
                if (isset($sqResponse['NBN']['addr_list']) && count($sqResponse['NBN']['addr_list']) == 0)
                {
                    unset($sqResponse['NBN']['addr_list']);
                }
            }

            return $sqResponse;
        }
    }
