<?php

    namespace Drupal\tpg_sq\v2\SQResponseTransform;

    use Drupal\tpg_sq\v2\OneSqEnv;
    use Drupal\tpg_sq\v2\SQResponseTransform\SqTransformRule;

    class AddOneSqEndpointRule implements SqTransformRule
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
            $sqResponse['url'] = OneSqEnv::returnOneSqEndpoint();
            return $sqResponse;
        }
    }
