<?php
require_once __DIR__ . "/../../libs/Model.php";

class loginModel extends Model{
    
    public $db;

    public function __construct(){
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function getLogin($cedula, $password){
        try{
            $sql = "SELECT pro.id_profesor, pro.id_status, pro.nombre, pro.apellido, CONCAT(pro.nombre, ' ', pro.apellido) AS full_name, pro.id_rol, rol.d_rol, pro.email, pro.pass, pro.cedula 
                    FROM profesores pro
                    INNER JOIN roles rol ON rol.id_rol = pro.id_rol
                    INNER JOIN status sta ON sta.id_status = pro.id_status
                    WHERE pro.cedula = '".$cedula."' AND pro.pass = '".$password."'
                    UNION ALL
                    SELECT dir.id_directivo, dir.id_status, dir.nombre, dir.apellido, CONCAT(dir.nombre, ' ', dir.apellido) AS full_name, dir.id_rol, rol.d_rol, dir.email, dir.passwd, dir.cedula 
                    FROM directivo dir
                    INNER JOIN roles rol ON rol.id_rol = dir.id_rol
                    INNER JOIN status sta ON sta.id_status = dir.id_status
                    WHERE dir.cedula = '".$cedula."' AND dir.passwd = '".$password."';";
            $result = Model::getResult($sql, $this->db);
            return $result;
           // var_dump($sql);
        } catch (Throwable $e) {
            // Handle exception
        } 
    }

    public function GetUserData($username, $password){
        try{
            $sql = "SELECT * FROM dblink('host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
                 'SELECT usuario, clave, coddocumento, nombres, apellidos, correo, codtipousuario,
					        activo, cargo FROM tblusuario') 
                            AS informacion_clientes (usuario varchar(100), clave 
                            varchar(100), coddocumento VARCHAR(20), nombres varchar(50), 
                            apellidos varchar(50), correo VARCHAR (50), codtipousuario character(50), activo character, cargo varchar(100)) 
                    WHERE usuario = '".$username."' AND clave = '".$password."';";
            $result = Model::getResult($sql, $this->db);
           // var_dump($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        } 
    }

    public function GetUsernameUser($username){
        try{
            $sql ="SELECT usuario FROM dblink('host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
                 'SELECT usuario FROM tblusuario') 
                            AS usuario (usuario VARCHAR (50)) 
                    WHERE usuario = '".$username."';";
            $result = Model::getResult($sql, $this->db);
            return $result;
   // Depuración: imprime la consulta SQL y el resultado
           } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetPasswordUser($username, $password){  
        try {
            $sql = "SELECT usuario, clave FROM dblink('host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
                 'SELECT usuario, clave FROM tblusuario') 
                            AS usuario_clave (usuario varchar(50), clave VARCHAR (200)) 
                    WHERE usuario = '".$username."' AND clave = '".$password."';";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    /*public function getUpdateName($form){
        try{
            $sql = "UPDATE profesores
                    SET nombre = '".strtoupper($form['nombre'])."' 
                    WHERE id_profesor = ".$form['id_profesor'].";";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getUpdateSurname($form){
        try{
            $sql = "UPDATE profesores
                    SET apellido = '".strtoupper($form['apellido'])."' 
                    WHERE id_profesor = ".$form['id_profesor'].";";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getUpdateCedula($id_profesor){
        try{
            $sql = "UPDATE profesores
                    SET cedula = '".strtoupper($form['cedula'])."' 
                    WHERE id_profesor = ".$id_profesor.";";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetCedula($id_profesor){
        try{
            $sql = "SELECT cedula FROM profesores WHERE id_profesor = ".$id_profesor['id_profesor'].";";
            $result = Model::getResult($sql, $this->db);
            var_dump($sql);
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function countAlumnoRol3(){
        try{
            $sql = "SELECT count(*) as alumnos FROM alumnos";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function showStudentsRol3(){
        try{
            $sql = "SELECT alu.id_alumno, CONCAT(ase.ano, ' ', ase.seccion) as secciones, st.d_status, alu.cedula, alu.nombre, alu.apellido
                    FROM alumnos alu
                    INNER JOIN aseccion ase ON ase.id_aseccion = alu.id_aseccion 
                    INNER JOIN status st ON st.id_status = alu.id_status";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}
*/
}
//Fin Modelo
?>