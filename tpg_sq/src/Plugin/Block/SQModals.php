<?php
/**
 * Provides a SQ Modals Block for modal content.
 *
 * @Block(
 *   id = "sq_modals",
 *   admin_label = @Translation("SQ Modals"),
 * )
 */

namespace Drupal\tpg_sq\Plugin\Block;

use Drupal\Core\Block\BlockBase;

class SQModals extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
        '#theme' => 'sq_modals',
        '#attached' => array(
            'library' => array('tpg_sq/sq') // only add sq css/js when this block is present to page
        ),
    );
  }

}