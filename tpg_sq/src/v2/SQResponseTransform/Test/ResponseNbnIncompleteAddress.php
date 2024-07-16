<?php
    namespace Drupal\tpg_sq\v2\SQResponseTransform\Test;

    use Drupal\tpg_sq\v2\SQResponseTransform\SqTransformRule;

    class ResponseNbnIncompleteAddress implements SqTransformRule
    {
        public function __construct()
        {
            return $this;
        }

        public function execute($sqResponse)
        {
            $sqResponse['NBN']['res'] = 2;
            $sqResponse['NBN']['addr_list'][] = json_decode('{"roadType":"ST","roadNumber1":"151","latitude":"-34.67818455","locality":"KIAMA","postcode":"2533","ID":"LOC000000901005","lotNumber":"15","state":"NSW","roadName":"SHOALHAVEN","longitude":"150.8473947"}');
            $sqResponse['NBN']['addr_list'][] = json_decode('{"unitTypeCode":"U","roadType":"ST","roadNumber1":"151","latitude":"-34.6779773","locality":"KIAMA","postcode":"2533","unitNumber":"2","ID":"LOC000178016828","state":"NSW","roadName":"SHOALHAVEN","longitude":"150.8470108"}');
            $sqResponse['NBN']['addr_list'][] = json_decode('{"unitTypeCode":"U","roadType":"ST","roadNumber1":"151","latitude":"-34.67782649","locality":"KIAMA","postcode":"2533","unitNumber":"3","ID":"LOC000178016837","state":"NSW","roadName":"SHOALHAVEN","longitude":"150.8467898"}');
            $sqResponse['NBN']['exch'] = 'KIAM';

            return $sqResponse;
        }
    }
