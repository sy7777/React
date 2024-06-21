<?php

namespace Drupal\bluescope_subscribe_form\Form;

use Drupal\bluescope_subscribe_form\Entity\SubscribeFormEntry;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Ajax\RemoveCommand;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\steelselect_common\Plugin\UrlProcessor\UtmUrlProcessor;
use GuzzleHttp\Client;

/**
 * Defines the SubscribeForm class.
 *
 * This class extends FormBase and provides functionality
 * for the subscription form.
 *
 * @ingroup bluescope_subscribe_form
 */
class SubscribeForm extends FormBase {
  const JOB_OTHER = 'other';

  /**
   * Returns a unique string identifying the form.
   *
   * The returned ID should be a unique string that can be a valid PHP function
   * name, since it's used in hook implementation names such as
   * hook_form_FORM_ID_alter().
   *
   * @return string
   *   The unique string identifying the form.
   */
  public function getFormId() {
    return 'bluescope-subscribe-form';
  }

  /**
   * Form constructor.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   *
   * @return array
   *   The form structure.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#attached']['library'][] = "bluescope_subscribe_form/customajax";
    $form['#attributes']['class'][] = 'container in-article ajax-response-wrapper bluescope-subscribe-form-wrapper';

    $form['subscription_section_header'] = [
      '#markup' => '<h3 class="section-title">Your subscriptions</h3>',
    ];

    // Retrieve the subscription types string from the form state.
    $subscription_types_string = $form_state->subscription_types;

    /* Split the string into an array using the newline
     * character as the separator. */
    $subscription_types_array = array_filter(explode(PHP_EOL, $subscription_types_string));

    // Initialize an array to store subscription details.
    $subscriptions = [];

    // Iterate over subscription types.
    foreach ($subscription_types_array as $subscription_type) {
      // Break down each subscription info into individual fields.
      [$title, $description, $unique_key, $interests_required] = array_map('trim', explode('|', $subscription_type));

      // Create an entry for each subscription type.
      $subscriptions[$unique_key] = [
        'title' => $title,
        'description' => $description,
        'unique_key' => $unique_key,
        'interests_required' => $interests_required,
      ];
    }

    // Add a container for each checkbox, title, and description.
    foreach ($subscriptions as $unique_key => $checkbox) {
      $form['subscription_types'][$unique_key] = [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['form-item-subscription-option'],
          'data-unique-key' => $checkbox['unique_key'],
          'data-interests-required' => $checkbox['interests_required'],
        ],
      ];

      // Checkbox field for subscription type.
      $form['subscription_types'][$unique_key]['checkbox'] = [
        '#type' => 'checkbox',
        '#attributes' => ['class' => ['checked-margin-left']],
      ];

      // Markup for the title of the subscription type.
      $form['subscription_types'][$unique_key]['title'] = [
        '#markup' => '<div class="subscription-type-title checked-padding-left">' . $checkbox['title'] . '</div>',
      ];

