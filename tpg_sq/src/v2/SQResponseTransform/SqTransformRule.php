<?php
    namespace Drupal\tpg_sq\v2\SQResponseTransform;

    interface SqTransformRule
    {
        public function execute($sqResponse);
    }
