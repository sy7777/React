<?php
/**
 * @file
 * Contains \Drupal\tpg_sq\Controller\SQController.
 */

namespace Drupal\tpg_sq\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\tpg_sq\OneSQService;
use Drupal\tpg_sq\v2\AddressDetails;
use Drupal\tpg_sq\v2\OneSQService as OneSQservice2;
use Drupal\tpg_sq\v2\MapFromLegacySQ;
use Drupal\tpg_sq\v2\SQ;
use Drupal\tpg_sq\v2\SQservice;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;

class SQController extends ControllerBase {
    public static function create(ContainerInterface $container) {
        return new static(
            $container->get('tpg_sq.onesq')
        );
    }

    public function __construct(OneSQService $oneSQService) {
        $this->oneSQService = $oneSQService;
    }

    // partial refactor to a drupal service
    public function qas() {

        if (\Drupal\tpg_sq\ToggleOneSqVersion::isVersion2Available())
        {
            $oneSqService = new OneSQservice2();
            if ( OneSQservice2::isQAS() ) {
                $term = $_GET['term'];
                $result = $oneSqService->returnQAS('', $term);

                $headers = ['Content-Type' => 'application/json'];
                return new Response(json_encode($result), 200, $headers);
            }
            else if( OneSQservice2::isSQ() )
            {
                $address = $_GET['addr'];
                $addressId = $oneSqService->returnAddressId($address);
                if ($addressId)
                {
                    //GET ADDRESS BREAKDOWN FROM LEGACY SQ
                    $legacyAddressBreakdown = $oneSqService->returnAddressBreakdown($addressId);

                    //BUILD SQ PAYLOAD FOR ONESQ
                    $addressDetails = (new MapFromLegacySQ($legacyAddressBreakdown))->returnMappedData(new AddressDetails());
                    $sq             = (new SQ($addressDetails));
                    $oneSqResult    = (new SQservice())->returnOneSqResult($sq);

                    //SQ RESPONSE TRANSLATION/TRANSFORMATION
                    $oneSqResult = (new \Drupal\tpg_sq\v2\SQResponseTransform\TranslateSQResponse($oneSqResult))
                        ->setRules('\Drupal\tpg_sq\v2\SQResponseTransform\RemoveNBNaddrlistWhenEmptyRule')
                        ->setRules('\Drupal\tpg_sq\v2\SQResponseTransform\AddOneSqEndpointRule')
                        ->execute()
                        ->returnResponse();

                    $headers = ['Content-Type' => 'application/json'];
                    return new Response($oneSqResult, 200, $headers);

                }
            }
        }
        else{
            //LEGACY SQ CODE
            print $this->oneSQService->qas($_GET);
        }

        return new Response();
    }

    // partial refactor to a drupal service
    public function address_checker() {

        if (\Drupal\tpg_sq\ToggleOneSqVersion::isVersion2Available() && isset($_POST['locid']))
        {
            $locationId = $_POST['locid'];

            //BUILD SQ PAYLOAD
            $sq             = (new SQ(new AddressDetails(),'TPG','', $locationId));
            $oneSqResult    = (new SQservice())->returnOneSqResult($sq);

            //SQ RESPONSE TRANSLATION/TRANSFORMATION
            $oneSqResult = (new \Drupal\tpg_sq\v2\SQResponseTransform\TranslateSQResponse($oneSqResult))
                ->setRules('\Drupal\tpg_sq\v2\SQResponseTransform\RemoveNBNaddrlistWhenEmptyRule')
                ->setRules('\Drupal\tpg_sq\v2\SQResponseTransform\FormedFullAddressUpdateRule')
                ->setRules('\Drupal\tpg_sq\v2\SQResponseTransform\AddOneSqEndpointRule')
                ->execute()
                ->returnResponse();


            $headers = ['Content-Type' => 'application/json'];
            return new Response($oneSqResult, 200, $headers);
        }
        else{
            //LEGACY SQ CODE
            $address_post = array();
            foreach ($_POST as $key => $val) {
                $address_post[$key] = $val;
            }

            /*
                AP - this function directly prints output to stdout
                I'd like to refactor this to return value so we can handle output in the
                controller but its a lengthy refactor so for now I'll leave it as is.
            */
            $this->oneSQService->address_checker($address_post);
        }

        return new Response();
    }

    /**
     * return the SQ address form modal content for AJAX request
     * @return Response
     */
    public function ajax_modal_content(){
        //if it is AJAX request
        if(\Drupal::request()->isXmlHttpRequest()){
            $build = array(
                'page' => array(
                    '#theme' => 'sq_modal_content',
                ),
            );
            $html = \Drupal::service('renderer')->renderRoot($build);
            $response = new Response();
            $response->setContent($html);

            return $response;
        }
        else{
            //otherwise show Access Denied page
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
        }
    }
}
