<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
/**
 * @package dompdf
 * @link    http://dompdf.github.com/
 * @author  Benj Carson <benjcarson@digitaljunkies.ca>
 * @license http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 */
namespace Dompdf\FrameReflower;

use Dompdf\FrameDecorator\Block as BlockFrameDecorator;
use Dompdf\FrameDecorator\AbstractFrameDecorator;

/**
 * Reflows list bullets
 *
 * @package dompdf
 */
class ListBullet extends AbstractFrameReflower
{

    /**
     * ListBullet constructor.
     * @param AbstractFrameDecorator $frame
     */
    function __construct(AbstractFrameDecorator $frame)
    {
        parent::__construct($frame);
    }

    /**
     * @param BlockFrameDecorator|null $block
     */
    function reflow(BlockFrameDecorator $block = null)
    {
        $style = $this->_frame->get_style();

        $style->width = $this->_frame->get_width();
        $this->_frame->position();

        if ($style->list_style_position === "inside") {
            $p = $this->_frame->find_block_parent();
            $p->add_frame_to_line($this->_frame);
        }
    }
}
