<?php
/**
 * Plugin implementation of the 'SQ Address' formatter.
 * @author  Adrian Pennington <apennington@staff.iinet.net.au>
 *
 * @FieldFormatter(
 *     id = "sq_address_field_formatter",
 *     label = @Translation("SQ Address Field Formatter"),
 *     field_types = {
 *         "sq_address_field"
 *     }
 * )
 */

namespace Drupal\tpg_sq\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

class SQAddressFieldFormatter extends FormatterBase {
    const URLS = array('/nbn', '/', '/ftth', '/fttb', '/fttb_new');

    /**
     * {@inheritdoc}
     */
    public function settingsSummary() {
        $summary = array();
        $settings = $this->getSettings();

        $summary[] = t('Displays Address Input for Service Qualification');
        return $summary;
    }

    public static function isAngularSq() {
        $url = parse_url($_SERVER['REQUEST_URI']);
        return in_array($url['path'],self::URLS);
    }

    /**
     * {@inheritdoc}
     */
    public function viewElements(FieldItemListInterface $items, $langcode) {
        $elements = array();
        $node     = \Drupal::request()->attributes->get('node');
        $nodeType = $node->bundle();

        foreach ($items as $delta => $item) {
            $elements[$delta] = array(
                '#theme' => 'sq_address_field',
                '#attached' => array(
                    'library' => array('tpg_sq/sq'),
                ),
                '#display' => $item->display,
                '#title' => $item->title,
                '#placeholder' => $item->placeholder,
                '#address_bkdown' => $item->address_bkdown,
                '#splash' => $item->splash,
                '#business_type' => $item->business_type,
                '#content_type' => $nodeType,
                '#isAngularSq' => $this->isAngularSq()
            );
        }

        return $elements;
    }
}
