<?php

namespace Drupal\bluescope_subscribe_form\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the Subscribe Form Entry entity.
 *
 * @ingroup bluescope_subscribe_form
 *
 * @ContentEntityType(
 *   id = "subscribe_form_entry",
 *   label = @Translation("Bluescope Subscribe Form Entry"),
 *   base_table = "subscribe_form_entry",
 *   entity_keys = {
 *     "id" = "id",
 *     "uuid" = "uuid",
 *   },
 * )
 */
class SubscribeFormEntry extends ContentEntityBase implements ContentEntityInterface {

  /**
   * Define entity fields.
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    // Standard field, used as unique if primary index.
    $fields['id'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('ID'))
      ->setDescription(t('The ID of the Entry entity.'))
      ->setReadOnly(TRUE);

    // Standard field, unique outside of the scope of the current project.
    $fields['uuid'] = BaseFieldDefinition::create('uuid')
      ->setLabel(t('UUID'))
      ->setDescription(t('The UUID of the Entry entity.'))
      ->setReadOnly(TRUE);

    // Timestamp.
    $fields['date_created'] = BaseFieldDefinition::create('datetime')
      ->setLabel(t("Timestamp"))
      ->setDescription(t("Timestamp of submission."))
      ->setReadOnly(TRUE);

    // Unique Key.
    $fields['unique_key'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Unique Key"))
      ->setDescription(t("Unique Key"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 255,
        'text_processing' => 0,
      ]);

    // First Name.
    $fields['first_name'] = BaseFieldDefinition::create('string')
      ->setLabel(t("First Name"))
      ->setDescription(t("First Name"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 50,
        'text_processing' => 0,
      ]);

    // Last Name.
    $fields['last_name'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Last Name"))
      ->setDescription(t("Surname or family name"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 50,
        'text_processing' => 0,
      ]);

    // Email Address.
    $fields['email'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Email Address"))
      ->setDescription(t("Email address"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 255,
        'text_processing' => 0,
      ]);

    // Mobile.
    $fields['mobile'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Mobile"))
      ->setDescription(t("Mobile"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 15,
        'text_processing' => 0,
      ]);

    // State.
    $fields['state'] = BaseFieldDefinition::create('string')
      ->setLabel(t("State"))
      ->setDescription(t("State"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 100,
        'text_processing' => 0,
      ]);

    // Company Name.
    $fields['company_name'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Company"))
      ->setDescription(t("Name of company"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 100,
        'text_processing' => 0,
      ]);

    // Position.
    $fields['position'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Position"))
      ->setDescription(t("Position"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 100,
        'text_processing' => 0,
      ]);

    // Profession.
    $fields['profession'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Profession"))
      ->setDescription(t("Profession"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 100,
        'text_processing' => 0,
      ]);

    // Project type.
    $fields['project_type'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Project Type"))
      ->setDescription(t("Project Type"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 100,
        'text_processing' => 0,
      ]);

    // Project other.
    $fields['project_other'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Project Other"))
      ->setDescription(t("Project Other"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 100,
        'text_processing' => 0,
      ]);

    // Content Preference.
    $fields['content_preference'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Content Preference"))
      ->setDescription(t("Content Preference"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 100,
        'text_processing' => 0,
      ]);

    // Research participation.
    $fields['user_research_participation'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t("User Research Participation"))
      ->setDescription(t("User Research Participation"))
      ->setSettings([
        'default_value' => FALSE,
      ]);

    // Accepted Acknowledgement.
    $fields['terms_acknowledgement'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t("Accepted Acknowledgement"))
      ->setDescription(t("Accepted Acknowledgement"))
      ->setSettings([
        'default_value' => FALSE,
      ]);

    // Accepted Privacy Terms.
    $fields['terms_acceptance'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t("Accepted Privacy Terms"))
      ->setDescription(t("Accepted Privacy Terms"))
      ->setSettings([
        'default_value' => FALSE,
      ]);

    // BLOCK ID.
    $fields['block_id'] = BaseFieldDefinition::create('string')
      ->setLabel(t("Source Block Id"))
      ->setDescription(t("Source Block Id"))
      ->setSettings([
        'default_value' => '',
        'max_length' => 256,
        'text_processing' => 0,
      ]);

    return $fields;
  }

}
