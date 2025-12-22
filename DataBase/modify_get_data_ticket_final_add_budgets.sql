-- Script para modificar la función getdataticketfinal() y agregar información de budgets
-- Este script agrega campos para verificar si existe un presupuesto y el id_status_ticket

-- DROP FUNCTION IF EXISTS public.getdataticketfinal();

CREATE OR REPLACE FUNCTION public.getdataticketfinal(
	)
    RETURNS TABLE(
        id_ticket integer, 
        nro_ticket character varying, 
        full_name_tecnico1 text, 
        create_ticket text, 
        name_status_ticket character varying, 
        name_failure character varying, 
        devolution boolean, 
        full_name_coord text, 
        fecha_envio_coordinador text, 
        name_status_payment character varying, 
        full_name_tecnico2 text, 
        fecha_assignado_al_tecnico2 text, 
        envio_a_taller text, 
        name_process_ticket character varying, 
        status_taller character varying, 
        name_accion_ticket character varying, 
        fecha_llaves_enviada text, 
        fecha_carga_llaves text, 
        id_status_key boolean, 
        name_status_domiciliacion character, 
        document_types_available text, 
        id_level_failure text, 
        rif character varying, 
        serial_pos character varying, 
        fecha_envio_destino text, 
        razonsocial_cliente character varying, 
        fecha_instalacion text, 
        estatus_inteliservices character varying, 
        confirmcoord boolean, 
        confirmtecn boolean, 
        reentry_lab boolean, 
        garantia_instalacion boolean, 
        garantia_reingreso boolean, 
        fecha_cierre_anterior text, 
        nombre_estado_cliente character varying, 
        name_region character varying, 
        document_url text, 
        document_type character varying, 
        original_filename text, 
        comment_devolution text, 
        confirmrosal boolean,
        -- NUEVOS CAMPOS AGREGADOS:
        id_budget integer,
        has_budget boolean,
        id_status_ticket integer,
        pdf_path_presupuesto character varying
    ) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
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
    -- Obtener las credenciales para la base de datos 'Intelipunto'
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
    SELECT
        tik.id_ticket,
        tik.nro_ticket,
        CONCAT(usr_n1.name, ' ', usr_n1.surname) AS full_name_tecnico1,
        TO_CHAR(usrtik_initial.date_create_ticket, 'DD-MM-YYYY') AS create_ticket,
        sttik.name_status_ticket,
        fail.name_failure,
		tik.devolution, 
        CONCAT(usr_coord.name, ' ', usr_coord.surname) AS full_name_coord,
        TO_CHAR(usrtik_initial.date_sendcoordinator, 'DD-MM-YYYY') AS Fecha_envio_coordinador,
        stpay.name_status_payment,
        COALESCE(CONCAT(usr_n2_latest.name, ' ', usr_n2_latest.surname), 'No Asignado') AS full_name_tecnico2,
        TO_CHAR(latest_tecnico_n2.date_assign_tec2, 'DD-MM-YYYY') AS Fecha_assignado_al_tecnico2,
        TO_CHAR(tik.date_send_lab, 'DD-MM-YYYY') AS Envio_a_taller,
        prtik.name_process_ticket,
        stlab.name_status_lab AS status_taller,
        acctik.name_accion_ticket,
        TO_CHAR(tik.date_sendkey, 'DD-MM-YYYY') AS fecha_llaves_enviada,
        TO_CHAR(tik.date_receivekey, 'DD-MM-YYYY') AS fecha_carga_llaves,
        tik.id_status_key,
        stdom.name_status_domiciliacion,
        adj_agg.document_types_available,
        CASE
            WHEN tik.id_level_failure = 1 THEN 'Nivel 1'
            WHEN tik.id_level_failure = 2 THEN 'Nivel 2'
            ELSE CAST(tik.id_level_failure AS TEXT)
        END AS id_level_failure,
        tik.rif,
        tik.serial_pos,
        TO_CHAR(tik.date_send_fromrosal, 'DD-MM-YYYY') AS Fecha_envio_destino,
        t1.razonsocial::varchar AS razonsocial_cliente,
        TO_CHAR(t1.fechainstalacion, 'DD-MM-YYYY') AS fecha_instalacion,
        t1.desc_estatus AS estatus_inteliservices,
        tik.confirmcoord,
        tik.confirmtecn,
		tikstlab.reentry_lab,
        (t1.fechainstalacion IS NOT NULL AND t1.fechainstalacion >= (v_current_date - INTERVAL '6 months')) AS garantia_instalacion,
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
        TO_CHAR(
            (SELECT GREATEST(
                tik.date_end_ticket,
                (SELECT fecha_cierre FROM dblink(
                    v_dblink_conn_string_postventa,
                    'SELECT fecha_cierre FROM tk WHERE serialpos = ' || quote_literal(tik.serial_pos) || ' ORDER BY fecha_cierre DESC LIMIT 1'
                ) AS t_rem(fecha_cierre DATE))
            )), 'DD-MM-YYYY'
        ) AS fecha_cierre_anterior,
        -- SOLO ESTA LÍNEA CAMBIADA: CAST a character varying
        vb.nombre_estado::character varying AS nombre_estado_cliente,
        -- REGIÓN DEL CLIENTE usando la función verifingbranches
        COALESCE(vb.nombre_estado::character varying, 'Sin Región'::character varying) AS name_region,
        adj_doc.file_path AS document_url,
        adj_doc.document_type,
        adj_doc.original_filename,
        CASE 
            WHEN tik.id_accion_ticket = 12 THEN COALESCE(tik.comment_devolution, '')
            ELSE ''
        END AS comment_devolution,
		tik.confirmrosal,
        -- NUEVOS CAMPOS AGREGADOS:
        bg.id_budget,
        CASE WHEN bg.id_budget IS NOT NULL THEN true ELSE false END as has_budget,
        tik.id_status_ticket,
        bg.pdf_path as pdf_path_presupuesto
    FROM
        tickets tik
    INNER JOIN status_tickets sttik ON sttik.id_status_ticket = tik.id_status_ticket
    INNER JOIN process_tickets prtik ON prtik.id_process_ticket = tik.id_process_ticket
    INNER JOIN accions_tickets acctik ON acctik.id_accion_ticket = tik.id_accion_ticket
    INNER JOIN tickets_failures tikfail ON tikfail.id_ticket = tik.id_ticket
    INNER JOIN failures fail ON fail.id_failure = tikfail.id_failure
    INNER JOIN status_payments stpay ON stpay.id_status_payment = tik.id_status_payment
    LEFT JOIN tickets_status_domiciliacion tikstdom ON tikstdom.id_ticket = tik.id_ticket
    LEFT JOIN status_domiciliacion stdom ON stdom.id_status_domiciliacion = tikstdom.id_status_domiciliacion
    LEFT JOIN tickets_status_lab tikstlab ON tikstlab.id_ticket = tik.id_ticket
    LEFT JOIN status_lab stlab ON stlab.id_status_lab = tikstlab.id_status_lab
    -- NUEVO JOIN AGREGADO: LEFT JOIN con budgets
    LEFT JOIN budgets bg ON bg.nro_ticket = tik.nro_ticket

    INNER JOIN users_tickets usrtik_initial
        ON usrtik_initial.id_ticket = tik.id_ticket
        AND usrtik_initial.id_user_ticket = (
            SELECT MIN(ut_min.id_user_ticket)
            FROM users_tickets ut_min
            WHERE ut_min.id_ticket = tik.id_ticket
        )
    INNER JOIN users usr_n1 ON usr_n1.id_user = usrtik_initial.id_tecnico_n1
    INNER JOIN users usr_coord ON usr_coord.id_user = usrtik_initial.id_coordinador

    LEFT JOIN LATERAL (
        SELECT STRING_AGG(adj.document_type, ', ') AS document_types_available
        FROM archivos_adjuntos adj
        WHERE adj.nro_ticket = tik.nro_ticket
        ) AS adj_agg ON TRUE

    LEFT JOIN LATERAL (
        SELECT 
            adj.file_path,
            adj.document_type,
            adj.original_filename
        FROM archivos_adjuntos adj
        WHERE adj.nro_ticket = tik.nro_ticket
            AND adj.document_type = 'Envio_Destino'
        ORDER BY adj.uploaded_at DESC
        LIMIT 1
    ) AS adj_doc ON TRUE

    LEFT JOIN LATERAL (
        SELECT ut.id_tecnico_n2, ut.date_assign_tec2
        FROM users_tickets ut
        WHERE ut.id_ticket = tik.id_ticket
            AND ut.id_tecnico_n2 IS NOT NULL
        ORDER BY ut.date_assign_tec2 DESC, ut.id_user_ticket DESC
        LIMIT 1
    ) AS latest_tecnico_n2 ON TRUE
    LEFT JOIN users usr_n2_latest ON usr_n2_latest.id_user = latest_tecnico_n2.id_tecnico_n2

    -- DBLINK para obtener datos del cliente (razón social, fecha instalación, estatus)
    LEFT JOIN dblink(
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
            invt.fechainstalacion DESC,
            stintel.desc_estatus DESC'
    ) AS t1(razonsocial name, remote_rif text, fechainstalacion date, desc_estatus character varying)
    ON tik.rif = t1.remote_rif

    -- USAR LA MISMA FUNCIÓN QUE getdataticketbyidaccion
    LEFT JOIN LATERAL public.verifingbranches_serial(tik.serial_pos) AS vb ON TRUE

    WHERE
        -- NUEVA CONDICIÓN: id_status_ticket debe ser distinto a 3
        tik.id_status_ticket != 3
        AND (tik.id_accion_ticket = 14 OR tik.id_accion_ticket = 9 OR tik.id_accion_ticket = 8 OR tik.id_accion_ticket = 16 OR tik.id_accion_ticket = 17 OR tik.id_accion_ticket = 12)
    ORDER BY
        usrtik_initial.date_create_ticket DESC;
END;
$BODY$;

ALTER FUNCTION public.getdataticketfinal()
    OWNER TO postgres;
