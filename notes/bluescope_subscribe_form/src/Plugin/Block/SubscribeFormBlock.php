<?php

namespace Drupal\bluescope_subscribe_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'bluescope_subscribe_form' block.
 *
 * @Block(
 *   id = "bluescope_subscribe_form_block",
 *   admin_label = @Translation("Bluescope Subscribe Form"),
 *   category = @Translation("Custom")
 * )
 */
class SubscribeFormBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();

    // Get values from config.
    $default_value = [
      'value' => '',
      'format' => 'full_html',
    ];

    $acknowledgement = $config['bluescope_subscribe_acknowledgement'] ?? $default_value;
    $privacy = $config['bluescope_subscribe_privacy'] ?? $default_value;
    $tktitle = $config['bluescope_subscribe_thankyou_subtitle'] ?? $default_value;
    $tkmessage = $config['bluescope_subscribe_thankyou_message'] ?? $default_value;

    // Mandatory fields.
    $form['bluescope_subscribe']['mandatory_fields'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Mandatory Field Options'),
    ];

    $form['bluescope_subscribe']['mandatory_fields']['bluescope_subscription_types'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Subscription Type'),
      '#default_value' => $config['bluescope_subscription_types'] ?? '',
    ];

    $form['bluescope_subscribe']['mandatory_fields']['bluescope_subscribe_acknowledgement'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Acknowledgement checkbox text'),
      '#default_value' => $acknowledgement['value'],
      '#format' => $acknowledgement['format'],
    ];

    $form['bluescope_subscribe']['mandatory_fields']['bluescope_subscribe_privacy'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Privacy checkbox text'),
      '#default_value' => $privacy['value'],
      '#format' => $privacy['format'],
    ];

    // Optional fields.
    $form['bluescope_subscribe']['optional_fields'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Optional Fields'),
    ];

    $form['bluescope_subscribe']['optional_fields']['bluescope_subscribe_content_preference'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Interest'),
      '#default_value' => $config['bluescope_subscribe_content_preference'] ?? '',
    ];

    $form['bluescope_subscribe']['optional_fields']['bluescope_subscribe_content_preference_options'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Interest options'),
      '#default_value' => $config['bluescope_subscribe_content_preference_options'] ?? '',
      '#states' => [
        'visible' => [
          ':input[name="settings[bluescope_subscribe][optional_fields][bluescope_subscribe_content_preference]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['bluescope_subscribe']['optional_fields']['bluescope_subscribe_project_type'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Project type'),
      '#default_value' => $config['bluescope_subscribe_project_type'] ?? '',
    ];

    $form['bluescope_subscribe']['optional_fields']['bluescope_subscribe_project_type_options'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Project type options'),
      '#default_value' => $config['bluescope_subscribe_project_type_options'] ?? '',
      '#states' => [
        'visible' => [
          ':input[name="settings[bluescope_subscribe][optional_fields][bluescope_subscribe_project_type]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['bluescope_subscribe']['optional_fields']['bluescope_subscribe_interested_in'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('User research'),
      '#default_value' => $config['bluescope_subscribe_interested_in'] ?? '',
    ];

    $form['bluescope_subscribe']['optional_fields']['bluescope_subscribe_interested_in_options'] = [
      '#type' => 'textarea',
      '#title' => $this->t('User research options'),
      '#default_value' => $config['bluescope_subscribe_interested_in_options'] ?? '',
      '#states' => [
        'visible' => [
          ':input[name="settings[bluescope_subscribe][optional_fields][bluescope_subscribe_interested_in]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // Thankyou message fields.
    $form['bluescope_subscribe']['thankyou_options'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Thank you Message Options'),
    ];

    $form['bluescope_subscribe']['thankyou_options']['bluescope_subscribe_thankyou_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Thankyou title'),
      '#default_value' => $config['bluescope_subscribe_thankyou_title'] ?? '',
    ];

    $form['bluescope_subscribe']['thankyou_options']['bluescope_subscribe_thankyou_subtitle'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Subtitle'),
      '#default_value' => $tktitle['value'],
      '#format' => $tktitle['format'],
    ];

    $form['bluescope_subscribe']['thankyou_options']['bluescope_subscribe_thankyou_message'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Thankyou message'),
      '#default_value' => $tkmessage['value'],
      '#format' => $tkmessage['format'],
    ];

    // Form submission fields.
    $form['bluescope_subscribe']['form_submission_options'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Form Submission Options'),
    ];

    $form['bluescope_subscribe']['form_submission_options']['bluescope_subscribe_salesforce_form_handler_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Salesforce form handler url'),
      '#default_value' => $config['bluescope_subscribe_salesforce_form_handler_url'] ?? '',
      '#description' => t('The salesforce url to submit the form to.'),
      '#required' => TRUE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $values = $form_state->getValues();

    $this->setConfigurationValue('bluescope_subscribe_content_preference', $values['bluescope_subscribe']['optional_fields']['bluescope_subscribe_content_preference']);
    $this->setConfigurationValue('bluescope_subscribe_content_preference_options', $values['bluescope_subscribe']['optional_fields']['bluescope_subscribe_content_preference_options']);
    $this->setConfigurationValue('bluescope_subscribe_project_type', $values['bluescope_subscribe']['optional_fields']['bluescope_subscribe_project_type']);
    $this->setConfigurationValue('bluescope_subscribe_project_type_options', $values['bluescope_subscribe']['optional_fields']['bluescope_subscribe_project_type_options']);
    $this->setConfigurationValue('bluescope_subscribe_interested_in', $values['bluescope_subscribe']['optional_fields']['bluescope_subscribe_interested_in']);
    $this->setConfigurationValue('bluescope_subscribe_interested_in_options', $values['bluescope_subscribe']['optional_fields']['bluescope_subscribe_interested_in_options']);
    $this->setConfigurationValue('bluescope_subscribe_acknowledgement', $values['bluescope_subscribe']['mandatory_fields']['bluescope_subscribe_acknowledgement']);
    $this->setConfigurationValue('bluescope_subscribe_privacy', $values['bluescope_subscribe']['mandatory_fields']['bluescope_subscribe_privacy']);
    $this->setConfigurationValue('bluescope_subscribe_thankyou_title', $values['bluescope_subscribe']['thankyou_options']['bluescope_subscribe_thankyou_title']);
    $this->setConfigurationValue('bluescope_subscribe_thankyou_subtitle', $values['bluescope_subscribe']['thankyou_options']['bluescope_subscribe_thankyou_subtitle']);
    $this->setConfigurationValue('bluescope_subscribe_thankyou_message', $values['bluescope_subscribe']['thankyou_options']['bluescope_subscribe_thankyou_message']);
    $this->setConfigurationValue('bluescope_subscribe_salesforce_form_handler_url', $values['bluescope_subscribe']['form_submission_options']['bluescope_subscribe_salesforce_form_handler_url']);
    $this->setConfigurationValue('bluescope_subscribe_block_id', $form_state->getBuildInfo()['callback_object']->getEntity()->id());
    $this->setConfigurationValue('bluescope_subscription_types', $values['bluescope_subscribe']['mandatory_fields']['bluescope_subscription_types']);
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    $form_state = new FormState();
    $form_state->content_preference_flag = $config['bluescope_subscribe_content_preference'] ?? '';
    $form_state->content_preference_options = $config['bluescope_subscribe_content_preference_options'] ?? '';
    $form_state->project_type_flag = $config['bluescope_subscribe_project_type'] ?? '';
    $form_state->project_type_options = $config['bluescope_subscribe_project_type_options'] ?? [];
    $form_state->interested_in_flag = $config['bluescope_subscribe_interested_in'] ?? '';
    $form_state->interested_in_options = $config['bluescope_subscribe_interested_in_options'] ?? [];
    $form_state->terms_acknowledgement = $config['bluescope_subscribe_acknowledgement']['value'] ?? '';
    $form_state->terms_acceptance = $config['bluescope_subscribe_privacy']['value'] ?? '';
    $form_state->thankyou_title = $config['bluescope_subscribe_thankyou_title'] ?? '';
    $form_state->thankyou_subtitle = $config['bluescope_subscribe_thankyou_subtitle']['value'] ?? '';
    $form_state->thankyou_message = $config['bluescope_subscribe_thankyou_message']['value'] ?? '';
    $form_state->salesforce_url = $config['bluescope_subscribe_salesforce_form_handler_url'] ?? '';
    $form_state->unique_block_id = $config['bluescope_subscribe_block_id'] ?? '';
    $form_state->subscription_types = $config['bluescope_subscription_types'] ?? '';

    $form = \Drupal::formBuilder()->buildForm('Drupal\bluescope_subscribe_form\Form\SubscribeForm', $form_state);

    // Disable cache.
    $form['#cache'] = ['max-age' => 0];
    \Drupal::service('page_cache_kill_switch')->trigger();

    return $form;
  }

}
