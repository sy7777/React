<?php
    namespace Drupal\tpg_sq\v2\SQResponseTransform\Test;

    use Drupal\tpg_sq\v2\SQResponseTransform\SqTransformRule;

    class ResponseNbnAvailable implements SqTransformRule
    {
        public function __construct()
        {
            return $this;
        }

        public function execute($sqResponse)
        {
            $sqResponse['Services']['nbn'] = 1;

            $sqResponse['NBN']['svcClass'] = 3;
            $sqResponse['NBN']['loc'] = 'LOC000007852596';
            $sqResponse['NBN']['res'] = 0;
            $sqResponse['NBN']['Self Install and RSP Professional Install Eligible'] = 'No';
            $sqResponse['NBN']['ultraFastAvailable'] = 'Yes';
            $sqResponse['NBN']['technology']    = 'Fibre';
            $sqResponse['NBN']['long'] = '115.82945';
            $sqResponse['NBN']['csa']  = 'CSA600000000017';
            $sqResponse['NBN']['selfInstallandRSPProfessionalInstallEligible']  = 'No';
            $sqResponse['NBN']['batt'] = 'Y';
            $sqResponse['NBN']['exch'] ='APPX';
            $sqResponse['NBN']['superFastAvailable'] = 'Yes';
            $sqResponse['NBN']['region'] = 'URBAN';
            $sqResponse['NBN']['lat'] = '-32.0276';
            $sqResponse['NBN']['ntd'] = 'NTD000006521159';

            return $sqResponse;
        }
    }
?>
