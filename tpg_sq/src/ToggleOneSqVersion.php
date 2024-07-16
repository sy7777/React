<?php

namespace Drupal\tpg_sq;

class ToggleOneSqVersion
{
    static private $availableOnPages = [];

    /**]
     * @return bool
     */
    static public function isVersion2Available()
    {
        $host       = $_SERVER['HTTP_HOST'] . '/';
        $referer    = $_SERVER['HTTP_REFERER'];
        $page       = str_replace( [$host, 'http://', 'https://'], '', $referer );

        return in_array($page, self::$availableOnPages);
    }
}
