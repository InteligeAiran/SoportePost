<?php
require_once __DIR__ . "/../../libs/Model.php";

class documentsModel extends Model{
    
    public $db;

    public function __construct(){
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function GetDeliveryNoteData($id_ticket){
        try{
            $sql = "SELECT * FROM get_nota_entrega_data(".$id_ticket.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        } 
    }
}
?>