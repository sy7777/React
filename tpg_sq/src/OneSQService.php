<?php
/**
 * OneSQ Service
 *
 * This service provides service installation information from OneSQ.
 * @package tpg_sq
 * @author Adrian Pennington
 */

namespace Drupal\tpg_sq;

use Drupal\tpg_env\TPG;
use Drupal\tpg_sq\AddressFieldTypes;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Client;

class OneSQService {
    protected $base_url = 'https://nbn.tpg.com.au/?';
    protected $apiClient;

    public function __construct() {
        $this->addressFieldTypes = new AddressFieldTypes();
        $this->apiClient = new Client();
    }

    public function qas($params) {
        if (isset($params['addr']) && $params['addr'] != '' && !isset($_SESSION['qas']['rows'])) {
            $params['term'] = $params['addr'];
        }
        $result = '[]';
        if (isset($params['term']) && $params['term'] != '') {
            $term                    = $params['term'];
            $rows = json_decode($this->qas_api('', $term));
            unset ($rows->url);
            $_SESSION['qas']['rows'] = $rows;
            $values                  = array();
            foreach ($rows as $row) {
                $values[] = $row->text;
            }
            $result = json_encode($values);
        }
        if (isset($params['addr']) && $params['addr'] != '') {
            $addr = $params['addr'];
            if (isset($_SESSION['nbn_sq']['block_timer']) && time() < $_SESSION['nbn_sq']['block_timer'] + 3) {
                // blocker set and within 3 seconds time frame - break
                return '[]';
            }
            $_SESSION['sq_addr']               = $addr;
            $_SESSION['nbn_sq']['block_timer'] = time();
            $dataNBNSq = $this->retrieve_qas_session($addr);
            $bd_decode = $dataNBNSq;

            $dataNBNSq['r']         = 'api/sq';
            $dataNBNSq['verbose']   = '1';
            $dataNBNSq['checkFttb'] = 1; // enables fttb check
            if(!empty($params['onesq']) && $params['onesq']) {
                $dataNBNSq['r'] = 'api/onesq';
            }

            $sqJSON = $this->process($dataNBNSq);

            // FTTN
            $sq_decode                           = json_decode($sqJSON, true);
            $result_decode                       = array_merge($sq_decode, $bd_decode);
            $result_decode['formed_fulladdress'] = $addr;

            if (!empty($result_decode['Address'])) {
                if (isset($result_decode['unitType'])) {
                    $result_decode['Address']['unitType'] = $result_decode['unitType'];
                }
                if (isset($result_decode['allotmentType'])) {
                    $result_decode['Address']['allotmentType'] = $result_decode['allotmentType'];
                }
                if (isset($result_decode['postcode']) && empty($result_decode['Address']['postcode'])) {
                    $result_decode['Address']['postcode'] = $result_decode['postcode'];
                }
            }

            $result = $this->postProcess($result_decode);
        }
        return $result;
    }

    protected function qas_api($id, $addr) {
        $dataNBNSq['r']    = 'api/qas';
        $dataNBNSq['id']   = $id;
        $dataNBNSq['addr'] = $addr;
        return $this->process($dataNBNSq);
    }

