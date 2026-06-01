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
 * @author  Fabien Ménager <fabien.menager@gmail.com>
 * @license http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 */
namespace Dompdf;

use Dompdf\Frame;

/**
 * Embeds Javascript into the PDF document
 *
 * @package dompdf
 */
class JavascriptEmbedder
{

    /**
     * @var Dompdf
     */
    protected $_dompdf;

    /**
     * JavascriptEmbedder constructor.
     *
     * @param Dompdf $dompdf
     */
    public function __construct(Dompdf $dompdf)
    {
        $this->_dompdf = $dompdf;
    }

    /**
     * @param $script
     */
    public function insert($script)
    {
        $this->_dompdf->getCanvas()->javascript($script);
    }

    /**
     * @param \Dompdf\Frame $frame
     */
    public function render(Frame $frame)
    {
        if (!$this->_dompdf->getOptions()->getIsJavascriptEnabled()) {
            return;
        }

        $this->insert($frame->get_node()->nodeValue);
    }
}
