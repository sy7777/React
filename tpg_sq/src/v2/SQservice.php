<?php
    namespace Drupal\tpg_sq\v2;

    use Drupal\tpg_sq\v2\OneSqEnv;
    use Drupal\tpg_sq\v2\SQ;
    use Drupal\tpg_sq\v2\AddressDetails;
    use GuzzleHttp\Client;

    define('SQ_API', 'onesq/api/v1/sq');

    class SQservice{

        private $apiClient;

        /**
         * SQservice constructor.
         */
        public function __construct()
        {
            $this->apiClient = new Client();
        }

        /**
         * @param \Drupal\tpg_sq\v2\SQ $payload
         * @return string
         */
        public function returnOneSqResult(SQ $payload)
        {
            try {

                $options = [
                    'headers'=> ['content-type' => 'application/json'],
                    'body' => $payload->toJsonString()
                ];

                $url = OneSqEnv::returnOneSqEndpoint() . SQ_API;
                $request = $this->apiClient->post($url, $options);
                $body = $request->getBody();

                return $body->getContents();
            }
            catch (\Exception $e)
            {
                echo $e->getMessage();
            }
        }


    }
?>
