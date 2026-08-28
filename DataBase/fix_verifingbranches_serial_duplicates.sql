-- =====================================================================
-- FIX: verifingbranches_serial() devolvia mas de una fila por serial
-- Problema: un mismo serialpos puede tener varios registros en
-- tblinventariopos (Intelipunto) -- p.ej. el POS cambio de cliente con
-- el tiempo y cada asignacion quedo como una fila distinta con el mismo
-- serialpos. La consulta remota del dblink no filtraba a un solo
-- resultado, asi que quien la usa via "LEFT JOIN LATERAL
-- verifingbranches_serial(...) ON TRUE" (getdataticketfinal, usada por
-- Gestion Rosal / pendiente_entrega) terminaba duplicando la fila del
-- ticket una vez por cada asignacion encontrada.
-- Las otras dos funciones que tambien listan tickets
-- (getdataticketbyidaccion, getdataticketbyidaccion1) ya se protegian de
-- esto envolviendo la llamada en un LIMIT 1 / DISTINCT ON -- este fix
-- aplica el mismo criterio (la asignacion con fechainstalacion mas
-- reciente) directamente en la funcion, para que todo el que la use
-- quede protegido.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.verifingbranches_serial(p_rif text)
 RETURNS TABLE(id_estado integer, nombre_estado text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
    -- select * from verifingbranches_serial('P10B7240615000478')
DECLARE
    v_host TEXT;
    v_port TEXT;
    v_dbname TEXT;
    v_username TEXT;
    v_password TEXT;
    v_dblink_conn_string TEXT;
BEGIN
    -- Obtener las credenciales de la tabla dblink_configs para la base de datos 'Intelipunto'
    SELECT host, port, dbname, username, password
    INTO v_host, v_port, v_dbname, v_username, v_password
    FROM dblink_configs
    WHERE config_name = 'intelipunto_db'; -- Usamos la configuración para Intelipunto

    -- Si no se encuentran las credenciales, lanzar una excepción
    IF v_host IS NULL THEN
        RAISE EXCEPTION 'Configuración de dblink "intelipunto_db" no encontrada en dblink_configs.';
    END IF;

    -- Construir la cadena de conexión de dblink dinámicamente
    v_dblink_conn_string := format(
        'host=%s port=%s dbname=%s user=%s password=%s',
        v_host, v_port, v_dbname, v_username, v_password
    );

    RETURN QUERY
    SELECT *
    FROM dblink(
        v_dblink_conn_string, -- ¡Aquí se utiliza la cadena de conexión dinámica!
        format(
            'SELECT DISTINCT ON (i.serialpos)
                        clie.estado,
                        case when inst.d_codetipo = 4 then efs.estado else est.estado end
            FROM clie_tblclientepotencial clie
                        left join tbldirecciones inst
                        on inst.id_afiliado=clie.id_consecutivo::integer and inst.d_codetipo = ''4''
                        left join tblestados efs
                        on efs.id_estado=inst.d_estado::integer
            LEFT JOIN tblestados est ON est.id_estado::INTEGER = clie.estado::INTEGER
                        inner join tblinventariopos i on i.id_cliente::integer=clie.id_consecutivo
            WHERE i.serialpos = %L
            ORDER BY i.serialpos, i.fechainstalacion DESC NULLS LAST, i.fechacarga DESC',
            p_rif
        )
    ) AS remote_table (id_estado integer, nombre_estado TEXT);
END;
$function$;
