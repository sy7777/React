<?php
/**
 * Provides an Address Entry Block
 *
 * @Block(
 *   id = "sq_block",
 *   admin_label = @Translation("SQ Address"),
 * )
 */

namespace Drupal\tpg_sq\Plugin\Block;

use Drupal\Core\Block\BlockBase;

class SQBlock extends BlockBase {
    /**
     * {@inheritdoc}
     */
    public function build() {
        return array(
            '#theme' => 'tpg_sq',
        );
    }
}