    protected function process($data) {
        if (\Drupal\tpg_env\TPG\Environment::getEnv() === 'dev' || \Drupal\tpg_env\TPG\Environment::getEnv() === 'staging') {
            $this->base_url = 'http://nbn-dev.it.tpgtelecom.com.au/?';
            if(isset($_COOKIE["oneSqEnv"]) && $_COOKIE["oneSqEnv"]=='prod') {
                    $this->base_url = 'http://nbn.tpg.com.au/?';
            }
        }

        foreach ($data as $key => $value) {
            $tmparray[] = $key . '=' . urlencode($value);
        }

        $extension = implode('&', $tmparray);

        $url = $this->base_url . $extension;

        $request = $this->apiClient->get($url);
        $body = $request->getBody();
        $res = $body->getContents();

        if (!$this->isJson($res)) {
            // self created error
            return ('{"res":999,"data":"SQ failed"}');
        }

        if (\Drupal\tpg_env\TPG\Environment::getEnv() !== 'prod') {
            $res_arr = json_decode($res, true);
            $res_arr['url'] = $url;

            if  ($res_arr['Services']['adsl'] === 1) {
                $res_arr['Services']['adsl'] = 0;
                $res_arr['ADSL']['adsl1'] = 'Not Available';
                $res_arr['ADSL']['adsl2offnet'] = 'Not Available';
                $res_arr['ADSL']['adsl2plus'] = 'Not Available';
                $res_arr['ADSL']['adsl2unlimited'] = 'Not Available';
                $res_arr['ADSL']['homephone'] = 'Not Available';
            }
            $res = json_encode($res_arr);

        }

        if (empty($res)) {
            return false;
        }
        $res_arr = json_decode($res, true);
        if (array_key_exists("Services",$res_arr))
            {
                if(empty($res_arr['Services'])) {
                    \Drupal::logger('SQ Failed')->warning($res_arr['formed_fulladdress']);
                }
            }
        $res = json_encode($res_arr);

        return $res;
    }

    protected function retrieve_qas_session($addr) {
        $dataNBNSq = array();
        $breaddown = '';

        if (isset($_SESSION['qas']['rows'])) {
            $rows = $_SESSION['qas']['rows'];
            foreach ($rows as $row) {
                if ($row->text == $addr) {
                    $breaddown = $this->qas_api($row->id, '');
                    break;
                }
            }
        }
        else {
            \Drupal::logger('qas')->error("failed to retrieve qas session");
        }
        $bd_decode = json_decode($breaddown, true);

        $datamap['state']       = 'State code';
        $datamap['locality']    = 'Locality';
        $datamap['postcode']    = 'Postcode';
        $datamap['roadName']    = 'Street (Name)';
        $datamap['roadType']    = 'Street (Type)';
        $datamap['roadSuffix']  = 'Street (Type Suffix)';
        $datamap['roadNumber1'] = 'Building number (First)';
        $datamap['roadNumber2'] = 'Building number (Last)';
        $datamap['unitNumber']  = 'Flat/Unit (Number)';
        $datamap['unitType']    = 'Flat/Unit (Type)';
        $datamap['allotmentType'] = 'Allotment (Lot)';
        $datamap['lotNumber']   = 'Allotment (Number)';

        foreach ($datamap as $sqfield => $datafield) {
            if (isset($bd_decode[$datafield]) && !empty($bd_decode[$datafield])) {
                $dataNBNSq[$sqfield] = $bd_decode[$datafield];
            }
        }

        return $dataNBNSq;
    }

    protected function postProcess($result) {
        if (isset($result['addr_list']) && is_array($result['addr_list'])) {
            $_SESSION['nbn_sq']['check_sq'] = 1;
        }
        elseif(!empty($result['NBN']['addr_list'])){
            $_SESSION['nbn_sq']['check_sq'] = 1;
        }

        // ADSL SQ
        if (isset($result['res']) && ($result['res'] == 3 || $result['res'] == 4)) {
            $result['adsl_res'] = $this->adsl_api($result['exch']);
        }

        unset($_SESSION['nbn_sq']['block_timer']);

        return json_encode($result);
    }

    protected function adsl_api($exch) {
        $dataADSLSq['r']    = 'api/adslsq';
        $dataADSLSq['exch'] = $exch;
        $resJson            = $this->process($dataADSLSq);
        return json_decode($resJson);
    }

