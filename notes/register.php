<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
session_name('fttb');
session_start();

class fttb_register extends CI_Controller {
    function __construct()
    {
        parent::__construct();
    }

    function index() {
		$this->load->model('modfttb');
		if ($values = $this->input->post()){
			if ($_SESSION['captcha'] != $values['captcha']){
				$data = $this->input->post();
				$data['err'] = 'Captcha does not match!';
			}
			else {
				$res = $this->modfttb->insertRegisterInterest($values, 'FTTB');
				if ($res){
					$data['msg'] = 'Thank you. We will contact you when Fibre to the Building product is available in your building.<br/><br/>';
				}
				else{
					$data['err'] = 'Unfortunately an error has occurred when processing your request. Please try again in a few minutes.<br />
									If you continue to experience the same problem, please contact TPG on 1300 720 016 for further assistance.<br/><br/>';
				}
			}
		}

		/*
		echo "<pre>";
		print_r($data);
		echo "</pre>";
		*/

		$data['title'] = "Register Your Interest in TPG's Fibre to the Building Network";
		$data['meta']  = '<meta name="description" content="Enter your details to register your interest in having TPG\'s Fibre to the Building (FTTB) network in your building." />'."\n";
		$data['meta'] .= '<meta name="keywords" content="tpg, fttb, fibre to the building, register interest" />';
		$data['mainf'] = "fttb/register_your_interest";

		$this->load->library('Tpgaddress');
		//$fttbStreetTypeArray = $this->tpgaddress->get_fttbStreetTypeArray('all');
		//$streetType = isset($_SESSION['fttbchangeplan']['fttbStreetType']) ? $_SESSION['fttbchangeplan']['fttbStreetType'] : '';
		$data['streettype_options'] = $this->tpgaddress->get_nbnStreetType($data['fttbStreetType']);
		$data['unittype_options'] = $this->tpgaddress->get_nbnUnitType();
		$data['leveltype_options'] = $this->tpgaddress->get_nbnlevelType();
		$data['streetsuffix_options'] = $this->tpgaddress->get_nbnStreetSuffix($data['fttbStreetSuffix']);
		$data['complexstreettype_options'] = $this->tpgaddress->get_nbnStreetType();
		$data['complexstreetsuffix_options'] = $this->tpgaddress->get_nbnStreetSuffix();

		$data['fttbState_options'] = $this->tpgaddress->get_state2($data['fttbState']);

		$data['jquery_specified'] = '
		<script type="text/javascript" src="/scripts/jquery-1.9.1.js"></script>
		<script type="text/javascript" src="/scripts/jquery-ui-1.10.3.custom.js"></script>
		<script type="text/javascript" src="/scripts/registerinterestfttb.js"></script>
		<link href="/css/jquery-ui-1.10.3.customnbn.css" rel="stylesheet" type="text/css" />
		<link href="/css/fttb.css" rel="stylesheet" type="text/css" />
		<link href="/css/fttbcoverage.css" rel="stylesheet" type="text/css" />';

		$this->load->view('modules/template', $data);
    }
	
	
	function address_checker() {
		$this->load->library('Tpgaddress');

		$address_post = array();
		if ($input = $this->input->post()){
			foreach($input as $key=>$val){
				$address_post[$key] = $val;
			}
		}

		//$base_url = 'http://fttb-dev.tpg.com.au/?';
		$base_url = 'http://nbn.tpg.com.au/?';

		$data['r'] = 'api/address';

		$searchtype = $address_post['searchtype'];

		switch($searchtype)
		{
			case 'fttbsuburb':
				$data['state'] = $address_post['fttbState'];
				$data['suburb'] = $address_post['fttbSuburb'];
				$data['limit'] = '10';
				$result = $this->process($data,$base_url);
				$datadecode = json_decode($result,true);
				foreach($datadecode['response'] as $key => $data )
				{
					$res['response'][$key]['label'] =$data;
					$res['response'][$key]['value'] =$data;

				}
				$test2 = json_encode($res,true);
				echo($test2);
			break;

			case 'fttbPostcode':
				$data['r'] = 'api/Postcode';
				$data['state'] = $address_post['fttbState'];
				$data['suburb'] = $address_post['fttbSuburb'];
				$result = $this->process($data,$base_url);
				$datadecode = json_decode($result,true);
				foreach($datadecode['response'] as $key => $data )
				{
					$res['response'][$key]['label'] =$data;
					$res['response'][$key]['value'] =$data;

				}
				$test2 = json_encode($res,true);
				echo($test2);
			break;

			case 'fttbstreet':
				$this->load->library('Tpgaddress');

				$data['state'] = $address_post['fttbState'];
				$data['suburb'] = $address_post['fttbSuburb'];
				$data['street'] = $address_post['fttbStreet'];
				$data['limit'] = '10';
				$result = $this->process($data,$base_url);

				$datadecode = json_decode($result,true);

				$fttbStreetTypeArray = $this->tpgaddress->get_nbnStreetTypeArray('all');

				foreach($datadecode['response'] as $key => $data )
				{
					//$streettype = trim($this->tpgaddress->get_fttbStreetTypeArray($data['type']));
					$res['response'][$key]['label'] =$data['name'];
					$res['response'][$key]['value'] =$data['name'];
					$res['response'][$key]['streettype'] = array_search($data['type'],$fttbStreetTypeArray);
				}
				$test2 = json_encode($res,true);
				echo($test2);
			break;

			case 'sq':

				// check security code first
				if(empty($_SESSION['captcha']))
				{
					echo '{"errmsg":"Captcha do not match!"}';
					die();
				}

				if(!empty($_POST['captcha']) && $_POST['captcha'] != $_SESSION['captcha'])
				{
					echo '{"errmsg":"Captcha do not match!"}';
					die();
				}

				$allowable = array('0');

				$base_url = 'http://octo.tpg.com.au/index.php?';
				$datamap['state'] = 'fttbState';
				$datamap['locality'] = 'fttbSuburb';
				$datamap['postcode'] = 'fttbPostcode';
				$datamap['roadName'] = 'fttbStreet';
				$datamap['roadType'] = 'fttbStreetType';
				$datamap['roadSuffix'] = 'fttbStreetSuffix';
				$datamap['roadNumber1'] = 'fttbStreetNumber';
				$datamap['unitNumber'] = 'fttbUnitNumber';


				$dataFTTBSq['r']='sq/sq';

				foreach($datamap as $sqfield => $datafield )
				{
					if(isset($_POST[$datafield]) && !empty($_POST[$datafield]))
					{
						switch($datafield){
							case 'fttbStreetNumber' :
								if(strpos($_POST[$datafield],'-'))
								{list($dataFTTBSq['roadNumber1'], $dataFTTBSq['roadNumber2']) = explode('-',$_POST[$datafield]);	}
								else
								{$dataFTTBSq['roadNumber1'] = $_POST[$datafield];	}
							break;
							case 'fttbStreetType' :
								$dataFTTBSq[$sqfield] = $this->tpgaddress->get_nbnStreetTypeArray($_POST[$datafield]);
							break;
							case 'fttbComplexStreetNumber' :
								if(strpos($_POST[$datafield],'-')){
									list($dataFTTBSq['complexRoadNumber1'], $dataFTTBSq['complexRoadNumber2']) = explode('-',$_POST[$datafield]);}
								else{
									$dataFTTBSq['complexRoadNumber1'] = $_POST[$datafield];	}
							break;
							default:
								$dataFTTBSq[$sqfield] = $_POST[$datafield];
							break;
						}
					}
				}

				$jsonResult = $this->process($dataFTTBSq,$base_url);
				echo($jsonResult);
			break;

		}
	}

	function process($data,$base_url) {
		foreach($data as $key => $value)
		{
			$tmparray[] = $key.'='.urlencode($value);
		}

		$extension = implode('&',$tmparray);

		$url = $base_url.$extension;

		$tmp = (array) @file($url,0);


		$res = implode("",$tmp);

		if(!$this->isJson($res))
		{
			// self created error
			return('{"res":999,"data":"SQ failed"}');
		}

		if(empty($res))
		{
			return false;
		}

		return $res;
	}
	
	function isJson($string) {
		json_decode($string);
		return (json_last_error() == JSON_ERROR_NONE);
	}
	
	
}

/* End of file personal.php */
/* Location: ./application/controllers/personal.php */