<?php
/**
 * Provides a field type SQ Address.
 * @author  Adrian Pennington <apennington@staff.iinet.net.au>
 * 
 * @FieldType(
 *     id = "sq_address_field",
 *     label = @Translation("SQ Address"),
 *     module = "tpg_sq",
 *     description = @Translation("SQ Address Field"),
 *     default_formatter = "sq_address_field_formatter",
 *     default_widget = "sq_address_widget",
 * )
 */

namespace Drupal\tpg_sq\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

class SQAddressField extends FieldItemBase implements FieldItemInterface {
    /**
     * {@inheritdoc}
     * Most of these values are '' this is to prevent display of the field by default
     */
    public static function defaultFieldSettings() {
        return [
            'display' => '1',
            'placeholder' => 'Start typing your address',
            'title' => '',
            'splash' => 'yes',
            'address_bkdown' => 'dialog',
            'business_type' => '0',
        ] + parent::defaultFieldSettings();
    }

    /**
     * {@inheritdoc}
     * Be aware these settings are stored in the database, if you add any new schema items you'll need to create a new field 
     * otherwise you'll get problems when you try to insert to the database.
     */
    public static function schema(FieldStorageDefinitionInterface $field_definition) {
        return array(
            'columns' => array(
                'display' => array(
                    'type' => 'int',
                    'length' => '1',
                    'not null' => false,
                ),
                'placeholder' => array(
                    'type' => 'text',
                    'size' => 'medium',
                    'not null' => false,
                ),
                'title' => array(
                    'type' => 'text',
                    'size' => 'medium',
                    'not null' => false,
                ),
                'splash' => array(
                    'type' => 'text',
                    'size' => 'small',
                    'not null' => true,
                ),
                'address_bkdown' => array(
                    'type' => 'text',
                    'size' => 'small',
                    'not null' => true,
                ),
                // ALTER TABLE `drupal_tpg`.`node__field_section_6_sq` ADD COLUMN `field_section_6_sq_business_type` INT NULL DEFAULT NULL COMMENT '' AFTER `field_section_6_sq_address_bkdown`;
                // ALTER TABLE `drupal_tpg`.`node__field_sqaddress` ADD COLUMN `field_sqaddress_business_type` INT NULL DEFAULT NULL COMMENT '' AFTER `field_sqaddress_address_bkdown`;
                // ALTER TABLE `drupal_tpg`.`node_revision__field_section_6_sq` ADD COLUMN `field_section_6_sq_business_type` INT NULL DEFAULT NULL COMMENT '' AFTER `field_section_6_sq_address_bkdown`;
                // ALTER TABLE `drupal_tpg`.`node_revision__field_sqaddress` ADD COLUMN `field_sqaddress_business_type` INT NULL DEFAULT NULL COMMENT '' AFTER `field_sqaddress_address_bkdown`;
                'business_type' => array(
                    'type' => 'int',
                    'length' => '1',
                    'not null' => false,
                ),                
            ),
        );
    }

    /**
     * {@inheritdoc}
     */
    public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
        $properties = [];
        $properties['display'] = DataDefinition::create('integer')
            ->setLabel(t('Display SQ Address Field'));

        $properties['title'] = DataDefinition::create('string')
            ->setLabel(t('Title text'));

        $properties['placeholder'] = DataDefinition::create('string')
            ->setLabel(t('Input Placeholder'));

        $properties['address_bkdown'] = DataDefinition::create('string')
            ->setLabel(t('Provide address breakdown option'));

        $properties['splash'] = DataDefinition::create('string')
            ->setLabel(t('Display Splash popup when running'));

        $properties['business_type'] = DataDefinition::create('integer')
            ->setLabel(t('Display customized result for business'));
        
        return $properties;
    }

    /**
     * {@inheritdoc}
     * In this case SQAddressField is never empty as an empty "Field" causes too many gotchas with multi-value fields
     */
    public function isEmpty() {
        return false;
    }
}