    protected function isJson($string) {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    public function address_checker($address_post) {
        $data['r']  = 'api/address';
        $searchtype = $address_post['searchtype'];

        switch ($searchtype) {
        case 'address':
            $data['r']           = 'api/faddress';
            $data['addr']        = $address_post['address'];
            $data['limit']       = '10';
            $data['limitExceed'] = 'true';
            $result              = $this->process($data);
            $datadecode          = json_decode($result, true);
            foreach ($datadecode['response'] as $key => $data) {
                $res['response'][$key]['label'] = $data['address'];
                $res['response'][$key]['value'] = $data['address'];
                $res['response'][$key]['lat']   = $data['latitude'];
                $res['response'][$key]['lng']   = $data['longitude'];
            }
            $test2 = json_encode($res, true);
            echo ($test2);
            break;

        case 'suburb':
            $data['state']  = $address_post['state'];
            $data['suburb'] = $address_post['suburb'];
            $data['limit']  = '10';
            $result         = $this->process($data);
            $datadecode     = json_decode($result, true);
            foreach ($datadecode['response'] as $key => $data) {
                $res['response'][$key]['label'] = $data;
                $res['response'][$key]['value'] = $data;
            }
            $test2 = json_encode($res, true);
            echo ($test2);
            break;

        case 'postcode':
            $data['r']      = 'api/Postcode';
            $data['state']  = $address_post['state'];
            $data['suburb'] = $address_post['suburb'];
            $result         = $this->process($data);
            $datadecode     = json_decode($result, true);
            foreach ($datadecode['response'] as $key => $data) {
                $res['response'][$key]['label'] = $data;
                $res['response'][$key]['value'] = $data;
            }
            $test2 = json_encode($res, true);
            echo ($test2);
            break;

        case 'street':
            $data['state']  = $address_post['state'];
            $data['suburb'] = $address_post['suburb'];
            $data['street'] = $address_post['street'];
            $data['limit']  = '10';
            $result         = $this->process($data);

            $datadecode = json_decode($result, true);

            $nbnStreetTypeArray = $this->addressFieldTypes->getStreetType('all');

            foreach ($datadecode['response'] as $key => $data) {
                $res['response'][$key]['label']      = $data['name'];
                $res['response'][$key]['value']      = $data['name'];
                $res['response'][$key]['streettype'] = array_search($data['type'], $nbnStreetTypeArray);
            }
            $test2 = json_encode($res, true);
            echo ($test2);
            break;

        case 'sq':
            $datamap = array();
            $datamap['state']                = 'state';
            $datamap['locality']             = 'suburb';
            $datamap['roadName']             = 'street';
            $datamap['roadType']             = 'streetType';
            $datamap['roadSuffix']           = 'streetSuffix';
            $datamap['roadNumber1']          = 'streetNumber';
            $datamap['unitNumber']           = 'unitNumber';
            $datamap['unitTypeCode']         = 'unitTypeCode'; // new field
            $datamap['levelType']            = 'levelTypeCode'; // new field
            $datamap['lotNumber']            = 'lotNumber';
            $datamap['levelNumber']          = 'levelNumber';
            $datamap['addressSiteName']      = 'complexSiteName';
            $datamap['secondaryComplexName'] = 'complexBuildingName';
            $datamap['complexRoadName']      = 'complexStreetName';
            $datamap['complexRoadType']      = 'complexStreetType';
            $datamap['complexRoadSuffix']    = 'complexStreetSuffix';
            $datamap['complexRoadNumber1']   = 'complexStreetNumber';
            $datamap['postcode']             = 'postcode';
            $dataNBNSq['r']                  = 'api/sq';

            if(!empty($address_post['onesq'])) {
                $dataNBNSq['r'] = 'api/onesq';
            }
            elseif (!empty($address_post['locid'])) {
                $dataNBNSq['r'] = 'api/nbnLocLookup';
            }

            if (!empty($address_post['locid']) && $_SESSION['nbn_sq']['check_sq']) {
                // http://nbn-dev.tpg.com.au/?r=api/nbnLocLookup&loc=LOC100046914886
                $dataNBNSq['loc']               = $address_post['locid'];
                $_SESSION['nbn_sq']['check_sq'] = 0;
                preg_match('/\d{4}$/', $address_post['fullAddress'], $postcodeFromFulladdress);
            } else {
                if (isset($_SESSION['nbn_sq']['block_timer']) && time() < $_SESSION['nbn_sq']['block_timer'] + 3) {
                    // blocker set and within 3 seconds time frame - break
                    echo '[]';
                    return;
                }
                $_SESSION['nbn_sq']['block_timer'] = time();

                foreach ($datamap as $sqfield => $datafield) {
                    if (isset($address_post[$datafield]) && !empty($address_post[$datafield])) {
                        switch ($datafield) {
                        case 'streetNumber':
                            if (strpos($address_post[$datafield], '-')) {list($dataNBNSq['roadNumber1'], $dataNBNSq['roadNumber2']) = explode('-', $address_post[$datafield]);} else { $dataNBNSq['roadNumber1'] = $address_post[$datafield];}
                            break;
                        case 'complexStreetNumber':
                            if (strpos($address_post[$datafield], '-')) {
                                list($dataNBNSq['complexRoadNumber1'], $dataNBNSq['complexRoadNumber2']) = explode('-', $address_post[$datafield]);} else {
                                $dataNBNSq['complexRoadNumber1'] = $address_post[$datafield];}
                            break;
                        default:
                            $dataNBNSq[$sqfield] = $address_post[$datafield];
                            break;
                        }
                    }
                }

                $dataNBNSq['verbose']   = '1';
                $dataNBNSq['checkFttb'] = 1; // enables fttb check
            }
            $jsonResult = $this->process($dataNBNSq);

            // FTTN
            $result_decode = json_decode($jsonResult, true);

            if (!empty($result_decode['Address']) && !empty($result_decode['NBN']['addr'])) {
                if (empty($result_decode['Address']['allotmentType']) && !empty($result_decode['Address']['lotNumber'])) {
                    $result_decode['Address']['allotmentType'] = 'Lot';
                }
                if (empty($result_decode['Address']['unitType']) && !empty($result_decode['NBN']['addr']['unitTypeCode']) && $result_decode['NBN']['addr']['unitTypeCode'] === 'UNIT') {
                    $result_decode['Address']['unitType'] = 'U';
                }
                if (empty($result_decode['Address']['postcode']) && !empty($result_decode['NBN']['addr']['postcode'])) {
                    $result_decode['Address']['postcode'] = $result_decode['NBN']['addr']['postcode'];
                }
                else if (!empty($postcodeFromFulladdress)) {
                    $result_decode['Address']['postcode'] = $postcodeFromFulladdress[0];
                }
            }

            if (isset($address_post['fullAddress']) && trim($address_post['fullAddress']) != '') {
                $result_decode['formed_fulladdress'] = trim($address_post['fullAddress']);
            } else {
                $lotNumber   = !empty($address_post['lotNumber']) ? 'Lot ' . $address_post['lotNumber'] . ',' : '';
                $unitType    = $this->addressFieldTypes->getUnitTypeCode($address_post['unitTypeCode']);
                $levelType   = $this->addressFieldTypes->getLevelType($address_post['levelTypeCode']);
                $unitNumber  = !empty($address_post['unitNumber']) ? $address_post['unitNumber'] . '/' : '';
                $levelNumber = !empty($address_post['levelNumber']) ? $address_post['levelNumber'] . ',' : '';

                $address = $lotNumber . " " . $levelType . " " . $levelNumber . " " .
                            $unitType . " " . $unitNumber . " " .
                            $address_post['streetNumber'] . " " .$address_post['street'] . " " .
                            $this->addressFieldTypes->getStreetType($address_post['streetType']) . " " .
                            $this->addressFieldTypes->getStreetSuffix($address_post['streetSuffix']) . " " .
                            $address_post['suburb'] . " " . $address_post['state'] . " " . $address_post['postcode'];
                $result_decode['formed_fulladdress'] = trim($address);
            }

            $jsonResult = $this->postProcess($result_decode);

            echo $jsonResult;
            break;
        }

        return;
    }
}
