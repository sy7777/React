<?php

namespace Drupal\tpg_sq\v2;

use Drupal\tpg_env\TPG\Environment as TPG_ENV;

define ('ONESQ_PRODUCTION_ENDPOINT', 'https://onesq.tpgtelecom.com.au/');
define ('ONESQ_TESTING_ENDPOINT', 'https://onesqtst.it.tpgtelecom.com.au/');
define ('QAS_PRODUCTION_ENDPOINT', 'http://nbn.tpg.com.au/');
define ('QAS_TESTING_ENDPOINT', 'http://nbn-dev.tpg.com.au/');
define ('ONESQ_OVERRIDE_COOKIE_NAME', 'onesq_environment');

class OneSqEnv
{

    /**
     * @return bool|string
     */
    static public function returnOverridenOneSqEndpoint()
    {
        if ( isset($_COOKIE[ONESQ_OVERRIDE_COOKIE_NAME]) )
        {
             $cookieValue = strtolower($_COOKIE[ONESQ_OVERRIDE_COOKIE_NAME]);
             switch ( $cookieValue )
             {
                 case 'production':
                    return 'prod';
                    break;
                 case 'test':
                     return 'dev';
                     break;
                 default:
             }
        }

        return false;
    }


    /**
     * @return string
     */
    static public function returnQASEndpoint()
    {
        $env = TPG_ENV::getEnv();
        switch ($env)
        {
            case "dev":
            case "testing":
            case "staging":
                return QAS_TESTING_ENDPOINT;
                break;
            default:
                return QAS_PRODUCTION_ENDPOINT;
        }
    }

    /**
     * @return string
     */
    static public function returnOneSqEndpoint()
    {
        $env = (self::returnOverridenOneSqEndpoint() !== false) ? self::returnOverridenOneSqEndpoint() : TPG_ENV::getEnv();
        switch ($env)
        {
            case "dev":
            case "testing":
            case "staging":
                return ONESQ_TESTING_ENDPOINT;
                break;
            default:
                return ONESQ_PRODUCTION_ENDPOINT;
        }
    }

}
