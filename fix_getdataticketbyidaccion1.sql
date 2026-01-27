-- FUNCTION: public.getdataticketbyidaccion1(integer)

CREATE OR REPLACE FUNCTION public.getdataticketbyidaccion1(
	p_id_user integer)
    RETURNS TABLE(id_ticket integer, create_ticket text, serial_pos character varying, name_status_ticket character varying, name_process_ticket character varying, name_accion_ticket character varying, name_status_payment character varying, id_status_domiciliacion integer, name_status_domiciliacion character, id_status_payment integer, name_failure character varying, full_name_tecnico text, full_name_tecnico_n2_actual text, razonsocial_cliente character varying, rif character varying, nro_ticket character varying, fecha_instalacion text, estatus_inteliservices character varying, confirmcoord boolean, confirmtecn boolean, garantia_instalacion boolean, garantia_reingreso boolean, fecha_cierre_anterior text, nombre_estado_cliente text, pdf_zoom_url text, img_exoneracion_url text, pdf_pago_url text, pdf_zoom_filename text, img_exoneracion_filename text, pdf_pago_filename text, comment_devolution text, pdf_convenio_url text, pdf_convenio_filename text, has_rejected_document boolean, id_failure integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	v_user_role_id INT;
	v_host_intelipunto TEXT;
	v_port_intelipunto TEXT;
	v_dbname_intelipunto TEXT;
	v_username_intelipunto TEXT;
	v_password_intelipunto TEXT;
	v_dblink_conn_string_intelipunto TEXT;
	v_host_postventa TEXT;
	v_port_postventa TEXT;
	v_dbname_postventa TEXT;
	v_username_postventa TEXT;
	v_password_postventa TEXT;
	v_dblink_conn_string_postventa TEXT;
	v_current_date DATE := CURRENT_DATE;
BEGIN
	-- Obtener el rol del usuario
	SELECT id_rolusr
	INTO v_user_role_id
	FROM users
	WHERE id_user = p_id_user;

	-- Si el usuario no existe, retornar vacío
	IF v_user_role_id IS NULL THEN
		RETURN;
	END IF;

	-- Obtener configuración de dblink para intelipunto
	SELECT host, port, dbname, username, password
	INTO v_host_intelipunto, v_port_intelipunto, v_dbname_intelipunto, v_username_intelipunto, v_password_intelipunto
	FROM dblink_configs
	WHERE config_name = 'intelipunto_db';

	IF v_host_intelipunto IS NULL THEN
		RAISE EXCEPTION 'Configuración de dblink "intelipunto_db" no encontrada en dblink_configs.';
	END IF;

	v_dblink_conn_string_intelipunto := format(
		'host=%s port=%s dbname=%s user=%s password=%s',
		v_host_intelipunto, v_port_intelipunto, v_dbname_intelipunto, v_username_intelipunto, v_password_intelipunto
	);

	-- Obtener configuración de dblink para postventa
	SELECT host, port, dbname, username, password
	INTO v_host_postventa, v_port_postventa, v_dbname_postventa, v_username_postventa, v_password_postventa
	FROM dblink_configs
	WHERE config_name = 'soporte_postventa_db';

	IF v_host_postventa IS NULL THEN
		RAISE EXCEPTION 'Configuración de dblink "soporte_postventa_db" no encontrada en dblink_configs.';
	END IF;

	v_dblink_conn_string_postventa := format(
		'host=%s port=%s dbname=%s user=%s password=%s',
		v_host_postventa, v_port_postventa, v_dbname_postventa, v_username_postventa, v_password_postventa
	);

	RETURN QUERY
	SELECT DISTINCT ON (usrtik_initial.date_create_ticket)
		tik.id_ticket,
		to_char(usrtik_initial.date_create_ticket, 'DD-MM-YYYY HH12:MI') as create_ticket,
		tik.serial_pos,
		stutik.name_status_ticket,
		procs.name_process_ticket,
		accti.name_accion_ticket,
		stpy.name_status_payment,
		stdom.id_status_domiciliacion,
		stdom.name_status_domiciliacion,
		tik.id_status_payment,
		fail.name_failure,
		CONCAT(usr_n1.name, ' ', usr_n1.surname) as full_name_tecnico,
		COALESCE(CONCAT(usr_n2_latest.name, ' ', usr_n2_latest.surname), 'No Asignado') as full_name_tecnico_n2_actual,
		t1.razonsocial::varchar AS razonsocial_cliente,
		tik.rif,
		tik.nro_ticket,
		to_char(t1.fechainstalacion, 'DD-MM-YYYY') as fecha_instalacion,
		t1.desc_estatus,
		tik.confirmcoord,
		tik.confirmtecn,
		-- Cálculo de garantía de instalación
		(t1.fechainstalacion IS NOT NULL AND t1.fechainstalacion >= (v_current_date - INTERVAL '6 months')) AS garantia_instalacion,
		-- Cálculo de garantía por reingreso
		(
			SELECT
				CASE
					WHEN final_cierre IS NOT NULL AND final_cierre >= (v_current_date - INTERVAL '1 months') THEN TRUE
					ELSE FALSE
				END
			FROM (
				SELECT GREATEST(
					tik.date_end_ticket,
					(SELECT fecha_cierre FROM dblink(
						v_dblink_conn_string_postventa,
						'SELECT fecha_cierre FROM tk WHERE serialpos = ' || quote_literal(tik.serial_pos) || ' ORDER BY fecha_cierre DESC LIMIT 1'
					) AS t_rem(fecha_cierre DATE))
				) AS final_cierre
			) AS combined_dates
		) AS garantia_reingreso,
		-- Obtener la fecha de cierre más reciente y formatearla a 'DD-MM-YYYY'
		to_char(
			(SELECT GREATEST(
				tik.date_end_ticket,
				(SELECT fecha_cierre FROM dblink(
					v_dblink_conn_string_postventa,
					'SELECT fecha_cierre FROM tk WHERE serialpos = ' || quote_literal(tik.serial_pos) || ' ORDER BY fecha_cierre DESC LIMIT 1'
				) AS t_rem(fecha_cierre DATE))
			)), 'DD-MM-YYYY'
		) AS fecha_cierre_anterior,
		-- Usar DISTINCT ON para evitar duplicados en verifingbranches
		(SELECT DISTINCT ON (nombre_estado) nombre_estado 
			FROM public.verifingbranches_serial(tik.serial_pos) 
			ORDER BY nombre_estado 
			LIMIT 1) AS nombre_estado_cliente,
		-- URLs de documentos cargados
		COALESCE(zoom_docs.file_path, '') as pdf_zoom_url,
		COALESCE(exon_docs.file_path, '') as img_exoneracion_url,
		COALESCE(pago_docs.file_path, '') as pdf_pago_url,
		-- Nombres originales de documentos
		COALESCE(zoom_docs.original_filename, '') as pdf_zoom_filename,
		COALESCE(exon_docs.original_filename, '') as img_exoneracion_filename,
		COALESCE(pago_docs.original_filename, '') as pdf_pago_filename,
		-- NUEVA COLUMNA: comment_devolution solo para tickets con id_accion_ticket = 12
		CASE 
			WHEN tik.id_accion_ticket IN (12) THEN COALESCE(tik.comment_devolution, '')
			ELSE ''
		END AS comment_devolution,
		-- NUEVAS COLUMNAS DE CONVENIO (URL y FILENAME)
		COALESCE(convenio_docs.file_path, '') as pdf_convenio_url,
		COALESCE(convenio_docs.original_filename, '') as pdf_convenio_filename,
        -- CAMBIO APLICADO: Solo considerar documentos RECIENTES
        (
            SELECT EXISTS (
                SELECT 1
                FROM (
                    SELECT DISTINCT ON (aa.document_type) aa.rechazado
                    FROM public.archivos_adjuntos aa
                    WHERE aa.nro_ticket = tik.nro_ticket
                    ORDER BY aa.document_type, aa.uploaded_at DESC
                ) AS latest_docs
                WHERE latest_docs.rechazado = TRUE
            )
        ) AS has_rejected_document,
        -- NUEVO CAMPO AGREGADO: id_failure
        fail.id_failure
	FROM
		tickets tik
	INNER JOIN
		status_tickets stutik ON stutik.id_status_ticket = tik.id_status_ticket
	INNER JOIN
		process_tickets procs ON procs.id_process_ticket = tik.id_process_ticket
	INNER JOIN 
		tickets_status_domiciliacion tikst ON tikst.id_ticket = tik.id_ticket
	INNER JOIN 
		status_domiciliacion stdom ON stdom.id_status_domiciliacion = tikst.id_status_domiciliacion
	INNER JOIN
		accions_tickets accti ON accti.id_accion_ticket = tik.id_accion_ticket
	INNER JOIN
		tickets_failures tikfai ON tikfai.id_ticket = tik.id_ticket
	INNER JOIN
		failures fail ON fail.id_failure = tikfai.id_failure
	INNER JOIN
		status_payments stpy ON stpy.id_status_payment = tik.id_status_payment
	INNER JOIN users_tickets usrtik_initial
		ON usrtik_initial.id_ticket = tik.id_ticket
		AND usrtik_initial.id_user_ticket = (
			SELECT MIN(ut_min.id_user_ticket)
			FROM users_tickets ut_min
			WHERE ut_min.id_ticket = tik.id_ticket
		)
	INNER JOIN
		users usr_n1 ON usr_n1.id_user = usrtik_initial.id_tecnico_n1
	INNER JOIN
		users usr_coord ON usr_coord.id_user = usrtik_initial.id_coordinador
	LEFT JOIN LATERAL (
		SELECT ut.id_tecnico_n2, ut.date_assign_tec2
		FROM users_tickets ut
		WHERE ut.id_ticket = tik.id_ticket
			AND ut.id_tecnico_n2 IS NOT NULL
		ORDER BY ut.date_assign_tec2 DESC, ut.id_user_ticket DESC
		LIMIT 1
	) AS latest_tecnico_n2 ON TRUE
	LEFT JOIN users usr_n2_latest ON usr_n2_latest.id_user = latest_tecnico_n2.id_tecnico_n2
	-- JOINs para obtener documentos cargados con nombres originales
	LEFT JOIN LATERAL (
		SELECT adj.file_path, adj.original_filename
		FROM archivos_adjuntos adj	
		WHERE adj.nro_ticket = tik.nro_ticket
		AND adj.document_type = 'Envio'
		ORDER BY uploaded_at DESC
		LIMIT 1
	) AS zoom_docs ON TRUE
	LEFT JOIN LATERAL (
		SELECT adj.file_path, adj.original_filename
		FROM archivos_adjuntos adj
		WHERE adj.nro_ticket = tik.nro_ticket
		AND adj.document_type = 'Exoneracion'
		ORDER BY uploaded_at DESC
		LIMIT 1
	) AS exon_docs ON TRUE
	LEFT JOIN LATERAL (
		SELECT adj.file_path, adj.original_filename
		FROM archivos_adjuntos adj
		WHERE adj.nro_ticket = tik.nro_ticket
		AND adj.document_type = 'Anticipo'
		ORDER BY uploaded_at DESC
		LIMIT 1
	) AS pago_docs ON TRUE
	LEFT JOIN LATERAL (
		SELECT adj.file_path, adj.original_filename
		FROM archivos_adjuntos adj
		WHERE adj.nro_ticket = tik.nro_ticket
		AND adj.document_type = 'convenio_firmado'
		ORDER BY uploaded_at DESC
		LIMIT 1
	) AS convenio_docs ON TRUE
	LEFT JOIN
		dblink(
			v_dblink_conn_string_intelipunto,
			'SELECT DISTINCT ON (clie.coddocumento)
				clie.razonsocial,
				clie.coddocumento,
				invt.fechainstalacion,
				stintel.desc_estatus
			FROM
				clie_tblclientepotencial clie
			INNER JOIN tblinventariopos invt ON invt.id_cliente::integer = clie.id_consecutivo
			INNER JOIN tblestatusinteliservices stintel ON stintel.idestatus = invt.idestatusinteliservices
			ORDER BY
				clie.coddocumento,
				invt.fechainstalacion DESC
			'
		) AS t1(razonsocial name, remote_rif text, fechainstalacion date, desc_estatus character varying)
	ON tik.rif = t1.remote_rif
	WHERE
		tik.id_level_failure = 2
		AND (tik.id_accion_ticket = 6 OR tik.id_accion_ticket = 7 OR tik.id_accion_ticket = 10 OR tik.id_accion_ticket = 11 OR tik.id_accion_ticket = 12 OR tik.id_accion_ticket = 16)
		AND (
			-- Si el usuario tiene rol 1 o 4, puede ver todos los tickets que cumplan las condiciones anteriores
			(v_user_role_id = 1 OR v_user_role_id = 4)
			-- O si es técnico N2 asignado al ticket
			OR latest_tecnico_n2.id_tecnico_n2 = p_id_user
		)
	ORDER BY
		usrtik_initial.date_create_ticket DESC, 
		tik.id_ticket; 	
END;
$BODY$;

ALTER FUNCTION public.getdataticketbyidaccion1(integer)
    OWNER TO postgres;
