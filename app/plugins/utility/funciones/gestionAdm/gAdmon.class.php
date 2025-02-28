<?php

/* Clase:    gAdmon.class.php
 * Objetivo: Permitir las funciones necesarias para los
 *           funcionarios gestionen las solicitudes              
 * Author:   Vladimir Virguez           
 */

 class GAdmon{
   /*
    * @Defino los Atributos protegidos 
    */
      private  $nroSol;
      private  $id_funcionario;
      private  $id_rol;
      private  $id_status;
      private  $dbx; 

   /** 
     * Constructor. Definir los atributos de la Clase
     */
      
      function __construct($nroSol,$id_funcionario,$id_rol){

      	    $this->nroSol         = $nroSol;
      	    $this->id_funcionario = $id_funcionario;
      	    $this->id_rol         = $id_rol;
      }

      /**
        * @Define_Status. Determina el Rol de Acuerdo a la Accion
        *                 y al Rol del Funcionario.   
        */ 


      public function defStatus($accion){
               
          /* Defino los Arreglos con los Estatus 
           * de Aprobacion y Rechazo de la Solicitud  
           * De acuerdo al Rol del Funcionario 
           */
             $this->aprob  = array(2 => 2, 3 => 6, 4 => 8, 5 => 9, 6=>11);
             $this->rechaz = array(2 => 7, 3 => 5, 4 =>12, 5 => 13, 6 =>14);

             switch($accion)
              {
              	case 1: 
              	 $result = $this->aprob[$this->id_rol];
                break;
                case 2:
                 $result = $this->rechaz[$this->id_rol];
                break;    
              }

          return $result;
      }

      //Nuevo Metodo para Consignacion desde el coordinador
       
      public function defStatusNew($accion){
               
          /* Defino los Arreglos con los Estatus 
           * de Aprobacion y Rechazo de la Solicitud  
           * De acuerdo al Rol del Funcionario 
           */
             $this->aprob  = array(2 => 2, 3 => 6, 4 => 2, 5 => 2, 6=>11);
             $this->rechaz = array(2 => 7, 3 => 5, 4 =>12, 5 => 13, 6 =>14);

             switch($accion)
              {
                case 1: 
                 $result = $this->aprob[$this->id_rol];
                break;
                case 2:
                 $result = $this->rechaz[$this->id_rol];
                break;    
              }

          return $result;
      } 


      
      /**
        * @Aprobar Solicitud. Actualiza la Solicitud de acuerdo al 
        *                     al Rol del Funcionario.   
        */ 


      public function getProceso($action){

          /**
            * @Verifa si Aprueba el Contralor. Si es el Contralor 
            *  Debe buscar el tipo de solicitud, en caso de ser 
            *  Nuevo Registro, busca el Numero de Registro Nuevo 
            */

           //Busca el Status Correspondiente

          switch($action){

              case 1:
                $status = $this->defStatus(1);
              break;

              case 2:
                $status = $this->defStatus(2);
              break;
          }

           //Actualizo el Status en la Solicitud
               
             /*$sql   = "UPDATE solicitud 
                          SET id_status_solicitud =".$status." ,
                              f_status ='".getTime()."' 
                        WHERE id_solicitud =".$this->nroSol.";";*/
                        
             $sql = "UPDATE solicitud 
                        SET id_status_solicitud =".$status."   
                      WHERE id_solicitud =".$this->nroSol.";";           

             $query = @pg_query($sql);

            if($query){
              $bool = true;
            }else{
         	    $bool = false; 
            }

        return $bool;  


      }

      //Metodo Alterno por Situacion Pandemia

      public function getProcesoNew($action){

          /**
            * @Verifa si Aprueba el Contralor. Si es el Contralor 
            *  Debe buscar el tipo de solicitud, en caso de ser 
            *  Nuevo Registro, busca el Numero de Registro Nuevo 
            */

           //Busca el Status Correspondiente

          switch($action){

              case 1:
                $status = $this->defStatusNew(1);
              break;

              case 2:
                $status = $this->defStatusNew(2);
              break;


          }

           //Actualizo el Status en la Solicitud
               
             $sql   = "UPDATE solicitud 
                          SET id_status_solicitud =".$status."   
                        WHERE id_solicitud =".$this->nroSol.";";

             $query = @pg_query($sql);

            if($query){
              $bool = true;
            }else{
              $bool = false; 
            }

        return $bool;  


      }

      /**
        * @setMotivo:Resguarda el Motivo del Rechazo.   
      */
         public function setMotivo($motiv){

             $db      = Database::getInstance();
             $sqlF    = "SELECT NOW();";
             $queryF  = $db->pgquery($sqlF);
             $numR    = $db->pgNumrows($queryF);

             if($numR > 0){
                $rowF = $db->pgfetch($queryF); 
                $f_rechazo = $rowF["now"];
             }

             $sql = "INSERT INTO desc_rechazo(id_solicitud,
                                              id_funcionario,
                                              motivo,
                                              f_rechazo)
                          VALUES($this->nroSol,
                                 '".$this->id_funcionario."',
                                 '".$motiv."',
                                 '".$f_rechazo."');";
               
             $query = $db->pgquery($sql);
             
             if($query){
                $bool = true;
             }else{
                $bool = false;
             }  
             
           return $bool;
         }
          
 } //Fin de la Clase

 ?>