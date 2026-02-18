-- FUNCTION: public.getdataclientbyrazon(text)

-- DROP FUNCTION IF EXISTS public.getdataclientbyrazon(text);

CREATE OR REPLACE FUNCTION public.getdataclientbyrazon(
	p_razonsocial text)
    RETURNS TABLE(id_cliente integer, razonsocial text, rif text, tipocomunicacion integer, nombre_tipo_pos text, name_modelopos text, modelopos integer, serial_pos text, desc_pos text, afiliacion text, fechainstalacion date, banco text, direccion_instalacion text, id_estado integer, estado text, id_municipio integer, municipio text, total_presupuesto numeric, total_abonado numeric, deuda numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
 #variable_conflict use_column
 DECLARE
    v_host TEXT;
    v_port TEXT;
    v_dbname TEXT;
    v_username TEXT;
    v_password TEXT;
    v_dblink_conn_string TEXT;
 BEGIN
    -- Obtener las credenciales de la tabla dblink_configs
    SELECT host, port, dbname, username, password
    INTO v_host, v_port, v_dbname, v_username, v_password
    FROM dblink_configs
    WHERE config_name = 'intelipunto_db';

    -- Si no se encuentran las credenciales, lanzar un error
    IF v_host IS NULL THEN
        RAISE EXCEPTION 'Configuración de dblink "intelipunto_db" no encontrada en dblink_configs.';
    END IF;

    -- Construir la cadena de conexión de dblink dinámicamente
    v_dblink_conn_string := format(
        'host=%s port=%s dbname=%s user=%s password=%s',
        v_host, v_port, v_dbname, v_username, v_password
    );

    RETURN QUERY
    SELECT 
        remote.*,
        COALESCE(b.monto_taller, 0) as total_presupuesto,
        COALESCE(p.total_paid, 0) as total_abonado,
        (COALESCE(b.monto_taller, 0) - COALESCE(p.total_paid, 0)) as deuda
    FROM (
        SELECT *
        FROM dblink(
            v_dblink_conn_string,
            format(
                'SELECT cli.id_consecutivo AS id_cliente,
                        cli.razonsocial,
                        cli.coddocumento AS rif,
                        cli.tipopos AS tipocomunicacion,
                        tbl.tipopos AS nombre_tipo_POS,
                        mod.desc_modelo AS name_modelopos,
                        cli.codmodelopos AS modelopos,
                        pos.serialpos AS serial_pos,
                        e.desc_estatus as desc_pos,
                        pos.nroafiliacion AS afiliacion,
                        DATE(pos.fechainstalacion) AS fechainstalacion,
                        tblcod.ibp AS banco,
                        cli.direccion_instalacion,
                        cli.estado AS id_estado,
                        tbles.estado,
                        cli.municipio AS id_municipio,
                        tblmun.municipio
                FROM clie_tblclientepotencial cli
                INNER JOIN tbltipopos tbl ON tbl.codtipo::integer = cli.tipopos::integer
                INNER JOIN tblmodelopos mod ON mod.codmodelo = cli.codmodelopos
                INNER JOIN tblbanco tblcod ON tblcod.codigobanco::integer = cli.codigobanco::integer
                INNER JOIN tblinventariopos pos ON pos.id_cliente::integer = cli.id_consecutivo::integer
                LEFT JOIN tblestados tbles ON tbles.id_estado::integer = cli.estado::integer
                LEFT JOIN tblmunicipios tblmun ON tblmun.id_municipio::integer = cli.municipio::integer
                INNER JOIN tblestatusinteliservices e on e.idestatus=pos.idestatusinteliservices
                WHERE cli.razonsocial ILIKE %L AND pos.idestatusinteliservices NOT IN (0 ,9)
                GROUP BY cli.id_consecutivo, cli.razonsocial, cli.coddocumento, cli.tipopos, tbl.tipopos, mod.desc_modelo, cli.codmodelopos, pos.serialpos, afiliacion, pos.fechainstalacion,
                tblcod.ibp, cli.direccion_instalacion, cli.estado, tbles.estado, cli.municipio, tblmun.municipio, e.desc_estatus'
                ,p_razonsocial
            )
        ) AS remote_table (
            id_cliente integer,
            razonsocial text,
            rif text,
            tipocomunicacion integer,
            nombre_tipo_POS text,
            name_modelopos text,
            modelopos integer,
            serial_pos text,
            desc_pos text,
            afiliacion text,
            fechainstalacion date,
            banco text,
            direccion_instalacion text,
            id_estado integer,
            estado text,
            id_municipio integer,
            municipio text
        )
    ) AS remote
    LEFT JOIN (
        SELECT DISTINCT ON (tk.serial_pos) tk.serial_pos, tk.nro_ticket
        FROM tickets tk
        INNER JOIN users_tickets ut ON tk.id_ticket = ut.id_ticket
        ORDER BY tk.serial_pos, ut.date_create_ticket DESC
    ) t ON remote.serial_pos = t.serial_pos
    LEFT JOIN budgets b ON t.nro_ticket = b.nro_ticket
    LEFT JOIN (
        SELECT nro_ticket, SUM(reference_amount) as total_paid
        FROM payment_records
        GROUP BY nro_ticket
    ) p ON t.nro_ticket = p.nro_ticket;
 END;
 
$BODY$;

ALTER FUNCTION public.getdataclientbyrazon(text)
    OWNER TO postgres;