      // Markup for the description of the subscription type.
      $form['subscription_types'][$unique_key]['description'] = [
        '#markup' => '<div class="subscription-type-description checked-padding-left">' . $checkbox['description'] . '</div>',
      ];
    }

    // Hidden fields.
    $form['unique_key'] = [
      '#type' => 'textfield',
      '#maxlength' => 40,
      '#required' => FALSE,
    ];

    $form['interests_required'] = [
      '#type' => 'checkbox',
      '#required' => FALSE,
    ];

    $form['project_other'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Project'),
      '#title_display' => 'after',
      '#required' => FALSE,
      '#attributes' => [
        'class' => ['inline-input'],
      ],
      '#states' => [
        'visible' => [
          ':input[name="project_type[Other]"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="interested_in"]' => ['value' => '1'],
          ':input[name="project_type[Other]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['custom_div_2'] = [
      '#markup' => '<hr class="section-divider">',
    ];

    $form['custom_div_3'] = [
      '#markup' => '<h3 class="section-title mb-24">Your details</h3>',
    ];

    $form['first_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('First Name'),
      '#title_display' => 'after',
      '#required' => FALSE,
    ];

    $form['last_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Last Name'),
      '#title_display' => 'after',
      '#required' => FALSE,
    ];

    $form['email'] = [
      '#type' => 'email',
      '#title' => $this->t('Email'),
      '#title_display' => 'after',
      '#required' => FALSE,
    ];

    $form['company_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Company <span class="fw-light">(Optional)</span>'),
      '#title_display' => 'after',
      '#required' => FALSE,
    ];

    $form['position'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Position <span class="fw-light">(Optional)</span>'),
      '#title_display' => 'after',
      '#required' => FALSE,
    ];

    $form['profession_wrapper'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['form-item-profession']],
      'fake-label' => [
        '#markup' => '<p class="fake-label mb-0">Profession <span class="fw-light">(Optional)</span></p>',
      ],
      'professions' => [
        '#type' => 'select',
        '#options' => $this->getOptionsFromTaxonomy('subscription_professions'),
        '#default_value' => 'Professional (Optional)',
        '#required' => FALSE,
        '#empty_option' => $this->t('Profession (Optional)'),
      ],
      'job_other' => [
        '#type' => 'textfield',
        '#title' => $this->t('Other'),
        '#title_display' => 'after',
        '#attributes' => [
          'class' => ['inline-input'],
        ],
        '#states' => [
          'required' => [
            ':input[name="professions"]' => ['value' => 'Other'],
          ],
          'visible' => [
            ':input[name="professions"]' => ['value' => 'Other'],
          ],
        ],
      ],
    ];

    $form['custom_div_5'] = [
      '#markup' => '<hr class="section-divider">',
    ];

    $form['interest_section_header'] = [
      '#markup' => '<h3 class="section-title pb-0 mb-0">Your interests<span class="input-hint"> (Optional)</span></h3><p class="section-content mb-24">Help us deliver relevant content by telling us a bit more about yourself and your work</p>',
    ];

    if ($form_state->content_preference_flag) {
      $form['content_preference'] = [
        '#type' => 'checkboxes',
        '#title' => $this->t('What content do you find interesting? <span>(Select all that apply)</span>'),
        '#options' => $this->getOptionsFromList($form_state->content_preference_options),
        '#attributes' => [
          'class' => ['checked-margin-left dropdown'],
        ],
      ];
    }

    if ($form_state->project_type_flag) {
      $form['project_type'] = [
        '#type' => 'checkboxes',
        '#title' => $this->t('What kinds of projects do you work on? <span>(Select all that apply)</span>'),
        '#options' => $this->getOptionsFromList($form_state->project_type_options),
        '#attributes' => [
          'class' => ['checked-margin-left dropdown'],
        ],
      ];
    }

    if ($form_state->interested_in_flag) {
      $form['interested_in'] = [
        '#type' => 'radios',
        '#title' => $this->t('As an industry professional, help improve our products by participating in website research'),
        '#options' => $this->getOptionsFromList($form_state->interested_in_options),
        '#attributes' => [
          'class' => ['dropdown'],
        ],
      ];
    }

    $form['custom_wrapper'] = [
      '#markup' => '<div class="two-columns-wrapper contact-fields">',
    ];

    $form['mobile'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Mobile'),
      '#title_display' => 'after',
      '#required' => FALSE,
      '#states' => [
        'visible' => [
          ':input[name="interested_in"]' => ['value' => '1'],
        ],
      ],
    ];

    $form['state'] = [
      '#type' => 'select',
      '#title' => $this->t('State'),
      '#title_display' => 'after',
      '#options' => $this->getOptionsFromTaxonomy('bsl_states'),
      '#default_value' => 0,
      '#required' => FALSE,
      '#empty_option' => $this->t('State'),
      '#states' => [
        'visible' => [
          ':input[name="interested_in"]' => ['value' => '1'],
        ],
      ],
    ];

    $form['custom_wrapper_close'] = [
      '#markup' => '</div>',
    ];

    $acknowledgement_text = t('I acknowledge, and give consent for the information collected in this form to be used for promotional, marketing and research purposes.');

    if ($form_state->terms_acknowledgement) {
      $acknowledgement_text = $form_state->terms_acknowledgement;
    }

    $form['terms_acknowledgement'] = [
      '#type' => 'checkbox',
      '#title' => $acknowledgement_text,
      '#required' => FALSE,
      '#attributes' => [
        'class' => ['checked-margin-left'],
      ],
    ];

    $privacy_text = t('By submitting, you agree to the collection, disclosure, and use of your details in accordance with our <a target="_blank" href="@policy_url">Privacy Policy</a>, including promotional, marketing, publicity, and research purposes. The Privacy Policy also contains information about how you may opt out, access, or update your personal information. BlueScope respects your privacy and complies with the Australian Privacy Principles and the SPAM Act.', [
      '@policy_url' => 'https://cdn.dcs.bluescope.com.au/download/bluescope-privacy-policy',
    ]);

    if ($form_state->terms_acceptance) {
      $privacy_text = $form_state->terms_acceptance;
    }

    $form['terms_acceptance'] = [
      '#type' => 'checkbox',
      '#title' => $privacy_text,
      '#required' => TRUE,
      '#attributes' => [
        'class' => ['checked-margin-left'],
      ],
    ];

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Subscribe'),
      '#ajax' => [
        'callback' => '::ajaxThankYouMessage',
        'event' => 'click',
        'progress' => [
          'type' => 'throbber',
          'message' => $this->t('Verifying entry...'),
        ],
      ],
    ];

    // Disable cache.
    $form['#cache'] = ['max-age' => 0];
    \Drupal::service('page_cache_kill_switch')->trigger();

    return $form;
  }

  /**
   * Validate the title and the checkbox of the form.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    // parent::validateForm($form, $form_state);
    // Pass unique_key to the form-state.
    $form_state->set('unique_key', $form['unique_key']['#value']);
    $form_state->set('interests_required', $form['interests_required']['#value']);
    $form_state->set('project_other', $form['project_other']['#value']);
    $form_state->setRebuild(FALSE);

    $values = $form_state->getValues();

    $checked_content_preferences = array_filter($form_state->getValue('content_preference'));

    $checked_project_types = array_filter($form_state->getValue('project_type'));

    // Get subscription unique key.
    if (empty($values['unique_key'])) {
      $form_state->setErrorByName('unique_key', $this->t('Please choose a subscription format.'));
    }

    if (($values['interests_required']) == 1) {
      if ($checked_content_preferences !== NULL && empty($checked_content_preferences)) {
        $form_state->setErrorByName('content_preference', $this->t('Please choose an option'));
      }
      if ($checked_project_types !== NULL && empty($checked_project_types)) {
        $form_state->setErrorByName('project_type', $this->t('Please choose an option'));
      }

      if ($values['project_type']['Other'] === 'Other') {
        if (empty($values['project_other'])) {
          $form_state->setErrorByName('project_other', $this->t('Other field is required'));
        }
      }
    }

    // Loop through the subscriptions and check if the checkbox is checked.
    if (empty($values['first_name'])) {
      $form_state->setErrorByName('first_name', $this->t('First name field is required'));
    }

    if (empty($values['last_name'])) {
      $form_state->setErrorByName('last_name', $this->t('Last name field is required'));
    }

    if (empty($values['email']) || !\Drupal::service('email.validator')->isValid($values['email'])) {
      $form_state->setErrorByName('email', $this->t('This field requires a valid e-mail address'));
    }

    // Validate the participation fields if user choose to participate.
    if ($form_state->interested_in_flag) {
      if ($values['interested_in'] == 1) {

        // Check if 'mobile' is not empty and contains only numbers.
        if (empty($values['mobile'])) {
          $form_state->setErrorByName('mobile', $this->t('Mobile field is required'));
        }
        if (!is_numeric($values['mobile'])) {
          $form_state->setErrorByName('mobile', $this->t('Please enter an valid mobile number'));
        }
        if (empty($values['state'])) {
          $form_state->setErrorByName('state', $this->t('State field is required'));
        }
      }
      else {
        // Clear the value.
        $form_state->setValue('mobile', '');
        $form_state->setValue('state', '');
      }
    }

    if (empty($values['terms_acceptance'])) {
      $form_state->setErrorByName('terms_acceptance', $this->t('This field is required'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Get form values.
    $values = $form_state->getValues();
    $entity_fields = [];
    $entity_fields['unique_key'] = $values['unique_key'];
    $entity_fields['first_name'] = $values['first_name'];
    $entity_fields['last_name'] = $values['last_name'];
    $entity_fields['email'] = $values['email'];
    $entity_fields['company_name'] = $values['company_name'];
    $entity_fields['position'] = $values['position'];
    $entity_fields['user_research_participation'] = $values['interested_in'];
    $entity_fields['project_other'] = $values['project_other'];
    $entity_fields['mobile'] = $values['mobile'];
    $entity_fields['state'] = $values['state'];
    $entity_fields['terms_acknowledgement'] = $values['terms_acknowledgement'];
    $entity_fields['terms_acceptance'] = $values['terms_acceptance'];
    $entity_fields['block_id'] = $form_state->unique_block_id;

    if ($values['professions'] == 'Other') {
      $entity_fields['profession'] = $values['job_other'];
    }
    else {
      $entity_fields['profession'] = $values['professions'];
    }

    if ($form_state->content_preference_flag) {
      $sanitized_interests = array_filter(array_values($values['content_preference']), function ($value) {
        return $value !== 0;
      });
      $entity_fields['content_preference'] = implode("|", $sanitized_interests);
    }

    if ($form_state->project_type_flag) {
      $sanitized_interests = $values['project_type'];

      // Exclude the element with key 'Other'.
      unset($sanitized_interests['Other']);

      $sanitized_interests = array_filter(array_values($sanitized_interests), function ($value) {
        return $value !== 0;
      });

      $entity_fields['project_type'] = implode("|", $sanitized_interests);
    }

    $entry = SubscribeFormEntry::create($entity_fields);
    $entry->save();

    // Send to Salesforce.
    if (!empty($form_state->salesforce_url)) {
      $salesforce_url = $form_state->salesforce_url;

      $success = $this->submitToSalesforceViaFormHandler($entity_fields, $salesforce_url);

      if (!$success) {
        \Drupal::messenger()->addMessage('Unable to register. Please try again.');
      }
    }
  }

  /**
   * Build options from taxonomy.
   */
  private function getOptionsFromTaxonomy($vid, $filter = []) {
    $values = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => $vid]);
    $options = [];

    foreach ($values as $value) {
      // Optional filter specifies which TIDs are valid options.
      if (!count($filter) || array_search($value->id(), $filter) !== FALSE) {
        $option_name = $value->get('name')->getString();
        $options[$option_name] = $option_name;
      }
    }

    return $options;
  }

  /**
   * Submit to Salesforce.
   */
  private function submitToSalesforceViaFormHandler($entity_fields, $salesforce_url): bool {
    $form_params = [
      'unique_key' => $entity_fields['unique_key'],
      'first_name' => $entity_fields['first_name'],
      'last_name' => $entity_fields['last_name'],
      'email' => $entity_fields['email'],
      'mobile' => $entity_fields['mobile'],
      'state' => $entity_fields['state'],
      'company_name' => $entity_fields['company_name'],
      'position' => $entity_fields['position'],
      'profession' => $entity_fields['profession'],
      'user_research_participation' => $entity_fields['interested_in'],
      'project_type' => $entity_fields['project_type'],
      'project_other' => $entity_fields['project_other'],
      'content_preference' => $entity_fields['content_preference'],
      'terms_acknowledgement' => $entity_fields['terms_acknowledgement'],
      'terms_acceptance' => $entity_fields['terms_acceptance'],
    ];

    $form_params = array_merge($form_params, $this->getUtmValuesFromQueryString());

    // Build the request parameters.
    $params = [
      'form_params' => $form_params,
      'headers' => [
        'Content-Type' => 'application/x-www-form-urlencoded',
      ],
    ];

    // Send the HTTP request.
    $client = new Client();
    $response = $client->request('POST', $salesforce_url, $params);

    // Handle the response.
    $body_reports_error = strpos((string) $response->getBody(), 'error') !== FALSE;
    $status_is_ok = $response->getStatusCode() == 200;

    if ($status_is_ok && !$body_reports_error) {
      return TRUE;
    }
    else {
      return FALSE;
    }
  }

  /**
   * AJAX handler for displaying thank you messages or error messages.
   *
   * @param array &$form
   *   The form array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *   The AJAX response containing commands to display messages.
   */
  public function ajaxThankYouMessage(array &$form, FormStateInterface $form_state) {
    $response = new AjaxResponse();

    // Check if the form has errors after validation.
    if ($form_state->hasAnyErrors()) {
      $response->addCommand(new RemoveCommand('.error-message'));
      $response->addCommand(new InvokeCommand('.show-error', 'removeClass', ["show-error"]));
      $response->addCommand(new InvokeCommand('.error-margin', 'removeClass', ["error-margin"]));

      foreach ($form_state->getErrors() as $name => $error) {
        $element = $form[$name];
        $error_message = strip_tags(html_entity_decode($error->render()));
        $id = substr($element['#id'], 0, strpos($element['#id'], "--"));

        // Add an error message element for each field with errors.
        if ($name !== "project_type" &&
            $name !== "content_preference" &&
            $name !== "interested_in" &&
            $name !== "unique_key" &&
            $name !== "state") {
          $response->addCommand(new InvokeCommand(
            NULL,
            'showError',
            [
              $id,
              '<div class="error-message">' . $error_message . '</div>',
              FALSE,
            ],
          ));
        }

        elseif ($name == "unique_key") {
          $response->addCommand(new InvokeCommand(
            NULL,
            'showError',
            [
              $id,
              '<div class="error-message ps-relative">' . $error_message . '</div>',
              TRUE,
            ],
          ));
        }

        else {
          $response->addCommand(new InvokeCommand(
            NULL,
            'showErrorDropdown',
            [
              $id,
              '<div class="error-message">' . $error_message . '</div>',
              FALSE,
            ],
          ));
        }
      }
      $response->addCommand(new InvokeCommand("html", 'gotoErrorElement'));
      // Calling get messages for errors, clears those errors from the stack.
      drupal_get_messages('error');
    }
    else {
      $form_state->setRebuild();
      $response->addCommand(new InvokeCommand("html", 'updatePageUrl'));
      $response->addCommand(new InvokeCommand("html", 'gotoElement', ['.region-content']));
      $response->addCommand(
        new HtmlCommand(
          '.ajax-response-wrapper',
          '<div class="message">
            <h2 class="block-title">' . $form_state->thankyou_title . '</h2>
            <div class="thankyou-container">
            <h3>' . $form_state->thankyou_subtitle . '</h3>
            <p>' . $form_state->thankyou_message . '</p>
          </div>
            <section id="resources">
                <h2 class="fw-bold">Looking for other content?</h2>
                <ul>
                    <li><a href="/products" class="products" alt="View Products">Products</a></li>
                    <li><a href="/resources/literature" class="brochures" alt="View Literature">Literature</a></li>
                    <li><a href="/resources/cad" class="cad" alt="View CAD Files">CAD Files</a></li>
                    <li><a href="/resources/textures" class="textures" alt="View Textures">Textures</a></li>
                </ul>
            </section>
        </div>'
        )
      );
    }
    return $response;
  }

  /**
   * Toggle Job title option field.
   */
  public function toggleJobTitleOption(array &$form, FormStateInterface $form_state) {
    $response = new AjaxResponse();
    $response->addCommand(new InvokeCommand("html", 'toggleJobTitleOption', ['#edit-job-title']));

    return $response;
  }

  /**
   * Extracts options from a string and returns them as an associative array.
   *
   * @param string $values
   *   A string containing key-value pairs separated by PHP_EOL (newline).
   *
   * @return array
   *   An array of options where keys are values and values are labels.
   */
  private function getOptionsFromList($values) {
    $options = [];
    $options_pairs = explode(PHP_EOL, $values);

    foreach ($options_pairs as $pair) {
      [$value, $label] = explode('|', $pair);
      $options[$value] = $label;
    }

    return $options;
  }

  /**
   * Extracts and returns UTM parameters from the query string.
   *
   * @return array
   *   Associative array of UTM parameters and their values
   *   from the query string.
   */
  private function getUtmValuesFromQueryString() {
    $tracking_values = [];

    foreach (UtmUrlProcessor::UTM_PARAMETERS as $field) {
      if (isset($_GET[$field]) && !empty($_GET[$field])) {
        $tracking_values[$field] = $_GET[$field];
      }
    }

    return $tracking_values;
  }

}
