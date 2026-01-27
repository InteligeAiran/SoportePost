-- FUNCTION: public.get_tickets_pending_document_approval(integer)

CREATE OR REPLACE FUNCTION public.get_tickets_pending_document_approval(
	p_id_user integer)
    RETURNS TABLE(id_ticket integer, create_ticket text, serial_pos character varying, name_status_ticket character varying, name_process_ticket character varying, name_accion_ticket character varying, name_status_payment character varying, id_status_domiciliacion integer, name_status_domiciliacion character, id_status_payment integer, name_failure character varying, full_name_tecnico text, razonsocial_cliente character varying, rif character varying, nro_ticket character varying, fecha_instalacion date, estatus_inteliservices character varying, confirmcoord boolean, confirmtecn boolean, garantia_instalacion boolean, garantia_reingreso boolean, fecha_cierre_anterior text, nombre_estado_cliente text, full_name_tecnico_n2_actual text, pago text, exoneracion text, envio text, envio_destino text, document_type character varying, original_filename text, file_path text, mime_type character varying, uploaded_at text, id_motivo_rechazo integer, motivo_rechazo text, envio_rechazado text, exoneracion_rechazado text, envio_destino_rechazado text, anticipo_rechazado text, ticket_tiene_documentos_rechazados text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	v_user_role_id INT;
	v_user_area_id INT;
	v_dblink_conn_string TEXT;
	v_current_date DATE := CURRENT_DATE;
BEGIN
	-- Obtener rol y área del usuario
	SELECT id_rolusr, id_area INTO v_user_role_id, v_user_area_id FROM users WHERE id_user = p_id_user;
	IF v_user_role_id IS NULL THEN RETURN; END IF;
	-- Construir conexión dblink
	SELECT format('host=%s port=%s dbname=%s user=%s password=%s', host, port, dbname, username, password)
	INTO v_dblink_conn_string
	FROM dblink_configs WHERE config_name = 'intelipunto_db';
	
	IF v_dblink_conn_string IS NULL THEN
		RAISE EXCEPTION 'Configuración de dblink "intelipunto_db" no encontrada.';
	END IF;
	RETURN QUERY
	WITH
	-- CTE 1: Obtener tickets filtrados primero (más eficiente)
	filtered_tickets AS (
		SELECT	
			tik.id_ticket,
			tik.nro_ticket,
			tik.serial_pos,
			tik.rif,
			tik.confirmcoord,
			tik.confirmtecn,
			tik.date_end_ticket,
			tik.id_status_payment,
			tik.id_level_failure,
			tik.id_accion_ticket,
			tik.id_process_ticket,
			tik.id_status_ticket
		FROM tickets tik
		INNER JOIN status_payments stpy ON stpy.id_status_payment = tik.id_status_payment
		LEFT JOIN tickets_status_domiciliacion tsd ON tsd.id_ticket = tik.id_ticket
		WHERE tik.id_level_failure = 2
			-- SE AGREGÓ STATUS 17 (Pago Pendiente por Revision)
			AND stpy.id_status_payment IN (4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 17)
	),
	-- CTE 2: Obtener datos de Intelipunto solo para los tickets filtrados (CON MANEJO ESPECIAL PARA CONVENIO FIRMADO)
	intelipunto_data AS (
		SELECT
			t1.remote_rif,
			t1.razonsocial,
			t1.fechainstalacion,
			t1.desc_estatus
		FROM dblink(
			v_dblink_conn_string,
			'SELECT DISTINCT ON (clie.coddocumento)
				clie.coddocumento,
				COALESCE(clie.razonsocial, ''Cliente no encontrado'') as razonsocial,
				invt.fechainstalacion,
				stintel.desc_estatus
			FROM clie_tblclientepotencial clie
			INNER JOIN tblinventariopos invt ON invt.id_cliente::integer = clie.id_consecutivo
			INNER JOIN tblestatusinteliservices stintel ON stintel.idestatus = invt.idestatusinteliservices
			WHERE clie.coddocumento IS NOT NULL
			ORDER BY clie.coddocumento, invt.fechainstalacion DESC, stintel.desc_estatus DESC'
		) AS t1(remote_rif text, razonsocial name, fechainstalacion date, desc_estatus character varying)
		WHERE t1.remote_rif IS NOT NULL
	),
	-- CTE 3: Agrupar archivos adjuntos una sola vez con información detallada de rechazo
	attachments_summary AS (
		SELECT	
			aa.nro_ticket,
			BOOL_OR(aa.document_type = 'Anticipo') AS tiene_pago,
			BOOL_OR(aa.document_type = 'Exoneracion') AS tiene_exoneracion,
			BOOL_OR(aa.document_type = 'Envio') AS tiene_envio,
			BOOL_OR(aa.document_type = 'Envio_Destino') AS tiene_envio_destino,
			-- COLUMNAS: Verificar cada tipo de documento rechazado
			BOOL_OR(aa.document_type = 'Envio' AND aa.id_motivo_rechazo IS NOT NULL) AS envio_rechazado_flag,
			BOOL_OR(aa.document_type = 'Exoneracion' AND aa.id_motivo_rechazo IS NOT NULL) AS exoneracion_rechazado_flag,
			BOOL_OR(aa.document_type = 'Envio_Destino' AND aa.id_motivo_rechazo IS NOT NULL) AS envio_destino_rechazado_flag,
			BOOL_OR(aa.document_type = 'Anticipo' AND aa.id_motivo_rechazo IS NOT NULL) AS anticipo_rechazado_flag,
			-- COLUMNA: Verificar si el TICKET completo tiene documentos rechazados
			BOOL_OR(aa.id_motivo_rechazo IS NOT NULL) AS ticket_tiene_documentos_rechazados
		FROM archivos_adjuntos aa
		GROUP BY aa.nro_ticket
	),
	-- CTE 4: Obtener documentos con lógica inteligente para cada ticket
	smart_documents AS (
		SELECT DISTINCT ON (aa.nro_ticket)
			aa.nro_ticket,
			aa.document_type,
			aa.original_filename,
			aa.file_path,
			aa.mime_type,
			TO_CHAR(aa.uploaded_at, 'DD-MM-YYYY HH12:MI') AS uploaded_at,
			aa.id_motivo_rechazo,
			mr.name_motivo_rechazo,
			-- ROW_NUMBER para asegurar un solo documento por ticket
			ROW_NUMBER() OVER (
				PARTITION BY aa.nro_ticket	
				ORDER BY	
					CASE	
						-- Si el ticket está en status 5 o 7 (pendiente de revisión), priorizar documentos NO rechazados
						WHEN EXISTS (
							SELECT 1 FROM tickets t	
							WHERE t.nro_ticket = aa.nro_ticket	
							AND t.id_status_payment IN (5, 7)
						) AND aa.id_motivo_rechazo IS NULL THEN 0
						-- Si el ticket está en otros status, priorizar documentos rechazados
						WHEN aa.id_motivo_rechazo IS NOT NULL THEN 1
						-- Por defecto, mostrar documentos no rechazados
						ELSE 2
					END,
					aa.uploaded_at DESC
			) as rn
		FROM archivos_adjuntos aa
		LEFT JOIN motivos_rechazo mr ON mr.id_motivo_rechazo = aa.id_motivo_rechazo
        -- *** NUEVA LÓGICA DE FILTRADO ESTRICTO ***
        WHERE
            CASE
                -- Tesoreria (2) y Administrativo (5) -> SOLO Anticipo
                WHEN v_user_area_id = 2 AND v_user_role_id = 5 THEN 
                    aa.document_type = 'Anticipo'
                -- Taller/Boleita (3) y Administrativo (5) -> SOLO Exoneracion
                WHEN v_user_area_id = 3 AND v_user_role_id = 5 THEN 
                    aa.document_type = 'Exoneracion'
                -- Resto -> Mostrar todo
                ELSE TRUE 
            END
        -- *** FIN NUEVA LÓGICA ***
	),
	-- CTE 5: Obtener datos principales del ticket sin duplicaciones
	ticket_main_data AS (
		SELECT DISTINCT ON (tik.id_ticket)
			tik.id_ticket,
			tik.nro_ticket,
			tik.serial_pos,
			tik.rif,
			tik.confirmcoord,
			tik.confirmtecn,
			tik.date_end_ticket,
			tik.id_status_payment,
			tik.id_level_failure,
			tik.id_accion_ticket,
			tik.id_process_ticket,
			tik.id_status_ticket,
			usrtik.date_create_ticket,
			usrtik.id_coordinador,
			usrtik.id_tecnico_n1,
			usr.name AS tecnico_name,
			usr.surname AS tecnico_surname,
			usrt.name AS coord_name,
			usrt.surname AS coord_surname,
			intel.razonsocial,
			intel.fechainstalacion,
			intel.desc_estatus,
			vb.nombre_estado,
			latest_tecnico_n2.id_tecnico_n2,
			usr_n2.name AS tecnico_n2_name,
			usr_n2.surname AS tecnico_n2_surname
		FROM filtered_tickets tik
		LEFT JOIN (
			SELECT DISTINCT ON (ut.id_ticket)
				ut.id_ticket,
				ut.date_create_ticket,
				ut.id_coordinador,
				ut.id_tecnico_n1
			FROM users_tickets ut
			WHERE ut.id_ticket IN (SELECT ft.id_ticket FROM filtered_tickets ft)
			ORDER BY ut.id_ticket, ut.date_assign_tec2 DESC
		) usrtik ON usrtik.id_ticket = tik.id_ticket
		LEFT JOIN users usr ON usr.id_user = usrtik.id_tecnico_n1
		LEFT JOIN users usrt ON usrt.id_user = usrtik.id_coordinador
		LEFT JOIN intelipunto_data intel ON tik.rif = intel.remote_rif
		LEFT JOIN LATERAL public.verifingbranches(tik.rif) AS vb ON TRUE
		LEFT JOIN LATERAL (
			SELECT ut.id_tecnico_n2
			FROM users_tickets ut
			WHERE ut.id_ticket = tik.id_ticket AND ut.id_tecnico_n2 IS NOT NULL
			ORDER BY ut.date_assign_tec2 DESC, ut.id_user_ticket DESC
			LIMIT 1
		) AS latest_tecnico_n2 ON TRUE
		LEFT JOIN users usr_n2 ON usr_n2.id_user = latest_tecnico_n2.id_tecnico_n2
		ORDER BY tik.id_ticket
	)
	SELECT
		tmd.id_ticket,
		to_char(tmd.date_create_ticket, 'DD-MM-YYYY HH12:MI') as create_ticket,
		tmd.serial_pos,
		stutik.name_status_ticket,
		procs.name_process_ticket,
		accti.name_accion_ticket,
		stpy.name_status_payment,
        -- ***************************************************************
        -- SELECCIÓN DE LAS NUEVAS COLUMNAS DE DOMICILIACIÓN
        -- ***************************************************************
        td.id_status_domiciliacion,
        sdm.name_status_domiciliacion,
        -- ***************************************************************
        -- FIN: Nuevas columnas
        -- ***************************************************************
		tmd.id_status_payment,
		fail.name_failure,
		CONCAT(tmd.tecnico_name, ' ', tmd.tecnico_surname) as full_name_tecnico,
		-- CORREGIDO: Manejo especial para casos donde no se encuentra razón social
		CASE 
			WHEN tmd.razonsocial IS NOT NULL AND tmd.razonsocial::varchar != '' AND tmd.razonsocial::varchar != 'Cliente no encontrado' 
				THEN tmd.razonsocial::varchar
			WHEN td.id_status_domiciliacion = 4 
				THEN 'Cliente - Convenio Firmado'
			ELSE 'Cliente no encontrado'
		END AS razonsocial_cliente,
		tmd.rif AS rif,
		tmd.nro_ticket,
		tmd.fechainstalacion,
		tmd.desc_estatus,
		tmd.confirmcoord,
		tmd.confirmtecn,
		(tmd.fechainstalacion IS NOT NULL AND tmd.fechainstalacion >= (v_current_date - INTERVAL '6 months')) AS garantia_instalacion,
		(tmd.date_end_ticket IS NOT NULL AND tmd.date_end_ticket >= (v_current_date - INTERVAL '1 months')) AS garantia_reingreso,
		to_char(tmd.date_end_ticket, 'DD-MM-YYYY') AS fecha_cierre_anterior,
		tmd.nombre_estado AS nombre_estado_cliente,
		COALESCE(CONCAT(tmd.tecnico_n2_name, ' ', tmd.tecnico_n2_surname), 'No Asignado') AS full_name_tecnico_n2_actual,
		-- COLUMNAS DE DOCUMENTOS CON VALORES POR DEFECTO (convertir a text)
		CASE WHEN COALESCE(att.tiene_pago, false) THEN 'Sí' ELSE 'No' END AS pago,
		CASE WHEN COALESCE(att.tiene_exoneracion, false) THEN 'Sí' ELSE 'No' END AS exoneracion,
		CASE WHEN COALESCE(att.tiene_envio, false) THEN 'Sí' ELSE 'No' END AS envio,
		CASE WHEN COALESCE(att.tiene_envio_destino, false) THEN 'Sí' ELSE 'No' END AS envio_destino,
		-- COLUMNAS DE DOCUMENTOS (LÓGICA INTELIGENTE)
		sd.document_type,
		sd.original_filename,
		sd.file_path,
		sd.mime_type,
		sd.uploaded_at,
		sd.id_motivo_rechazo,
		sd.name_motivo_rechazo,
		-- COLUMNAS: Respuestas específicas para cada tipo de documento rechazado
		CASE WHEN COALESCE(att.envio_rechazado_flag, false) THEN 'Sí' ELSE 'No' END AS envio_rechazado,
		CASE WHEN COALESCE(att.exoneracion_rechazado_flag, false) THEN 'Sí' ELSE 'No' END AS exoneracion_rechazado,
		CASE WHEN COALESCE(att.envio_destino_rechazado_flag, false) THEN 'Sí' ELSE 'No' END AS envio_destino_rechazado,
		CASE WHEN COALESCE(att.anticipo_rechazado_flag, false) THEN 'Sí' ELSE 'No' END AS anticipo_rechazado,
		-- COLUMNA: Indicador de ticket completo con documentos rechazados (convertir a text)
		CASE WHEN COALESCE(att.ticket_tiene_documentos_rechazados, false) THEN 'Sí' ELSE 'No' END AS ticket_tiene_documentos_rechazados
	FROM
		ticket_main_data tmd
	INNER JOIN
		status_tickets stutik ON stutik.id_status_ticket = tmd.id_status_ticket
	INNER JOIN
		status_payments stpy ON stpy.id_status_payment = tmd.id_status_payment
	INNER JOIN
		process_tickets procs ON procs.id_process_ticket = tmd.id_process_ticket
	INNER JOIN
		accions_tickets accti ON accti.id_accion_ticket = tmd.id_accion_ticket
	INNER JOIN
		tickets_failures tikfai ON tikfai.id_ticket = tmd.id_ticket
	INNER JOIN
		failures fail ON fail.id_failure = tikfai.id_failure
    -- ***************************************************************
    -- JOINs DE DOMICILIACIÓN (debes usar tmd.id_ticket ya que estás uniendo con ticket_main_data)
    -- ***************************************************************
	LEFT JOIN 
		tickets_status_domiciliacion td ON td.id_ticket = tmd.id_ticket
	LEFT JOIN
		status_domiciliacion sdm ON sdm.id_status_domiciliacion = td.id_status_domiciliacion
    -- ***************************************************************
    -- FIN: JOINs DE DOMICILIACIÓN
    -- ***************************************************************
	LEFT JOIN
		attachments_summary att ON att.nro_ticket = tmd.nro_ticket
	-- JOIN CON DOCUMENTOS INTELIGENTES
	LEFT JOIN (
		SELECT * FROM smart_documents WHERE rn = 1
	) sd ON sd.nro_ticket = tmd.nro_ticket
    
    -- *** FILTRO FINAL: SI EL USUARIO TIENE ROL ESTRICTO, OCULTAR TICKETS SIN EL DOCUMENTO REQUERIDO ***
    WHERE
        CASE
            -- Si es Tesoreria (2) y Administrativo (5), el ticket DEBE tener un documento (que ya filtramos sea Anticipo)
            WHEN v_user_area_id = 2 AND v_user_role_id = 5 THEN 
                sd.nro_ticket IS NOT NULL
            -- Si es Taller (3) y Administrativo (5), el ticket DEBE tener un documento (que ya filtramos sea Exoneracion)
            WHEN v_user_area_id = 3 AND v_user_role_id = 5 THEN 
                sd.nro_ticket IS NOT NULL
            -- Para los demás, permitimos ver el ticket aunque no tenga documento (o tenga otros)
            ELSE TRUE 
        END
    -- ************************************************************************************************
    
	ORDER BY tmd.id_ticket, tmd.date_create_ticket DESC;
END;
$BODY$;

ALTER FUNCTION public.get_tickets_pending_document_approval(integer)
    OWNER TO postgres;
