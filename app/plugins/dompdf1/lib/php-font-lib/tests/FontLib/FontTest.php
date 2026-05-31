<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */

namespace FontLib\Tests;

use FontLib\Font;

class FontTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @expectedException \Fontlib\Exception\FontNotFoundException
     */
    public function testLoadFileNotFound()
    {
        Font::load('non-existing/font.ttf');
    }

    public function testLoadTTFFontSuccessfully()
    {
        $trueTypeFont = Font::load('sample-fonts/IntelClear-Light.ttf');

        $this->assertInstanceOf('FontLib\TrueType\File', $trueTypeFont);
    }
}