<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
namespace Dompdf\Frame;

use IteratorAggregate;
use Dompdf\Frame;

/**
 * Pre-order IteratorAggregate
 *
 * @access private
 * @package dompdf
 */
class FrameTreeList implements IteratorAggregate
{
    /**
     * @var \Dompdf\Frame
     */
    protected $_root;

    /**
     * @param \Dompdf\Frame $root
     */
    public function __construct(Frame $root)
    {
        $this->_root = $root;
    }

    /**
     * @return FrameTreeIterator
     */
    public function getIterator()
    {
        return new FrameTreeIterator($this->_root);
    }
}
