<?php
/**
 * SQ Address Widget.
 * @author  Adrian Pennington <apennington@staff.iinet.net.au>
 *
 * @FieldWidget(
 *   id = "sq_address_widget",
 *   label = @Translation("Textfield"),
 *   field_types = {
 *     "sq_address_field",
 *   }
 * )
 */

namespace Drupal\tpg_sq\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Field\WidgetInterface;
use Drupal\Core\Form\FormStateInterface;

class SQAddressWidget extends WidgetBase implements WidgetInterface {
    /**
     * {@inheritdoc}
     */
    public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
        $item = $items[$delta];

        $element['display'] = [
            '#type' => 'radios',
            '#title' => $this->t('Show SQ Address'),
            '#description' => $this->t("Selecting 'Yes' displays SQ Address input box on this page, 'No' suppresses it"),
            '#options' => [ '0' => 'No', '1' => 'Yes' ], // we use the index as a boolean
            '#required' => true,
            '#size' => 1,
            '#default_value' => isset($item->display) ? $item->display : null,
        ];

        /* NOTE: Not meant to be in use currently, we are handling this via CSS
        $element['title'] = [
            '#type' => 'textfield',
            '#title' => $this->t('SQ address field title text'),
            '#required' => false,
            '#size' => 60,
            '#default_value' => isset($item->title) ? $item->title : null,
        ]; */

        $element['placeholder'] = [
            '#type' => 'textfield',
            '#title' => $this->t('SQ address field placeholder text'),
            '#description' => $this->t("This is the text that will show inside the address entry input box, e.g. 'Enter Your Address'"),
            '#required' => false,
            '#size' => 60,
            '#default_value' => isset($item->placeholder) ? $item->placeholder : null,
        ];

        $element['address_bkdown'] = [
            '#type' => 'radios',
            '#title' => $this->t('Address breakdown option'),
            '#description' => $this->t("Selecting 'Dialog' means the user is given access to the address breakdown popup, normally this is enabled"),
            '#options' => [ 'dialog' => 'Dialog', 'none' => 'None' ],
            '#default_value' => isset($item->address_bkdown) ? $item->address_bkdown : null,
        ];

        $element['splash'] = [
            '#type' => 'radios',
            '#title' => $this->t('Display SQ splash popup'),
            '#description' => $this->t("Brings up a popup dialog with a loading graphic while the SQ is running"),
            '#options' => [ 'yes' => 'Yes', 'no' => 'No' ],
            '#default_value' => isset($item->splash) ? $item->splash : null,
        ];

        $element['business_type'] = [
            '#type' => 'radios',
            '#title' => $this->t('Select residential or business type'),
            '#description' => $this->t("Selecting 'Business' to display customized result for business"),
            '#options' => [ '0' => 'Residential', '1' => 'Business' ], // we use the index as a boolean
            '#required' => true,
            '#size' => 1,
            '#default_value' => isset($item->business_type) ? $item->business_type : null,
        ];
        
        return $element;
    }
}
