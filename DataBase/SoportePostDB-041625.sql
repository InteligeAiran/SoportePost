PGDMP                         }            SoportePost    15.12    15.12 �    l           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            m           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            n           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            o           1262    19193    SoportePost    DATABASE     �   CREATE DATABASE "SoportePost" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Venezuela.1252';
    DROP DATABASE "SoportePost";
                postgres    false                        3079    19609    dblink 	   EXTENSION     :   CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;
    DROP EXTENSION dblink;
                   false            p           0    0    EXTENSION dblink    COMMENT     _   COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';
                        false    2                        3079    20130    lo 	   EXTENSION     6   CREATE EXTENSION IF NOT EXISTS lo WITH SCHEMA public;
    DROP EXTENSION lo;
                   false            q           0    0    EXTENSION lo    COMMENT     7   COMMENT ON EXTENSION lo IS 'Large Object maintenance';
                        false    3            U           1255    21110 ;   check_password_exists(character varying, character varying)    FUNCTION     `  CREATE FUNCTION public.check_password_exists(p_username character varying, p_password character varying) RETURNS TABLE(username character varying, password character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.username, u.password
    FROM users u
    WHERE u.username = p_username AND u.password = p_password;
END;
$$;
 h   DROP FUNCTION public.check_password_exists(p_username character varying, p_password character varying);
       public          postgres    false            T           1255    21109 (   check_username_exists(character varying)    FUNCTION     �   CREATE FUNCTION public.check_username_exists(p_username character varying) RETURNS TABLE(username character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.username
    FROM users u
    WHERE u.username = p_username;
END;
$$;
 J   DROP FUNCTION public.check_username_exists(p_username character varying);
       public          postgres    false            Z           1255    21123 %   get_failed_attempts_by_username(text)    FUNCTION       CREATE FUNCTION public.get_failed_attempts_by_username(p_username text) RETURNS TABLE(trying_failedpassw integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.trying_failedpassw
    FROM public.users u
    WHERE u.username = p_username;
END;
$$;
 G   DROP FUNCTION public.get_failed_attempts_by_username(p_username text);
       public          postgres    false            L           1255    21129    get_failures_level_1()    FUNCTION     ;  CREATE FUNCTION public.get_failures_level_1() RETURNS TABLE(id_failure integer, name_failure character varying, id_failure_level integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_failure, f.name_failure, f.id_failure_level
    FROM failures f
    WHERE f.id_failure_level = 1;
END;
$$;
 -   DROP FUNCTION public.get_failures_level_1();
       public          postgres    false            K           1255    21128    get_failures_level_2()    FUNCTION     ;  CREATE FUNCTION public.get_failures_level_2() RETURNS TABLE(id_failure integer, name_failure character varying, id_failure_level integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_failure, f.name_failure, f.id_failure_level
    FROM failures f
    WHERE f.id_failure_level = 2;
END;
$$;
 -   DROP FUNCTION public.get_failures_level_2();
       public          postgres    false            H           1255    21125    get_install_day_pos(text)    FUNCTION        CREATE FUNCTION public.get_install_day_pos(p_serialpos text) RETURNS TABLE(inst_ticket date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT (remote_table.inst_ticket)::DATE
    FROM dblink('host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
                  'SELECT inv.fechainstalacion AS inst_ticket
                   FROM tblinventariopos inv
                   WHERE inv.serialpos = ''' || p_serialpos || '''')
    AS remote_table (inst_ticket date);
END;
$$;
 <   DROP FUNCTION public.get_install_day_pos(p_serialpos text);
       public          postgres    false            I           1255    21124    get_last_date_ticket(text)    FUNCTION     `  CREATE FUNCTION public.get_last_date_ticket(p_serialpos text) RETURNS TABLE(ult_ticket date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT (remote_table.ult_ticket)::DATE
    FROM dblink('host=127.0.0.1 port=5432 dbname=soporte_postventa user=postgres password=Airan1234',
                  'SELECT inv.fecha_cierre AS ult_ticket
                   FROM tk inv
                   WHERE inv.serialpos = ''' || p_serialpos || '''
                   ORDER BY inv.fecha_cierre DESC
                   LIMIT 1')
    AS remote_table (ult_ticket date); -- Asumo timestamp with time zone
END;
$$;
 =   DROP FUNCTION public.get_last_date_ticket(p_serialpos text);
       public          postgres    false            S           1255    21103 =   get_user_by_credentials(character varying, character varying)    FUNCTION     �  CREATE FUNCTION public.get_user_by_credentials(p_username character varying, p_password character varying) RETURNS TABLE(id_user integer, usuario character varying, clave character varying, cedula character varying, nombres character varying, apellidos character varying, correo character varying, codtipousuario integer, name_rol character varying, status integer)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT usr.id_user,
           usr.username AS usuario,
           usr.password AS clave,
           usr.national_id AS cedula,
           usr.name AS nombres,
           usr.surname AS apellidos,
           usr.email AS correo,
           usr.id_rolusr AS codtipousuario,
           rol.name_rol AS name_rol,
           usr.id_statususr AS status
    FROM users usr
    INNER JOIN roles rol ON usr.id_rolusr = rol.id_rolusr
    WHERE usr.username = p_username AND usr.password = p_password;
END;
$$;
 j   DROP FUNCTION public.get_user_by_credentials(p_username character varying, p_password character varying);
       public          postgres    false            V           1255    21115 $   get_user_by_email(character varying)    FUNCTION     �  CREATE FUNCTION public.get_user_by_email(p_email character varying) RETURNS TABLE(email character varying, coddocumento character varying, id_user integer, nombre_completo character varying)
    LANGUAGE plpgsql
    AS $$
	BEGIN
	    RETURN QUERY
	    SELECT
	        u.email,
	        u.national_id AS coddocumento,
	        u.id_user,
	        CAST(CONCAT(u.name, ' ', u.surname) AS VARCHAR) AS nombre_completo
	    FROM
	        users u
	    WHERE
	        u.email = p_email;
	END;
	$$;
 C   DROP FUNCTION public.get_user_by_email(p_email character varying);
       public          postgres    false            J           1255    21126    getcoordinator()    FUNCTION     �   CREATE FUNCTION public.getcoordinator() RETURNS TABLE(id_user integer, full_name text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.id_user, CONCAT(u.name, ' ', u.surname)
    FROM users u
    WHERE u.id_rolusr = 4;
END;
$$;
 '   DROP FUNCTION public.getcoordinator();
       public          postgres    false            @           1255    20886    getdataclientbyrif(text)    FUNCTION     :  CREATE FUNCTION public.getdataclientbyrif(p_rif text) RETURNS TABLE(id_cliente integer, razonsocial text, rif text, tipocomunicacion integer, nombre_tipo_pos text, name_modelopos text, modelopos integer, serial_pos text, afiliacion text, fechainstalacion date, banco text, direccion_instalacion text, id_estado integer, estado text, id_municipio integer, municipio text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dblink(
        'host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
        format(        
                'SELECT cli.id_consecutivo AS id_cliente,
                       cli.razonsocial,
                       cli.coddocumento AS rif,
                       cli.tipopos AS tipocomunicacion,
                       tbl.tipopos AS nombre_tipo_POS,
                       mod.desc_modelo AS name_modelopos,
                       cli.codmodelopos AS modelopos,
                       pos.serialpos AS serial_pos,
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
                WHERE cli.coddocumento = %L
                GROUP BY cli.id_consecutivo, cli.razonsocial, cli.coddocumento, cli.tipopos, tbl.tipopos, mod.desc_modelo, cli.codmodelopos, pos.serialpos, afiliacion, pos.fechainstalacion,
                tblcod.ibp, cli.direccion_instalacion, cli.estado, tbles.estado, cli.municipio, tblmun.municipio'
            ,p_rif
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
        afiliacion text,
        fechainstalacion date,
        banco text,
        direccion_instalacion text,
        id_estado integer,
        estado text,
        id_municipio integer,
        municipio text
    );
END;
$$;
 5   DROP FUNCTION public.getdataclientbyrif(p_rif text);
       public          postgres    false            G           1255    20890    getinstalldate()    FUNCTION     �   CREATE FUNCTION public.getinstalldate() RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    user_count bigint;
BEGIN
    SELECT count(*) INTO user_count
    FROM users;
    RETURN user_count;
END;
$$;
 '   DROP FUNCTION public.getinstalldate();
       public          postgres    false            Q           1255    20966    getpassworduser(text, text)    FUNCTION     ^  CREATE FUNCTION public.getpassworduser(p_username text, p_password text) RETURNS TABLE(username character varying, password character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.username, u.password
    FROM public.users u
    WHERE u.username = p_username
      AND u.password = p_password;
END;
$$;
 H   DROP FUNCTION public.getpassworduser(p_username text, p_password text);
       public          postgres    false            B           1255    20893    getposserialsbyrif(text)    FUNCTION     B  CREATE FUNCTION public.getposserialsbyrif(p_rif text) RETURNS TABLE(serial text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dblink(
        'host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
        format(        
                'SELECT tbl.serialpos as serial FROM clie_tblclientepotencial inv 
					 INNER JOIN tblinventariopos tbl ON tbl.id_cliente::integer = inv.id_consecutivo 
           wHERE inv.coddocumento = %L'
            ,p_rif
        )
    ) AS remote_table (p_rif TEXT);
END;
$$;
 5   DROP FUNCTION public.getposserialsbyrif(p_rif text);
       public          postgres    false            E           1255    20898    getstateregionbyid(integer)    FUNCTION     �  CREATE FUNCTION public.getstateregionbyid(p_id_state integer) RETURNS TABLE(id_state integer, name_state character varying, id_region integer, name_region character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT est.id_state,
           est.name_state,
           reg.id_region,
           reg.name_region
    FROM states est
    INNER JOIN regions reg ON reg.id_region = est.id_region
    WHERE est.id_state = p_id_state;
END;
$$;
 =   DROP FUNCTION public.getstateregionbyid(p_id_state integer);
       public          postgres    false            P           1255    20965     getuserbycredentials(text, text)    FUNCTION     �  CREATE FUNCTION public.getuserbycredentials(p_username text, p_password text) RETURNS TABLE(id_user integer, usuario character varying, clave character varying, cedula character varying, nombres character varying, apellidos character varying, correo character varying, codtipousuario integer, status integer)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id_user,
        u.username AS usuario,
        u.password AS clave,
        u.national_id AS cedula,
        u.name AS nombres,
        u.surname AS apellidos,
        u.email AS correo,
        u.id_rolusr AS codtipousuario,
        u.id_statususr AS status
    FROM public.users u
    WHERE u.username = p_username
      AND u.password = p_password;
END;
$$;
 M   DROP FUNCTION public.getuserbycredentials(p_username text, p_password text);
       public          postgres    false            R           1255    20967    getusername(text)    FUNCTION     �   CREATE FUNCTION public.getusername(p_username text) RETURNS TABLE(username character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.username
    FROM public.users u
    WHERE u.username = p_username;
END;
$$;
 3   DROP FUNCTION public.getusername(p_username text);
       public          postgres    false            Y           1255    21121 ~   insert_session_user(text, integer, timestamp without time zone, text, character varying, integer, timestamp without time zone) 	   PROCEDURE     :  CREATE PROCEDURE public.insert_session_user(IN p_id_session text, IN p_id_user integer, IN p_start_date timestamp without time zone, IN p_user_agent text, IN p_ip_address character varying, IN p_active integer, IN p_expiry_time timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO sessions_users (id_session, id_user, start_date, user_agent, ip_address, active, expiry_time)
    VALUES (p_id_session, p_id_user, p_start_date, p_user_agent, p_ip_address, p_active, p_expiry_time);

    COMMIT; -- Asegura que la inserción se guarde
END;
$$;
    DROP PROCEDURE public.insert_session_user(IN p_id_session text, IN p_id_user integer, IN p_start_date timestamp without time zone, IN p_user_agent text, IN p_ip_address character varying, IN p_active integer, IN p_expiry_time timestamp without time zone);
       public          postgres    false            4           1255    20902    insertticketfailure(integer)    FUNCTION     �   CREATE FUNCTION public.insertticketfailure(p_id_failure integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO tickets_failures (id_failure)
    VALUES (p_id_failure);
END;
$$;
 @   DROP FUNCTION public.insertticketfailure(p_id_failure integer);
       public          postgres    false            \           1255    21140 X   save_data_failures2(text, integer, integer, integer, integer, integer, text, text, text)    FUNCTION     O  CREATE FUNCTION public.save_data_failures2(p_serial text, p_descripcion integer, p_nivel_falla integer, p_id_status_payment integer, p_coordinador integer, p_id_user integer, p_ruta_base_datos text DEFAULT NULL::text, p_ruta_exo text DEFAULT NULL::text, p_ruta_anticipo text DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_archivo_base_datos BYTEA := NULL;
    v_archivo_exo BYTEA := NULL;
    v_archivo_anticipo BYTEA := NULL;
BEGIN
    -- Leer archivo de base de datos si la ruta es proporcionada
    IF p_ruta_base_datos IS NOT NULL THEN
        BEGIN
            v_archivo_base_datos := encode(pg_read_binary_file(p_ruta_base_datos), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de base de datos: %', SQLERRM;
            v_archivo_base_datos := NULL;
        END;
    END IF;

    -- Leer archivo de exoneración si la ruta es proporcionada
    IF p_ruta_exo IS NOT NULL THEN
        BEGIN
            v_archivo_exo := encode(pg_read_binary_file(p_ruta_exo), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de exoneración: %', SQLERRM;
            v_archivo_exo := NULL;
        END;
    END IF;

    -- Leer archivo de anticipo si la ruta es proporcionada
    IF p_ruta_anticipo IS NOT NULL THEN
        BEGIN
            v_archivo_anticipo := encode(pg_read_binary_file(p_ruta_anticipo), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de anticipo: %', SQLERRM;
            v_archivo_anticipo := NULL;
        END;
    END IF;

    -- Llamar a la función (asumo que existe una función llamada SaveDataFalla2 en tu base de datos)
    PERFORM savedatafalla2(p_serial, p_coordinador, p_descripcion, p_nivel_falla, p_id_status_payment, p_id_user, v_archivo_base_datos, v_archivo_exo, v_archivo_anticipo);

    RETURN TRUE; -- Asumimos éxito si la función PERFORM no lanza una excepción

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al guardar los datos de falla 2: %', SQLERRM;
    RETURN FALSE;
END;
$$;
 �   DROP FUNCTION public.save_data_failures2(p_serial text, p_descripcion integer, p_nivel_falla integer, p_id_status_payment integer, p_coordinador integer, p_id_user integer, p_ruta_base_datos text, p_ruta_exo text, p_ruta_anticipo text);
       public          postgres    false            [           1255    21139 R   save_data_failures2(text, text, integer, integer, text, integer, text, text, text)    FUNCTION     I  CREATE FUNCTION public.save_data_failures2(p_serial text, p_descripcion text, p_nivel_falla integer, p_id_status_payment integer, p_coordinador text, p_id_user integer, p_ruta_base_datos text DEFAULT NULL::text, p_ruta_exo text DEFAULT NULL::text, p_ruta_anticipo text DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_archivo_base_datos BYTEA := NULL;
    v_archivo_exo BYTEA := NULL;
    v_archivo_anticipo BYTEA := NULL;
BEGIN
    -- Leer archivo de base de datos si la ruta es proporcionada
    IF p_ruta_base_datos IS NOT NULL THEN
        BEGIN
            v_archivo_base_datos := encode(pg_read_binary_file(p_ruta_base_datos), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de base de datos: %', SQLERRM;
            v_archivo_base_datos := NULL;
        END;
    END IF;

    -- Leer archivo de exoneración si la ruta es proporcionada
    IF p_ruta_exo IS NOT NULL THEN
        BEGIN
            v_archivo_exo := encode(pg_read_binary_file(p_ruta_exo), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de exoneración: %', SQLERRM;
            v_archivo_exo := NULL;
        END;
    END IF;

    -- Leer archivo de anticipo si la ruta es proporcionada
    IF p_ruta_anticipo IS NOT NULL THEN
        BEGIN
            v_archivo_anticipo := encode(pg_read_binary_file(p_ruta_anticipo), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de anticipo: %', SQLERRM;
            v_archivo_anticipo := NULL;
        END;
    END IF;

    -- Llamar a la función (asumo que existe una función llamada SaveDataFalla2 en tu base de datos)
    PERFORM savedatafalla2(p_serial, p_coordinador, p_descripcion, p_nivel_falla, p_id_status_payment, p_id_user, v_archivo_base_datos, v_archivo_exo, v_archivo_anticipo);

    RETURN TRUE; -- Asumimos éxito si la función PERFORM no lanza una excepción

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al guardar los datos de falla 2: %', SQLERRM;
    RETURN FALSE;
END;
$$;
 �   DROP FUNCTION public.save_data_failures2(p_serial text, p_descripcion text, p_nivel_falla integer, p_id_status_payment integer, p_coordinador text, p_id_user integer, p_ruta_base_datos text, p_ruta_exo text, p_ruta_anticipo text);
       public          postgres    false            M           1255    21130 R   save_data_failures2(text, text, text, integer, integer, integer, text, text, text)    FUNCTION     I  CREATE FUNCTION public.save_data_failures2(p_serial text, p_coordinador text, p_descripcion text, p_nivel_falla integer, p_id_status_payment integer, p_id_user integer, p_ruta_base_datos text DEFAULT NULL::text, p_ruta_exo text DEFAULT NULL::text, p_ruta_anticipo text DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_archivo_base_datos BYTEA := NULL;
    v_archivo_exo BYTEA := NULL;
    v_archivo_anticipo BYTEA := NULL;
BEGIN
    -- Leer archivo de base de datos si la ruta es proporcionada
    IF p_ruta_base_datos IS NOT NULL THEN
        BEGIN
            v_archivo_base_datos := encode(pg_read_binary_file(p_ruta_base_datos), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de base de datos: %', SQLERRM;
            v_archivo_base_datos := NULL;
        END;
    END IF;

    -- Leer archivo de exoneración si la ruta es proporcionada
    IF p_ruta_exo IS NOT NULL THEN
        BEGIN
            v_archivo_exo := encode(pg_read_binary_file(p_ruta_exo), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de exoneración: %', SQLERRM;
            v_archivo_exo := NULL;
        END;
    END IF;

    -- Leer archivo de anticipo si la ruta es proporcionada
    IF p_ruta_anticipo IS NOT NULL THEN
        BEGIN
            v_archivo_anticipo := encode(pg_read_binary_file(p_ruta_anticipo), 'base64')::BYTEA;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error al leer el archivo de anticipo: %', SQLERRM;
            v_archivo_anticipo := NULL;
        END;
    END IF;

    -- Llamar a la función (asumo que existe una función llamada SaveDataFalla2 en tu base de datos)
    PERFORM savedatafalla2(p_serial, p_coordinador, p_descripcion, p_nivel_falla, p_id_status_payment, p_id_user, v_archivo_base_datos, v_archivo_exo, v_archivo_anticipo);

    RETURN TRUE; -- Asumimos éxito si la función PERFORM no lanza una excepción

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al guardar los datos de falla 2: %', SQLERRM;
    RETURN FALSE;
END;
$$;
 �   DROP FUNCTION public.save_data_failures2(p_serial text, p_coordinador text, p_descripcion text, p_nivel_falla integer, p_id_status_payment integer, p_id_user integer, p_ruta_base_datos text, p_ruta_exo text, p_ruta_anticipo text);
       public          postgres    false            F           1255    20899 .   savedatafalla(text, integer, integer, integer)    FUNCTION     �  CREATE FUNCTION public.savedatafalla(p_serial_pos text, p_id_failure integer, p_id_level_failure integer, p_id_user integer) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO tickets (
        date_create_ticket,
        id_user,
        serial_pos,
        id_status_ticket,
        id_process_ticket,
        id_accion_ticket,
        id_failure,
        id_level_failure
    )
    VALUES (
        NOW(),
        p_id_user, -- Usar el parámetro recibido
        p_serial_pos,
        1,
        1,
        2,
        p_id_failure,
        p_id_level_failure
    );

    RETURN TRUE;

EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
 |   DROP FUNCTION public.savedatafalla(p_serial_pos text, p_id_failure integer, p_id_level_failure integer, p_id_user integer);
       public          postgres    false            O           1255    20942 V   savedatafalla2(text, integer, integer, integer, integer, integer, bytea, bytea, bytea)    FUNCTION       CREATE FUNCTION public.savedatafalla2(p_serial_pos text, p_id_user_coord integer, p_id_failure integer, p_id_level_failure integer, p_id_status_payment integer, p_id_user integer, p_downl_send_to_rosal bytea, p_downl_exoneration bytea, p_downl_payment bytea) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO tickets (
        id_status_ticket,
        id_user,
        id_process_ticket,
        id_accion_ticket,
        id_status_payment,
        date_create_ticket,
        serial_pos,
        id_user_coord,
        id_failure,
        id_level_failure,
        downl_send_to_rosal,
        downl_exoneration,
        downl_payment
    )
    VALUES (
        1,
        p_id_user,
        1,
        1,
        p_id_status_payment,
        NOW(),
        p_serial_pos,
        p_id_user_coord,
        p_id_failure,
        p_id_level_failure,
        p_downl_send_to_rosal,
        p_downl_exoneration,
        p_downl_payment
    );

    RETURN TRUE;

EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
   DROP FUNCTION public.savedatafalla2(p_serial_pos text, p_id_user_coord integer, p_id_failure integer, p_id_level_failure integer, p_id_status_payment integer, p_id_user integer, p_downl_send_to_rosal bytea, p_downl_exoneration bytea, p_downl_payment bytea);
       public          postgres    false            N           1255    20912    searchserial(text)    FUNCTION     �  CREATE FUNCTION public.searchserial(p_serial text) RETURNS TABLE(serial_pos text, id_cliente integer, numero_terminal text, nombre_tipo_comunicacion text, numero_sim text, usuario_carga text, estatus_pos text, serial_mifi text, usuario_carga2 text, fecha_carga date, usuario_parametros text, fecha_parametros date, modelo integer)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dblink(
        'host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
        format(        
                'SELECT
            inv.serialpos AS Serial_POS,
            inv.id_cliente::integer AS ID_cliente,
            inv.numterminal AS Numero_Terminal,
            tbl.tipopos AS nombre_tipo_POS,
            inv.numsim AS Numero_SIM,
            inv.usuariocarga AS Usuario_Carga,
            inte.desc_estatus AS Estatus_POS,
            inv.serialmifi AS Serial_Mifi,
            inv.usuariocarga AS Usuario_Carga2,
            DATE(inv.fechacarga) AS Fecha_Carga, -- Extrae solo la fecha
            inv.usuarioparametro AS Usuario_Parametro,
            DATE(inv.fechaparametro) AS Fecha_Parametro, -- Extrae solo la fecha
            clie.codmodelopos::integer as modelo
        FROM
            tblinventariopos inv
        INNER JOIN
            tblestatusinteliservices inte ON inte.idestatus = inv.idestatusinteliservices
        INNER JOIN
            clie_tblclientepotencial clie ON clie.id_consecutivo::integer = inv.id_cliente::integer
		INNER JOIN 
            tblmodelopos mod ON mod.codmodelo = clie.codmodelopos
        INNER JOIN 
		 	tbltipopos tbl ON tbl.codtipo::integer = clie.tipopos::integer

        WHERE
            inv.serialpos = %L'
            ,p_serial
        )
    ) AS remote_table (
       Serial_POS text,
                ID_cliente integer,
                Numero_Terminal text,
                nombre_tipo_comunicacion text,
                Numero_SIM text,
                Usuario_Carga text,
                Estatus_POS text,
                Serial_Mifi text,
                Usuario_Carga2 text,
                Fecha_Carga date,
                Usuario_Parametros text,
                Fecha_Parametros date,
                modelo integer
    );
END;
$$;
 2   DROP FUNCTION public.searchserial(p_serial text);
       public          postgres    false            C           1255    20894    searchtypepos(text)    FUNCTION     �  CREATE FUNCTION public.searchtypepos(p_serial text) RETURNS TABLE(codmodelopos text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dblink(
        'host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
        format(        
                'SELECT cli.codmodelopos::integer as modelo FROM clie_tblclientepotencial cli
         INNER JOIN tblmodelopos mod ON mod.codmodelo = cli.codmodelopos
         INNER JOIN tblinventariopos inv ON inv.id_cliente::integer = cli.id_consecutivo::integer WHERE inv.serialpos  = %L'
            ,p_serial
        )
    ) AS remote_table (codmodelopos TEXT);
END;
$$;
 3   DROP FUNCTION public.searchtypepos(p_serial text);
       public          postgres    false            W           1255    21119 %   trying_failedpassw(character varying)    FUNCTION     �  CREATE FUNCTION public.trying_failedpassw(p_username character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_trying_failedpassw INTEGER; -- Cambiamos el nombre de la variable
BEGIN
    SELECT trying_failedpassw
    INTO v_trying_failedpassw -- Usamos el nuevo nombre de la variable
    FROM users
    WHERE username = p_username;

    RETURN v_trying_failedpassw; -- Devolvemos el nuevo nombre de la variable
END;
$$;
 G   DROP FUNCTION public.trying_failedpassw(p_username character varying);
       public          postgres    false            X           1255    21120 )   update_user_password_by_email(text, text) 	   PROCEDURE     5  CREATE PROCEDURE public.update_user_password_by_email(IN p_email text, IN p_new_password text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE public.users
    SET password = p_new_password
    WHERE email = p_email;

    -- Opcional: Puedes agregar una verificación para ver si se actualizó alguna fila
    -- GET DIAGNOSTICS rows_updated = ROW_COUNT;
    -- IF rows_updated = 0 THEN
    --     RAISE NOTICE 'No se encontró ningún usuario con el correo electrónico: %', p_email;
    -- END IF;

    COMMIT; -- Asegura que la actualización se guarde
END;
$$;
 ^   DROP PROCEDURE public.update_user_password_by_email(IN p_email text, IN p_new_password text);
       public          postgres    false            D           1255    20896    verifingbranches(text)    FUNCTION     �  CREATE FUNCTION public.verifingbranches(p_rif text) RETURNS TABLE(id_estado text, nombre_estado text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dblink(
        'host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
        format(        
                'SELECT clie.estado, est.estado
                FROM clie_tblclientepotencial clie
                INNER JOIN tblestados est ON est.id_estado::INTEGER = clie.estado::INTEGER
                WHERE clie.coddocumento = %L'
            ,p_rif
        )
    ) AS remote_table (id_estado TEXT, nombre_estado TEXT);
END;
$$;
 3   DROP FUNCTION public.verifingbranches(p_rif text);
       public          postgres    false            A           1255    20891    verifingclient(text)    FUNCTION     q  CREATE FUNCTION public.verifingclient(p_rif text) RETURNS TABLE(id_cliente integer, rif text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM dblink(
        'host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
        format(        
                'SELECT inv.id_consecutivo AS id_cliente, CAST(inv.coddocumento AS TEXT) AS rif FROM clie_tblclientepotencial inv 
                    WHERE inv.coddocumento = %L'
            ,p_rif
        )
    ) AS remote_table (
                    id_cliente INTEGER,
                    rif TEXT
    );
END;
$$;
 1   DROP FUNCTION public.verifingclient(p_rif text);
       public          postgres    false                       1259    21046    accion    TABLE     �   CREATE TABLE public.accion (
    id_accion integer NOT NULL,
    name_accion character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.accion;
       public         heap    postgres    false                       1259    21045    accion_id_accion_seq    SEQUENCE     �   CREATE SEQUENCE public.accion_id_accion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.accion_id_accion_seq;
       public          postgres    false    264            r           0    0    accion_id_accion_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.accion_id_accion_seq OWNED BY public.accion.id_accion;
          public          postgres    false    263            �            1259    19775    accions_tickets    TABLE     }   CREATE TABLE public.accions_tickets (
    id_accion_ticket integer NOT NULL,
    name_accion_ticket character varying(50)
);
 #   DROP TABLE public.accions_tickets;
       public         heap    postgres    false            �            1259    19316    areas    TABLE     b   CREATE TABLE public.areas (
    id_area integer NOT NULL,
    name_area character varying(100)
);
    DROP TABLE public.areas;
       public         heap    postgres    false            �            1259    19351    assignments_tickets    TABLE     �   CREATE TABLE public.assignments_tickets (
    id_assginment_ticket integer NOT NULL,
    id_ticket integer,
    id_coordinator integer,
    id_tecnico integer,
    date_sendcoordinator date,
    note character varying(200),
    date_assign_tec2 date
);
 '   DROP TABLE public.assignments_tickets;
       public         heap    postgres    false            �            1259    19267    branches    TABLE     �   CREATE TABLE public.branches (
    id_branches integer NOT NULL,
    name_branches character varying(100),
    id_region integer
);
    DROP TABLE public.branches;
       public         heap    postgres    false                       1259    20969    departments    TABLE     �   CREATE TABLE public.departments (
    id_department integer NOT NULL,
    name_department character varying(100),
    id_coordinador_rol integer
);
    DROP TABLE public.departments;
       public         heap    postgres    false            �            1259    19315    departments_id_department_seq    SEQUENCE     �   CREATE SEQUENCE public.departments_id_department_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.departments_id_department_seq;
       public          postgres    false    227            s           0    0    departments_id_department_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.departments_id_department_seq OWNED BY public.areas.id_area;
          public          postgres    false    226                       1259    20968    departments_id_department_seq1    SEQUENCE     �   CREATE SEQUENCE public.departments_id_department_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.departments_id_department_seq1;
       public          postgres    false    258            t           0    0    departments_id_department_seq1    SEQUENCE OWNED BY     `   ALTER SEQUENCE public.departments_id_department_seq1 OWNED BY public.departments.id_department;
          public          postgres    false    257            �            1259    19460    failures    TABLE     �   CREATE TABLE public.failures (
    id_failure integer NOT NULL,
    name_failure character varying(100),
    id_failure_level integer
);
    DROP TABLE public.failures;
       public         heap    postgres    false            �            1259    19459    failures_id_failure_seq    SEQUENCE     �   CREATE SEQUENCE public.failures_id_failure_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.failures_id_failure_seq;
       public          postgres    false    232            u           0    0    failures_id_failure_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.failures_id_failure_seq OWNED BY public.failures.id_failure;
          public          postgres    false    231            �            1259    19548    levels_tecnicos    TABLE     �   CREATE TABLE public.levels_tecnicos (
    id_level_tecnico integer NOT NULL,
    name_level character varying(100),
    description character varying(200)
);
 #   DROP TABLE public.levels_tecnicos;
       public         heap    postgres    false            �            1259    19547 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE     �   CREATE SEQUENCE public.levels_tecnicos_id_level_tecnico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.levels_tecnicos_id_level_tecnico_seq;
       public          postgres    false    242            v           0    0 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.levels_tecnicos_id_level_tecnico_seq OWNED BY public.levels_tecnicos.id_level_tecnico;
          public          postgres    false    241            �            1259    19770    process_tickets    TABLE        CREATE TABLE public.process_tickets (
    id_process_ticket integer NOT NULL,
    name_process_ticket character varying(50)
);
 #   DROP TABLE public.process_tickets;
       public         heap    postgres    false            �            1259    19274    regions    TABLE     �   CREATE TABLE public.regions (
    id_region integer NOT NULL,
    name_region character varying(100),
    "id_statusReg" integer
);
    DROP TABLE public.regions;
       public         heap    postgres    false            �            1259    19273    regions_id_region_seq    SEQUENCE     �   CREATE SEQUENCE public.regions_id_region_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.regions_id_region_seq;
       public          postgres    false    223            w           0    0    regions_id_region_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.regions_id_region_seq OWNED BY public.regions.id_region;
          public          postgres    false    222            �            1259    19288    regionstecnicos    TABLE     }   CREATE TABLE public.regionstecnicos (
    id_regionstecnicos integer NOT NULL,
    id_region integer,
    id_user integer
);
 #   DROP TABLE public.regionstecnicos;
       public         heap    postgres    false            �            1259    19287 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE     �   CREATE SEQUENCE public.regionstecnicos_id_regionstecnicos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.regionstecnicos_id_regionstecnicos_seq;
       public          postgres    false    225            x           0    0 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.regionstecnicos_id_regionstecnicos_seq OWNED BY public.regionstecnicos.id_regionstecnicos;
          public          postgres    false    224            �            1259    19255    roles    TABLE     b   CREATE TABLE public.roles (
    id_rolusr integer NOT NULL,
    name_rol character varying(50)
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    19254    roles_id_rolusr_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_rolusr_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.roles_id_rolusr_seq;
       public          postgres    false    219            y           0    0    roles_id_rolusr_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.roles_id_rolusr_seq OWNED BY public.roles.id_rolusr;
          public          postgres    false    218            �            1259    19751    sessions_users    TABLE     t  CREATE TABLE public.sessions_users (
    id_session character varying(255) NOT NULL,
    id_user integer,
    start_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_agent character varying(255),
    ip_address character varying(45),
    active integer DEFAULT 0,
    end_date timestamp without time zone,
    expiry_time timestamp without time zone
);
 "   DROP TABLE public.sessions_users;
       public         heap    postgres    false                        1259    20854    states    TABLE     �   CREATE TABLE public.states (
    id_state integer NOT NULL,
    name_state character varying(255) NOT NULL,
    id_region integer
);
    DROP TABLE public.states;
       public         heap    postgres    false            �            1259    19266    states_id_state_seq    SEQUENCE     �   CREATE SEQUENCE public.states_id_state_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.states_id_state_seq;
       public          postgres    false    221            z           0    0    states_id_state_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.states_id_state_seq OWNED BY public.branches.id_branches;
          public          postgres    false    220            �            1259    19490 
   status_lab    TABLE     r   CREATE TABLE public.status_lab (
    id_status_lab integer NOT NULL,
    name_status_lab character varying(50)
);
    DROP TABLE public.status_lab;
       public         heap    postgres    false            �            1259    19489    status_lab_id_status_lab_seq    SEQUENCE     �   CREATE SEQUENCE public.status_lab_id_status_lab_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.status_lab_id_status_lab_seq;
       public          postgres    false    234            {           0    0    status_lab_id_status_lab_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.status_lab_id_status_lab_seq OWNED BY public.status_lab.id_status_lab;
          public          postgres    false    233            �            1259    20059    status_payments    TABLE        CREATE TABLE public.status_payments (
    id_status_payment integer NOT NULL,
    name_status_payment character varying(50)
);
 #   DROP TABLE public.status_payments;
       public         heap    postgres    false            �            1259    20058 %   status_payments_id_status_payment_seq    SEQUENCE     �   CREATE SEQUENCE public.status_payments_id_status_payment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.status_payments_id_status_payment_seq;
       public          postgres    false    250            |           0    0 %   status_payments_id_status_payment_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.status_payments_id_status_payment_seq OWNED BY public.status_payments.id_status_payment;
          public          postgres    false    249            �            1259    19516    status_tickets    TABLE     |   CREATE TABLE public.status_tickets (
    id_status_ticket integer NOT NULL,
    name_status_ticket character varying(50)
);
 "   DROP TABLE public.status_tickets;
       public         heap    postgres    false            �            1259    19515 #   status_tickets_id_status_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.status_tickets_id_status_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.status_tickets_id_status_ticket_seq;
       public          postgres    false    238            }           0    0 #   status_tickets_id_status_ticket_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.status_tickets_id_status_ticket_seq OWNED BY public.status_tickets.id_status_ticket;
          public          postgres    false    237            �            1259    20593    tickets_id_ticket_seq    SEQUENCE     ~   CREATE SEQUENCE public.tickets_id_ticket_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.tickets_id_ticket_seq;
       public          postgres    false            �            1259    20485    tickets    TABLE     b  CREATE TABLE public.tickets (
    id_ticket integer DEFAULT nextval('public.tickets_id_ticket_seq'::regclass) NOT NULL,
    date_create_ticket timestamp without time zone,
    serial_pos character varying(255),
    id_status_ticket integer,
    id_process_ticket integer,
    id_accion_ticket integer,
    id_level_failure integer,
    id_failure integer,
    id_user integer,
    id_status_payment integer,
    id_user_coord integer,
    downl_exoneration bytea,
    downl_payment bytea,
    downl_send_to_rosal bytea,
    date_send_lab timestamp without time zone,
    date_send_torosal_fromlab timestamp without time zone,
    id_status_domiciliacion integer,
    data_sendkey character varying(255),
    date_receivekey timestamp without time zone,
    downl_send_fromrosal bytea,
    date_receivefrom_desti timestamp without time zone,
    motive_close text
);
    DROP TABLE public.tickets;
       public         heap    postgres    false    252            �            1259    20633    tickets_failures    TABLE     �   CREATE TABLE public.tickets_failures (
    id_tickets_failures integer NOT NULL,
    id_ticket integer NOT NULL,
    id_failure integer
);
 $   DROP TABLE public.tickets_failures;
       public         heap    postgres    false            �            1259    20632    tickets_failures_id_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_failures_id_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.tickets_failures_id_ticket_seq;
       public          postgres    false    255            ~           0    0    tickets_failures_id_ticket_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.tickets_failures_id_ticket_seq OWNED BY public.tickets_failures.id_ticket;
          public          postgres    false    254            �            1259    20631 (   tickets_failures_id_tickets_failures_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_failures_id_tickets_failures_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.tickets_failures_id_tickets_failures_seq;
       public          postgres    false    255                       0    0 (   tickets_failures_id_tickets_failures_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.tickets_failures_id_tickets_failures_seq OWNED BY public.tickets_failures.id_tickets_failures;
          public          postgres    false    253            �            1259    19668    tickets_status_history    TABLE     _  CREATE TABLE public.tickets_status_history (
    id_history integer NOT NULL,
    id_ticket integer,
    old_status integer,
    new_status integer,
    changed_by integer,
    changed_at timestamp without time zone,
    notes character varying(255),
    old_process integer,
    new_process integer,
    old_action integer,
    new_action integer
);
 *   DROP TABLE public.tickets_status_history;
       public         heap    postgres    false            �            1259    19667 %   tickets_status_history_id_history_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_history_id_history_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.tickets_status_history_id_history_seq;
       public          postgres    false    245            �           0    0 %   tickets_status_history_id_history_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.tickets_status_history_id_history_seq OWNED BY public.tickets_status_history.id_history;
          public          postgres    false    244            �            1259    19497    tickets_status_lab    TABLE     �   CREATE TABLE public.tickets_status_lab (
    id_ticket_status_lab integer NOT NULL,
    id_ticket integer,
    id_status_lab integer
);
 &   DROP TABLE public.tickets_status_lab;
       public         heap    postgres    false            �            1259    19496 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 B   DROP SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq;
       public          postgres    false    236            �           0    0 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE OWNED BY     {   ALTER SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq OWNED BY public.tickets_status_lab.id_ticket_status_lab;
          public          postgres    false    235            �            1259    19524    tickets_status_tickets    TABLE     �   CREATE TABLE public.tickets_status_tickets (
    id_ticket_status_ticket integer NOT NULL,
    id_ticket integer,
    id_status_ticket integer,
    "date _status_ticket" date,
    level_failure integer
);
 *   DROP TABLE public.tickets_status_tickets;
       public         heap    postgres    false            �            1259    19523 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq;
       public          postgres    false    240            �           0    0 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq OWNED BY public.tickets_status_tickets.id_ticket_status_ticket;
          public          postgres    false    239                       1259    21025    user_permissions    TABLE     
  CREATE TABLE public.user_permissions (
    id_permission integer NOT NULL,
    id_user integer NOT NULL,
    id_view integer,
    id_accion integer,
    permitido boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 $   DROP TABLE public.user_permissions;
       public         heap    postgres    false                       1259    21024 "   user_permissions_id_permission_seq    SEQUENCE     �   CREATE SEQUENCE public.user_permissions_id_permission_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.user_permissions_id_permission_seq;
       public          postgres    false    260            �           0    0 "   user_permissions_id_permission_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.user_permissions_id_permission_seq OWNED BY public.user_permissions.id_permission;
          public          postgres    false    259            �            1259    19202    users    TABLE     �  CREATE TABLE public.users (
    id_user integer NOT NULL,
    national_id character varying(10),
    id_statususr integer,
    name character varying(50),
    surname character varying(50),
    username character varying(50),
    password character varying(200),
    id_rolusr integer,
    email character varying(100),
    id_area integer,
    trying_failedpassw integer,
    date_create time with time zone,
    id_level_tecnico integer
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    19201    users_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_id_user_seq;
       public          postgres    false    217            �           0    0    users_id_user_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;
          public          postgres    false    216            �            1259    19414    users_tickets    TABLE     �   CREATE TABLE public.users_tickets (
    id_user_ticket integer NOT NULL,
    id_user integer,
    id_ticket integer,
    types_tickets integer
);
 !   DROP TABLE public.users_tickets;
       public         heap    postgres    false            �            1259    19413     users_tickets_id_user_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.users_tickets_id_user_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.users_tickets_id_user_ticket_seq;
       public          postgres    false    230            �           0    0     users_tickets_id_user_ticket_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.users_tickets_id_user_ticket_seq OWNED BY public.users_tickets.id_user_ticket;
          public          postgres    false    229                       1259    21036    views    TABLE     �   CREATE TABLE public.views (
    id_view integer NOT NULL,
    name_view character varying(255) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.views;
       public         heap    postgres    false                       1259    21035    views_id_view_seq    SEQUENCE     �   CREATE SEQUENCE public.views_id_view_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.views_id_view_seq;
       public          postgres    false    262            �           0    0    views_id_view_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.views_id_view_seq OWNED BY public.views.id_view;
          public          postgres    false    261            K           2604    21049    accion id_accion    DEFAULT     t   ALTER TABLE ONLY public.accion ALTER COLUMN id_accion SET DEFAULT nextval('public.accion_id_accion_seq'::regclass);
 ?   ALTER TABLE public.accion ALTER COLUMN id_accion DROP DEFAULT;
       public          postgres    false    264    263    264            6           2604    19319    areas id_area    DEFAULT     z   ALTER TABLE ONLY public.areas ALTER COLUMN id_area SET DEFAULT nextval('public.departments_id_department_seq'::regclass);
 <   ALTER TABLE public.areas ALTER COLUMN id_area DROP DEFAULT;
       public          postgres    false    226    227    227            3           2604    19270    branches id_branches    DEFAULT     w   ALTER TABLE ONLY public.branches ALTER COLUMN id_branches SET DEFAULT nextval('public.states_id_state_seq'::regclass);
 C   ALTER TABLE public.branches ALTER COLUMN id_branches DROP DEFAULT;
       public          postgres    false    221    220    221            E           2604    20972    departments id_department    DEFAULT     �   ALTER TABLE ONLY public.departments ALTER COLUMN id_department SET DEFAULT nextval('public.departments_id_department_seq1'::regclass);
 H   ALTER TABLE public.departments ALTER COLUMN id_department DROP DEFAULT;
       public          postgres    false    257    258    258            8           2604    19463    failures id_failure    DEFAULT     z   ALTER TABLE ONLY public.failures ALTER COLUMN id_failure SET DEFAULT nextval('public.failures_id_failure_seq'::regclass);
 B   ALTER TABLE public.failures ALTER COLUMN id_failure DROP DEFAULT;
       public          postgres    false    232    231    232            =           2604    19551     levels_tecnicos id_level_tecnico    DEFAULT     �   ALTER TABLE ONLY public.levels_tecnicos ALTER COLUMN id_level_tecnico SET DEFAULT nextval('public.levels_tecnicos_id_level_tecnico_seq'::regclass);
 O   ALTER TABLE public.levels_tecnicos ALTER COLUMN id_level_tecnico DROP DEFAULT;
       public          postgres    false    242    241    242            4           2604    19277    regions id_region    DEFAULT     v   ALTER TABLE ONLY public.regions ALTER COLUMN id_region SET DEFAULT nextval('public.regions_id_region_seq'::regclass);
 @   ALTER TABLE public.regions ALTER COLUMN id_region DROP DEFAULT;
       public          postgres    false    222    223    223            5           2604    19291 "   regionstecnicos id_regionstecnicos    DEFAULT     �   ALTER TABLE ONLY public.regionstecnicos ALTER COLUMN id_regionstecnicos SET DEFAULT nextval('public.regionstecnicos_id_regionstecnicos_seq'::regclass);
 Q   ALTER TABLE public.regionstecnicos ALTER COLUMN id_regionstecnicos DROP DEFAULT;
       public          postgres    false    224    225    225            2           2604    19258    roles id_rolusr    DEFAULT     r   ALTER TABLE ONLY public.roles ALTER COLUMN id_rolusr SET DEFAULT nextval('public.roles_id_rolusr_seq'::regclass);
 >   ALTER TABLE public.roles ALTER COLUMN id_rolusr DROP DEFAULT;
       public          postgres    false    219    218    219            9           2604    19493    status_lab id_status_lab    DEFAULT     �   ALTER TABLE ONLY public.status_lab ALTER COLUMN id_status_lab SET DEFAULT nextval('public.status_lab_id_status_lab_seq'::regclass);
 G   ALTER TABLE public.status_lab ALTER COLUMN id_status_lab DROP DEFAULT;
       public          postgres    false    233    234    234            A           2604    20062 !   status_payments id_status_payment    DEFAULT     �   ALTER TABLE ONLY public.status_payments ALTER COLUMN id_status_payment SET DEFAULT nextval('public.status_payments_id_status_payment_seq'::regclass);
 P   ALTER TABLE public.status_payments ALTER COLUMN id_status_payment DROP DEFAULT;
       public          postgres    false    249    250    250            ;           2604    19519    status_tickets id_status_ticket    DEFAULT     �   ALTER TABLE ONLY public.status_tickets ALTER COLUMN id_status_ticket SET DEFAULT nextval('public.status_tickets_id_status_ticket_seq'::regclass);
 N   ALTER TABLE public.status_tickets ALTER COLUMN id_status_ticket DROP DEFAULT;
       public          postgres    false    238    237    238            C           2604    20636 $   tickets_failures id_tickets_failures    DEFAULT     �   ALTER TABLE ONLY public.tickets_failures ALTER COLUMN id_tickets_failures SET DEFAULT nextval('public.tickets_failures_id_tickets_failures_seq'::regclass);
 S   ALTER TABLE public.tickets_failures ALTER COLUMN id_tickets_failures DROP DEFAULT;
       public          postgres    false    253    255    255            D           2604    20637    tickets_failures id_ticket    DEFAULT     �   ALTER TABLE ONLY public.tickets_failures ALTER COLUMN id_ticket SET DEFAULT nextval('public.tickets_failures_id_ticket_seq'::regclass);
 I   ALTER TABLE public.tickets_failures ALTER COLUMN id_ticket DROP DEFAULT;
       public          postgres    false    254    255    255            >           2604    19671 !   tickets_status_history id_history    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_history ALTER COLUMN id_history SET DEFAULT nextval('public.tickets_status_history_id_history_seq'::regclass);
 P   ALTER TABLE public.tickets_status_history ALTER COLUMN id_history DROP DEFAULT;
       public          postgres    false    244    245    245            :           2604    19500 '   tickets_status_lab id_ticket_status_lab    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_lab ALTER COLUMN id_ticket_status_lab SET DEFAULT nextval('public.tickets_status_lab_id_ticket_status_lab_seq'::regclass);
 V   ALTER TABLE public.tickets_status_lab ALTER COLUMN id_ticket_status_lab DROP DEFAULT;
       public          postgres    false    236    235    236            <           2604    19527 .   tickets_status_tickets id_ticket_status_ticket    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_tickets ALTER COLUMN id_ticket_status_ticket SET DEFAULT nextval('public.tickets_status_tickets_id_ticket_status_ticket_seq'::regclass);
 ]   ALTER TABLE public.tickets_status_tickets ALTER COLUMN id_ticket_status_ticket DROP DEFAULT;
       public          postgres    false    239    240    240            F           2604    21028    user_permissions id_permission    DEFAULT     �   ALTER TABLE ONLY public.user_permissions ALTER COLUMN id_permission SET DEFAULT nextval('public.user_permissions_id_permission_seq'::regclass);
 M   ALTER TABLE public.user_permissions ALTER COLUMN id_permission DROP DEFAULT;
       public          postgres    false    259    260    260            1           2604    19205    users id_user    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    216    217    217            7           2604    19417    users_tickets id_user_ticket    DEFAULT     �   ALTER TABLE ONLY public.users_tickets ALTER COLUMN id_user_ticket SET DEFAULT nextval('public.users_tickets_id_user_ticket_seq'::regclass);
 K   ALTER TABLE public.users_tickets ALTER COLUMN id_user_ticket DROP DEFAULT;
       public          postgres    false    229    230    230            I           2604    21039    views id_view    DEFAULT     n   ALTER TABLE ONLY public.views ALTER COLUMN id_view SET DEFAULT nextval('public.views_id_view_seq'::regclass);
 <   ALTER TABLE public.views ALTER COLUMN id_view DROP DEFAULT;
       public          postgres    false    261    262    262            i          0    21046    accion 
   TABLE DATA           D   COPY public.accion (id_accion, name_accion, created_at) FROM stdin;
    public          postgres    false    264   �      Y          0    19775    accions_tickets 
   TABLE DATA           O   COPY public.accions_tickets (id_accion_ticket, name_accion_ticket) FROM stdin;
    public          postgres    false    248   s�      E          0    19316    areas 
   TABLE DATA           3   COPY public.areas (id_area, name_area) FROM stdin;
    public          postgres    false    227   ˃      F          0    19351    assignments_tickets 
   TABLE DATA           �   COPY public.assignments_tickets (id_assginment_ticket, id_ticket, id_coordinator, id_tecnico, date_sendcoordinator, note, date_assign_tec2) FROM stdin;
    public          postgres    false    228   )�      ?          0    19267    branches 
   TABLE DATA           I   COPY public.branches (id_branches, name_branches, id_region) FROM stdin;
    public          postgres    false    221   F�      c          0    20969    departments 
   TABLE DATA           Y   COPY public.departments (id_department, name_department, id_coordinador_rol) FROM stdin;
    public          postgres    false    258   ^�      J          0    19460    failures 
   TABLE DATA           N   COPY public.failures (id_failure, name_failure, id_failure_level) FROM stdin;
    public          postgres    false    232   {�      T          0    19548    levels_tecnicos 
   TABLE DATA           T   COPY public.levels_tecnicos (id_level_tecnico, name_level, description) FROM stdin;
    public          postgres    false    242   M�      X          0    19770    process_tickets 
   TABLE DATA           Q   COPY public.process_tickets (id_process_ticket, name_process_ticket) FROM stdin;
    public          postgres    false    247   ��      A          0    19274    regions 
   TABLE DATA           I   COPY public.regions (id_region, name_region, "id_statusReg") FROM stdin;
    public          postgres    false    223   �      C          0    19288    regionstecnicos 
   TABLE DATA           Q   COPY public.regionstecnicos (id_regionstecnicos, id_region, id_user) FROM stdin;
    public          postgres    false    225   M�      =          0    19255    roles 
   TABLE DATA           4   COPY public.roles (id_rolusr, name_rol) FROM stdin;
    public          postgres    false    219   j�      W          0    19751    sessions_users 
   TABLE DATA           �   COPY public.sessions_users (id_session, id_user, start_date, user_agent, ip_address, active, end_date, expiry_time) FROM stdin;
    public          postgres    false    246   ̉      a          0    20854    states 
   TABLE DATA           A   COPY public.states (id_state, name_state, id_region) FROM stdin;
    public          postgres    false    256   �      L          0    19490 
   status_lab 
   TABLE DATA           D   COPY public.status_lab (id_status_lab, name_status_lab) FROM stdin;
    public          postgres    false    234   �      [          0    20059    status_payments 
   TABLE DATA           Q   COPY public.status_payments (id_status_payment, name_status_payment) FROM stdin;
    public          postgres    false    250   %�      P          0    19516    status_tickets 
   TABLE DATA           N   COPY public.status_tickets (id_status_ticket, name_status_ticket) FROM stdin;
    public          postgres    false    238   ��      \          0    20485    tickets 
   TABLE DATA           �  COPY public.tickets (id_ticket, date_create_ticket, serial_pos, id_status_ticket, id_process_ticket, id_accion_ticket, id_level_failure, id_failure, id_user, id_status_payment, id_user_coord, downl_exoneration, downl_payment, downl_send_to_rosal, date_send_lab, date_send_torosal_fromlab, id_status_domiciliacion, data_sendkey, date_receivekey, downl_send_fromrosal, date_receivefrom_desti, motive_close) FROM stdin;
    public          postgres    false    251   �      `          0    20633    tickets_failures 
   TABLE DATA           V   COPY public.tickets_failures (id_tickets_failures, id_ticket, id_failure) FROM stdin;
    public          postgres    false    255   �V      V          0    19668    tickets_status_history 
   TABLE DATA           �   COPY public.tickets_status_history (id_history, id_ticket, old_status, new_status, changed_by, changed_at, notes, old_process, new_process, old_action, new_action) FROM stdin;
    public          postgres    false    245   �V      N          0    19497    tickets_status_lab 
   TABLE DATA           \   COPY public.tickets_status_lab (id_ticket_status_lab, id_ticket, id_status_lab) FROM stdin;
    public          postgres    false    236   �V      R          0    19524    tickets_status_tickets 
   TABLE DATA           �   COPY public.tickets_status_tickets (id_ticket_status_ticket, id_ticket, id_status_ticket, "date _status_ticket", level_failure) FROM stdin;
    public          postgres    false    240   W      e          0    21025    user_permissions 
   TABLE DATA           m   COPY public.user_permissions (id_permission, id_user, id_view, id_accion, permitido, created_at) FROM stdin;
    public          postgres    false    260   6W      ;          0    19202    users 
   TABLE DATA           �   COPY public.users (id_user, national_id, id_statususr, name, surname, username, password, id_rolusr, email, id_area, trying_failedpassw, date_create, id_level_tecnico) FROM stdin;
    public          postgres    false    217   sW      H          0    19414    users_tickets 
   TABLE DATA           Z   COPY public.users_tickets (id_user_ticket, id_user, id_ticket, types_tickets) FROM stdin;
    public          postgres    false    230   $X      g          0    21036    views 
   TABLE DATA           L   COPY public.views (id_view, name_view, descripcion, created_at) FROM stdin;
    public          postgres    false    262   SX      �           0    0    accion_id_accion_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.accion_id_accion_seq', 4, true);
          public          postgres    false    263            �           0    0    departments_id_department_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.departments_id_department_seq', 3, true);
          public          postgres    false    226            �           0    0    departments_id_department_seq1    SEQUENCE SET     M   SELECT pg_catalog.setval('public.departments_id_department_seq1', 1, false);
          public          postgres    false    257            �           0    0    failures_id_failure_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.failures_id_failure_seq', 42, true);
          public          postgres    false    231            �           0    0 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.levels_tecnicos_id_level_tecnico_seq', 1, false);
          public          postgres    false    241            �           0    0    regions_id_region_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.regions_id_region_seq', 6, true);
          public          postgres    false    222            �           0    0 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.regionstecnicos_id_regionstecnicos_seq', 1, false);
          public          postgres    false    224            �           0    0    roles_id_rolusr_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.roles_id_rolusr_seq', 2, true);
          public          postgres    false    218            �           0    0    states_id_state_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.states_id_state_seq', 22, true);
          public          postgres    false    220            �           0    0    status_lab_id_status_lab_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.status_lab_id_status_lab_seq', 1, false);
          public          postgres    false    233            �           0    0 %   status_payments_id_status_payment_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.status_payments_id_status_payment_seq', 8, true);
          public          postgres    false    249            �           0    0 #   status_tickets_id_status_ticket_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.status_tickets_id_status_ticket_seq', 1, false);
          public          postgres    false    237            �           0    0    tickets_failures_id_ticket_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.tickets_failures_id_ticket_seq', 1, true);
          public          postgres    false    254            �           0    0 (   tickets_failures_id_tickets_failures_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.tickets_failures_id_tickets_failures_seq', 1, true);
          public          postgres    false    253            �           0    0    tickets_id_ticket_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tickets_id_ticket_seq', 1, true);
          public          postgres    false    252            �           0    0 %   tickets_status_history_id_history_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.tickets_status_history_id_history_seq', 1, false);
          public          postgres    false    244            �           0    0 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.tickets_status_lab_id_ticket_status_lab_seq', 1, false);
          public          postgres    false    235            �           0    0 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.tickets_status_tickets_id_ticket_status_ticket_seq', 1, false);
          public          postgres    false    239            �           0    0 "   user_permissions_id_permission_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.user_permissions_id_permission_seq', 1, false);
          public          postgres    false    259            �           0    0    users_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_id_user_seq', 2, true);
          public          postgres    false    216            �           0    0     users_tickets_id_user_ticket_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.users_tickets_id_user_ticket_seq', 1, false);
          public          postgres    false    229            �           0    0    views_id_view_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.views_id_view_seq', 1, true);
          public          postgres    false    261            �           2606    21054    accion accion_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.accion
    ADD CONSTRAINT accion_pkey PRIMARY KEY (id_accion);
 <   ALTER TABLE ONLY public.accion DROP CONSTRAINT accion_pkey;
       public            postgres    false    264            �           2606    19779 $   accions_tickets accions_tickets_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.accions_tickets
    ADD CONSTRAINT accions_tickets_pkey PRIMARY KEY (id_accion_ticket);
 N   ALTER TABLE ONLY public.accions_tickets DROP CONSTRAINT accions_tickets_pkey;
       public            postgres    false    248            Z           2606    19321    areas departments_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.areas
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id_area);
 @   ALTER TABLE ONLY public.areas DROP CONSTRAINT departments_pkey;
       public            postgres    false    227            \           2606    19376 *   assignments_tickets pk_assignments_tickets 
   CONSTRAINT     z   ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT pk_assignments_tickets PRIMARY KEY (id_assginment_ticket);
 T   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT pk_assignments_tickets;
       public            postgres    false    228            �           2606    20974    departments pk_departments 
   CONSTRAINT     c   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT pk_departments PRIMARY KEY (id_department);
 D   ALTER TABLE ONLY public.departments DROP CONSTRAINT pk_departments;
       public            postgres    false    258            h           2606    19465    failures pk_failures 
   CONSTRAINT     Z   ALTER TABLE ONLY public.failures
    ADD CONSTRAINT pk_failures PRIMARY KEY (id_failure);
 >   ALTER TABLE ONLY public.failures DROP CONSTRAINT pk_failures;
       public            postgres    false    232            x           2606    19553 "   levels_tecnicos pk_levels_tecnicos 
   CONSTRAINT     n   ALTER TABLE ONLY public.levels_tecnicos
    ADD CONSTRAINT pk_levels_tecnicos PRIMARY KEY (id_level_tecnico);
 L   ALTER TABLE ONLY public.levels_tecnicos DROP CONSTRAINT pk_levels_tecnicos;
       public            postgres    false    242            j           2606    19495    status_lab pk_status_lab 
   CONSTRAINT     a   ALTER TABLE ONLY public.status_lab
    ADD CONSTRAINT pk_status_lab PRIMARY KEY (id_status_lab);
 B   ALTER TABLE ONLY public.status_lab DROP CONSTRAINT pk_status_lab;
       public            postgres    false    234            �           2606    20064 "   status_payments pk_status_payments 
   CONSTRAINT     o   ALTER TABLE ONLY public.status_payments
    ADD CONSTRAINT pk_status_payments PRIMARY KEY (id_status_payment);
 L   ALTER TABLE ONLY public.status_payments DROP CONSTRAINT pk_status_payments;
       public            postgres    false    250            p           2606    19521     status_tickets pk_status_tickets 
   CONSTRAINT     l   ALTER TABLE ONLY public.status_tickets
    ADD CONSTRAINT pk_status_tickets PRIMARY KEY (id_status_ticket);
 J   ALTER TABLE ONLY public.status_tickets DROP CONSTRAINT pk_status_tickets;
       public            postgres    false    238            l           2606    19502 (   tickets_status_lab pk_tickets_status_lab 
   CONSTRAINT     x   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT pk_tickets_status_lab PRIMARY KEY (id_ticket_status_lab);
 R   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT pk_tickets_status_lab;
       public            postgres    false    236            r           2606    19529 0   tickets_status_tickets pk_tickets_status_tickets 
   CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT pk_tickets_status_tickets PRIMARY KEY (id_ticket_status_ticket);
 Z   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT pk_tickets_status_tickets;
       public            postgres    false    240            b           2606    19419    users_tickets pk_users_tickets  
   CONSTRAINT     k   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT "pk_users_tickets " PRIMARY KEY (id_user_ticket);
 K   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT "pk_users_tickets ";
       public            postgres    false    230            ~           2606    19774 $   process_tickets process_tickets_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.process_tickets
    ADD CONSTRAINT process_tickets_pkey PRIMARY KEY (id_process_ticket);
 N   ALTER TABLE ONLY public.process_tickets DROP CONSTRAINT process_tickets_pkey;
       public            postgres    false    247            T           2606    19279    regions regions_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id_region);
 >   ALTER TABLE ONLY public.regions DROP CONSTRAINT regions_pkey;
       public            postgres    false    223            V           2606    19293 $   regionstecnicos regionstecnicos_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT regionstecnicos_pkey PRIMARY KEY (id_regionstecnicos);
 N   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT regionstecnicos_pkey;
       public            postgres    false    225            P           2606    19260    roles roles_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rolusr);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    219            |           2606    19759 "   sessions_users sessions_users_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.sessions_users
    ADD CONSTRAINT sessions_users_pkey PRIMARY KEY (id_session);
 L   ALTER TABLE ONLY public.sessions_users DROP CONSTRAINT sessions_users_pkey;
       public            postgres    false    246            R           2606    19272    branches states_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.branches
    ADD CONSTRAINT states_pkey PRIMARY KEY (id_branches);
 >   ALTER TABLE ONLY public.branches DROP CONSTRAINT states_pkey;
       public            postgres    false    221            �           2606    20858    states states_pkey1 
   CONSTRAINT     W   ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey1 PRIMARY KEY (id_state);
 =   ALTER TABLE ONLY public.states DROP CONSTRAINT states_pkey1;
       public            postgres    false    256            �           2606    20639 &   tickets_failures tickets_failures_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT tickets_failures_pkey PRIMARY KEY (id_tickets_failures);
 P   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT tickets_failures_pkey;
       public            postgres    false    255            z           2606    19673 2   tickets_status_history tickets_status_history_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.tickets_status_history
    ADD CONSTRAINT tickets_status_history_pkey PRIMARY KEY (id_history);
 \   ALTER TABLE ONLY public.tickets_status_history DROP CONSTRAINT tickets_status_history_pkey;
       public            postgres    false    245            �           2606    20492    tickets tickets_unified_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_pkey PRIMARY KEY (id_ticket);
 F   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_pkey;
       public            postgres    false    251            ^           2606    19397 :   assignments_tickets unq_assignments_tickets_id_coordinator 
   CONSTRAINT        ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT unq_assignments_tickets_id_coordinator UNIQUE (id_coordinator);
 d   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT unq_assignments_tickets_id_coordinator;
       public            postgres    false    228            `           2606    19383 5   assignments_tickets unq_assignments_tickets_id_ticket 
   CONSTRAINT     u   ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT unq_assignments_tickets_id_ticket UNIQUE (id_ticket);
 _   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT unq_assignments_tickets_id_ticket;
       public            postgres    false    228            X           2606    19565 +   regionstecnicos unq_regionstecnicos_id_user 
   CONSTRAINT     i   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT unq_regionstecnicos_id_user UNIQUE (id_user);
 U   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT unq_regionstecnicos_id_user;
       public            postgres    false    225            �           2606    20663 /   tickets_failures unq_tickets_failures_id_ticket 
   CONSTRAINT     o   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT unq_tickets_failures_id_ticket UNIQUE (id_ticket);
 Y   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT unq_tickets_failures_id_ticket;
       public            postgres    false    255            n           2606    19509 3   tickets_status_lab unq_tickets_status_lab_id_ticket 
   CONSTRAINT     s   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT unq_tickets_status_lab_id_ticket UNIQUE (id_ticket);
 ]   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT unq_tickets_status_lab_id_ticket;
       public            postgres    false    236            t           2606    19879 B   tickets_status_tickets unq_tickets_status_tickets_id_status_ticket 
   CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT unq_tickets_status_tickets_id_status_ticket UNIQUE (id_status_ticket);
 l   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT unq_tickets_status_tickets_id_status_ticket;
       public            postgres    false    240            v           2606    19541 ;   tickets_status_tickets unq_tickets_status_tickets_id_ticket 
   CONSTRAINT     {   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT unq_tickets_status_tickets_id_ticket UNIQUE (id_ticket);
 e   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT unq_tickets_status_tickets_id_ticket;
       public            postgres    false    240            d           2606    19421 )   users_tickets unq_users_tickets_id_ticket 
   CONSTRAINT     i   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT unq_users_tickets_id_ticket UNIQUE (id_ticket);
 S   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT unq_users_tickets_id_ticket;
       public            postgres    false    230            f           2606    19428 '   users_tickets unq_users_tickets_id_user 
   CONSTRAINT     e   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT unq_users_tickets_id_user UNIQUE (id_user);
 Q   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT unq_users_tickets_id_user;
       public            postgres    false    230            �           2606    21032 &   user_permissions user_permissions_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id_permission);
 P   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT user_permissions_pkey;
       public            postgres    false    260            N           2606    19207    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    217            �           2606    21044    views views_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.views
    ADD CONSTRAINT views_pkey PRIMARY KEY (id_view);
 :   ALTER TABLE ONLY public.views DROP CONSTRAINT views_pkey;
       public            postgres    false    262            �           1259    21034    idx_id_vista_accion    INDEX     ^   CREATE INDEX idx_id_vista_accion ON public.user_permissions USING btree (id_view, id_accion);
 '   DROP INDEX public.idx_id_vista_accion;
       public            postgres    false    260    260            �           1259    21033    idx_user_id_view_accion    INDEX     k   CREATE INDEX idx_user_id_view_accion ON public.user_permissions USING btree (id_user, id_view, id_accion);
 +   DROP INDEX public.idx_user_id_view_accion;
       public            postgres    false    260    260    260            �           2606    20975 &   departments fk_departments_departments    FK CONSTRAINT     �   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT fk_departments_departments FOREIGN KEY (id_coordinador_rol) REFERENCES public.roles(id_rolusr);
 P   ALTER TABLE ONLY public.departments DROP CONSTRAINT fk_departments_departments;
       public          postgres    false    258    3408    219            �           2606    19305 #   regionstecnicos fk_regionestecnicos    FK CONSTRAINT     �   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT fk_regionestecnicos FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 M   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT fk_regionestecnicos;
       public          postgres    false    225    223    3412            �           2606    20171 (   regionstecnicos fk_regionstecnicos_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT fk_regionstecnicos_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 R   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT fk_regionstecnicos_users;
       public          postgres    false    225    3406    217            �           2606    19937 &   sessions_users fk_sessions_users_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.sessions_users
    ADD CONSTRAINT fk_sessions_users_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 P   ALTER TABLE ONLY public.sessions_users DROP CONSTRAINT fk_sessions_users_users;
       public          postgres    false    3406    246    217            �           2606    19334    branches fk_state_region    FK CONSTRAINT     �   ALTER TABLE ONLY public.branches
    ADD CONSTRAINT fk_state_region FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 B   ALTER TABLE ONLY public.branches DROP CONSTRAINT fk_state_region;
       public          postgres    false    223    221    3412            �           2606    20669 -   tickets_failures fk_tickets_failures_failures    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT fk_tickets_failures_failures FOREIGN KEY (id_failure) REFERENCES public.failures(id_failure);
 W   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT fk_tickets_failures_failures;
       public          postgres    false    255    232    3432            �           2606    20789 ,   tickets_failures fk_tickets_failures_tickets    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT fk_tickets_failures_tickets FOREIGN KEY (id_ticket) REFERENCES public.tickets(id_ticket);
 V   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT fk_tickets_failures_tickets;
       public          postgres    false    255    251    3460            �           2606    19503 (   tickets_status_lab fk_tickets_status_lab    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT fk_tickets_status_lab FOREIGN KEY (id_status_lab) REFERENCES public.status_lab(id_status_lab);
 R   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT fk_tickets_status_lab;
       public          postgres    false    234    236    3434            �           2606    19885 0   tickets_status_tickets fk_tickets_status_tickets    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT fk_tickets_status_tickets FOREIGN KEY (id_status_ticket) REFERENCES public.status_tickets(id_status_ticket);
 Z   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT fk_tickets_status_tickets;
       public          postgres    false    240    3440    238            �           2606    21071 +   user_permissions fk_user_permissions_accion    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT fk_user_permissions_accion FOREIGN KEY (id_accion) REFERENCES public.accion(id_accion) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT fk_user_permissions_accion;
       public          postgres    false    264    260    3476            �           2606    21098 -   user_permissions fk_user_permissions_failures    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT fk_user_permissions_failures FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 W   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT fk_user_permissions_failures;
       public          postgres    false    217    3406    260            �           2606    21066 )   user_permissions fk_user_permissions_view    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT fk_user_permissions_view FOREIGN KEY (id_view) REFERENCES public.views(id_view) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT fk_user_permissions_view;
       public          postgres    false    262    260    3474            �           2606    19854    users fk_users_areas    FK CONSTRAINT     x   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_areas FOREIGN KEY (id_area) REFERENCES public.areas(id_area);
 >   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_areas;
       public          postgres    false    227    217    3418            �           2606    19592    users fk_users_levels_tecnicos    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_levels_tecnicos FOREIGN KEY (id_level_tecnico) REFERENCES public.levels_tecnicos(id_level_tecnico);
 H   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_levels_tecnicos;
       public          postgres    false    242    3448    217            �           2606    19261    users fk_users_rolsusr    FK CONSTRAINT     ~   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_rolsusr FOREIGN KEY (id_rolusr) REFERENCES public.roles(id_rolusr);
 @   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_rolsusr;
       public          postgres    false    219    3408    217            �           2606    20271 $   users_tickets fk_users_tickets_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT fk_users_tickets_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 N   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT fk_users_tickets_users;
       public          postgres    false    230    217    3406            �           2606    20859    states states_id_region_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_id_region_fkey FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 F   ALTER TABLE ONLY public.states DROP CONSTRAINT states_id_region_fkey;
       public          postgres    false    3412    256    223            �           2606    20503 -   tickets tickets_unified_id_accion_ticket_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_accion_ticket_fkey FOREIGN KEY (id_accion_ticket) REFERENCES public.accions_tickets(id_accion_ticket);
 W   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_accion_ticket_fkey;
       public          postgres    false    251    3456    248            �           2606    20498 .   tickets tickets_unified_id_process_ticket_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_process_ticket_fkey FOREIGN KEY (id_process_ticket) REFERENCES public.process_tickets(id_process_ticket);
 X   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_process_ticket_fkey;
       public          postgres    false    247    3454    251            �           2606    20518 .   tickets tickets_unified_id_status_payment_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_status_payment_fkey FOREIGN KEY (id_status_payment) REFERENCES public.status_payments(id_status_payment);
 X   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_status_payment_fkey;
       public          postgres    false    251    250    3458            �           2606    20493 -   tickets tickets_unified_id_status_ticket_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_status_ticket_fkey FOREIGN KEY (id_status_ticket) REFERENCES public.status_tickets(id_status_ticket);
 W   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_status_ticket_fkey;
       public          postgres    false    251    3440    238            �           2606    20523 *   tickets tickets_unified_id_user_coord_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_user_coord_fkey FOREIGN KEY (id_user_coord) REFERENCES public.users(id_user);
 T   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_user_coord_fkey;
       public          postgres    false    217    3406    251            �           2606    20513 $   tickets tickets_unified_id_user_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 N   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_user_fkey;
       public          postgres    false    217    3406    251            i   H   x�3�L.JM,I�4202�50�5�P04�25�24�3�
�qq����Wc�	4&�
�҂�V��qqq ���      Y   H   x�3�J-.M�)��2�t�S((�ON-��2�K��LIL����2ʔe&��+$�(8���d�yE\1z\\\ �i!      E   N   x�3�t��K̫J,�2�tL����,.)JL����2�I��I-Rp��I�,I�2�ʦ�&r�r��(�'�p��qqq A       F      x������ � �      ?     x�-P�n�0<��"_���c�����c/K��(�t#�ñ�"?�M���hwfv��K��dM7�S�L��.y�abz���r�BiT5F�|;<��BR�ls�<<)�P��N����
��i�l�'�Sw$�YbG�6�c��ZR^BS�3�9^\�zd�̱"��.���=Jed��T��أ�Z�z�e'���9�ã9���
l��`'��J��nQ:
\��ҏ��J��4��<���{����sO��p���ܸZ�ϙR���b*      c      x������ � �      J   �  x�}T�r1=���19$�0,��H�*�'�\M����&ZH9��'���=,�.ȅ�����21I!�����8P~���"�t�X�F����%���<��Xz��*:�Iz�V��D����M��C�`_̌t�;�xW&�F++�k ����B	D������z�e��hK$l(
g��1��a��(�˳�sKA,�ـ\���R,��\[��H������2r%ne�B��L^���4+���a���'H�t�NdbjW̼w�-���jղ��,�o�(�1m��i&�-��������? uW���b�`��{?]�\�m��c�>J�}j⮳������y���7��t/�bG,T�V;�(?�Ԝ`g���"���y�zd�vah���fk.�.��+�~&$�Q���{܆��q���V���)'�,�n��iÂ�`)�{v틻⊢��ć�g7���b��S7�fy[��d�����i;`����V;]HC=%��w��E�&�������Z��|o���ӖO�0j���[���1:��TԆ)�Ӕ">�����qe(�sqM�笻�w��}~=gB�U��Plb��|�
�6�7�W�g �D4X9Z �!?��$R�6��^*����d���y�#w�}{$H�u��Tɶ�+��/,���<���}!V���d�Yd�_;�B�%s4��x)���d������6��      T   c   x�]�1� �ᙞ�0&�=�]v ��@��Bt0N���g�Oh͚�	{�s�N�9E�*�W��u Cc�-�$%7�-��EC&V�m�A�+M      X      x�3��/�/*IU������ 8��      A   R   x�3��/�L�+I�4�2�t��s�lN��bǼ��b ����I��q�8���3S���!���9���A�c����        C      x������ � �      =   R   x�3�.-H-rL����2�IM��L��2�t��/J��KL�/�2�rS��3sb�L9��3�K���f�n@uyU��\1z\\\ k@e      W     x�͕�n�0@��W���X���U�"�I 7i�ZJ�.R�&�ׇk����Ȋ�q�CM��d�t�z{��B;����(P� �@D
�0f��^��u�#� �{u�����o?R<�qA�S�[�}�1�ξ��[9����/_?��km����O?Փ��#aq��H��e>����!'ؐ 53$Zn!U�Ll��@�B]Ƴ/(G��Fz)wVq/��a%��#�}���Wբ��5]ȋ�A.�I���1�CX�X5"�����z�1����B��_:e��ߊ��p�
����)A%�m��*���eO������f�\�wV�
��<���Aƚb	ͫ�cﮪue._�r"�U�W@�a%��"��	�$���:�#G�.��.�s�0�x��V<���-��q&g:O5�a�\��Vs�j5��뼱"�
�����uv�TR����x�ε���D���+\�P�ƊDC��+fx��LPŸ�B���sСZ�~꽟y ��@�m��vB`�o/'��|c!�S���,I��M�!C      a     x�%�=N1���)r{���hB"BѼl�őY��ڑ�mRRPq��Ϣ��G3��sܑo�����$�xK�je���0]�풃Q��.��јM��d�4���z��ԲͿv�7�c��+�k�����s:9
kb�Ke��O�c�I�1x�6}a�؈>�C@���q�ʔغ1��a���E��Zc��s&�͐�K&4��te����G�5�2�!�Pb'��pk��&��ю-�0u�DjH�2s��o�RS�^�      L      x������ � �      [   {   x�u�A
�@E��9AAZ�z�t'���1H@�!3�_AA(����ߪ�f��ǔ���b�6�d��@����d�=�%o3�Փ���Ks�e�CZ$Ҡp=yϢ�s���}���FI�/�~i!/� ��LD      P   .   x�3�tL�L-*��2�t�S((�ON-��2�tN-*JL������ ݢ
�      \      x���I��X�]W�^����VUWI�_Av�����4<�����d��w�9�N,Y�lY�G���o[�oe������{-���z�������?���o����O�ǈ�������~��k�Σmk��<g�W���W�s�����6�Q��Oo��9���_����Z��w�ƹ�Y��u�6�^���|�>�?�4�9V���������6K|~ic;������s�m��	{?�=���֯9���γw�0���2�(�7G�ñj���Z���QƊg�/�G��2���}m�SW���;W��߱&�{�����9k۷X�y���G�߷���m��ҫ�;=}����w���\�7��m�Ko�̽�Ɗ����bm���^����;�ǧ���o7��bGV|o���Z�+���5犿aMۘ�;�ڨ�p�Y�6�[�j�#�6v�]�`wV������Ӱ�k�^-w-~���>5�j�Ӄ{g�<A��챗��h�~�Z�R�5>Ot�'������ܴ���m�9O�?�|���$�q�F�om����؋��_��ewbk�V���U�/��^��-6�\l`��O�b��/~s��ٟ���o%V��O�{���u�'">7>���+�F<��.nP<g܊X�x�����W�8Ƶ�}���.�����Ǎ�w��ϲ�Ĺ���qJ�n�j���I�5�6�)�y����4�x����{�7���o��8��=;�:Vf���Չ�`]��Ϫ��s����w{�o�M���d�-�=>�S����������O�I��w�O�|s��O������O�1���Լ�>%v������~v���n��[W�s�o���.�|�����o��k��Z�bG*�k�sEc���s���Dě�I�>4>-����5۪�Z�N�I�o��bM�v��B���,��'�'���q�1���':gc���T<��S�'~�p������37ɟ�k;�������qG�mVxo�o��Z������Oa�x�7�����R<��}�DZ)nQ�<�/ֱ4�=N8�Z�C|c�^\�x�X%�;nJ�xo�O��x��e���ϸc���^��o��cv�8':־mg<y��'%��=
+�)v?��R㒟���Ɠn\oW���=x~�M,?�<�?�����6΢+�z�z�X���x��gg��k�5æ�l|������ �O�F��0|R�[o����x��ɸ�o��v�9�Zcm��&O�=���·�X��"��&�M�~#��O�9�q�+��]��|�[q�y�^ws���V,��Ǔ`���9�l?w�3��$���걒q�Ys~/6���3��a6��_q�Y�X�}����9C�{pƳ�n��~�[�c�⮟3�8"��ǳ�'�=�u8��q��6
+����ّ�'aü��Qb�b�X��{�>�3�z�Y!Έ^,�(��k�����?���Ө"~'��5�tԸQ�u�@���6�&�?��i����<�?ߣ'��㺅��]���Ɠ�|R�>�����;ރ؂{�5��e���?�a��'�����a7�7�O�/�N�`DU��㤆�	��;ioc��^�7��?ɻ`�:�J8�8�w��X��u�~�l�����pF�O܈�N�}\-~��U<�K�],�X���7$���c�o?qJ▄�>��o�C��y��5�.���A?v$v+V0>���Ѻ�C�=y�<C�S�d�S�u��8��1��Y~���T�ӌS��Sc�"�8������l���p����܀�y'0������T���v n���I����gb��Bq�w��k��7�%ˈ���I��ٍ���'�`��qn�0��kD�qB���
+7�b"����a\���[�g�K_�b�����q�m#~*q���Wbu�=[D�g���3�#�l�;Z���_����Oǧ�j�qb-��X-�8~�$
��������:�/�Ը?q���E�ϓQ����$����;��b��f����ϱqru�n<��O�����b58!��-�K�Rz��Y�:�)V2֋,����2����8�]��,���$n8q�*lc�JX�X=�L�6_6��'č��pK	1��]��v�m<ن�&���#��`Y��q��,�|�ܸ��"�Z����Ɲ
��Y��19?cFě{�o��ȣ&^˟&"�w�y#�w}�o�n���.�;>;~��jbE�2��'{4���9q܁�}%��?o��kog2n���D��ּ��� ���_�?�ω�oMk' �B��!_.G���B��� ����RLNU%��╈�'��Q|lX'��A,�-�~}s{�nvL�vr����fb����nv�5�&���w����kp�7�c�f䙱���k]:9�9N���N�|��Gb_���GFȎt�ĝ�3����X$V�}4���Tc�oƮ�j�;{N��|$�)n_��!�,� |$���]�8�)˼ox�;v��~�1�x+�"����q&'�ڜ��|r
��~����&}��_���-����|P���',���8�#��3x�Xĸ��a�I���G�n�!��9��3K�V*�.���Cb���w�xӮG'��s~#��'Ɛų��ē��x��s.<��z�D�L�^����Di���8}%���}�Ӑ�v2����Ո�7�S�Iƛ�Oc͌�+F�jO4�T��~�������D{�Gį�s���)��v�2e"����4�U��BQ��!���_ }��N�C8=/�8�Ak��"�6�SX�K�D=�7� +q&��#F����£��vX�X�Ȗ';�:�i�����<�\���;.��Ո�Vb��c����4�I�kpR��E��څ��VW?J�F�n�Z�/�\�?b��7���4���}rw0�g�/p��ڑ�p��9��1� �Z��v�D���DD��
�O'��M���q�+�Ë���l<�I�j���2�����f��pl�D��sҺ9d|^�I��kx	��W��\1b�x'bgr	b��)X�6y����rW6����ſU���w�
M�~�OX�5�m�^k�7pj���Cؑ���,�t�������q�:971k�z,V����Y:Þ��&�������,�Ex����k�A!=ZDdnb<�)���g�Z�t�4F�aM�D�§Ƴ�-����)�o'6�$N��ky����rmO�6�ka�6"ny�� ���u"��7v7�mc�o�),�t%��[���_D�]Ko7���m7��,e�ܼ� ��F�M���&�x'�!~�3������!���oQ��o1Sſ��'6�<|�I�"���wyg�=��w�i�"� ����_�*�y�`�yE����d�v
B��$��ޕ\��6�.�;n�t���p��I#G��R����c���(^�Kd�8�m�����A΍�"�!W�� �p
`���x����־"���7���U���:P�e$��[:��	@�eP�5��&�f�#�@T��������6�&r�o��M�y_��8���o3G%��U��!��#K��&� 3���S�o=��a[bG�>�!��l4��f��l�H����m,q�Q�o>2>��	:�Ս�N�JՍ��P,�T��|@v�p��K**����T,�vX���D}�� 9�Tn��%���6+�C��c�"_�s6��r]/֕S.ҹ@r:�:������&F��;�X����Y�6q�E�����t����>,m%*�,��������4��m�Yx6�B���QG��v`��G��1������h��=���e�b'>��=��sB9gF}/x�O�Xd�EL���h�N4��'��+!�8Ad'v��ψO�?�nx#���*�Rx,��C=�"�g�#���2V!�t�j��2:�Z�8�^��h(,-Adu�X�K���
Y����z�8�;w�ȥ��߄�����e��|z!�%��}���-N;بY��f�LD�c��qy����RIHwb�� ���}ɷ    ;(Q�WP��7W�qƊ�7Ѭ�sﰪ�n؈B�K�� �'>���w����k8��~�>�A�2�w�	���1>O�o�ӗHI�޲��G V�Иjx+A"k������Ҋ��=�,�S��w�Y�ęh�jձ_�G,I���������q��C��<�7�;���κys��'�žRm��3lJ�!�)��8�\��vuj'�9epSq��F���e�Tƌq�c�㴄5�V����	`��6���ID��3�ۈb�z����Lx�e��s^�^�܀�W�C`y��V���P�����6�hD��J	9k�1fJ����uo0V���F'���������7����j��������K�����0�l�|�	���g�]'���S1 >�
u�Ja\@TLtt`��=�fWo��=�:Efn0�/�8�b��M�r�)ۨ�qs��n�����D��vnd�+��ۿk��k%�$�%2�8~0"�8�X\�#���=�[�~��,v�F{QQ4��o<w�t�g�x���Q�Y�3�b�;'JN�KF�+��� ��T�E��F1K$�9�<��Kt��LL����oK-�s��,���v��q�#òp�c[�8@���5�8�_��Γ�J�w�&
�E،�#/�^�+nU��ƚqc�'��}$W�H���x�X'�ap3j����!֪�^���E�J����<����/Osb	�o\�ߏ(�k��q�#k�u��؇h��w���U�os7.ڙb���-���Jl��G�w����Z�Pyb}}��i��Հ�0z�A��@��8�Ď�h����R;ߍ���⃀�Rp���[�*��=��㌑1��ґ�tC��^=�ktq
ɋ�u�8��-3T��<��$n�˺Qٶ"�ĵ-�M���� 7ە�7A��n2ԩ�6c��:��/.����q{xF�1D�`�ֵ��T��,���~.s��~�r66�������/�y���ϔEB�.k�d-yowВ��BU�H(��Ч���1��'mÒ��ӑ'���;��<�5a���s���x��yDH����`�N�>+��W�Vl��+?�h���(�9䃠��d/��'��!��3`?�3p^s�Ȏ�����z��حhb���RO��6n����{��l�h�>������d(=���i&N�|�	�M�g�a�ݢ^9a�tY`?Q�+�%���q1�l%�/�
1��A��!��<s[�o��q�"0:��#^��h�,2j���"6�>�;�Fn�'R�݊ؒZ��r����K6��§U0)je0��/��Z�ȯ�z��WJ"<��oEY9�Ta�4c10jʑ)��LЍ�U����c+(�����4�KA��S��fZC�H�h������,
A��լ�����?ł�P���M�4��&_��v���Aaa��2Z�fU3�^IX05J����!��T�Q�oV�+�7�͗�"~ r4Dݨ�v�6���)VAd������;���/�b�JT�#��E[V�Z@n��+!v�]���] z���&7���L0�2��][Q�dyXr 7%�,�dV�A����͏g�ڶ`�ə�ƀT�>�a`ga���r����T���6��.8(~/w�4"���nR�&N��1��/gĖ��⼉
��'��vjP��+Uت-ߩ��$Rɍ{I�vy�O��ӢV���>O�����0���*�BDx�F�p9\��<�pU�v��=�Wm��i	K7vy��k��x.*���[T5> �$
�'�� g���w�ѝ�}}�೶LŇX*+Kğo�g�ʘ��R��ȚL��w�b��<u�gm��9Kf���$���#GdT��k�:+�qxU��D�����&��N��f%�`%<yr���NP.��"��@�@���u�hYψ�1޽��c�B�{x�pp�Y�\����1pȺ���c��%�g����I��Ⱥ�ۥ_aS���^��R�!R+��sR=���M��]�̧�W�mq�m�W�9Վ��d��X�am�Xׄ��~N� 
I������ĝ�Ș�Q�{�`QDh0�:��l�����=sC㴃ա��?�ԙ0�����O�,��9�\����C7m0��B$��G!��;N:�v�q���1HKJ��Su�0W���M~֝�p+9���pm�foN�<�cF�SSɌ��*SωϹa܈t��y�*��Vd-9D$��'����u��rc�Υ��
2�O���D�@��|�u�\���DЊ9�~��JY���9^f(�M��ζ8�!��	��^ր*L�\�{D��$^+�����B&צ}�NR��P55�5�m��*�h|X���8�1O�+��?�+o~��YX5�~�;|6T�aY��q��.ڔ�-�&6򤱚�@>5yU�����uR�Y`nS����YM�n��LV��M�l�B�O�q �p<k0���_r�����"��<|j�28S Y�,*����eo{���a��|8K���D�;	��A8���w��E'|M�I�f0Rl�������\�6H���銐�ӹPD\��ӨB���Ռy�2 �������4D���1��6օ���J�ҍY_v$߇U]x�.Xd�1B6j1;HY�5�C�\��NXiv6�(̒j>)w���4�'� �iՈ��)�0,��2���$4Lٮ'��:����$�u�/8�Ɓ�q�.,C+:�{LbVGN-V���{?�=�VKD;�Z:��Y���7 �>�:2;��Z��>�qX���x�ά�h��s�b	�&ª�P4ɩ`�M�-+ݻx�w� �F�ZR��{�!J4��	���#Z�=�ċ��[$#ڰ���u좛X�)6/3ը��7��7���P��,�ߍ�ALV�V�<�uH�����A5wy��X^� �9Pd�sK�aOx9��6�\�M C��	�������h<̜��޸��OC����5�ҷ�x%�Iտ���>�d�����r��m��:�]<ݕ8,,��,�'�<)?��KNo� s���Hg�s��>�$�\��ĭqq*s�'@m���(�Z3q��py���'o�
�>��t���0���� �'?�k�������0v��a!�b�9��XA!�����;�w�� ��v������T>#;6#'�'���_������-�R�PDK,<t�����Yo������RZT���v�%��j����H�W��f�Fز$P�>��M��ݭ&�c���N]���8��&<)9�<�C�2Y6xM�S �'v�Uxꔜx
7��{i�A����3��*�j׆�b G�P���̳�_�ԩ���^ɴ&*(�����_���$�L���.�aZ��N��2H�����L��l��ҞY��0�q*��a�E�#��]�
b���͖z�,��� ��X3z��C\֜���Έ�t� �(!J�oDqD��-bb��o#��S'^������Y!ʟ�'�Q��/ss�N4�i_�N\c���it�sײ��u���M�0���3��p�̦��i�
oN�k��fb�ӊ�����Ώaz��6���z�ҟρa{?қ�c�T����D�'v#�)X��M�h��6~��+����٩��X�f4P2���ǜ�	�Y��ψ�������4:t�ԅ��n�#ޑ[N�N9��E�ٗh�++&�y�}�2d;�����?�Z��hH�b����#ZE䁛�C��H���9�N��a
M��Wж��dZ�jѫs�a��H�1B�)��v��ԥ6��g�u���%k$��S�,�\a���ϰ����^�Ur԰j�9ŝ\Ƹ�]��(��~<K"*�ސ�F_g�D|�Fe����P+;:�����xvxm�u|ͣG�J�ѭҒ8O0"�nV㾇s�E�\�.�v�"P�[v���awd�D�L��::��[�xM4�~bv%1�D*H��2�g�~�=E���$����~$|�	UOY�p6�^���f��n�Z]A|C����QT��;Y3�.A    ��CL;�5A���RlG�4�V��©���\\��p=��]F0^
�9�E���=�(�d�����Z<�N��N���x8f��ӳ�^n����C���ɳ�ˈ��d��)�i����ߴ�n�S�EV�?�v	'[p9¼���ߊ]ܭ�e��E���7;����g7Y���D"��s�$���"��7~V;HY���3m��Y٠@t
2��(H���N��E~K�g�����~�1`S7;`�W�en���8�[rTF5�]]�Y�(��y�����BA�P�A:V�j��f,����n�jK�3�P#� ֲ�w��t��v�������k��W���δ�5�5����P�.��<$���n�$��������ɝo�o㗑�.���N�J7(V����M��>%�Z�Ԩc�@�`;����&Z��NT���9������?�Kk��&�jK���sO�--c���v�.ֿ�b��]���.rz���7��!p�W��7麰��Q�i/IO�ɮ72���s�|LԜ��n�k-:I?���O�M�iw�����2��_�U��2����b��1��5㓛�
�xTZ�zyR��%֝`��#�^���A������'s�Fy���Y���5/� �>v���_g[�WV�EpU�%D��T#��r�#z�d+%tN�.[�5��9]b�tb�h ��Y� �e�Պ���M���\�t�5D7�@���D�����ٻj��
�ߙ	��Ƙ�+�N����uq�fV(��5�y*'�::^�>,2rb��k�ޞ�V`S��!�ٱB�d_ZO�]�.� �k�35@�}��z� r�쮦Rj�o�n�#�s���>L y��Şj���'~�L�oG?\��a�˟Nk�╜�ܰGN��g�����sq���Dp.0���71���p��l��pFỒ�t�2ч{]a7q���N$L�!��f��)��R<�bxI�jt�P'*��^��W�0I�o�#{¨���ݲ,�'�W��˓�lvyO�q��cQ
�%��vǧ�K �K�{���Dj����� g�����;��1D��7����d�Ϊ�8rW��(!s��.94<ܛu�eՃ5W�?�����s���<����;?��4s�O��1�M����J?K��L(��\�������J��ns6v��T�<��kC�i���%NXD������iY�M��؀�_�j�u����v���;�jL�>.��2�)b�?�Q�����g�ԉ���Y���;��k���K�U��/����=Q�mџ�uى�?H�׌
-��&#��W;Y�;�O@|8_2]�
*Ć�Ł;�!�E�� �Pa�7�f$�����Jd��gV��+���#�ױ@w��On�W�:����!�� ��+qx�M�礒L4��:�E�/�5��FӑA�{ɷ��|�3:�O��C���E�/*UVO��!=�}:�j�,�2���/}Y�P���YΓ2ſc�v�D8;\�b�(}a���Gf���/�"?��o���q�06�vN�3��F�K�$��[̧��c9�%4��C}����f��y����E/c�x�
����Д	��4����oE9��$@L���y�ɠ�"�"g���5X�力��\�K���!#"3����z)U(�fO=�*;X=�� ����i�2�a��
U�1�G���O��Dx�ݎ�K#ַ��k N	�P9}�KQ���l����(���C͓�Ψ L�~�n7B�8ہa�N(�����ެf�sB�Eg�P̲U{}[��J2J�]��@������`��'�_�)����>Y�sfAb燵��]jv�%����|ݕ�Z�ϟ��!�����V���m԰�M�F@�{۽��ڲ�Om������j`�r8^_<���s-�:=Vb���x�<7�ڳ3�by7ɟĲ��D�v��O>D$=���523�f�����C݁Cj��UⰔ�6��� �{t��$��?{! b�Ib  ���E|����~P������J�n�� zqW��*�h&v
oв\?�^�_韒� Y��Plg�'�=���������cѳO�\a�S�+�@�׳�e5c/�J��q��{�)�Ϩ��uz:�Y2�K�>��o�ѯ9���_&�ių?ڤ��u~�a�B��7�����[�	a�tG���ưT��.jɪ�WѺ�!G�'U�Ң�G���+����7��@�$�Yе��E�P<٭k7�'m
~��耴c���NfE�2H��
�����C�ֲGlLT���!/4��y6Pp�UA�^9vs��Z֯{�2(3Yk��)X�D�C&�L-Y%d�v>m͸���&��S`�.5���n����vu��p��QD���5�;�	�#p7o*12��57xf�u�y ��#j��=Q�3D�ݎgzFU���A-��ܙ��.`�����U�+�6h�`��Vf�&{�]!RU���
�7u����$';y۔�����4�X���S�����[F��ǲ߱X����9D^�ٓ}0�<�[��c���0��L�0�� J��񀩓3ᄝ$�J�ê?�A��:%5U1^�-�{�N[K�׌P���!Ţ�0�#�nɜ�ed�%�Fb����+�*�� G�E�a�K(υh LΤ����nZ.�n��k¦��r����L��ď�Lv3�ق�`�8���5��@]�5;����E�(�﹡�sXS��e퀔�QamV����!� ���iɑ����7F0��k�boY;���h��m��i�*�fL���o_�:�J�q��r���w��ҍ�'WI��!#R_�-�'�u�`m�|H�!|j�G�J`6� �v	�|�nF�G�::�&��7�$�B}�Pw��AKVOMt�x?�'co� ��y2�`�/c���?%.�'D�h��/���qy��"O� w7�f��tp�T��f�������6���PvT���A�4T�ȾR<�Mz�F���!K�|�q5�^s,�U`,���z�Ђh;v+�tq]�z������A;�N�yح�>�����	�O;��ڒ!,w����+���KUn�ׅ��ӈc�m��D%O�֗�I�Zb2��+�v�3및�1�
�Gm/�a�ew��W��ΩN�}�DA�ठ�6���K.�P�L�z�(���	wWu���D�7����-��L��C��_b�*\����(�Y�q�WY6���VD���z
��H�R���LD�n�2�x���o*S��Gͧi˳b�9����nC��?���Ӹv�����n��:Z�?E}VTG��ꍦ���S�y8����+����}ώy�P����j/�)L��9W��C�@���e�Pa涆@�Z��K��\ jMj~JD(���Zg3�B��Y�"�_�gK̮�KxĬSRe6������.�k\��{s��v�Q\��a��|f�N&�@n���I���Y��.ɊRѐ^_tj�]U�z�	'�ʻʎ ��ZE�6\�d�N5�J��3�s�)MB���k}��3��B�b���9U��F5Z{���-�I�`�v�D}�?}H��@�����E��*^��V-��8��o�]��� ��a�KU��F |�2��5P�eT�7.T�X�O} �E�z����U��<aj;u&쉓yI&������l������m�d*�_�T�}�R-���������~b�F�Ͽ�]�3�Deƿ�ޥ<Z�È�d����^�z^$��<��K�Y� �DK�����ߧF6�k��I���vb���K��ϟ������9����l����^k�5U���r'T}��rf�{Oկ�Z�y+}����M����Fr ⌏?�y��� P���ctF�:P\�������efG8���aG=��?;�Ͽu�����ա�7?�N�L����|�9U���G��B!�՘�F�:ݭW-H�< ]�[�Oþ1a�r�T/�(�Ria���T�������y�:�|^����Z��ۓ�Q��}��џ�*����������)]W�R.�Lʅ.lU����No���H7    ;�Q��b�*:Q�?U7	)OfY[��{b�wGkҩ�7��7�^+���������w��;��(����gv�e�$�G/���ݮ;�K�N�"*���4Z^�0UvA�y��f�t�;��LW���8�EP}A/T�c��A��k�d��:��0���C�9����Ө�'��UG���juНE\c	��UT��窿�텻��I�^�x����2sEU�=^��pI�(ͮ�g���k�Kb�b��yăr�\Lkdcd��P���|�qSZ*&/�\�*ʞ�V.6�r�9N�"����5�
'M��w�E��ܲ�,��Nd�n3dStʾ�E�U/��,r�aU�ѣ�vߙ�?K��PU/0q2+��ecv5�Nu.wU���S��O���S�������"Y?2;0y��/O��b�Z?y�xJ�����qPѪ��k6�^FFb�U��a|B��sNm0���ܝ(��e����n��YQV�Er���S�B�L�+ؠ��d��ё?�$�%�6"����"jLtm��5R�L�Gbw�,
�LN���c#���[zAP�F*ڊKߡo����e�AN������Oy�m�d{��ZeS-���Y���q8ic�f��E���O�^m�8-���n��?�M�7���S���+�L�N+ �-V���,;٦w��j�~5s�j���%ׄjɦn(hQ�#*��;��tW9�`�H[�+É��k�¡Q��PA������u�m�Z��+�,�;˥�#qʲ���9V��AS�\f�5T��j�]��wX����'Lo],x��CAA�!�'J�Œ�=,��}j4TL	=�$�^{�z�`��=�=a����2�vSU6��j�DGbd�U.ON���#yC=5���������H}��l�JO�BO���d�ۗ�p��ݝ8��ʈ��%�h���D�Ɵ.����W�!�&gݧ�U������]A+ʻ�o�Ql����xxT�V�;*U�}�hP�z`f��^���e��*�TCӛQQYҚ6uKv��K��үz�O���ģ�~zFr�kTX���S)�^9kR�J]�%��u�&߼�
a�à�'li�R�쩾���/��8	:�v1P.U���m�J� N���ՠ%�he�GL��JV��@��r6����k��1�<���6���usc�N�|���Yn��FW���nQ��ε����d70*Ԧ)*�jſ�S��;imǓ8_���fF�.�M���S�s��M �Vԧ�NT�\�[xʜ&�i��{��9Oά�r�w�6͓L/�с�PT�7
�ٷ%�`�ˑ�q�1�y\ۄy#�[��a�v��	rq@�"7[����p鱵�C�S��Fnp���Ԃ-��t�a�:�Ĩ\�8��K2�v�w��2��]˽%
"ߴ/�59��A7�IQ;-��f����>2��uF*;5e��B���������CU54�ҭ�wy�=�Uq98.�>Xm���U�!�<nϊ��7�Z���5�˨M�"�>2�����[��Mi7��;�4;_�)��4�-W�XzD��n~�st�x�>��ei2��P^�p��D�>z����d�-?�TC</�m%6qq���Kδ���iCS��.����TZ���]��$Ck��L!�ڲb�O��X�i�?l��NE���s��0ja�������/�Z�"�ՋY<YOM�c%gt��w���N��.q���R�Wm8ls�/:��#��=%;��f�E��hJR�k��_�z����k(�J%p����B�Ի�|9{����Ԣ9wW���y���S�zv�����gO��1S���U�r4u���ϒ��1}�bv�:7�t��t�����T�#���A��rr�nL����d9Y�h2����D����|�h��O�g���z3X�%;�Z!x����̞�nힻ$C[�n��`�æ��
�����U!�z3�=���zSk��,�:[��<�T��nV�T�g�������2_�}��,զ؉��9��O��5=��?�k>���M�9���[�QQ�K��,��SM,p���LM�N��t�7TDz���z�k���gM��*�ӚX��N�gXuݿ�\��T�T�K���n����3�#���gF�fwg�n��
Q�ǓE�5^j� �Jj�u,t���>�f�:��Sw�z��/�H{���VP;̮X�Rh�dƉU�����I3$&��'�Z��B;��.�.��~�f߆�n@ٳ���3�����]�j����R�U	�'�߰gNp*���D��y�� �x']d�S�����-5���~�^�]��Id��n��ty�����
q�;���O�]��4�j��~�j��'�N�i~*�	?��G�Zv��K��_G�j�&���EI5ipx�x��[Q#{`�' ۺ�L�Ug}�t�oU,�묫UB���uF�]K�z�ۗ7��id&�:o��(Z*�p7~��Ш$�O�Y��N�������>�.��
t��=��g5'�q��p ��|K��KFG�u�&��q꫿�\���2v+n�}8���:tv�ý�WrPs����.dt��m��f��2��g�����>sN�}���Xccvb��ji�>�$,{I~�\�Uk��q�yf�U�u=�yIR(�R���3�?���9�?�v��D�x��s�8wU�\Q~{�OcZdT0��h��5��G9���Ͳ>����d�O���Z��������՘�>$VZ�?$�A�ə�D''w���Xx�tU�f�)U�gR������%QE@��T�m���u���.�
��h�w��=�eU�I���L��Jk��j�!C�IٷOVr��7Y�ct)�d��0P$f�.ԚA�Q����n��iH�S(���8�e��<d��Hn� ���I��BU�С�ȃ���Z��P�uV̔Kn�5bU�d.�TU�#Ò��������Z)Hov�%%��X�Nl��+�(���=���r����[�.}Z��z��1��)�ZYW� \ǅ%mVl���3uE-��=������ndI~��44��l:�6�J�7��3X�S[���T�E�F�}���Zۻ��W��=S�Is��
�0T�9�O=�����%���N5��َ���2��Aj���#]�)g�����`ٝ�*G"ڏ�RK�pZ١�j���h&����xҦ�N���1�z5�-�j�t���\������Q���D s�w�K�L���S���n&��RS��֊Y�}�9��gB�s:�#�vNW��̖��p^���9��N��4�\��K���l��V��+U;���DY��k\h��ȹ�,ȷ҃t�f���cZ��H��fG���K����gUe4��v�d�p�TM��Y�vl�E�F/2A�6���l֜?�Lҟ��I�<!5A��[j��5�M]��:�0�]�(V�4:e�m#+֪�q���9�=�5p�;��../����*'�O��o��T����p��S���x�f{���;���e9�*F0��4�yT�]�u�w})��O6N$@u�}���{J�,���>���?`����=3|��{pA��@7�49!R�љ�v޲:ø�8G�f�d��f�+���_���N$����[u��v��W3���RE����\u8v߄-���l{��I���ȋ�;�=5)Pz��1:���jbub(��a�?']��*�E~�r�:���)��Z��Wyu�ADu&��v��#{��	�����.xk�*������^7�W%�R+G���p�9��VX��d�O�����>���<�*}�?��*����qfht��S������˚���R7��O7��(�jCt�;��0gNn�+�q�(5�t8�����ryrjnNY"�=�\�ƣM{뉉}�L��p�������I&��)��ԏ{�a�9hW���_�����r�ST�S����
��O��g�p鉫�
�~ ��/Xg��)g}� �O/=a�Q�ު.��!��&=W���bM�S�v���4z��
zvV;tv"�*�uG�7[��.�i_�X&B2��T���
��i�Q�S(�"|�ST�)����LS�${����TFu��k�r�:��d:�S�ָ��    r���r8�9ݜH�D��[r�T�Q�r��۰�bs@ŒG������j�9҇���q�U��']�S|�Yci3�O���S���J���o
�����y,{(U4�w8�\�������"���]Z�&jt�Z�1>��N\Af֌4Ț����ɮA�Ǿ��::��Pyb�Vp-�B�f:�S�Rl�,�[/H���
�O	��	���3�rR崣s1���:g\(�En���NV�{�3�`y��9;��wC�������[��7���f�N��S�X���֏�	جO/Y/N���'r�sf����.��W�r�����oa��8��y�q�"����mAo�²�H�*7DE�8�ā�5���Z��er�x*�F��V,Xf��*�Y:Ե����Χγ��B]Km!��K��tLϐ��g�����џ2 ���ZL���O������ѡNs��e�B�N�a��v�v29�ڰ�ʩ�"̖B����S��]�h�мb,gNNɨ�j���p���IVj�ҭv���L��9�C�E$��f�U߰�}���k@֧SF�Ѿ����~Oܩ�(��}V./��w���*ŉ���	��{��5a���1/V����;RNeQi)�J���
,��7�-މ��u���B�	�}�u�F��z~�45G�^,=*b(��7�	��wV2��=[(�����cKM!���؂]4S���j��M�ә�6M�?t�sL�ꒃlDoQDl:��(������J�5��d��~�ꌿ;�]�T�bYK���A2Z���Y�sc�
��f)�@G��^� �������ũ'�q��AD���ׅ|�ͤT�j�����<����:7�XTM�2�3�l5˲+���K��PGuɽ���+eM���t.�4��e^p�v�ƛ�p�6T�NQ��d���b��݀j��u��OD��UQ�]���A��)��x�]��,`��Pl|��u�����|�����Z���&��*,��ˇĎg����������ȓ�ˋ"z��m�5�nLwt�wY2(J�q����UW�� o�P9���5 �%Vr�,��(�������;�f:�ڙ�5s���v��N�%�S�FjΤF���ɸ�`���kf�=h�r*��D*{��7�^��踠�2�Y�1�f��D�9F���G���_��;kQW�7u��z`sZD�^�ԋ�v��i
�\��3������<����b����2�V�é/Vp��%��VM�\V����!a��k�,��vO��d��p� ]j�<ح��Cw����4އ���&	�^6�:��Qi�
�Q�����1e?��Ƽ�d�;[�.y��4�g�ԓ����ߩ�K�}w��t��� 1L�G-��Ȟ<��v��\�?�Q���JJΨ<��J���F�w���?�+����Z�s� ����?��-�C�GK`d�r��N�3��F�-���#9s��H��崆�&�̊�� ꠉ����5���~���H���43B�����5u;߱�?�Y�ٟ�N���Je�7Crϩl:55����<�������O�����թ+�ݦ�%V�Dx"x<?(Ŧ�au����Ή�5{	�e"�I~K��Quty�׻Q�,@����I��I3'����_�U^�|EsJ^�g]�P*]��;��~#5u�
i����u��aD�V6�ϡ�a	�����Je�6�4� :{~�*j��-���akFNEr(]�h���0b�J�&��ܕ��;���M�H�c�JN��~�]�{���ʬp#.簈W���ki_��V�}�v��*:ԝ�>r�U�/$���Ifn捻���Yw��*��q��O�c�����f��/�q�����Uf��w�N� Z ��g[�/��T-��n*���»>�2��~������+�8X�N8s�HE����0�Ƅ��j5��|'��OK]sx-�d]���\��ꯓQQ���Asv����鋿B��G��w����+"�j�L�T-3vD�d�b�����Ī�.�~��|s��j�lR�"_<��V2���Q�%#�'V��tb��(D�V��Nbu�&�+����z�y��M���
����ghگb�u����^�lNҥj�˹{̌rz4M��0o�)F�J�Y?�6k��[fuNW:T���?U�s|SZ7�`L��'7H��i�6���}����Ja��UhvֽHT�7���|���ć�2XE�T��y�g�����X��ԣme��5�g��z�"�﯊�E�z:��5p�:H��YWU,�&}��A�a���pr�3�T� ���/�c@,��C*�lfy����ߡ�dyٓ��J��*#�i�u;O���T��%NJ��+|�~��묄�ϼ*�`^�[喦vs3Z�N��j��)M`�b���
�$Y��������-Z��P�@&��	�V��5���ӘDtC���}w���GUE�WM̼K��f��KS�2�)�q~qd?�p�,P��	:���h6���\γ��ˈX��P�۝���C��iv>5�Q#Sv�
&�;GHv�V�`���*�-��Y�Q�v ��nN�K���y�Ui�!U�X��̐��=ԕK&��C��. :��j)��rF8q�X����Ę�M̺f�ZN�4�@�
�Ś�z��r:**/_�=�����z՜M��lY=GVAw�Оz�͍N�����n�b����}�xsm��LNXI�}3�#��~3�?�����Զ�nN�#  }�^bu
�x_�	��/b��כ=~+�='��� ��T}�5O�&�]��N�n�}8SkȾX�*^I������;h��T�֙�C��ϗY+ޤ�	(�T�=�v�jv���K�w��sD����x�-�mV�Y��@]Gއʑ��v+�E���Tin�9@n ���VU5u�?���Yt�&�g���i��NI����GDx�*$�Ǐr��pG�;&��v;�)y&؀Î<���Υv3��:����H�@��8��Q9������=5U^*z�K�8�^}g�W�!�������iE�(��jPL�$4��m�3��p��Ϭ�&K��1�鑻�[�Ng�J`���mS[��V��j9��ʳ��N��c��%�T�;#�ӵK���3#������N�Q8� u/n=:[J��A��Z��rS�mO��
�E�2��((��PC���	27x�`�8*�mޞ�Z"D/fp�@N�kY����I�)!���ey_-'��_p�ymY�t��5)&jtQ1��BK�r�r��&���*�(pT����Շ����M���>j��)�� �~ݟ*C�����9VPdxG�kvj��q9[�jqn��,�f�!�	᲻�5�f��N��1�
�|�����0��jj�8�)���{�bLkGĒ[ƍ���'��En'd������E�#S�Wtm�[��s�1�ҫ�0�Xb$�+P�yG�OưwE�*l�W�ɜ#�&���ש��U%:X�=���)U�j�Iw.�aǁ��L�w�t���Z9����]4h�^6ފ���wN+$�u�4�6Y��`�-�b}5+�N��7���:lN�PB����n�%��L�(v8�Hu,<08�����ZX'*��E��eU�1�	7�wKĝ&��.�O%��<\=�s�c>3���0)T@�`d-zڧ���
Fe��l�,��"��ʚ̯�y�Z8��Y�oŎ��>�b��C����W5;���<3��OUq�P�圉�<��v6��Q�,!9�}}Ԥ9�ɦ��?�P�)<E�9����J4�3�4΂,�eo���u���
4NSK�����T+*R���P'N�����Z?V]n� A�@��<��u������2�!�Y���N���4������Tb��IQ����@���IE�+�{w���5�*�os��ȹ���RDQ��Xq�ݩϾ�xyu���P��j����n�T�������}[?�i�v�����T����6yU#��Tx�s5ə�H�7֔5�s�>X�N�~���#�쓌�)��h���Ns�q$+�|�g�!�6��J�$��V�Na�ݾ���{E�͹���ߙ�M=&��R�I���P9���[�h'Q(1F���:�'�)+    �@VHc>F]��F�S�Xc��O�E7g� 0���)�8?tȎϙ\�ޟB\�a]��s���}�v�]�d䧓���޲�P����K5�d�?{F"�L��3��kȩ�V���
��^}b+���=>Su,n�	�:V��(��I[�3�V�pr��C��S��@���8MLάxH���TCx�0Ҝ̠$��K�['� K�� ����'��TgM�ң�.��������
m��=��*��z�L%1�c /�	��挥�2L{�dpWuC�m;�0�;���Hw��'_��c���0f�R;r����,�s���ݻ�4�C��9?Ƙy �1�3�^'�ob?��r��p�4��O�rra{��(D~R�������/,Җ��	/;��7/�T���LH�Ƙ�T|d~SĚ��/���O�#m������8?I���|�Ԝ�z��q����\����f�d��^NM�bTĹ��9%��&���9S�YS)�~K�M����5uf&>{��@�Ci�iԝ�1��҄Л#�X9���PG۝)y��]� t�0ѵ�LxTN�{��C�v��0��nku3����vʦ�7;ԪG����K�0Uy�[�g���8��3Y�j����t�vg0�3#ׯC��A�x�����e��jp���s����v?9{����2��T󑃨�����H�P���]��[�<<dg�pO�veg�C����t�dy��;���݈B���%P�/�,�[��ݡ2�fΡ�9���oUM:'�9����p��&rZg/�n�3��h;�g�%R�3�٩����y�8?�G�(g�����9S�y���[��F���phy��oU�R�Y�ӟ(�MVJ�]�?L�nUz���@��$�U:�t2�쨜�4����uE��r���8eo��bA��Oq�Wv!������ ����{-?6�����&�llɎ����0�U�7#Gt�����X��J�t�4��s&6�+��y�]֝�c���]�X�#�r^8oDQ�;��Z��-|�N�-Da��B�����T�%
�Bw|d-�O7�.�1u��E�C>,�T�~���S�k��}X�������*T�_���A��{-.�}����x�j���L'��ԇP�ÚYbl�����A/+�g���V��v���A��O������3�NU���>�7F��CO>���P��맾�6���U�<���fG�� G��v%�����6�<FoT�Α�CUM��*/~���}w$K�p��<�8������:7/�ê-]�i���Ⱦ6����m7�6U��L
�IUsə�K�<v�:�O�6'd�7���Աcv��)���'�Tif*bT+����L
C���A��ȝoq�)�W�4���^�����oE%M��R������J�_���ϴ�"�Xv~?i:�|;>;3��<!�4&�R�-yUem;*xn�����r|��B�g9���3���k�VIs����@������ca<����ՙ�ӮN>��7�^v���/c�>����{S*���[��{���K���1�9Y�a�Ç��v{/��8E/���7Y�>��r���n�`>Q�"��ݚ*#M,?;�+�.�%��z��T~�w^Q�!�hC��;�>��L�_T\�N�+�&��L\$D=2����+x�~Y��8]��_Nי�aFlXo�9] ��;OՎ@���S�V�]��Y����iQ���?����f4A'�Vu�k��+��E�\��_�������`����:?��~l�Û��e���|2���v���10��+/1V%�{�2�cG
�5y�p��p�#䢾���
�3��'���Ahb�|��<�CF*��c뀓ޝ���i��w]�S9^<(�m�AΑ9����.F��}bG{����?��?��KO��QiR���Uy0����-�ͮ��A������Q�7[�����Ω�d��6�Ƕ㪜@���n9ܛ���a4��C?'
Q�(��u��C;@0�H6���������F�꠰�寚�ڪ�+bb[+��T�Lu:���&&���S�����́��ʛN�!^��8��m�p�Ș���"j��a ��h��B�n��qDE˵�(e����٤��}R�צ�J7T�O �vX�W� �א�$Y%з��;x���kIX��p�4'���O�9����F�*����++谼%�6y��EL���	�9s�xP��I�,ҽ��.AݶB�)E,���L��.�v���Z�Š\ҫ9��Slc
:-k������x莔�`�XMDf��w���ҩ_i.���D+
8�#������EdP�PVw��c2	���MGqfL�h�t&����x@+�k�H=[&r��p="j�g� 
����� ����2E�Rΐf�*��@�nS.dK�'�yH�D�B�J���G���@�t�{��t��b��hP� �7�ha�Q�D�҈�C�ўl[�DLbn�A��$�\�2I����LP�)�j���J�iq�*q�Y�5G5 ��r�a� ��K
̎�hv{)���U7���g�@�=���m@Bf44�00�!cǶ�:����ʊ��#�e-��A�ȱ��F�<�ln������$K�t%szo�ٌ#�h{�!dW���[W��Rb8�p�k�]�(;�'7/CQ�囖�3R��8�Њ�B]fDB�##v����}B��M���H��R4� ]�[�G$k;h�f,�":M��x��I��26Xo�+��+r#�*�{j�Hq	���+�Pl�o�Q&�a]�®�!�^͑��a�c���Mq7 �Y�C��Dx9�JQ�����"D&�AR��n�<5�|��L拈'v
�*����c�o�=�q}S$�gɔ�����^�[�o� �*v�/z��9t'Or�8\��Y��<V���zB�&Oc8���mH�%��o��:X���d;Y�a��R��VU������q��(�$IJM�|$Y�b:�@YI�ji+��?Rw�2(�F����w�	;^�A)�����h�tj�~�����4J�Do<��9�����8S��$��3��耴�;P{K�`��ѻ���� ^�!"'��u~)���c��c��V�sy%I�&�gO������O�t�&��i�ሬ�E�&���[C�ϕH�b���2~mB�, ����AƳ�ʤ�݈��M~��
� }���)��]���ݚVkC�l[��÷p*���0<�f��ak�.u���I(;g4��Ƞ���]7�2.�sK��dv%dE�l����Ò��B������e��e[�7eL�Cj ���r��JJ,��=J�,OV ��s#`�OAؔqئ�<�n��l\�%�:(��0���D=���d��!q���$�ސ2(��~B|N�}���a$�m��a;�QmǍ:�"� �YdC-��B��3 ~j˱����D���Q�*ux�O�Տ���`G}ϐ��N�V�B><w0�T�l�JB�+��Y�mG���7��p ���i�	�6
�7@�(��iΖcaE	����.�T�(E��r��DK�(7��]�@ୖ�<�t|(8�#�7\x^?E�(l ,u�N�>&�B\Jf�d�I��:��~)�ǈ����a;U
��v�mSvx��q3W�ҸI����/Su�$��$�s�6T�����H���,�4�#���PU�:��6�AA�Zv�l���lK��w\ME��\��D��&!�KW�mw�A�3�օ�%��-+��S�9��#O�Sy^[�Q�ݬ�o�&8����Fa#=ei|JV��Oٓ�� ��N�M��m�!�(�@�|�8��������b�4��lρ6����_Rzn�U�a�E�5��{��w�k�����.6�ѻ-�J.,�R�K)x������y!�I,�������7�r&9�I���?$�C���@��"5�|_Iy��Y.%7���6�nf<]���TW������++�`$��#4Q���-�ܙ�e��ɰ"Г$<LC�����eH�f"d���    Y�"n��Ey�?�asE�`NoU�p�d������@{∋�6��VmjBW�V�b����(i���	e7I������{�nO��A �v���u��p�vuX�O�z�9�R�� ����A|���cɉq)J�Qs�� D���H�
���)��w�h�e^��Iե��{�Q4�qw-��y�#��QΝ�)�l|r�۔��Įt��͂�Hm�i`�n�˵Ą�!���O2������b�L}wCѪ�h�����ҋ@.ϰ,��_�
��u���$E#���W3PC��J���p�s�ۤ�[\jR尧զ���d�X�m�|`-CX��I�2aU"IZM��\-�_]�kn�fd%]Q��>2o��zÖYZ�y�����݁�H�s(�`Y�4�@�1)H�Ȏ@��$��,���{�St)��ߤ��P&�%E˒%b,���҉��7mDNh��v� �Ι1mψ�(Tz�b�j�@��Ȯ8��oϲ��0ڙ�.;n�kH������<gӡ�?��:�
ʇ�tg��:X���8rkr��P�B#6,b���LGʙ(�c�.�n�c�$���)^э7@CN�I`�C9��L�Z�68!�$�^;qZ�R-�o���3��<��m4)@3��JѠ���IQ��fN�⏊�!�G��ɍ�)��9e�p� �"".,\��l��d���yPI���!IJ��Gs��&F�wXb�-G�/:�(���LQI�n�M,�b{�XW./K(xd%j��ib��:Y4�U7�R��[$�n��/"��j�m���ַ-W�T؊v����QVa���ي�q⶞�.w|8�z2 �ߡ��V`+ΐ��K	/ŤtY�z�Q���d�Cʎ:�DY��+��l�g�,��J)q2~E�h~GΏ{�D�i�C�8q����Ж~�e�7U�]1�(������"�ç#���q��02^��=�(N�p}���	�Y슙::�|���3v���a3ۇ���ԇ�R�`y� �5���k d>bĔ�c%M榥�6<'�2���ph�4�R�v���f��)s��MKE*����IjP��Q$N�d�!*�m�g������M�B|%3����j����K0`�"�!!��<�@��2QJ�R<����RPq�LS���?9pUz�Z�^�E���v�Ώ�*�_�om=G%����Lߔ��lP�R6M��"�):S�IV�F��d���e�� K��9�Q��=:�l�U?�\<"��J�I�jӣv\�_��ҟ�rԇ^�����*r9�<�r�%Z$[B��r� $�G�m��[Bi�b��cVG��p�~��Th�CKj��l2�Z� �a{Zw����m6Mڴ�4Z�;8�Iw)�ϰdb���c�7o?lHG�l����I�~�5��#}�w���<�?=8�8�}�L����%��!'�A����Dv�{X�.ю���[I��n�����J�
݊�({f�N���`��BA V�d��yQ��nE]
֓�K�6�������Q�H���]BCf�HO5�v8�sw[Mn@@z��)�A��P9���6�N�NlD�Y	2�Y�� ~�� p4[�����
�4��ho(�:�n&Dg���c@������r�,e��!�AS>��k%��(<��6Rl��"BU��c0.+�d9�s�.�.U���
�|�'ۘ�Q:�ٔC�&� IS�������׷��(���$��rX\��h#e�%E4�B���%M�i�j�+��mF�H�.02`�Z���5�PѺ�ބ�n��(I���P�TY�<Ęf�U�"(�`�Ѩ;҂�(-���̄��3�^C;ХD�r ��p�:��R��H��[�Z12�"ȶ���������!�+��:R�ې��`�"��#}�C������"��������ā�+�>�1�1#�?^GK�z*z4�PP���~b����l�O����&�CX�b�R�֟���]�帖	���#Ejl���*��������n��8�i�0V��A����M���P|�s�-�Ҳ��iU:���ĕBQ�0R���1S+�:<`HXD��9�:���?�q����Ki�����ve��t:�:���>=ŤQ����|{]I/��F:��f��MW���s��4�{��4$5�-�n�<�6E`QV�M�LK����=��e����F�g)<�q$O�摈S�#�|�Y��4�B����d�PO�EQ�V�d� ���*�M���A�E�M�%��u�x�^��LN(6C�ij�>��R$�)�DF��t�Ho-�v�e-N��?�x��`T谽�vT���5ٻ��`SQ�j�,�:n)̍Crj6%�KmrN��_G21��=�T���i���]4�֞�xܔ�P� ����eVP��:`��)�IND#w� A}�٤	����i۴�p�:��c�V���8U��d����:�9�E1�X�T���K���?�16�ѻ�z��F�T���i������"���ls4v�W��<�VĬ*!G�ݕ6�`qD��y:�)��ç��͈����T!���&;}�bF���j]dӕ�P�Fc��"6)%�,�8,� ֞]:�F�sz��rDtUR�l���S��Z��)�D���CN�ƅ��v�_���a6QT��i�(�K���f%Y�n���m��U�2�Ds��-��1y����M"�ҙD8�a�X�X4Q�$`"*Sn�B�d�zQ�;5JO��Xt��l;���a�!�p�(��S��������N�����Ǧ����֕�S0��3G H5F�ۯ&�j��qTX���(s��R�cIG�I�����Q��:�nJ��U�y;皣y������m� �d"�uj�(j��D����(IM3�R��p�T�mj?3��ʩ�
i�Y9X�̬�D�R)�ø�)O��)U"��ڷ�6�2�.#�P}9����6i�1R�������Fð�툓%Z���VLhO���l��A��VbSNj�ʔB����ȉ��Z���z*R�n.-���Ѩ�+ͳ�,k�ݸ�FXlY����1(�o�~��Ƀ�'�޲R��A^�
,6� ���5�z@t�Ù���79�Y��q0��T
Z+uS$�k�6��C)��M*�Pȱ(��h�ɥ7��I5�=})�%ۗ��g.}(�H�6v��R��r'���_�iWr����Nup&#�F�\Z3�M]s"n�ȕ����re/'މ��(�&y;�N`�rR��[J���A04��i��j�J�>�����MUz8�ܖ�f�����̗�����[�]���8�������|Z�n�Z������;��eɵ�!�d�96�;�P�v���8Ў�u]9b��D��c$hCh��n���9]���E�!)*Ĺ��BC �^=��9���OoŻD|yپMխT�2���%?v��#׻]9���EA2b�Af�Zp���AT�`p�r��d�f��������;l�5�R)�/��L0l�FB��>l\2DGK(�-ߋ��Un��&��FHm�#�e�l�t���Z>�Y�9�v(�C������Z�O%Ҡ�װ�k��f��R�z�)�_��R!�M5g2J���V.�ڊ��NI�׌���K�����T�O���XI*���G��|'���"��|Zq+��D��)�a>�(B�l��3�D�r��)k�>2��D+xq��6Z��G
׎�U��[�����X�(�o�����3x^Hf�.�Y<VZ�SV��X�s9H��8Eس}õ�?C������3<wSF5
m Yڸ�AׯY�+��׭U�����㋾��GP�&z؛�
��~���%��<bU3+��my���¶uj�4�+�d�l�H$}�Ǡ�'�$���*=�?Gm�M"�����v���J~8�e9��y�2Gz��uFǈ�%gYk�̇�p�e�PV*i��2�'� �uz �;"馷�ݨ��1�/mw��H�%�uJ����{�c��ȟ�J
)�R�g�hܟf��Fu�y��
奃��}��y5�?E��"��R�T=�& �J׽�O�=�y�=V�;�XL�eT�Ϧ{�|�&�R|Z�	    :ы�RW�Ŵ!�� �X�5+u�� ����������(d�亂�f� s��ݼ�=h���g;�P<P��*̔�OH�̡��C�v��W�eFU��2b�`�ɕ�CI��7%8���g�H[�e��n��wc���r Hw�4-����^�{_����B�����Ƚ�$�������>�e��f/�S�ӷ\�&���=��{���&��S��l���.��tW�9��'/_a��Y�N$V'Н�l�>��e�gǱѠ���	���g�$��~���ݶ@+ �F�p��yv��}�w<��5�F~��
����Y�s+�w^��?�`�@u4TF�	>n��?�R������w��Ɂ� R	l�����ܾ��+��״����.���Ο�#w�|�vb�l���}��S�M���O|�.�)U��.V4��eR�!�d �~�/�����Ś��}�	ۍ�6
i
0�b��b��2/���ږ&�ʨ�L�'�сx������M����k����Nh5�8́:EW�6DF(��ܱ�_
�m6��������Kc_}V���j�\��w
�6�>��fWY��@g't�I�4��4�}�=��!�!mS���/����C���9,"���m��;��7Q@��b��� �����_T�m
��2Uԛ�_�CEx8�Ԝ�e���`^�=lÒ�.�{�T���S��T��'��rk�b��	���K�=nqգ�NQ�Oۈ���	w����z�n�;�d']j�@����f@:��vuU�ʙ�T��x	���e�nޟ��I$������&�����;�&��f߱Gl�����H��~�0�y�?�/�@�;އ2����]I��OxzA3�;���,�WJ!���z�Sg����ͮ�ir�M&
oW����+��ȹ��j��<�9�Ք���O��U�U�Q�w�9�����y��3�Tu��zmZ�%��{`�9�zV��>}� �}܅�-D���Pҙ]���$Blʯk;8�_)��eE\�9uk�0&B�y�X��7Ǭ��M�l��uo���}�|	�hH ���y�6�����͞WX�7�w�~�k����Ê�'P�������9�{43�/�_�G�$c��
?@�C$�nz��w�A;�TxW̾o~�~�JR(�³�g��J�A�<���u����;o�[�Z�I5'���0��}3�o$������q����w�ǩ��}�s�������t���s��>S��pX8]"9��A�n#�j]ND%���Ĝ����#�����嫂}M({=��KJ�ك)�w��o�D
 �e3�@O��OZ�ʂ5�A6���h�}������s�7��n T�����V���L	��l�"����s���8�t.^���0ލ�o��|;��1l0x�_\���u��B��G�m~[�TH�F����8��X���v�M�=�oǻ:>M�Ӥ�A}��7�ժ�v��5���~y.R���N�h�*�Uk/Z�K��BO������|��ę ς=i�
/���N��u��{������O�塆��{����YM�w�/���oz���]Pns8a����W�ؼa�ûώ�V���t��J��n�
���?��Γ�S���~�y�_.BI2DU3=h.�n8M�t��x+On�����v��3Gm �� ��Whl�)0Uq����>p9͍�#�:��`�*��q�4���sh][L����4-����eڋh肰لY������4� ���t_�n]|�8W'Yʁ���MD������	�;�}����@���̨���X����9�8hy��(�hM�i�T������l��w�|��N�9uC�{Ý ���-��w�A����;��'�@�Am&�8� PLe��Cy�ͭw�]�@���¼��5�5�a��\Sf�Ux��@x��8�qdm��'�ύO����������Nӥ#hHO=���T'����]XK�c�����$�fN��3�Mm���hQER�
����	Wey�1��i��xq��X�jb�<�r�x�k��pp�)W��~R����.&F;@i�i;�?*7Z��guti's�f_���M1��s�� �]�!�w�X�N�'�Z;�|v�n,�`
���m�j���gJ�h�0�¹���n�C�\�k��t6�A�� ��x�Ʃӽ��{S�|�14�{e:���g�N��֭���EO0�tL�zcs���jΝ]4c �ߓ�.h�߼�Υ��s�@U��)^�$o���Lz�9qn&r_��h��n�W��j�|_������������������b�z����E����/�V�����]�{�fa�ہ� �����?4a��3H5����ձ��_��^3�/�5�j����ɗ�FMQ�	��|*M%a���uc���v�m���/����{A�����ߨ�ҏ?���'s�,�1u�d�u��)r�E��vd ��b�	���7`s �}HQ��X���}]�A�_ġ���jIq��?у�Gx�a �яP����l�6����6yJs�m����!3���9[����.�8cy�����;�s3�����Z}��){�tԃ��i���2�N?��C������>Gu熸s�TI�7|�q:��
uXs�8B�/�*���p��5a=Uq ���ōA�A#�/a��wZ*�F�!�.�A{��_*S=e�K�upG]pU\�`�9��זq
���z�'R$����[E�D��9>�Weӳ�Co�@1O�{��Eb3Y�,���T�����v����#o�C��yMl��?��s�p�5�z�%���O�jx΅Ѫ�o�,��欄��u�]�P�,�#z�\'DrCmY�/��T��#B��C�}L�w�גk�C�u�ҟ�e�ˌ�1���5Qn?��
��*R��>�n*����m�U��	�76ú�o��ۥ�{d�ߛ��� Ú���^~�v�����FM�&C>sm�ܟ+���)�X0R/�	Y޾5}�-�p��*�f�M��
X��y�=��x�sb��w���a�������uHkPx��L�n<B�i�� ��*o�׃ĝ�u�:���ܭ�ߎAH[�G���OLg��)hCi�ݺhK���c�nr����J/�=�DR�Zԩo����V#U�<�I�B�	J��ߊ���D֢3��wm&Ǖ�[ǹ���v��\g*�c��>�	�xR��u��Y8:Ϫ��7V!��6O�/�^��Mf#9��:F��>�N�S��Łz �܉�ɉ�}�It�_���T�=��.��wo|��l;NcQ�Ƕİ�u���d���t
������.r��Za��u���=��cN�U���#m(;�oM��<)0?�M9z;�Br����75=z�$=���@��mB�V�DJ=�a������X�i#�~0��6L������!��xM����;�pZ�@4���`PU��������}���'Ǜy��ٜ������i����������ĢvA�8.�B���o����I�������u��;��G�N{�������ܯ�m��������߄�5Y]'^��>���%�k0�����8i��==�
U솦(�n-�N�?{�/��W��:�	{�?��� �i�"�\ ��P��6�;ε�H�{]]�`��������]((c�; j*��TИؼ�/�v��Nt��Ӷq�Qb��pO[�u���).������	?�o�=*��f6�Wm�c)���J�Z�bs��j�o��wg�bc�mR�JPw���kw�.��ss���G[x���Y��W���	�m~�\��j~[�|���0�Tǝ����Ը�����NsҨ�>��'�:�-<*ػ^s���S(��m���,�\�cfL�Qp�X�Gw*�>]������|��c7꿿�h���m�C�m��@_��q� ,Q�Ҹtߦ�l�� ;I(������~����h,���"�[t#?u�q6 ��ȈA��c�7�Wx��6��y��Ǡs�Z=z���wv�c�KL/���@�ɝDEy��AH::Dh���9��˫��e=��K�!���1��|    N��>Ԫ��},���&�'�F�O�c vg"�>�t�o����/�헀�T����7�C�|�S��3Gj&ޛ����	oƑ��n��"Gnm*L~�=z�^f��X<�6�i���m���+���]+Ve�_�F)���"� =���}���^=�ܗԉƿm�z����:I��):�D�ԅ�c�s� 2Zm
5��)U�m���nKMuh8Ug�UW�������Γ6S��ݕf����+��}�T>$������Jk�����mZRMHE�~�*�x�o2�y�����'����<��
Jc *�w|MO��	K#
�k���X�&L{J~'�]^��G�K=�C*�'Eg�Ɓ���}U�*���!��[!*,���/S~ڲ��HŇ��a��	����O���{�����޸㏚<j��iq��Ch��:YE���H��k'$�Pxu3��l�.7sw{'-v�l�C�Z���P{��=.����w�>�N��?�^�Б�9��ߞ(�6W߉ZB�2q3u���Y�t��[x�]]���O����S�s�4W,��p;�:�DTB�9����CӾ<�|�`�kӅ�,�G5�sSw��ޣ�k6�LL�e�x7�}1l4��������|i4���@�슲����,+�c��R�l4=u�l��M��4���v��8�w��أ�����<��x��G��������Q���g�S��>#R�/��+��i'@�{�hI V�itOіRo��.Uqw�R<��f�����
*�w0��e�DA�Y��dս�ʂ�,�+⁛��Qq��O�L�
��g1���v�ej_n���f���¾������id��S-�r�Y�\n�<;'�)���@`���.yX4Tv��} H<�䫷>�8����9�pC+=y"����WGWE|jVr��峧 1�d��T`���Y��=�{���{W9$�v��y'`��������e�4���x�_�k��s�2�HS/�
�V����ijf�7�	�iҽ	�P/|D>o���B.zߗ��K����![�Q���m&�3�~�3�~��pu���ӥ΄*L�����iM^M�{������Зg��~��O�s4����Q�p)B�9���f��#���X1؞��i_�'������S�]�&��N��P�|��}m��q'�L��XS�7����irv�=J�ۣ��A�*�=~�n���T�9��h2ڽ�L���ޮh*�����2_m�n*�T�O��E��,�o�U��f�7)o�u��W��F1�����?z������XhBw�r�t��r��H�� ���M>>�
1ޝ?u������C�L��� �G�K[��Y����GwvR7��Nk����<�� ��IR�����&�["8�sg��J�nL��z�3�kP��=�n�T��D��vz�R�,��o�k�=O�z�pL��߈��oJS���l��Y��t��ig]O�M�io^��W���=X޾��D����X�[�E9�j��������l���m��Q,V^ԯmM�ľMQ�H�.6q8��9af�I�wC��͛�e~���/�)ڰ��3�O������|
�='L6r�1�Ss烪�8��R�l��z"��Ĵ��D,���4��b&X���\���ε�T��;�:sE좂^�	�P:y{(�����m��%�D��J��߳�BSR��)���6/�E�O��'�ƠD�9��A�F$�&4�L<�z��M�O����{R����ܙ(���%�{�L�rv,!��E�����
B{"�I���H	�C�G��"����S9�����?~����b��4iY:FA2�$&����T�y�A5B�ޗ�/�́�9��Z��"����]����`	���9=-�ߵ�.�������?��oK���خw��d���p�����4	��?�l����/�t=�<g���v��L�x\��%]�6���YF{���3+x�,(ԓMxV���� �Я�Dm�8B	��N�$�g���¶���7�B 	���l�L:�����.>|fw�ʙmQ�z�6��L٥O�^�=8LT;u��6L��o?��7mfk�I����a�%�ё*J��������9�+�tvNb����˭�ھ9|�`���t�3��)C�C*�v�b��O'�?�]o/�p�)�#MUr9O>|/��vRw=�&��Y,W�z"��:�7ߗ��$��&�/�� ü�Ra� �{34�N�����=l���~t�&�(��}�1F���Д��,�1M�y�.&�V�栄\E������Wu�U.���(�����_݋��˒�u��4n*����=A`���݆���P-Ս�)�gF<f�;��,t��sj�ޱS<G�K�����3����s������I�U�L!E�|
�|��'�����"������7�> m7ogMz�tMzl��8�A?���h%���"P�Y���C�[ʏ֣����pFW���~4 �}���t����uE#�wDݣ��Kݪw�vy�P������+O�[���Pzä�R�r�JôMyw���^L}
cN����J���`��l�%,]ޟiԉ1��to^�
���A<�"KH����`��n��&Ƴ����ɝU8��� ���,=t���Fv��>�z虋�9��\�o�`�׋��>Է=��By��X/ͧ=㎾Z������$<h?Wۻ�3+�9�o<|�.^Uv��}�l�w])��֟�#m�(�!�u��(^��tL��������[�b=Di7�DH�?>e�p7W�;�����zW����q	�{�]x�"fE�m������h4P|����B��y��-A*�Ñg�n�icy��������!�sF��|�T��1����Nms�����l��ƀ�����ǭ�貛����^��b��SUV/Z�D��o���gCo'��[dᔿ�#.��u�좻	�哮���-VJU��1�FZϞ�Zv�*��/�Ï���kz"G�
�\�x��D�#�k�����LXw)!�i�x�jڿ�뮸�b��B=�Dq�g�����������M�Nj��'�nf3���9�^It{�ED���$��&�ݓ���75ֆ�e��$����ŸW�;'��͠>�	�%U �A{�f"��JN�����.ԡTq���x����Н��$�}�l��8���"Û�d��0�2	���惡�A>%j�~��?g�"��.�F@nDks�5��1Ӕi9D9��W��z%���.�{��6�񣨓:G=��c	
c��VNg���s5N���F!�g�ҝ��9���Khus��t�rS�<&=p���,�N�6<*�oSȷ��|tk�;5ӛRJrU�{��k涽	z [N���J�XR�O�`��5q�7'�����.{�p���)����α[���>����i��u��;��P��m�e��@�a�����h���n���b]���y����r.]��n ^�r�.乪�TJ����.9Q��Y�\m�M;��9�.iB/��j�Yb��˩t�FJ%T�������'g��9���C�%k��%)��O6�~�^6wʸ+DS�f\��X�x����H��]�kt�X�U�o��}}��
To8zו�3:�I�ì�I����ȹK�NE���F�ʜ�"ڴɐ��K��������7�P�~tL�9�q]I{E���8�i~ڳ�Ccj7�d	�6����>U�ى�VM�Ep��6yqs;��'�{˄�ƙIi�s��q2�"��I�4��!i�M���F��tUŸ� �}��M��q���Eg��瞨�黽���f�S����J�>"d�wozt�Rן5'�:�E/��N��ΜY�bo��__�Yrz��=��h�q��!��5�9�5�6�+}r�|�i�F]<�f�a��S��}��L:��f��ӌ>�+>�ݑ��y����|�=:#�\te���dI}�:d��\��U��z�^2 Lʪz)�{:��Mݬy�w]/�V}B/�U�A��U?{ۣ���R�6����ڬ��w���ү��E�_�ͻ��i�ȝO�M���F�9�{�ʄ�ρ��[�.���n�;�"����oW���j��?U�K�y:S�n�Fʻ�    ��ܴ㋝T�?��~��������-5i=��c�Y�2Y&�x�R�amvx���RU5勌F5/��O��I˴�M�t�;�$9�;y$U��)~���X��Xt{b��n�����@of�~��Ԅ�{�ڧ��y���%}��ҧ&�J�������� 9L-�A�=�U %I������(^Rq�$�T?^v�K:�����ߧ�������z��.�M~peO�j?w��Q��{a�L��#X��n���3�B����Ώ��Zv��K䁪u�*4鵠m�oӽM�xZ��7{R��r�ܯ�o=��Ǉ��#A�3�k6_e�";}�M-*x���i&�a��hrmIW5ѓ2��˵<L	N��U:K
�*�S��	���Sv�UC\&�o��W�릷��"��'Ҟ-�|�e��mcv�`w>����s{��=L�N�yw��|�R��L�P}�,�������ϴ�n�5I1�gw������T.�Xgly�=���Y&���5U�-���N��;����)rg�$[�1M�x��<z�>˺�Sec�yHO?x	�M�V�f�N֍e:
�4g���?}�ɚ�25_��J�c��*���n�1۹��gI3�:4�<���K~�[�����7��1N�ٻV�yΖ� IA�;��)��^����2-E����f&1�n���R�#����M�̵{j�\@��!����ä�y����9p���=ˡ4�����T��o��}?�T�>��D���d�i}6��$%����W�9f�t�T~M΢u������k���mz��%v�ޚv�T�vV�#�F9E��%=���<����9��4yu�n�|��Qܸ�ٍ���9�V�&��h�{������ʓ({3�i�b\s��H�nlﳣ��ɹT�W�s�N��P�gx2�M����:��=�����[��K�ɮ^Ymbv�	��$�y��\�O)Ѡ���Wz]�X�m��xߦ������0i�at�y3��0v��*C�o������I6֟���j.�.D׭�./OB���B�!�1��0�돐3���a�m��^�I�޹�p>6����Q;lvIʪ��]��ni��4��o�Mp{��M�R//�5��lJ�S���OԢ_�`k�;=.��I�J��0S���Y3��>z�4u	Z�����1�|�3��4�+]��Mx�9�b3W����U��l��G���	kwNʭK�k�>Yu��Ѝu�`Ʃ����M=g]��u������
��J}e�pJx�E�����,��u�!$ ]�Ŧ�=s'����Bl��p�PֿwSYv����q�V�O^3�b P���t
N���Wޮ}�l��`$8�n�(J#A��R���so�l{�}|��VVD���J�"�g��&>�H�.��W��Ω��\s��OM��q�W�|~�$)Q��}�O����Ic�V�Dnf�˴஽XP��ez��bJ������gs�f[Hn��s�$p�8M�\��_QM�q��q���z����OUcY>.�RJ@*E�H1j#b��IQ�#���ļEj�ѹ=��]rn�������}QQ��sL�K�&�,�|����f���ޤ���On�c�����97E�B���Q��b�y�<��ެ��9�c:��>����ۻ~�\qY��O����4�I��\U�Zō�|�J�O1$s��a�'V 8_��J臄�˞v��ysb?u�=��h��'�����ˬ�-h��K�w�����&��
5a���M��6���۹O�Nśo-5Ӎ��o#+�׏�p�-�4b�L���D�;��].DO��M}�M�_��}��UWw\�}��̎:�w���3��AH�J̛��R��<=MW6��6����?.�6�,��$���l�W/oD]x�����*K�����$Ws���Ղ�'}�y��d/od��"8�a�@ad|3w�p��Ǚ즒A���S�Wy琪���&VI��s�p����\�㜴�Rs��DM��y6�GU}�J��;.Uڸ�>����H�/�׍N8���$�'����V�� mo)�3��n9����<��^f�/�f��-�ٔ�־�}�lO(	��E-4�E��Vi5=�%;J ��u��ݲJVi/�wo*^gwk��I�1��J	~�z��h�r���.����^L������˞8�=~���ק`䩲oL�<����#r#۟�mrQ���ĩ���ȝ0|�n�̅頍J�GT�It�7B��<%1�ܥA['�\�����4���>�w� �ۨP	�j��Ũ��N:�x�� M
����&|��j\ڻ�o�3�����S�+�p�By��6̳M����ECq��W�M�n�®�Ij~i9����h309���������Ο�vY��C��6�O*ˍO�e��5�1^?�ԟ�ſt�՚��u����??��־��Tr�����o�
��+\��N�'��aJs�Dw޷]˩��*u�a�^p�*j�'�k�|��k���ɀ�U��y�?������n���'\~���f[2���I���A��&��2�׿��Y�{��U�s��G4˥�}SjU�a��B�י�1��!����u�Y}��Ȓ�C���K
{�&�����m�w�g���|Ο�����Q�엗3�:.*�Tiy6S��έ�~����~�p��H��Oη&B����{��-E
�͔�[�c6<����\\��C���O��]��W=��-6��	2���K��_$m�j�n�R�}�^<�G`Ѧ��c=T�2q�/�m\�����la҂K/2��PPREH~�p���뎴6&�� K�{��n��1�ؖq�4���:��������O-�-u��f~dd�GL�,|�?�����?idQdnO�J{�լ��Z^K��Q�����B�l���??i�}��z�s8�R@�m�����A�]�yoC��������{MnF�ێò� $̃�-�F;�����2f����_��_
q������q�U�Ɯ8��B;���R�L�gݯi(r���Y�����6�/���`��<��Y�JҼ��1v{)7֘X����\U|�ǆ�zИ��m
+�lk�۶��ƨ>��X�.�L%=�Q�3��f�}��n������,�W.��'=a�:�_����Q#�MN�w���t�,�c�3��_t�׽�	��H��t��{����S�5��G��ɫ�Nc�9a���|��.�Д�;�$T�m�^�Q|�#dC�I�Oj��K�sǐ-�����Xm��������OM�֍۷}��"Y�b��w���3Zj-m���]'�/8���W�1��v26��a޴'�w��QmpΔ����G�9�I�f5e�t�J.7t'�ſz�>mĺ���7�ߺ��0�*3)��\}]>�נ��I.
^G�]�0�ډk*�-jG��]~��<?P�$���ۅ�Ѥ���[%�Y�y���4_3����=ꇇa�]M���������2U��no9���h���T5[�׿�N�e�K�g�+b�w��U���I�:g��O��k�S/4>.�}'�(L�%�%�A|!�A���ɣ���@�����l��$�����u�~����KG)�]'��9���������-x�_��Juu�����צ����^�乧�i��{�g����I��?�����?�A�f��&Ca�n~��&���S�W��]E�ݟ�1���,��œ�g�r�:x�dt�|�(�ݬ�hZ.��S��fB���a��۩�Oִ�n�>�2g��x1v<J��n�،��]�X���n�K)SD�Z�ڳ�ݚ� u
�f��e�s����V���7�Q�dwO}0F�|nY�2|O�Fz�V���6���̚��M�i���z����E�TRe�%��RH�l��l�a8&�`�'����d�B�X�:�Zm43�o�p���������R��ڻl�)���l`�`{�%��(���1t�����G��F��p���t~=��7vJ�_�Q,��M�P�=�Λ��k����T��>��>�qQ)ON�u��ʷ�*-#5 ��A5�%R��'��&1Jׅ�\W��J��_��j��@W<����
Ĭ�����O��s��'z�xz"R�p��-{U�Y	��Q'�6tb��ͤt�SJ����_�Ϥ�MjR�    �j��$�V�2��G�z�A<٩��`���?�`�l�?)�T&*�ٗ�::
���I�]h4�s&)��N��Z�Ov���/�E��*�Q_��[�ۤ�R75�;���������;�J��v�Gm�O�-S��=6
�Q������K��I��|�"�[��;n��<S��G}/�G6
��p��n	���C����$R�]S��[u�۠��8M^s��g&��zWz~�4�=���|��	�c����k�Ǜ�)��2_����wxbaKc7]���4��;�g��<l��>ٍ{��l�ҏZp�-�/P�[����������HAW��i�7�>��Yߨ�.g�}���Ob��Vn���̍��4�g���;z�&�;����Ͽ���/�l���nt��c���}̒�ni֘J�p�=�|�E��7_��M!��)���[C~�eR�>m(�(�iѡh<wz��ϯ���W����O�k�m�}��!��*�J�S�_o�k����q����Џ7�zȳE%�Ԗ|�6��}�n ����MK�ՒcRa���䴓�W�o�|Gc��W;M��`IP����,U�Q�.��G�J�o<��i~.��WS����{�lP�����W{�ot�͈������r�\��S-|�b�&��kjSJל�+��f3�Q�c��A��"tk�>[�n�]Z׿樨C3�[����;�Ko3.R�!/��>��N��K6�Kj�]^�݆ДcH�V�=���5�*�k%�������a"���.=�a���;m4�6FeO4��?�4��~��
(&�Pj�(_��u�z���C��<h9�x�j��'��7�B��1Z��tZ{[앛������g�˹�%�������(�iF�u��ܿ)�e�����"����s6%���׫L.�#3u������I>m֪�v�hS��Wާ��9s����h���\�{o���i��#	�A��ݱ|�Դ�|f�LX-�<j�i�u7ѯ��ԣ�v�rbʟZ��,��k��Bs�#fG.�4|�6�6ӻo\<�X����]�"����Tݾ�j"������Zw�mX�T��*9}�"�Ƅu4��Vzo�`m?��P��A��)�mL����0���J{�7Rr��\�4�z�:��8��!�u����ǜ4O�x�w	%&�����4��u�Zrk�e'�Ez�C�eܢK�m�	LB{O���f�g�^�볙l�e�2�.�������T�m��?Х�|Ǐv���IF���kҮq�g�?�6�v�2�$Q�{;�|�����C݃'�K�h�xn�$�`ñ{R�l�O��/�
�y�
�ŗ^Y�}Ys���4�s�T�/L�wD����� �_�$��ov���B��ˡr����������!�5��x{_��r{mp�M���b�lm��ߡv�d�x��ܧ�Gϻ1��kK���,O��&/��7~W�Ĳ��N�q�:��j�r�-���x|S_=�k��ӈ�R=i;��� s�\޼���J:/�Bq}��y�z���:ߧ��MAV/`�f�ή8���-�E9t��U��O�=�w����5��4��!w�s�ا��5��m�#�%������]��F�������LCy�,�R���(���Jz�i�ۤ�����V�>��	{��b�v>MI���ں3��R�D�-�A�u�w����4�b����n�tk�&����c��Mr�wQ&l�/�D��Ăf`����I{��G���k�-��m'��c��/;�jyr��u�3��y�ۨi�:��"m��$2_OJ��e7;Jg�eB�O�my�������w\��\{�(��i��叧v퉖��[u�;(�vΦE@ۊbP�vz�j�^���*HZ��tƩ�����O���VJ�.A�i���y�ψI��#�ɩ��w���Y`*����.�>7v����q�l*��+��m�N�ǝ�c�&��7:ݪ#h�y�Q~1]���b2Q�����({y�%ۂ�x⦖hwrp�[
����%,-�_RyәH_�d.n�c�s�.��"o��n�Y�'k����������'��l~wH�Y8B�gM�Θ�шN%x�ݽU�tFs&^�';�4')���d�ޮt�&0]Y�|N��3ܳ�M9>�Õ�'�ܦ��=���;�ޡ��gxs�V7���5��k���_�= ߉I����PmO��F�����ɠ�K���T.���|��1ﲿ�����Z�N��7����'��i����'��]��#}�<��c�W��L=�*:��F<��*%�h�X���;Ə�Ov5A�s��{��l4L�����+�@���v�(.��&�M`��x2�R�L���Y�c��^ƪ)ODɼ��K�-�[�	�n��Q���r������M�=w��1�٤_�d������0]J1ѓ�?��^ғ����B!�M�G���z'�ɝr���C�tzKlVOff���PY�si�9j��jf��ٛGA��߬��_�QN��aG:ߛ��������/hȎ_���[V%�'���3�2*IxwRu�FIM��{�����?�pL���.]�C+rb�������IdE�o?���<�[��߷!,�~��+��NGO�!���\�݁�8��Z;1w��8$=��]H�V��l�n>$�>l8��o��7��S�F[y��R�.���Ѭj��5w&��ٿM-ݠ���G`�$���V����s�P�e�*��P��yъ��\�<���s��7�s��\T�O�H02>S�V��G���ee��[�I��O��*K�b�ޤ%����+[�c�݉Ds���K?6̱�����1 �������~Q�rb/�o?���'5KS;��n~)�`wʣ1����;�m�ƒ���4���2;�� �NJ�E����B�j.��w�XZ���a������Qn����?��{ɨ:�3��7��m�Ƕm�7i�g����7��U�o������Te���%�ݰ��움kp'�h�;:���;~�:��G��sؔ�Z��C�"i�jKq�S��ww��4$w�h?�S('�w���v�qM����r�6my4Cs�v�ߥX�ƌ ����I*�)�Ma�/셇(_+�Qo�:��n���@�%�O��|����9�$��j�Y/�&&�Uҝ��=�LJ�>ۜ�]H!�k�}��F9�ϒ������̳���߼aU8���(5��m=�v��Wo�ByhwoUS�NZێΞ���wz�r�s�q��?���
��˓k��S_���i�w^@��i�ɫ�fUB�o�����M�9�Ԅ����^���P���u�X�O��l�]{ʄ>�8l�<y;����6P����k�K�٤���*��l����_6oo�/����slv������#L�����U�{���S���$��"XƥL�'�	�U�sT�OJ]���+=-��γ�����m���}�":�fw����g�U:򏓡�Cu���̦y�WRG?���b>��̟�e�j�\/\w�Ա�����mr�����z'��Y��=e����M�ȡ��]�yz��f�����}�Q�o*(I������6����7���}��r8ﾽ;-ȋоm�����̘C7��U��n�}�������)�aTW��������P����٘�>��_7�-B��̠.��/�@��t��tgx�y��uV��}t+g��!7󘾝i��~�G�l�������,UJ+��'f�9�>C�qj~��&l��_��r�������
���wQ1=���w���ܥqi/�'�����k��0�
`N��|����2�(�gr�t�kX������Y�q-��OLd.׃#�;��'2vUzܪ5̸}�@�q��B�S�_��q�I��d2i����My{
��e�HA\��McSm6~h�p�%����`���|��!���b�}R�5U���_���:��6�Ux�ķ��22�r�ۓ��>O�k��M.����c��pj��$�2����Ӆ�h�:�rn��/ȧ�1���˛Fi��[P:�2�l$;Ȝ8�<*�cn�]��&%�[���f��#�Qm-�)oߜ����mp�k��~��uH���?�M���u����)�����[i?H}t��'u�C�0�K�BU�ϱn����    ����N˶�~�Z؜uX��}�������c�S��%�_��b�[;��XQfwԎ�#z*�I�C�/v<�:Y=�6F��kC\m�R�wb��fXo�{��io%�QF�<�͓��JM���3jۓ����7%���C�J�z�_�)�O�j����j4U�c۟?��^r�6'�:@�h�U�1��I��ξH6��$;M��B���y"6�cN�{��
��^$��6�C�� O���{��� �w��>�_��^ǿZ���iiԅ����F��!Ugs��od�T7�X;���@���:�E�G�=-�����諚5��v?W�����{��>0�wo�$���l��)��^�I���NZ����N��ꕛﯨS�j��*Zx\�GDU���R�b��Uks���7��c�JG�+�0�-�ơK��7�2�(�g/���
q���5tv<����ClsI�la��KS�����R�:ߢѡz.?W�:q��i�һ��N��	e���oO��������O���{����FI"]�&���G�6C�%�GkwG~ą:i���WT	Ue�N����)>�'/ݫ���h�Οv��je�͍�,�I��5�|Σ �q+��©��;�C|����(�#��1����(5LJt������ryV�ĳ[�;�'U	�o�@�FJ��@�:�I�_|�G���fmX�i�w)���\�.�e�V�3_��ޏ���e���G %��$�r�OV��3�/�y+�P4G�n�����>��+}
E[��e19��#�uW�(��fvy�g��������|7y�|4�_�o���oҌ��>�}�9w��w����7��2�q�n��>�@M��z�c��{r}��'���v�=V�����)øE�+�����6�Fj���T��S���Lg ��>���#����ad�|�������?5���u�������{:�����'�	e�8۷�>i��9\�N�T�u����z��!�ɫ|��gs����)��,������1L�T�6�K9��P{�v�U$��f����ȷ�Q-ޯ?zK���3�wsII��P�ҷd:͜tG�R����������:E�����zQ�}f������;��0�wi�y:�rLg��*�aa5�I��%�P��Ly���5	З̶f�R�R�6�m��&���*�ZC�S`��k7�^�����:e�)��sk��~��$�<�?�o�B܌����yrJ��A'�?��砿J�)EC�*�#��ˇ��6KCډ[|C[k��}=eV����K+Y)���jL���ǯ~х(�~�3m��A�1اC���f�g�F��ے��r9�j�p�;$��;��7]�/��o�P�6���\���x�i��uO6n��J�gQM���rє3�M�F�y�"��>~�&O�;bOyЫ��?j��YQ�����,�[���?�m��������]^��S��e�r�� �搭:�RH�����G�+%Ө#Nl�����Ҡ�������]�r����x�/��M.���L��3R�1��\��<��J��T��Wk�i�Vy�7j�t��{��+]���7�xZ�>CP����pՀ���1|ӷ�aA��r���Y�(��l���\�q�u�@��h�!MM��=|�����ޗ��������\�&�����g8l	�!̜����\�;��i3���x�Y�n:W[�n���0w~�Z��~�j!w�[&// ��k�VJ�ع�@A�1���w+�ǡ!�sGh�m��w���֧�Y�h�9��1�I5GK�%o�N�(������XC-�y�a�d��ˬ:ϛk�$�m��m��c�&i�C"���v�"|ۮ�S�!X�Z7?�S�pu��ρJ�O��O���E�����]a�ly����L�ʙ$�/N�.�R��M����ӖB=mBl��K�|�?|����x����]�UR��x�@w�}�Ď{}�r�ǿ������Qv6��� :^�(ͦ���g����sQ��n�Twl�XMߎ�TSa��slU��2
�4i�R澥����RIn�ťup�r�-����Ju�7�_26P	ڳ���p>\�}�10ÿ�$bF�M{a� u����N��)��h��d��i���&ejU'��]��Ф������,����{��������[M�^
������["�+�SJYV�<��g9�t~�z�-t�?\��yERwV����*�5����^�uH�=��" 4�ڻ�~t�4-y��d����5��P�ׅ HV����#ҟ� ��SLm�$�M�=K5�b$,{�?D��|���<�������:�z���7�z���=�'D�e]\�_�*�q����/��M�L?�"��o6�m���n��v���Pu~hYeܼ���d���4�}6���Ƈ7O�S<Xm�U�����g�󷉛�ZjiͶ�k�O��&Ew���򚌘��S�vF��*j�U���8�)?l�㌤�TQ�l���?��p��]�Һ�;}������ �=����=�	�.��S��F��N�v��N�N��k��ĺ}�fK��iz��q��l}����7���^��9�tt�5I�R�x.P�Z'��
�yu��Bj�T~<�HFz��7z���B~�_��^����ٓ7��M6��	���B��zV�v��&v�4eM�{��>�q�ǋD�˩]VQ��5��[�%�Dǿ�>������ɠ�Ad��'OĊL7��s��N���0C$=5���ܧ9�fjz]B���L�J=����9Ym����Ji�s	�c��*}o�4�N�v��sr\;=���_�꦳x�;����ˤ{v�� �N�!cǳ���ե�=���48\B����>z�����=�v��⍮�s����9(��%�8��yB��2*~�w��#�4�ңw��-�6nm_�5ޒ^v�I��vo��o��ͷ����C�|L�.�qb\=媦U�5/w�I��n�7�c���sܬ�T��s��v�w�H��i���)��~�ܻ#8���7�ɺU̙�rTY4S^Ts���u@m�_v�M�#���ͦb]G�uʾ��5���^�T���Jݸ�P����G���DS��\�6tm�N<�ՎU��tS�o�o�/�-�h��"�#ƍ�����F��������6�ng׌�o�*T_��1���n���7N9_L�E^�)W�o2���J�T�aS���+S��e����ji�Mۯ6�~5.׾�rw*:}��c)?���(G��m��;����>s��s�O/(�q*L��~��C�}��I�X�L�>o��!�{ڽUu�3NS,V��z�/Z{��h���\Km����x�٥?db�^�j����<o�nШ�%�d�N+_�F�悔���.3/���qJCߜK�X��}��6��qt漣}m�G�xH�l��Nxb��Ӭ��8�e������m�h�''տn]rC��[
�{��8���ӟ2;nn��[�mB4�T���ē�����n�X��$5�F�L�Q"�����#��,���d���?�X��3����^ۆ�nm�8���^̓�#oo���.���n�x��-��ݤ�b2Z�����tJ.k��������[�t�u%�����AQ�_��2������g��ڧ����e'�
f����7�ӣ�4��t�%�=�U;K��7e=��F�w���gL�bh|��QwJ��L���HU�Gnc_��I��6���O8���:atc�<r���Kp!��4�1�߶Ë��13�6Z)�:�nh@ݽ�`V�qsUz)s�\�z�É���������ѻ��"%/�7�e�Ϯ�I�GF�Bq��^<����ДFک�R���ͭ�Ln�|���3i�����®�R�s��ɴm�n��C���e�*V�S�.#M��NQ:�޸��{s'�P��I�L2���?o&8�}�2��Rc:�o?�{w�B���G?�)P��߼14I�̭���0ib$�=hnY���.�'��#����`i�c��lOƪ=�N������7��霈r��������Z��#6R�R��|c`��DQ,���a�]9��x�$�|�����?m��h�zPw^��{��O�M�Ό����    lh/�_w���:�f����L�6��h�HO,ǃ�k��(a7bsE����QN�����j��<��Ӯ�<\J��N�
�D�k���lX^5./)�_\��솷��I��.R*;�F˺�\p����zGe�ƞ�����7XZ�v�5Y�y��/#������Z��t���gu�������Y��.7��p����Q��59�Î��7��<M�#!�vȰ��d���p���
�C�����c�ℂ�~<Y)��v�Ͳ�Cd)7���9�wi*��]�i��[�>�V�FN��h�s6{bS}�֖.��ezp�uL��$�߃���V���흽c���WN�Lu�tռ4N���ŘR�h��8]�`X��������V���񶤤�λ�!և�&�	�n��5�wY���aS��2\�(�?;a3���w���O���d��d��C��ɤlF��͆�{�HZ��w��X.���t���C�i�Tg��%�DZ��J/��)�a|�8��>y�y1���6�x��zeѶ�9(DV)8��w��:��ƙ�?)�:�VʜC���1��E�{��TH��V�t�mx��m�*�4)��*��篢�~:���5G�V��V?�;��f=�X��X�7M��܆����L�~�C�d�QZ^��}���$.�<>t2O��d����)(i%�O��.L���RW}t����[�{�
Z'@*J��6�iu��kuS=}�
Ҹ�s�M��I���r�Uh��rU�	M�*S�|����ϟ�
���n��[��t��x�����}V��f]}���m�N�_�:M�벶!_�x��s�f�i��W�1���67�|�h�ҾQ�-4z�yW�2ƍͶft8�_�r �������O�}B2������Z�����M�S}?��nT�N���C��\�t�>�_��U6���fQ��h�>*wZ�fh��|���@>�gDہ�Q)06�,�
᾵�Ph4u��y�F������V�Ҵ�Ϥ
��7��h
���g�gO�R2�TR�;6^�G�,_����h�ܦ:��y⣶y�'��t��u�_I=�Oy��T㌛a�̫?���%w�}�ҏ�2���<N<��s�˲pz?�X�K���=��;�I}G'3BC���n���.�ͰT�:��}��]Q��Ut3�M���~�C��l���S�޶�z���?�8���S��7>9��F�{��	����di��ʹw�r�I�_7�F�����Mk��]�7���_���2A>��q����Nȝ���1��$lՏ͘�#�����5�e�c��Չ�Fh�^�
���X����FΈY=�UOR�l���$\�x^��Ím�Y�>���+!��~��C�����X��(�F��ѳ���\���V�ydWZ�ɒ�>���=�u�hTm�f�mNdd��_������jO��E��F���`x�V]'�c�1��]���p�
�^:����vyCP��F���K���c��9��8%����(|�݉�R͍ha����;|��|�y����G���y�e�b���Pף �9���_��攗���yZF�C�(��v=����:��n?�||
9O%P:=�ڴG�I��T>RpYo�4�4������ͅHzR?>ta�*��?�D�|�A�І����yΜ�������J1&��E�j^�2rT���?&�:���mۇ*��o�1j�WቇAoL�ZZ�~ҧ�]��N����V_4`7��a���h����␩>�g�)��0&�Ɏ�e�뗮T�~#�[�!M:�̮nͤV�M�ZU��f,��5�q�%��?q��Fۮn�K{�x�}�H?i�~��c&�m���>�6�e����3��%�Z=)�V�hӨ1Ed�j�M���쁂ָ�!������xJ�zK��|}QדּI���y+���Ar��><%4�����q���6��y�9#+��ҩR��Ň�������{���d�O͞�h�:���U%�L65ٸ6�-�m$�̆S�w��ι��:���Rma�o��Cb����c��@�����O�@/?mu1���GEL�&;��e1��~j����qHWBrh�!����~��Ҋ[�ƁT���&L��ѫ>|�h������|n�_ݓ/*#�}驽9'���mI��=�sQ�r�&K���=gp���R4�?�=��%tA����w�[�<�M�W3���Oڗ'�郼3�K�������}�f�u�E��oߝ#��2���(ݛ"��k�4����-I���&Az����sbcSH&�jp4���~]���ܱ��:Χ��#��,��9T��@����n�N4_Ru���I��հ�G}��}�6��z��7���I���i���M�:�'��wU�����ߤ!�o��>.���u(/���wuvͬƞ�A��ջ!��UP��P��h�K�-S�e�����_�l�����Y8z/��ݮ�iS�KI���oZ���ߟK_'�����+��i�3u�lW�����I�=����m���Į[�Lyp��.�},��V��a��S�D4�q���0T��@�����9��y�d��1���bc����lSjR��#�3�7w�SG$�C�D���v�� ��Q�ʾ��[�2�D���67���WQ�u����K�g͡Лa��GO%���=}��F5�kT=����>���eVV�4�K���G�ly�0���f�x<�p2��R�Pe�f��l����<O�>����҄�s��oC���^�Q�q����t O�J�_5�--��C�`|u�����-y��Th������w������R�ZQkm��o�95���R�����6�!	c���X-R��x�;�����6�u���}��כ{��M�@ޮi������w0��R�rG�{=��q�j/]�j�%[�=��IYJ����R��'ʩR�����[��/�����~Jk9��bJly�{��3nm��R��~&��?L���c|QK�o����Pc\RuwI=M���4��lʘ!���A��(��0������s���Ɛ�������wo�mm.��������)"˓������×*E�ʫ=�}�[�ʷ��zU��~���]g���<������xL
��ae�7�[˹��m�`nb6R�����S�F�5[m�;^ǻg�6At���_6��{�.t�;��^}f�q;�P���}�͟�>Ix�(c�.礁�v�U�U�%G��}�LW�:���W{�w����|����o����p&3$�kTLɆ='yH:?���٨�6�1
�4,=�rl��sT�̭�H!:9�m6qJ�\JO�
�����,��Y��[�����=�b�3e�BҷD�9(?�����p��͇8�v��������S��X^�s��n)�o���i9{�vl���y����O��Cu���7�i]E���O�-V���ɜ~�\�>-�Z�-�Ӡ�2��;��i����=�x>�j���O�y&�*�9���&����7��99���8KX�+m����9�V�I����f6״|�Q�/b�F۞�U�\)I����f������.Xׇ����I��͂;�'+�y�c�<��J8<qF<����Cv���Vs`��on��9��;r�=ǥ�K6Vz�ӥ:�U�p�e^q+e]pg�G�55IO�F7C7ω̷���w�����=�?l:uVğ%?��޻�lĚ�Ok݆YEWͭ�rCXd1��;F.r�j��)q+c	��%��i7s㼗�Ǒt`\�T��$��lo�h]�ه�O��W3n��GU5���q�uZ��`�,�O)1�<�E�׻��w6���Nٛ�:�)=Gh���a�a,��>��4�_N��$�;��t��T�7}��RQig���6�uܾ��_����D���CNj�����?YZ����[v~v�p�2&������OW����>3��n�%Rf�-������Y���-�T�n�j�� ���Z�Mۓ���
�(r��M,4M����ҳ��:�M�4�˦�3��Q���U�4F��Q|z�ҍ7s��O��7��t���U�)l���gV����ǋWX�r�|uV��V��ɢI�gĘ.a��gӛ��Q�ݦ{hű�q���W�q�8���mCd���d�lT�]�����N��`ũO�g���-��    �K����+5�D�K��,0���/�W�Y������!sZ�U��3��I��gף>�Z;�4�m0v��e���l���"y�*�z��Ӽ
����@�W� m�7��/KS�n;��l�}sj�Ӽ��7�J�����M�=�]����R~��W=���"��N���<�<X�2��I���6�[ѠQL�]�޴go@^Ui�R�۠v#;i�&+΃��&��I���v߿!}��J��o�zeD�s�A��qf���9ԋq�`�L��W���Q�[7A>F��{Mu��<<�%��J�{w��<1�Ez�|Ƙ�%H̼vr�]�(���:�D!��z�_J7���Q?�������N)ʍƟ�����"�0�=Yb{.�"��6�kJ���4�M�@��,�>+_�GJX^ �����@��oS}Gb�Je�������w�¢TX'ŋW���Θ=�lpO��j�e�]�!���h=e�PTm���@��F���)����N������fhF#��e.�j|$!����&���f.����;>vy$QJ�s����Km�I;y8�[�	�js{ŒI�T��X��M��=����9_e��S�&�)c[�'�(�����?�� r+�u��s���1�A��;��4'��ō���^���.�@Ō��On��S��g��~��y��<�Rg�BrQ�ű�K��*��lGT���K��3E�<g��ͷ��by�����c���0�|U��?{�K���V6�����x�(1�7�E[�~��K��2R�9Ҹl?�P��N�U�EZ�v�O���Z�D��,�OOb*���n�9	��1�ª:3EZ�\���}�q�q��IYi��IҌ��bޮݍ	��w���W���$h�To��hH�ON�*n
�&��ŋ��JK~�CBl���z���>����/L����^���0�;��Քm�s�+<��F�Ym�v��Ν�D�y���8h>�; ��R�X��\����u�U��~�XUJ�D큎m�U�����Z'�\����C�[�Ԟ2���Njk�QNj�{��ը\���1�J_>�_f"����یX�_����si�Nt���Qm�K�nB1I@�YiM�N��S�Q�����B�ȋ���9�M�)�L��Y;���+�T�4��t�Fi��)���y�V�YM�7t��꥗ H�D��L��.=��t�WΤs<�x�O���mԽ�0'��a�3L��
��������m�XZ^��T}�\ɴ��"U�@�/K��C5�ӹ�S�L�/��{ɶ�	3�W���Y���guR��r?^��U�qvz����K�����qvn�����7]��a���Ώ�l���k�T���P
�.}�̈́>�3^���������s���;��a��L�m����6����5Ͼ�O�<r!�I��_=�����Rl�ݵ�Ig��'Z �:Ji�Y��|2?�Ş���ʏ�&7��]㇓�	�MnV�i�Q^*Z��8�LV�z��&��C�ش�����<'��4~�o�E3��r1v���.I����g�+�H��6�q���e��B��'���Ev�Di�RiC�f��4��n�B�t!��wĪʴ�-��4g�uW_m9Hs,�׍�Ύ��}��]�����{������N�G{'��ſ���i�ŊdTu��RF����}�?���w|���M�z�;�|�*6���~���-7v�oGz�w�Yg�P4c��b���YO)��$ޢ�Kݛ9��7���LΩ���Q�a3�xo�ces����� �B�����F����~�N4��:~{'��6͟&��OR��eu�\�e�R�mU
�Mn�.3�.vg��z#I�fJ���c��u4����&_0��L�T?�[o��/��S\�K�j�Rg$)�IK�So����mX�������w=���)y�a�Ƀ��y>�n�����>�_�_��|^���e̆s��c
\�z8����iarӥP9�$|�a돟�V�( 1��O��ߦ�k��_ϛ|����e��'c��Ė!&5gY�ݻ���+�}�7)R7y�����$�B1S��ϫ�{Iޢ[m�~ɇ�m�>ws_j�7���Z��>�	��'E�m�|U�yN2cO��&M��Lay�'�c_0��mثwtgn.���li��Zwr6G4]p���/�bխ�W��6�����&�͘&���vs�ɕd>F]r��vB��+��l�g����zO{�;Dx�Ǌ7]7���WE���ws&��0e9��Ρ�`�Hb��ćK���۔���t��Ҭ���AԽ[z�\�����I|c�)��c��O��O��Sjus��h����r����꒫�h���@����HoOwSu�(#ޔ<�=.l��'��>�����s>��|u�7[���$i���`.���ҦH�����H������DS�>���'"
I_�Sjj�ʺ̼����R6[���}w��߯rx , j���[l�R<�4{�c�xgʴ��{:q?�Rn��4�(���V�p��$j)��H��njʸ���<�X�l��99�=_���8�U�L�-Eq&��i�W4������W,O8�yf����-G�j�6�z��&�o�q����]��U��λ]�p�ڊl��7�t<W�3�~m�7��ILR5��:i;:��_�ͺ��t7�����9�7�������G�}H�R����oMI��#d��I����>���p�6��=��O�t̟9��쓮�w�����9w~� ��E�6��/O�/�'y nH<)���N��'35��N�L�/�����&G�j����2S�S�D.�HG&���V����U���3�I5�f��D�:$�]��� .��v��䋛,�;wo}�lP�ۨߣ:��C�����^Zmf0Hk�}'	�����#Q�y�r����&8m�ħ��mhm��~6�Po"���SU��ꦷ�9�S�Cԑg�9V�p���޺i{��.����u�HR[~	M�F���YJI.m�S����W�-�sek2�k��6iϩ#s���k�s!4+6�[�9k����z�v�@�w(��]�O�<]dn3�ΉA�DÄX�oK0=0mLNcl�V�����������F`8��v*��	Jz��$�$�6�w,+3�~(�:��ݲ��;�q�|�l�������������#�^���e�N~���G�J�VeF5�j�����R��6%�Z��P��){�p��zҿ\w q������лM��ԤOydlHJ�'��)�܌�2E�]Q��mO�L}�Q'~��p֐�8�읙��·�����Y����ަ���"��v�_;���=�v5�W���	r��/��=oj�i6�|B����r�|h"����\��S��R�?B_^vҢU����Zg�źtF��ݤ�������˹�0o(K�u�hcR+�s+�V߹�`�,��^?J�K2,��Aa�����ts"q��tHF���s�G?~��V�M>S��CjTd]�F���j���m#YJwث�\v<>��$������#ˣP��~o�l���G,2�n�NM�f������q�T���:����~��Ǎ*����1�"o�N'y��$RF�� י�s�ٴ��Cܙ�j�+��]t�����:u�%�����~x[S��$��.nҪb��m���<��(���� ����Ii~%!�?��lË��0��:1t�U��!����9�چw5�p���pI�;t�Ii�u��o�����M��UM���2���6����<Qy�k�>�3;͘[/�X��m�54�J���im�
"�N���j0n/4�{���>����B�n?�����{��wǛ��vk{���៕�ڦ�����_��9&��?�O-��e?��sAE��oR�O%��h2D���Nr���������~
l��������_���{}^��ݬ\�2[��j(%g�i�ѱwPk��o6Af�C���ۍ�C�a�㸬�P/_!�ٝ�g(x�I��&�=ݟu~ߪ�>�S%���tf��s���V[��i�^�b�yxp�R���6�[x)[��W���&������*\��|(N�RnR�5��p�G�\q��xQ�*zW<����{G��/en�i�IǷl��-㮚ӫw3    ��JÆW#�4�Q�c0����ZT�_���K��0�[?uqZ��ݶ���[��xy���ʭ6��,xH�U��t�<��_5�P|&m��0�n˩wdr4됳��H���IU��D���~z$өY�N,�ީL�Y�?oZ��Ďz�of�摣ڹѨN6*m�:}/�s��T�*�����*��Nʳ���u��w��{�ި;Fv9�V����VD�UB:��Njc�s���[-nF;����L�ǤU�?���-ّ-K�,�y�p��7!�j��UETN�fvU�( ��z0O�;��L-������Mq��O�
e�*C k��=�Ϭ;��^�Q�/�O�)���
M4.^�?[��hY�kU����9����:(���j��L�K}/%��7�{y�-� �R#�s�ڭ=f��r���n��4�N��&,a���[*]�����S�qz�?��N3�;��gXч��1����2�[�{/�`}9�u�ܻ�a�w�������=y����ŗ�|�t�z����C������`�v{GB��h��@��LA���&Q; e�}L5U��LS�ߴ=�4��a�~&I�T�������杻��r��t�e���[�/&t�t+��O��bRȥ�D�z�e�
l��}(MTF���>4%�'N��I�n�\~����\�\��/��N�&�VV�iZ:yO)}�y�$���6��eT���:�l��.�ݯ=NI�N/�#�����ګj�WY�4�����5u
6er
͞ߛ�;�l��6_�����;'S,b��U�-+�H�Y]~��N�KFQ�R�s)�w��a0?n只/�����5 ���(QE��B[��c=*����u��e���߮R}p��H:�:�N��O(Y�?+�|�y�[��ݞ*��V����@/\��iB����}QN��~yڛ��D��^�?������Y?�O+"�f�W�Lo�}Wӏ]�Ҹ1�H7��<��a'�)��4{C��T��I4n�ަ+&"�l��ir{�t�ٽ����"|��A���Sk�O\}b;Rmۍ\�㪉�VDo��ݔ���nv�ʗX��W�b��S�R3�ţ�n�N�\n�o������G���Sr�䯊��!?�aD/u©�6g'a?"@J�n����e�I��Yy5�&׺9F�b�%Iy�f�1��'�����-s"LRI���{�N�����=�c��a2Z!߷��E�d����n�-2�C]
zsg��������L�e��I��G]� v,y:}I
�R{m&[i��;"G��9��b_{���B�(�����H5G_����ЍQ&�D*����y='���R�5��f��+Mb9 c��Y�[c��7Y�t���}��^mGUq �c Ď>�&��޾�8��xY�.?E[2`Y�R�ƫ7'����j�O���;��&=欓����/�]��ZUe�\�2��^�g*IOM}�S��a�����h%��?�b���h�4=t�H��{�i��[*�n�c����F*�o��U��b�5�/fbԬ~V�U2��p��	�5i�G/��=�#��A���ʃ~��,�9	E�A����k���&e�%�s��?�+Rg,�	+?jS�*��;���W�q����ʷ���;m�(�����f��������+���uũ�Rj_Ȫĺ=�i@�8���IUz�miWS��ܸw��e�j���wOe;ֺ�9uc�o�>&/~ŭ�j7;����>��1����O��fN��[&MAߛ}:^�U*h�ݭ��~�v��{�sm�)�9:�GO:<Ļ�R����َU�a���CV����߼�{���}�����a����E�06{ �������D=��V�߇IWu��Cr7���~��b\ӈ�U���wq�f�b��& ��,vm`mK8(���^��v�ݾ1'����;�W3���|2��2����,չ��7j�-��d��@��%q�Sc}��R����b�9y���@�-қ���kkuL\פ! |$"]�̫	P��)��Y|]i�A�C�'�E�݌s���/EV��Mj�0�L���$�ҁu�^^�Q�lއw����='��g��z�I��[���N�5ylU}6�k�%ݢ�3c�o��7�J	�<��D�Y��oܷ/޺��h͇���G��9�7��hD�&k� ƛ�s,�צ"F?���ED��=X�{�M�'�-"����Kv]�#3�;��I�����ַ!��W�xF��}M}O.�sz<�;j�δ6^�"�n�gl�X��ɠ��Й�借XP�1+z�Ǹ��/���'G���v�4	>�iO�RH�crB*�<o)��7��J2i�)i�W�=�L����!_� Gߞ��E^�S~r��M7|� /-=?���O�	{��g\ZQ��+�q4������}hJNC���a=:B�~$=��(�Zo��������B������^��U�2&�m��7�t��UgT�Ҿ�Xhr�60�K/������%��t�Q�џ����ߜD,(�v�A�N��i�?۳�T������>}�N��ߧA�:�D�I>�LR��<��ϩ2�0O�у��w�F��7=AU�]��jkY#�ΤL���
��;��'O;wn2���i�p��,��.�(�Rߛ�����LJm���[�x�V�nI־��n�qMJ�j�VU�P�����3���FG*��J��[���N��Z��k��U���jd���_=�<&����]v�k2ڛ�����&a�Փl��N�߭d~�.E�����7��i��ҧ�Ҹ�ӬWB~N�B9,�}�Gn�����z(��n��=<�l�Ǹu��u�o�n��wz�>�6��v�p����&�f���U.<�eध���K-u�����ԁͲ��CÅ�Kx99��<8G�!��?��-r���̶J+�\D�Yd�
�s*�ȬuW��ү���X7�R_B�����x���&�+蒁�;�vg��z�G��;~�=�c���:Z�F,�$�����O�a�����8�V�5�KݰneR	�Nu�6{��)����^�T%qz����yv����O��M�tNz�����d�Um�p~�]K�Ni��=���ĸٰu/��f���	��09�O�TX�U�ܠ�'�t8b�[��H9�Zt��{��J!��|R�ɷ�y:Q6yPi�kPJ��O����(�*��C������#���.����wN�E�7'��jRr"��WU\�?=�Cn��䘾d�ܑ��Jw�;x�$:��h&!/~�j����3|3��܌;�)?j��G��',��_�����v�?,[罍��}T�F��OfO{���7�/� �q�����qR�S7��u��qo��a�&�EtW���..����{�^��N�����o����w����������@����,m�!ϭ�׊��/��ޥ\��l�N<4{�n��G�����w'����l�����K�!1M&��z�:��߿�����K����(��j���N�ϟ�'��!�����mns�:��R�{�k�m�_tF7���v�]��Q��_R�V�g���i����V�����v��9��ݟ2��C�Z��>��z�j0!���/:�St�I�� ��������y맯֠����G���/I�%=�~�1���R�8QOoՅs�Y���xo��ڇ����C�Ke��'ȁp�0,~���W��K6��g�J�>r�co�.��0�_��:R��ȿ��j�'إ���h��S�hW������/[�~�Φɼ�rb�:ʔ�T��>i��U*�Im�!=�-k�97k�fz�-����;��>�<7`3���677�{g^�0K�ISL���N�f�:��ί�Tr�-�� ɪ����e"m浝��l�P���<ͳ.���7,�v��?e�1}w��N�]�[��ɱ7�C*�l��o]��Krޗ��;��1w&�&���ط�w{��MFV�?4�&�^�'��;nY�K	���7�������}�P�$��n�JA>�Wҟ2ڮ��=��'-��'��jw���]�x sz� oB�����il���o�o�h�l5�S,/�ǧz�O����F5�<y��`bE�n>T���T����_��.1������`��GY�y ��f�$    �Y��ߠ�=��ȴ��L:��)����Q�OK;�,��{�8�����l�8z�*�A�}�B��Fz�Uww���:��=�\�/������9����7{�4��3�R����KĂi�R�'=g3�hK�6�_�7Hh{�K��V�#��p��n����I[�o*4��oT��M=��+G���)}�޸ڐ���G�fS^�G=��������Gj�iR����wNq�ՙ��g|���n�ި��u&S(���fuI~�T��/E񋞷�6�=��(U�=��3�x�����n�?�v�!L�ĶU��[�鶕 x�6���?0?�k��U�%�풂9ۮ��j��h���O�B�~.]��S��K�zjVI�o*��sW���4�W���pj��,�o���,e��'��{���f\�}��kL�ՠp��Dw�nQ(���n�vu��4Y4�i�s���m�S�Ҵ}Y鉏m2�� IU-��,o��e�M~փ_i��]�z�sKCڱ�wo�̶ۿ^r*>F�X�[p\�f���E��i�B�Q��.9�"�^X�M�xR;��6O"�jseZ��'�x�Ϲ��\����j�y�{�9�֤�Z&�Fg�Je��t3���6�0��v�'9֩1>���n_H|8g��
�[�M�߿b�?��ʇ�Q���/t�m�vz�N�d$�C������m�!�|��>C��%�O*[4�m���M��|@M�(��ё������M ���cXɽ�r���l�2����2OX��>;�N݁�l�F��聑sL3;�ԧi^Po��,�O�E��Qk5H_Kt!w�����=��?�B����间��v�Vl��m�>�ٹ4�kuR�w�mDR2��Ԕ��5ueh�U���B#��{���?��!��=���8��_1n!��%�U���w��0E�=7�I�u���P��|�
�c�L1.i|˰�U��D�6�,���1��?�j}jt+_����&`Oyje���n:�-Ù5�䓫�o)i�m���d1��Z�ôa^�Sz�5�c4k� �^��˦�u�����Sꎏ�O��n�>��rGJ�&��`M���<o�F��6qR�qP�z�.����A]����n��x���;�]'�7��Y���]ۘңv�t��+��p���P����� 5�m��5�g7^����0���i/x��(ĉvM�Q�����Ǚ"V?������"&͹�f�wz��O?%�Edn��5@�B�e��J���Mq�������#o�w�#$��9f4w��)�;��B����9��oSQ�y-���.�#����}�?n4�Q6�	?����b���苴pװ/lM��Qˍ*p���ݮ9�)ȫ��hUr�|�:�������P �k4�=1�c��&�9S�����"76��ylV]7Coȟ�����EӾ��V����'NO{ޕn፽զ��ώ��ab1��;�|n	y�ܞOI�'�q�O�Bp��J�0:\�;.�b���@2i�߿�<�S2)1eΗ����`�8�d=�߉9]�	ߟ,r$���f���B���{�qzϐ��o4�t"�g�#�1<�
���3u�X�D5}�G=#r|3bDHO����#��l��;~D�fo�(9�6y�{N�Ԫ���s�w=�Y�Y��H-��5O�+�`��Dn����d��%[���]O�3(`����?�$ic�\9��ى�����C��7ٳ�h:Xc?a�����}���h�7�󞓛�`�����s����֕�)�S����gQ!�"9��\Ui9:���N�6����DY�l{:#�rO�|T�ﲪrR0QZ�~ݿ$�mN�uwݎOI5wD�����%m�%(�竑�$U���
U�
�Ur2NN���Qk��n�}=��<j^Y���$_��y�K��;��Ҥ�s�y��L�aX���)e��-gB$N���v�동��(����pez���2	m!Uq?'��D��d��M6�x���w&n��߯ϧ�_O�g�q�T���ԯ~d�S���S��U4�4�=���H�R&E
!�_j;��\w�����?m����DJ�������h�t>���m����ｐ�w�'�v��-�/���+�?q�އۛB��d؆���g�4��[c���l�E���[4�7EJLv��7�X��{
R�t�mf��tO;�I�=1a��?��%�v%p��9��ڒ��9���i�ՕD �����g���"���E�s�;7��Zw�Z�����h�v�)���ȋ����G�������2���y�(lbJ!���&�m��wV*O��r>~�6�}�wl��:�����M�?��N��m�vh����y�mnޞ��<6���G�i/4�Ϟ��j�^s��1�2y�%cl2Og����^(�KʸRx<m*��1�M�GU��c�y4���U�R�vԵ�q�򨿘�Ћ���u:�kR�ޕ:7
�����J�F��9���.=I-7I���Q�mYy���8ey�!o�7�95	�����@{v�;��y7z?�""X���o� K�y�-jx�sN��%>(�&���׻������������2V-���Q#L���C7��?ܝ;�����f�����_��[��}�����zn�d'UA�ߡO�g�s"V��ݵ��J[��0M;R��.�x������V�+��R����z��v�?��������Y�{��R�������M�\'l�|�C�
A&�ӝ
������[*��	��
۹����ŋ��L�����Tz�d�CI��UqW�|���c^-�����L�g�wp!�UU�϶�cSr�'AJ�}�s:�^���M��U��������n�cg!]c?�ul�<��7�h��|�2�iBs}�:�?f��7�G�3�j�S۝�P�U����w�h�֧�}��r�S�Y��I�1�Z8W;zO��K�@e����v�'���כ�'^�M;���fk(P���R\�;�R�U�ʂQs�E�P���c��.��)��w0���e*?�D8�/owY�\ғp��Ai�����F��)$C�Lu|�wZ�͝�J��[j�I8~JY�̒;�z7�^���ޚ۟��*s�z��8B�����x�8�)�;p/���
��B&Yj+��e��DS4�W/r�S�5�z�.��M��_^�B���R�;%X����d�2�i�ʁ x�[�~���+�!��Q�n&d���f�R�{ٰ�(�IR}�VH�>Q}�C��H�?+�.Cs���X�yI7�x#~��c8I���M_Ԅ�F)7)��S:�S*S������~���g�紭����������6,R�'��`��_�h.ԗ���~�c���ci�Vj��à�7��Ba�6��\����{{{��g՛�r7�ۨ"�CN�d����~9-�;��8�˞�cv���RlJ�&Ի[� ���["�>�=)={��t(��{���{��3�;I,=�������)��wȑC
jzb���Wl����K~ �î�N?�����H�[�k���ٖ̎��#+o��-��'u��Mgy��s(5c��=j��B�_�%]���E��k��n?�����)[�؝�vw�6��6��ބ���i'=U�*��P����B}�hCU�Qu�5�X�!�>�l���i=��/N�����D7ՊZE��qU�Л.,�*��ğI9�8Ն���f��O���ƫɖO�m��i��ʏ#�q����p&_�*u����ğ�YT���vv���/C�R�=�ں�y�ލX�Zخ��%ɝ�j��|*�>�6�������1��/
+�?>��;�#�xb��-����:�<06����T��8})<���7s�����F��e`;��V���M�S�Ǌ0�2.�!�_��& ��I!��E�Џ�]�� |ý/���%��j"���[��?�~T�s*�y���|�#B�|���;��|K)fܡw�q�fǿ�����U�Ι{��GDo����g�ލ��>.�7�D��vp2�ڔ �߿��;��Gt����gӛ��̸t7���:��o��4�~��b��<�is�����T^m�z;��A���]�ܸ�j���&z��$�>�[�+~q�_({��ފ��    ���f�|�;��B�����O"��!^S�'��)��%����Rg����9��7�>�W�*�9_D=���������߹�����a���&M���Þw���[`�cӤ:�F�[^��� _���6�����9W�ضi6q|U����;�x7���1XC(M}?��o�ڃ��ۜ��m� 5�c�f�e+�Q
�R:}o�!�A���1���W��ѰG.i>�	'�������El֓"g'�:��۽�iū�8Mpf6��W�C7*��y�;=zK�8QH6I��zD�6/t�����)�R�HXJ�6�k����Gs��?���v��-9���É��f�7��j׳�Y� ��iM4��S,�=&kS36^�Fw����튿��&�ɢ�^�e̾�FwWY4�5���q���n_���W�њЬN���ѽ�w�����O�N n�j2s���G��[ws�'�5��hl����}���>���9�5I���{қU�^��8&h$�J.��'n�����u��>��|�MX:mӍ�?HC�NL5uǘ�FN�����E���cU/�S�ϻ��=���U�)��z��#���"Wε�l���n@�Mf�4Y��X|���k;�F[�c�W_
����n�����j��7i8�7����Fy�&���|Ҭ�i3���D�������֏���Y�3��:���[�o�~%"��������+(�z����
����_'�h�K�Ƿ���o��u�ܤ��!=E��1~5Nuw���ԩ��<�1�f��y̮�K������a����J��]������>zΐ%���$��@�M�v��q����������l2��)9�c(�_�ux�'�o�z�\Iů�5Tժ\�='榟��Y���u�P��ԁ'�e��}�Xՙ9��0�7��S:���&�����K?�����)u{�N��sڶ�܉R{��Շ��N��I��3U������R���kr���\����� �m��ú�ܩ�o
�h��4��J�7b�Qi��m�6�z�&2��k��B���8���5Z�����������*}&0����to;椎-T�3���9=ݡ����:;�j�����=h�\gx���u�͉LI�Ϧߓ�]�|�O6�q�>u�1�ī�?l����N�.�ݴP����d|�W	]���4�൹�	�tOV�ڠ7!�
(]���zMN�k�a����M���[�(g�h/��d{�aM
�?Mn˫ZU��}���D��ɍ�1�}�:�'�RS�T��U�[J�0�n��+�sd�{[�s2=�Z����*z�-"8dV��n��$��;*.~�y��j���K)�x{d"�9�ٝ���:W|�0U/�w9H��/s��|җ;�bj��yN�g[��nv63�[�cc|��1��X���K�Cli���s1����lʙ���4��gj5�N��;�iwz�N^��~�T���d��ENL)si<ُiM{ݼ1*����,��O��λ�h��FA�Әu�M�!��g�a3�A0���u��L&�jڊ/ ��,�<�K��yR��3�V�����E1�m�o&���CZ�seuޤ�7�y�԰3b��h�E[؍~��7}0��u�MQaaZ�"�q��g���(�u���{�ó���)ws��i�[s�f�)��M��x/�C�y]S���kRC���K�m3��&�� |؄��������nB�Fn��?�M@7��f}�8�..��>�6����{�K���t>֝7����NKM��J5�A���BXی�DC��ȍP��K45�'�%�,�D��tQ
p{�*��GW͙��Æ��YK�n�5���9Z���:��1i�}������|w�C��-�7~���_a�)y,'��Ǚf�o�tmv���}h֋yקi����A��j����>)�uOYz�dY�#-�
�)o��e>K�"��?�4�:�N�����:�1��Wo���n��vH
��mn_ӫ�|u�_��w��>[��f��m�st����&���q�N�ì|ܩI?^Psz�J������qU�iesB\R4���=��I��N�}kJ�ˈ�֊w�`i����:����g����w��c�����@�|��]7}ݾ���uv���+�[굪��͝�K)ں	��q\���c�)z��|M{����b��\mRq;$js�6x�ج��D�����կ������;��96����w�t����T�Q^��;c?������[��>��k��{��`���Z��$fV�6��&�Cz#Fp�I�,���oq�M�ދ��!��qu~���I� �۱c����O>i�+�fמ���*�exkE>�o�����ލf�7�;�z�c�l�G��ε7[�<~�j
�O<�����x[�q��K�_�����r<)fb#.<�	��3j��7e�F��$¡w����H�|���qWw���Y����W|��w;>Fn{�U'��`��1�������?�'��p����P��|�?�'i9�s�$���8P݆<u��W�i[�&�x\ܟ�í���,C߶-�br��Z�m%;n�J�Z�����R��W��0�3^e3F%L�~�6i�3U̵5$�&C��ǫ*mv��{Ǿ���6	�|�s�BQ���9XH�4�5I�)+6E	����3l�Aq������ٟm�5��>�WO�~��6���6�o�������{R���zQ�S�&>򥬢*�e�d���)��±�l���v�<����7���31��{p�V7���fl�+�,�TЋ�Y�T�j��R9�#��5Rb�4��|�aRbT�[�� %I���X�};�P�[ꄶ�O.�:�;ێl(�3���l���}�r���G��OM!7���ౚ�۷>?���C��xt7q:aʎG�s٦	uSvI�y�m�c���@I��dm2UTg�T����Nϲ�<���@��^��$�I���7�O�f=�CJH���c��!�.fwSt��4���C��C���'��}�l%���E?;�7	Fe�}J���z�`���� ܧ7F�}�bH���`�����n��Jt�����^v���r����G�u�%�]}o�b
�t��r:�f���ޜ�!R��*J�uR�cw*^��9���q%�l�~y�#vzѡQ����	ےܧwI��L��5�Dƣ�$�"��!]�9I�f�ѵ>M8.[I[���y2MG(9)����7��Xk�����W�9�_|1��Y�	s������"w�)���N��4�������
H�u!����ݾe��U�4��Έ���T���+6g4����u�U�Ugo\��R��dRn�7Q�-��q�vc!�ws��ٜ�������v;uI&�3>�f�-3���kU��Qw4S^�?��M��I��:A�rWOv*��n���qm����l �-�����V[������ĥ���=ʉ�zG�Ny��nF��ӥvEɎ��K�)�9�Ԑ�s��a���H*����(��ðQr��WH+V��w�YjJ%+i�.Zuz[�u<(4�iı�Oɫz�f��C�F鍥=ޞ'��FIk�f+��L��|�8/���݊��1m�<�u�aT?��n�1aڃ����j�hy�7�,*����O��_�=狕F���v��Ѫ������_����HlĉW�����<_��$+b�o*��$�D��f_|�͟�����zb�~���~ʽ�m�3��Ջ��=R��kγ�N��Z��J>�iwvr�
S�����n:���\Q��)��'m�ǚ~4�ݜZ&:)��]'{��;Ϥ�xC�e"ɤ��Yet��a���*��&�j�b�5�e�$J�����6�F�R��w�MjH�-g�L ��c���jɴ��Ŷ v�U�3Y���`��⫔v�ªF~��L�T+Fm������}�z��QI�)�����4������4%l�Q�WN;��/횜mN�BԼ���Сs�3�o��h�i�������m�K���'�b��yt&���	ۈ����|m�;�S���l[.6���f���`�ι�W���W�������|���zӤ�z��8�݇2Z���C��7i]m����J����<�h    �Qt��O��1٬ί⭮�����7��G��Λ~|s�-��P�/�t4}��Cz���N��l1{�̨�u��x*h�&��(��|8��ɽ?K��ntT��Jm��5�Z�45d
iR+���BW�:̯���L?Q*�S���� ��� �B8�J�7�g��U�X)-���2iS�8��TOۤ���i6��������-�nwּ`�-�f�z{�X+�5M@��؛]��b�����x�ol�M^�4�N�<�3�is�s����}����M�bߚrG֠��2����4�J���J�_����l��C��[����E����۫�����S���z��6�W
LJ���j���\\�4T����2?/�6ӥ�o{���Є�s�)�N��0��DR������|��!i��3s79;�����<���*x��I���8��~�Nt92{'	7=���6	�$�%�D@�x���w��Z|��d�ut!'�?%끸������~˰�'����?�B�,�."��hϫ�����ߤu��;����A���УS��T
�F��ϗߕgӔ�ߧY_�{���ר��|t��"��&�㎈���Ax���#�r���/"n���lʸm�����/Ά����߰��_5�֊�~��a>�l�{M`�#���*�����f���Z�ܶ;2��{5���r!��%
U�(1_��<�/ݒ���v���{�h<�^�;���c僾CQmCi_����^��zΎ#m�I�g'��_�p��Fj{O�%��7?�o^�ږ�_�|�|��eS��&�{�}%f<m�?MQ�fW�:5�`�{~��Ry�w
)��4=R����<�&Q�Wnlf��f�^��n���a�^�R�=�y�s�QM����*��9�f2�����5o��]^������4�D��i��Kn��)�&q�!o���/���m�ٶb8_���Ѱ��m��ڞ�9�c��L�&�p�FQ��s�H�%�� ��s���X杣���>~�Z��,�s�i6�o�#�s%Qr1�5ׯ�W��(�FYhc��v�U�ޜ{�½�{p�6ʵ��z�i�y��_*��l�?yU&U��KU����~�Ѵ�$����dJ�O�x.�J��F螇9媸�����U�n��,��uEڌ�x׍WU/���6g�RI��ۄ�͙�;/a�#p�$i�Ռ�\��i��R=��Vul�v{7d����ܱ�b�����Ljx�W[��7޼����7�)C�37�^�,�W�'��#���>��]5��S�k�t��Ù�)Ws�K���9�o#�᰷?�Do��۟��@��+��>%HB~�`�7�v#;ݺm9�IU�2Z�r��Ë�Խ��'kq'եK+hژ��~@�\)��R�J��f>/�����l@;7�֩w�+��V�{�=�{�PW�8}���e8�i��T������[lP-T5�"��K�v������̂j�w���ͣ���7�������}j����7r\����&`�)���$Nv�<F������8>-9'i̷���!�&����1�۪91�����ȱw��ӂ��Wə0&�����&�;/��]�mI�28i�"@�uI%�u���t�k	'�n��}��=�v�:����J]��Jl*A����k��y��=%s��S:5���P�ӧ(c�4�n>{m�!���o������	������V ���]N���eS������������ _Ҭ�����'��ݦ�Ƭtܲ��;`�Q,"��8�|D˒v�خ�&��̩�{!���D}i�$E뉗Zrނ6v�Hy?rJS�t��Æ�x��(5?�W�f|���@~��T�ɒW�ƏOq�D/�� NB��y���������Qo���w]�j�IIc���F�R��5��U�R����w��y��{�3��K5�䴩w�KSP�N�o���{��M���D'5�+ih�O�^"]�խY���e/׹�ek�C���/J�z������No��;9��+��k��)��3�j�7���R�6�7*���_�DS�*4�t�~w�O�vZ�?|�/Eh�ŧ�#zzs�U�Ecy���*���n�f5)�x�/�r^��}���fNuZ_��㚟�	r;uڠy������^���ZFebӹ�|����g�|�!ߧ��6n|�{M�Fi3��������{����7׈&/����?���ؾ�;8�M�zJ��xS.
����۸�?��-)���$��G��Y��6%�̢�Wm��l��c�{��}���7O4��$��5��]������ʿd�̶Cm��=�i�')<]����D��JZ��IV��^on���qoHp�������.�#׺-|;;|�ꛧ��\'IQ>ʤ�fo_]��{��j�ga�g�t�ct�!��n�'RJ�L<�url�_��]�B���f~�˲�������јJ��.nO�${x�v4fAi�,W;;�'�p)s!?�1�4F���?���|���^�-��Zu��i_���j��7�Qe�H�+O!��!��Bcr��� }�M�_�9au1�&n����sp�9��<�|�3'�a~�����JMHO�'y�m�p�������9����^�$��m[qŪ��Һ.[_���w7���طL�͞y�I3�RU1�w��4�q�~�n�&���U�=�ޱbk�p*w1}��}��9�����ߣP�_:���d��z}EG)�V��%�t5fl/���)�f>�?��o���>u\����N���I�V.�{�K^��� ڍ�aN�*��1�y:N���ڕ�j���%s�m	7�L�5<�+�Eg[G��w�Gfh[_���L����M�~E&��J���P�\����ŀ��V��g�E])ۖ��eN�R�n���I������Kү��RϝJ��A��z���4��m2ǡ�����n�9�Uq wj�S��/kA����
������v�>+��ݤ#�����ؾ۞�Xp9�n���U6�A�lS��h[z?J+�-	�t�.djZ��f��w�C�K���=���H����]ǋ(G�9��$ܥ}�C�}}Uu�m{=��ߦO.���0JWP<-S_��w���A=
:x������7c�Pf~|>U�.'h������@^��ƲOBU���ylC����.5�}[�N/���MviӀ>�[�&�m,R��8/����P�_��Q����^�J\���|�M���yNV�'�V����loж�O�Mk����{_w9���V��H��O��hzND�/�O{�c�!z��O	U���.��#Nt������Da23���s��]�H�κ�߱o�����	C���ϡ�����D�M��̱7E�,�!?�9�D)�R^8��9z����&w�e��l2����ށ�n��=�B���G������1��fu�jx�b�B�'��_2g^�?ɷ2���m�s��.C@���~�V�'Ze���8$�<�F �}�~Ks�EHOC�1߱���T�S��.���A]g���ںQ^��.��?aM�������SUt��!�4r�,�����N�s����j1h(�����|OTc���Tp5��&�o�y�鐛�V��6�v����؇���G���Wn����5����v=>W�HQ���'�����P�ū�ěxQW�=�c�N��;�̀��JF=�A��%�8F�ʻ�B�=��8�X��$�°TJ���[��W�v�gS�h2����mN�`*�4U�[L����cA,WӺk���������Ȥ�Fa3G0�l�#m<Z�PQ$�`��7mn�%d�s�{]6�Ǹume��/��"���H{���w���Ԩv��;Mhc�u~�����2z�=ﺐ�q��C������${�Rh;F!,��<%���s(�TO�.���O��fؕ:���\J�K����U��R(��R���1�t�&�����6˸8~2j[�t�������f�'��罚 8SHm�5��s�]�s�>d����>��P���hv��5�z��Id�W���)���R�qǥJ�����:��R_�{px��4����Lv��˴Q��io0�����D�ο����V�+W��H7�ܷ>7��J��7�c��ei��dF�    )�#�r5p�Y����,=o\���8tF�2�$�5h� Hiq7W�6xS��Ö�Mp�ؘn|N$��V��N��n��_KSd�.��f��m2#C��Y�l���]%s�<�)���Q�����*]^�NVkU�"�3Fѝ6�|��2�e.6j�NO�X��Lӧ��3�J ���4EU5N����}����~�ʽUjz�fÔ(��P�N*
��Ғ`��M�*V����}�����>�.�zC:�(I�y�X:��qy���C��;�bӤ�F5�ܸǎ�<4��(��6��S���G��G�r#��Pb$�����"�'щ}�L��Q.{�M�c|LJv;(�&�=���ղT���3�`��\�ve.~ʇ��nR��?S�����m\<�m�ҹ���ޞlň���̜��ƍϟ�}�4]���¯��6��XNFF��%dz(�a�X/���n�?Et���]�]5}I���l�u�'�?�|��݌�e��؞����"~UK�C[��7�C�^
q�q7��"�%;딜���iɷh,i�V�nS�Ε�p{q!�=���������|�t��(�t.ҳ����0}�9�;[$�.��$=��c�0���p�V_����C2M'�)���1������� &f��Qj��E���ϩq���N���-v=��6z�:��>U#o�����N��[�0K�x����-��K�m�[�5]����H��6����c�c;��7w�CA4��GV�����g8�D�O��ރ�>zȝ��@M_x�m��S���x���{ٯ��3vu�m��}�xr�N>h��l��сQ_������]��#�mȢ�I����u���"���;ڦlN���ߏ2&����&q�^[zc~�~��$��9�i�mC����I��6lpRGw��O�zm��f,��7�ڐC�~�Nn�jl��Sq�:���a�tҚ�Jܾh��rv:��\�z.��M����I<����?on���x�*� �eb]����4d� <��j�����ҢUx�m򚡣�_�O�AM���o9S�P-�
'��̞��պS�>��*K�:�ç���RʅOx��u6�ݹĞ����.�&|`w�Nd��l��L2��;�=��ĈGc��T=+��"i���L�ʃ_�!���=���eH똢y��h����;&�Ka�^��4��5
��C�������D��>�lz[$�T���)Xn4�YtR�i\{�;�?,?�,���ng��8 ��>e�V��;߹�W��'�.�س��J��a���n����61�̩���T�F���:SyJ��˟�iNj��rl�fu���w�x�V��[vHX�T�����h�U��
�lg�ַ��lV:=�R��Յe�����o:�U�û�딿!��~�����(�7��8J�uw[����*�	��L�������?�۲&%O��Gf4R돈�ށ����Ό3����{<T|D������f&�B�I��%ʑ^�0}LV��Y}����@�������� ]ߖ[��6�\˹�v��4��fדe����4�í��A���b���t~�&���337! L���&�;i��*?��d;����f�\����PU۞\��U#5u�io򡣞����4���mx�����o��ι�,o~{��4�Ͼ�O�`q��m�0<��U?h�r�R����0�1�������E_�!T�&a��_(6W�l5e��u�=���h������Mh��r4�?��d�F�I#±���αQ2����{�6ͫ��	���؟�S���$1	�G'A���R+ۗ�}��"s��gO���_`��;i�S�r�=��!~�J�����ۿ��l�нam>&Up�����ٜ�U�?V�?[Z��r6VKiæ�FZ��Ll_�wn�Ej�w�\mݜK��:�tu�M�A����q��c�r��f��!�~3.Ԟ�
�t����jK��4e���3i[v��Ɨ �
\ⷹ'�$u�`�6d��(�����I_�:�8섣�ևp5��'�e��^��d�o�4գQ�w�:T������.\�����k\�u'TVr��V���L�D˦e������ON������]ýH{O�p��v���WW��58ri2�3��+_(�0+z��a�r�b,�8wG[5E��u�E��Mꇹ���O��L��S��۔���_�y�,M�u��]�^�r�g���>�*U�_�+��v�۝]�v�q��Ŝ��o��&��l"���:&������U�
%sz�Ner��s�I��o�n���}��ʋQ��J�=g2�� ��*�O�@�ylxl���N�ߡ���q\�_S�;��ז�%��oݗ��n��A5�Ͽ��`��w$���}x�m~Һ�v���E��>�>�,�k�����<U�T��������;�R�����'�o�ƃ;}�!T�U ���>�e����ߴ�9��{�i�O��_����T�=+h��?6�ٝf���]��dsǕ�f``N�!����������6��7˓^߄���Oa��p��v���o�����9���F���R��.nߔ��Z��R��P�F���l��"���Vy?Y��Ĕ&�ɉyS���P5��6�9�n:��1�hS�}O>�ɟ�l��m6�s�=;��{y����`E����-���b�K�8���w{>��lC?8y>۶?�x��������=U��ԓ)�?��`��")�,�;:|�,��ӎ�n��o�HmL�b�w�a�������>ȼ������0�X���`^lD�ƥ�~U��}�VMW?�lwr5��v�}�*'��t����q�<��R'`���lHmXq���AV���N��KN������	���8�yi؝��K;q� o$�I��(�M��z�q�i=eE�Q^�a��>��-���9�+�7=��7W��)��w��S�WQ�PM�zǫ�e�#..�h�}�ќ����к۔�F�uvKl�UP�7��r�/�jm�w�<�id���0y+몳�#�}g��.�����T���Su�����fl���~���b�����
�ϸ��t��L�:���Y��z�w�h�cT_�]�Q��Y�c������H�N�VR�{2B�鋤:���2�G[�+��r�4[�.�rl[uLͲ����d$������Wz��6��D��97�2�y��%��j$��}����h����;i��9^�]6b��7��?Z������?Oasɱ�Ӡ<�����μ�jd1�L3�t��U�$R�|x���������w�ѳ����;��g�n�Ѳ�{�>X���P����Z��A��|G;�'��D���-mmz�Uv���PE���+Á�\^UO՝��ޚn[��M�?�є��X�,5f;�n�$nGϚN��
�Ā�!5J붕���io�R���t�4��$U^rcn��9��竵�[N 90�Tu�4�7g�5��2�������!��;9Վ/�h�t���dU!����/ISnej�z��
��K����nX�)��:i4:��1��I��w�M��ܚUw�n�F��d���֝<�!��A%�?e%���9��%D�+��ϡ&<ԛ5��UOU�J����_ޜ,�z�c�x��#��N��Ι*-#z�gCUt��FI��N`s�Y{��r��\0*�A;9��5��h�p%����!�������(��9o.�J�`�toRm��{خ�O�Y
��Iu���'�1�6���_��!�*%�9.镋p�>1��N��Ø0�ʟ�_�P7�#g���9�r�z��t�s����j=��蹚�}������V�������h�̥�{m{��pzL$�Qgm�%�	W-w>���˻�����>v&���?J{��:�����A�ٷ>���l5��Y�1��M�8= ��z�Wj:~H�R�vv�p�����QTڷ_��;��!N�ۍ��)����M���ȰK6{�$�S6J�!㹩�zHp��9TA%��9���m����K���GhG�xL�6WF��l��2#o���м�Z$�v*�}:�Qe�L��Y_x]�JT�|�"��n6i���<���]ؖ7�þ��n5�0}G_��N�9��/)��	ˊ���5�,}&��>��k��o�U\S8    �ȋf�N����+3��5ȏAz"5��\iW��0i�\�O7x@�/��4���/�%ǌ3��6{�ܯ���l�y.6��T֫9�Y���ɰOg�>�ʙ���H��i~�#{��#��	7����K��>�Sk{I㲙��@�"��0%��7a\d2�;Q���57�_Ak�W��R�%�!�p���N�$?]W߯��T�ܤ���4|x:�Vw���i�.�eծ�d��/n�;�U=GPyimf�"�}�k��۷9�7� G�S��I�LC�ȗk�ݩ�C���d�M`���G��&�5�o&lw��j4O�b��I��{�ImS�y�py��u���K�?��YH�'����9U"@�?V8(�MZ��V����P\V0��	f��+�@T�_7_dg�*����{,,�M�{8�bd��9����u��ӿ1�����?�F����N�j,��~�t��z����?�� �:pQ�4~�;�H�O��M��L���o2���9U���7��S���$�^Z�YcƓ������εp�����75��\Ρq�Iz�cm�1��􊫬m|�>y�єG2�z�bɩU^rO�c�[WM�հ�}v��@�/m��o�i;��A.|�v��*�,��*��}N�\��s����T��9��}7**�*��״g�0goj���z~�5�=Y�}(���j�*Ҳ$�J��CQ��c���|q���I�"�<���'�~�L%c��ki��d�k��gD>sI�-)�-=�2�_�A9e�4�j�[��?�%���ɡ�l�wy�V�Ѝ���L�ڙ�N*G[����;I�R������K�Q߳:G�K9A?:�*������էi0�q�dІ�+.�������gqJpmx$�ǿg�Le��v?���_�o��������5l�;~��	���eʁ_a�s������9׮�������,�B�(�a�:�1�p;���/j�~f;3L��c>Ͷ/��=���O�{���:ʅ_H"��gmh?�j.�����8x�=�Q'�;��_9���>I�DK}O5 +��M<|�N��+��ҹ�v����/�{�L����6BU�;�q �ҡ�\}X%���IOrA0�r�.�����?i^�l�nv�:d�A>�5���ߓ猑��ߙӴ�J�Dܝab�x������[�.��'�iƶ�1��W9�uu)��d��������]�~��]\y��ԧDWy�����#��Sz�-����<́���vC�W%?j���@��؇t��D��c�Qe~(k�'��Z������ut[�ԇ�#��ݞ�&Q�N\�ݑ��n�[�=It��<&��g�ƿ93�����ͫ{�(k�q�_�$�d�t�sr�Rw�qm?lsۚ?q^�OU���+��͍��o�������[�3�����l�5:��Yw�欢LhA[9�6�s�M�ʜ�C��/�4�\�߄�/�)�ω�k���C?�`�� �I�܀O,�V����=? X���jb�sLȋ�Q:�_w{q����i������Ӫ�(6Ɨ_�E:������y�CFbt.�~�'��{|Ğ�Pw����"�䉈�.�~�R�<(v��������`�sCk/�̰Z�LjrǓ'�� �K��xm�F	jͧ�"Gmڒ�����̡d~RN�<^54�{�E[?�ܴ�sɐ�zꤪ�f���0e�?�����}�7�hR�>����qc�qvo$�WZ�uӒ�A�kb\ҍKuDqf\-�P>HmI����@�������l�Г��줽a��?=FEE���jbRu�[>�)'aS�t�UEyy쬢U��S/S{C���l	f�?Z���=3��s��,��1����x�O@�I��;T3�?i�Kkt��q��O{�R"WyUGm���T�����G��ZC��׏����O_�L�绞���t_�W'���F|q"g��o6sQ5ڵ�f���wy�%�vj4M��^���@��8����lKU���Uu:)|/�9��V���3Z]�C�Q�l�D�D�rU7N�Bu��6������8��u `یw�S�'��r����S֪8z��	������!���ϼ�\�")Q���O^3��4&���y$tקݮɬ�Z���!�ɲZ}���]�� ����Y���Au���Խmb%h�z���=ܝ4��$^�Ϟ��
�5i��^�,�*�P@�C�uMqteHő�7-Bs]*�t��ԺO����$��S��q`��|��a��e������]7CT�Ş��/�́��=<9Ul�H����?��`l婯C�_Sݐ�	W�V���o�f��l�5��T��g4�|9G�Zr6�+�r#�ݧK��z�G[ՙR&N�׻��j��p-g[�;m_��XX7[���S���B\��=1��	I��J1j2��ľ�t)gIy�	���6�&H�t?�>~|��nύ�������kVU��v<�K3�K�ִi�����<?'ʩ
�3B*�h�1���X6�	̕�N��gǟ۽��L,���9|�a�T�/	4~K��KrOY�o�4������~������o��n��4&�!�g�� Q�O�
�=_��S~��9ħ�g'-3���߯�����˫�%�J�|�9[���n�E[?�W�v������V'7}a!;���{��G砸�vT-��O�}��Ar"�����caʢWݿJ��y����?��j~��L�5�=7��|{��,��{�ov̅<cu�mC��w��(����`^�u��Pg[��{�@�t7S�x���={����&�^���_geig�b�{�*:G4S�f#��Êh��th3��G��S���_5�Կ�dM-��g�'�Y����N��&D�M��{��=꒛.�%���q��SG��mxə��i3���~�ήsQe>`�@ϑ�v���ۑHҽp-ڽ?���K���gݴ�FE���5��[����2���<Ӵ�}�����Fg�cǿ�A7	t81~�ad�[�';L�R�Pp��^�t��z7��^�p���婔�4U���E�"��gTңcn6�n����ӡ�,����?y�w�Ǖ�G�y�IH6��,<Swa�{��w��Q�R�V)��)�.36��`��e��'UBҭm�g��k�$X��ݾ�����>F��&�F�sU�&鸿k����srޜ�+%���kR5yCb��ͮ0m@Ԙ�f��>��F�	�s��o��ڿ�����=o�����;���d���M�FmqvBj�ޜ���S��x�sHh+��&����6g�x5J�m�d��$R��9�������_�q��j�yM��a/t�V�=On�;�e;��|��+�3>a�;�D�0	*4�x��{[�F���[-Q�̿)��>��T�i��c�܇�m��WRuЁ<h�����N`�ɹr-`͝.���n�mt�td>�4���Q��W�s��SDj��'�Ҏ��r*\	�yJ{�V�/���M$(
%��}���/^�XQ��L�����'ro��_�n�>�=�[���2�%���-���">�����b�h�)�'�ǫA���(g��>YO��� �ȿ�&�Z�S�H.S~�~�$�?[Z�q��s;}���6�,���_���v�3H�����v������[���^珸���;i�q�|�!��F�x8C����D.�{�e��|�ݏ���2��ZV�h����럛��i��z��U�_�U;	�P�)5�D�I�+�Rb�o�2-�"ٶ�]gB�M��8.�\��S�ڵ�yW�$��38������aE��LRr�|�a(KkU3��3�k�L?�d�C"m�����!u�k�B.��c��Gb|$ޅ�ʹ��4���:ٞ�����73���$Y�ScK3\e�����<�ͨy�d����'+G
-�� ��4�[��]����m��.����^�?��p{0��F �nw���;�I���U�m_io|�͔J-�w�ХH/�z@l�i<ԭ���F�.�����;2�����θ<�U����A���Iq����%ɓ��ߏ�M����>���f����C∴ǿ��������T�P���p�Pu��(G!߇�ֽO]�sh�t;q��Q.�բ�4]>J`\�lh�����ky8�^��+�Tz����Ö<�5b��c�!��'#�]x�]�    ������c����D|�_���5)	�ꢋ��u���V��	������y3���{���7��vhm�	n�5��}���t��4��O�0���!=�	�[���Iﰌ�C7��\���QΟ܌�Z����G��bu>��w#|e�~��G��I�rT8�x}'*Q�ۍ�*)��T`*�f�}ҝ��;��y�'׹4,?�2���EK��gxW��ejS�y�Tt�Ljk�H�x����}�w��H�r�} ��>�g����p{��{:�Ik�H���~�3;�����;-�2��t�wj��5ǈ�MIkD<���� b�
����:w�o�ΗZx�~y�sŝ��w�~��Tt?�-��@��*_�4�r���#2�u�'�L3G��v��Ky��b�I���}Ru�/�7��oo9)��9��cF��_�Q#�H�|�:r����O�`�PLŇ��Yl��d�\�CL��[�sL�f}����GX"�yS���={�@�Vd�/,�/�&m���T�aUp^Ć�3w=�C�b��[LQ�hrr�#j��4�N;�y�z^s> �U���8�q䌝��t+͡\T������mh��\:¨�w���__��ͽ ��� f����e� ��x��t���$���W-x�c���]m�u��`7A�/���߇��Q���4$D�M�����?��>OBd9�&	'm�)K.�F�p��c��&(qi�����[5?��_b�l�̓���ʊ~��ǯv�����ϛ������ys��A'=ķ�H�g��*�R�CiM���7?3��߯PH�<�Mު1�%b�y8'����HMy�w����S�܆��MZ�U���,Wmǥ�w}j��:-��͂rFǢ؀s��nPn�ߟHv����7!�Cs3�z�~�c撩�q~s��dyW=�?F}���$J��l�Ѷ:Oi��$��(Kǟgn��z����on��j��׎'�g�J,����K����9Ɂ$��;����`5�|���o�qn�U����K#��|�ͺ,GA����P�O�%�8�|~�C������m}��a�P7���Q&?{
Rݤ/L��W�އ����Y�A߰	Z���ɥ~��x�R���>}�����\~}�vf�xm�sJ����J� 6O���9���9s�b�p#\N�w4����0Ռ� 7�j/�_�J}9����O����'q�?����74�T:�|��_�G�W'ǳ4��}^�\��8��6���O��&����c����唺��z��d��P+w����*\��'����<����9�R������?�u����_���o}��{$�q�3��k�GK��M]�����F���>���p��G��褞�ӓ������g�Ӕ/�gx\����
󴱞����Cn7�Y.���3��6Lc))��5Qw�ӭ�s����^�_��dx�;��Vu���U���P� c4�TM~G��̨+�b�Ȭ:)�?�9��Yc̜�jw�L�ۦ�؄Rù�R��I��"�ޘ;M
qz�Lw>�K�,C�o]�h��z��oz�Ŝ��1�cS�י!���(�Mg���I�a������l|��brq����9�����
ٽ�TY�ݯ��Mu��>;ܛ�\y"hǸ�F�wN��Ĝ���ū.�o��ć�­�_����g�{���rkޥ��8p��ޤC���̿<Ż� ��s���{���#�}����,���B����g~���f/�~0O��X�	\�Se=�����CSh��/�CV睂�:����`���ߺ�����T�����t!:�(�nk��m��[�*��䘴�y��Ii�,��VK���}�iX�o�ko��n�40cyH�8�"6�O<�����H,��X����bC��l�t�ͯjw%���\o�';oMZW3����#j�D�S���a���S,��:����o
��~��Z��:C��G.(!B8�{̻�<,��N����T��D��͉rCV9�T�9�%���$2�x�.���?��y�Vཽ��1jۂ�d�6yw�SE��腍򲋕'���=&Ul�F�IJ�~�ġ�x����8���Hl&#��C�i���3�4��F���w�*�6~��{�I��+=�?���r�;�6ۿ��3������OӍ�2��jqۤ�<�3���>e"�L�4:OY�n�c�2X}ho����dN��G�b��<V�x�Q��ӯk���\�����
�615D��2wz�j~�q���(�K�7���C�"U!���ϛG�.�(�]�r��M���?�=įsa��]�<+����%�߃��VS���z� ��z�I�����Y5��榣��~b�S�Bcɷy���}*�q�:�!��U�����x��O4�ԑ�ڐ��;t���'��4��eu0��(e�[`�~�!�"��`~˓�Ms�&l.Cx��9y�I�s��l\����wI�I��EP�u2�U�W�aܤ饭V��;I�y��;+��v����;��`����X�Y�eMy�6��("T{&��i�߲uV�30���_
H�p	i����ͽ[c5�T���~���:,*�C���C���3��r�o59�@i�n��z�^C�H �>���?&G��|��ޑ���5AɍK����{c��8"�����'�d�t��ƶy���̌'�=Re���זQNpo�<W4������R�]{�=rnu�5���ٿ�C<0*�._=?����o�}n����q|�f��U?�;n��{O;�~���MN�]C��J�ʙJ�d�^O�Q�p�HAiz�Vb�P�������H��]����6t�]�ë�]�ن��$�K^�q��ܨ��]%��ڿ�	��T�I;F�n�������;C�>��4�Ǐ����}�ƾg|]���cm�$�}~S����&�M��N����6�l��6[���-b�rۤT��B�'�>~v���������(F'���-�h5f�W��C[v�5���?�ܤ2q� nt=��ߓ�l���(�%���<-{S���N�vC����N��N���4�k`������⦖�,9�S��&���݆��)��m2��!S��[B\?�}���oiQ�j��j�ߜ�^�Ã»O�q��5�yp�<s��k���C��'��b��i����#J�]��]�V7Uܞ��t���rO}Mz����=�&���&73�6�%���ߦ��S%�ܷ!1�jxu���B&ߟy���i�={�l��1wn����:�?�2��=��O�Y�ކ<�~.]P����i���_�l����D��a#���>�����?�3�����󗝚)����\4��"y�]��x}��0��i�Ԯ�×O�����KͲY���n���Wo�a��W��T��M�"��W��&@_��;����N�U/���g���3=QQ��㒬\�MU�:m�kN>��(T0����m"�VesUn�	TH*�h��K��=ի퀝q1�#2�y|e�\������tt��������T���q�-��|z:�1O���PH�f߬%����~:o
>OwD��rw����7~�\o�f�I#�hGH��ď_�����3J�w79�������}����T�w�����)��|�ۤ�m�wT�|���s��|��V�������NO�Ɍ2[�>e�>d[j���M6O�	����~���2��N�'�~���6r����{�(�v���7Jw������	�V��eB�n�'��2�/G�I��g_i��>�<������|��l/����rL\��N���N���HSɴ[I׎ �u����^�[�E�����<�m+C�z'd�_���w��}�����tNC�"���w�~�w��8��b���on��M=1�K����Pϙ�Rn��fn���/�e�V��e�ϥ:�ɔ�M�vD�/:S}?�I�����F/ C�3=E�e��2�t��%�s/S�J������yz����2r��6u����1�C�a2߄�}_��TB��;!��Umٓ3�Mu;�&gy�yAꈏ9keQw�Z�&O�F�]�һ]���>��:��.����R�<:�p��w���6�������ǩ��y    8�;��B�M��b�Ӛ`���Qu/6]��w�?���}�c��{|�E2�������~W��]��S$�UNn�%:�[��S�{��n'ݧ��B%�{�6���y۫�L|Ҧ�8tQL�0��{�v\��&����^�%��i��=[mظ�:}/�M�#��'�B+_�����gRL%6��^ʦq�1R�5>&�3���N#Sb4�:@���!���!��<'��e.��|�<ˣ=�;\��o��-�t��┛@�a�E���ۿ�E��.����v�3��th�����On��&E�ʛ�i�f�8';����;0D�sz)Ky_M!�[_򑆌w�i�#ꂬA]Л��J�%��-Y�>�|*�bӼS��t��������v�:���0��~��kz�S-�����x�l��ˆ)�Q,�EnƓzj����CR*N��w��&ϔ�����MH�\S��*��tG�l��Tt��efX2�7���_l��6�.&�O~�rĆu��^ۼ�:\V1���v�w�l&aL�0��Cۃ���ku����,�M}�/����
,+���S�I��7���1ޮ-�ʸn�2Ü�h��j�����T�p^�봗�3i�ZR���n���Z�o�G��fF�U�eI��9ά����r%˒��.��6�������ó�"�X,>>fD��k���?"K��{����qVD�JK_�z�«c�����/�ɵyĎ�Fq",8����&���<o�P[�����ڽH۸q����^�^����3<���Ę]LgJ�(I�4��Jv�j!Żs_�v�XO"B�th�rk;!���{*�SOr�O6Q�n�W��L��4�j>�R�iC�u3�2o�.���L�N��Hi����ww�F;w�'e��C>?�>��K����7qY9.-���o���T��J4ϖQq�%�2��Iy}���9�1�"1����z�w{B;��[~������*R��-�Td��?9�N��Nx*�Uϵ9�N�%��^(k-���/Y^u2M�w9�ި��+����/s#5Q�5�k?|P��Z�<�U�4���}�:��y�o����뵵�������{��y`�6Oj��D��A2�����ZR�2��^nŀ�Tk��]��}�6@T��wG�B�]8ܭmD��B��j���-�+%�:΀6��:e|ol�L?�cv6uM_��ϭ}�2��Æԝ<s��\U���6|�4:8�0䏟�
��~���e���:�6�3��*��*Y����L�|	�Ѹ�ʙ�o��q��|x���p~��O�z��}���.�9{�j��21����M#�7�of���>�����=FZ߆����w������I�͈�a�<�|́K�v;:r���Ph�aca������<�ʪAOa�z���rosRO&�t˷<�'_�S�p�J����lԛ-4�7]y�b�3i�G��i�-�]*��hT�,�������}7B�������rLci���U�A�#[yU����m˃z�ؙ$�Q�Z^e�DPy^�r����6�:eL���Û}Ѓ���2�o�ݩ�����O�����q�$�{V�ֺ�o�W��>=��E'�!)f���ğ���܇�3���%�䵣��	���+���Q�fOh��f1yr�Ucu��wڇ�v"%�|D�r�Q_�7�dq|����Sur�6�o���47�%A��Xf�����8l^.������W����22&�O�ܗ��͐��9
7�5��l���?�F����vq�L�Ի�oS]����K���P"�a���? V��[�	��{X�M��|_�ğN��թ�O�4l�}�1������6��v��]S��6�����v�F�r�N�oF��o!�Ǽ�rJ��b��������*�՟��̧6�4औ���)èunf�F��� Q(�sn�X��}���3z2�59����'k>�]�\$��:�{
G����?�˶B���h�sJ���f��,�"u�����K�g���i\7Uӻ���Z0��nh�[R [	} �h[��>�Нҁc��M��1�
���y98͛-g������MSQvz���U�����(�u<�ߺ��H��i�r����/M�o�s`�@M�I�	�ȼ�zh"�~b��u�`�L9�
�T7���u�nY*C~���ڟԢ�i�ZO~m:���>�}�5�������Y�i�פ���n|�y�O
':�&~�4���8�����������4���Q�Nu�J���Ɛ��=f~l��V�a�o�;�9�7�Y���k��I����.i+g����0Gyɭ�nd��O���oN�N�M��u��x�HbM�#����\v���xuh���i��n���Yac?-L��l{�F4)|����t�6٪c
�hV��4����Dw�r�6�T٩�r�.fz���f��C���K(�CQ�~���IU�-1�~sl%i��7����O�d"��n[�x=j^Dwb<��O/��-��^g�{�R'��#�F�(�o\��*.�P�삛q�RҴ|l�6����T�bm� =��S�S�t�v×��g]F�9>�(��?��'�\��h�Zӌ�1ꎨ�K{ʊ�~��I9�ی�G�4Y3��)e�$��A y����w����99?�U:��[u��bԕ"��}z��D^|�y�.�ILPyM��S�d��]>u0��������5XQ}8�i�?��}�M,|�>��S=��"��/z|�!�y����'�=�M��mzܟ;)�˷ƹ��%%IC
��{�y.w$#=4���M�V�s��V��6��0#b�s�!k��
�΁s������j����,=�&�Q��!�ο��#�W�V�N���}������8!Z~B���W������f����#5.�@����bv���j��ɳ{n����T�B�(ı�D|�Z�7�cߦ�>(�.����Q�����[6S'^�*�	�P��p1K;��Í��nV��}F�q�#�|L5�-6ܾ#��������!��A���^���o;"�cG��;'�ɿ��ї�W�0��y����ߌ�E��j{F]�>9k���ħ�W��=mʧ kv�o�7DWv��v�
9�aR5y���4M��FIa�$�P����8���wo��at"�H��ӌ��~}��=�n��^�?Y�9�0���'�]x�ZW7��ϝ�h;����%���r�SP;��^�Ԭ��U�a�q'��M5Z_u@�s�ܠ����L�7i'�֊t�>9J�?C��l7K�t�&o���/�e�b��RNK���h*�����F���Jo�'�s��2 ?ڈ�=��)��6.�&�ͩPI��7j��,'�ơNS����pf?l��]�Y��h�ش��:� >�]�d��0<N��'������j���A���+�fENK�V���&��C�9� �	3~F��3�S�g��7��LSw���_���4��n��T�f��=S��߻����V}������*t������7l؍W��t_���W�Uz��^�4������$|�J��c ���eN��b��L��M���s)��'�i�yQi�^�����'�RV�l�O�����i�K�A^���C6���W�y�K^O�����D/a�Ġ;h�_��c^pQ����ա_�H��*��mE�]=��YI�a��k��U-��� i�z.>��7[���1��^���a�9��%��ߔí�Ӧ<��|�':��}R]6y���@�l�t'�}Nu�_�������MH#��9�1r����"zj��f��Ԝ&P�E���9���1��J�1�7C�j���Y՝�\'�z���-�g rHug;���[�m�w0ͥT��O����9)�x{��ݭfo�RCn��(�v�����MGI�����m�60����ۻ��!Xh�ڨo~�Ϩ��pQ<i1wܟ����*���d�2-���WE���c�������3��<Kݕ�&\�ȌM��.j�{�w�ܞ�e��}����kN����*�}o���Ï�2 �f;�n���>�P��9�G��7�D�}��:�g��HPm�[��۹���_��pk���sO�C�Y:���:�r6I� [T�;�#�`��o�ا�H���/QO    -�4�:!?�
#v����|9��|)��rbh"Ҍ���ՎǗ���`�ݑ�������8L>��N<�T��J嵡y�v��_%'nA]�5�cT���3�A�l�y�r�pV�_}��ۧ�O��r|��3>3�d���4�����Lӓm?��}p������V�m����}���� #8]�tT�W?�,��짪m�`�_�W��8U�쥛��mxw����ꫣLm@�p����;�P0��PU��f7�7�Ԥ��f����֣/�Y3}��\�K��ݾ>��\i�.���>��<�e&�7U�_�����:���묜��a��(�UMN~�	����7��i)������8��3������{�#�:�֯�����ś'��.�щ	Z�D�?u�f���V���������N��u���M�uL24��C��u�q��w�Z��~~��j�����֫��
������~��Jճ٣��<�n��|�\�:��͜7����~���oo����~B����;�^��Ge��?�k�����t7 \�C���Zm��nݿ�Ir���궛[�ji�Nۺ�?��Y��d� �&�Ua��*�:��b*�������(7ĝ�5q�	s��ϵ�����E��A����g�:x�/v=�ť&|�Ͳ�~�fc4��I��sxb���X�ui�n4��K6���a�F%hsd2c7Լ�I�B9i���ז�NN���uD�H"�t�K!"�8���.��_>�_Ni#[ěCjJ7���f�ak4��o�$�~�,��/n跇=���-�`����n���CbuL%��?�PA�m������{4��'��#�B���T;g� o�t�;��Ӗk�<���ͦTR�6��-?e���Q�44Uz~���\Gx�٧t�]MC�wM�˼�M �jso�J3�-Pbn��'��N픩���-���b<x�o�[��m4��SC�8�R�����&��;����Jm>���i�P?������¢*NU}���5ݵ�lr����h�}ouE�)'��8{�N^Xը�M�ں�.�i�]L��?�������w_Zo��ҩ�[l�֮!���4o����N��\��y�<��t�Lm�/��#BB�����T�����S�i�+���1|�}N��������&a���u�N�i*<^o��2�J1|٭=�V�>��)9�k)*�ì�y���,R���SU��5�,����?U������!���+e}4G�H�8=�%·P
@����Vf)�̅������mp}��A]fL�k����MO\(Ӓ�>�0m�[�,�e��"���J�WE��9�G;�|����4R 5k�ǸΨ���Rнz��+�ѪZ0�ɗorǇ�3�T��������e�?f��v4%\o"��p.�D��<�� ��q�a��۾���A����?E��L�������߇�Qg��m�l[L��<����2����������^)����H�:�}�717O��\Nz��i��Υ�&��ߝ��K�^)on<&ڴI|R8�|6���^F�:#���P�޹�����{��#�ĳ�NG���)��=��@(}f;��ӝ��.⫠�薨�.�b��|L�����<����R�l�:�3
��s�ʹ25��>~����d�}�����&�
�M&���>�禧�9(V$�q;F�5
��N�]���}8��'U���Dɬ'��
z�)or*�����f�o������0���Kp��e����E��&����Iw�q�n����5x�HsP<%�m�7�oڶ�;_6I�����$�����Sme����kk��e7)#5����Irl�)|\����;I$���̙����y~�)ە;����T?�e���>�Ν��ԣ���:�������U�6M���l5�M����{�,��gS+5w_(Ɏy��T���n���N<$<� ������и��wj��E��s�O�Ԩ��:lHt:�m����!�Ry��K�g�g�Fo���ɟ����;E����Mj�W�mq�����rI<?%{����l_��7��}qŦ:��M�wğqu�R�>M�JeN͂�4|���\t�b����䦫�V+z�m�O=��B)���MM;�o�����Su�T_��S�Ňa<�C�`��	�p����G{\���oΌ�W�j/���ӡ�#i�>��O.�H�w���7���n��O��8|����܎�=��N>|��bF����uݿ�Nv,C�?���������zu32lvN_��T��������W5XC~��M'��'iv��i�R�:�:������	g��B�\�q��V�v����竽o�\��6	}}��s�=����&?���l<��w::}i����myz�e����[3�?��O��y��'�9+��n�v!�8oxF��<�?���y�l��ǰ�7���Ilۉ��j+�C��/�S�xD��C6��ݕ>� 
7Jw����_5[5Zn���}�F�j;0��*�*�j䓪�f.���4ê#j�>���w�,� ����.�o���[���#�牎�Ƣچ	�\Z��I5�i���[n��o.e�"�����͕Cp���2k�k��י�WIL�K�I}S����S�Ѥa�>�6�a�������9_�}fi��Pin&�*a��X���Rd7��m_��I�*ù�ϻ}���qo5�h#����K� ���L���:$^8��輩�Ӭ�!_9�K��<�|�o�ۚ��	�4���^�'�<��F�L�a%G�~�}�b�OqQA7	o^֧1Z�S>��� �۫�Z��gz-ʸ�&�W�M6r|�W,�4��{��������(��-T�(Ub�.*i����-u7�jUc��A��C�[����ϲ?/�� ��-E�.�C����Y��ը�6Q�X5���y/��X�T���o.��aUo��Ss�K�T٭�����xH���є�Ԯ*�;�N��7�����'�y
a�y�I�%g�>*��h��ڻ�ӗr�<L^$�{7O`�H7�_u6fG$��o������&���-,f�8t���~������x�ӹ�ݓQ�w8�J继kD����{�_m���s���<�:~M�����y�}�m�^�m�|��$܆?�Z����I1э-Ӧn�&���݀�ڮjo��.�e���\�ۜq�sa����c'x���6�iz���AS�@�����(���/'��xħf��e��4k��m߾�֗*"�X��i9Y7^��̄��f��[��m��eK������oe�����"������	��^]e���t�����1�*O�%����=��ו����P6;�k����u^�[����S�.ueg��O�m�w,����N%��p��	���]�@A�$�yO��v'�#��:Zž}o���ݛ:�)�?�U��k��	����ak�Ț%� ���S~�|�)���s�8j�L��#��}࿻�ۖ�k�s���.��Q��)&��x����5�U�dܪ��d���I���Y��lK�+�oݮ�7��7u��gڄ+�^>1l�Q0�F�U�m����������93�x'�$����r8�7�_��CR�ә��p���4^�.��ݭ�*cʏ*s��V9e�vNW�}����:�@[��I�B~�a.a���6>���)7}o���C>���#�ů��N�;��<Ͳ.���}ܲ�~�Z�w�QHJ����穐 =���~��	Y��*��搁j�A��V����S�>m�o�M�׻#���9��7׶�k��S�����q$�z~���Dom�R�]<&/o����1�I�[B�/���߽_Zd3Qܛ�k���S5�~�u˵3LG��+����6z���<�SJ`{�S�'Sm����lu>��s�=�{PG�vbн#��C�o>�\�亂N����n���*Ao��`fw��U?�����x����|C	���ϵů�!-���֘�U�1�!M�p�'1��DҎpH�;���~|���jME�K2ٯ�]�rCVn��L�S��m\)v����Y�{�U9|!����)��l�8]�Q�Q�ƋxN�}LO�_�w�9}�Q�=���;6U�=pC��mG�8�    P��v��(���=x ����H��0n��O�|9Z�P�Qs�l3��f�"i�;��B�l��'{�S�n6�_eI�P�a��|�:wz��U�(l)���!�I�y���::-�%����u�x��N�vL�gL��i�=�r��i��B]����N��K�k�z|)}�	L��S�3�k�]����p�U��x��ޛI��g9m����z����R���;�*�rh*M���W��햼�i*�V{����*�{铊
�(5���d�J�bȯ�Ѷm�����)G��Q��t�%��Qm�t�!��[�k�L���,��F��/�s�LM�gg?�Ru�|��|p1'zGQ��XL.\�]NE�_�C���|vx`�4g������^@+�t�NX�cS[~RsYblz�:�df�����mG9��*�EFG�j�~�G��埒.�IIw�m��Bl��J��Զ�LsT_�ǖo��m��i�kC�%h���q�T��֙���ȶ����I�c�^�M��լ=��{�nJ��*��y�f~�ow��N�x7j$����V�$��9.i%�?��5�"��9�g�ѹ�:����4�}bR�a4O�8jf.Q������C��?��[��0�4!�&��8rP������y�S���������&�CVs�vHh!s���t��w2�|H^�JP�&�.�;۪y��w2H��O|�S�����9�r�l�=���~�<��l�7;��3�+����[�Y���aM����8���SK�)	��:��.fl�B��qJ��2n��΁sLF�L澱U�$'�Χt�_q�b��'�4�G��m<�z�a�5�v�1ٰԁ�HA�{s���w� MkMM�G���.s��w��j�B}�e�m���݋��ҼRl��1��]���	�~�8����ɋS��ޟ�8���/������j���װ�ܠ�\�)���ID�����8x�p�HP��yP;~hWJyl74�G�ڱ ~sv�N�I�a�Q�z37ԧ�Io�؋�jC5�V�	�y��$͉�nvM��sǰ\���>~��T�FM��A_��_.�R�~��(��r�Qm<0-ʝ���|�k�����{3?��{L�U�Y�?;��šz?�����H��2Ģ��<�욥5��p�h��a�>�a����+f]��9}��w���&��� U���+98F��0j����=��IL�Ds|	�Ԏth?�-�����N�&a&������d�u�ݬ�<^��tB�u+��9@.�m��0��<ReA�'3����Y�>|?��@,/3�C�
O\BݪNx&�"*�lwNs�����n�!ې�LO6Z�_��ܛ�_��7�gz�f^��ciQ��Å�#��G��6Js2���sX�?�g�>�;������P)z���$ t�q�j������-�}�L65����2���d��vz4�es�o�������`�gr�MK>��۔|��:��^t�z�QJܿs͏�r3;C�U5�/�d91":����n�����Shem�v'ץ��j&pMV�-�T��给�Y�]�/B_���?s-�d�'NǦ�L�"ݤ�4?Vڟ�=�G�P�_\G��Ѕ�^����nO�A��?�>R��Ɓ�l��r`����F��;�lȂ��;)�P���k/��#������c����]�\!j�S݅��U���H�0	��?���
�Dq{L��ۋ�Э���6j�f�ͱ�jee}k�}4��
E��+�'��ôx���S�;ח�l�rme͙S�^���0�B��j���dHl�S��u���n{h�8M��>��ڹ���.���m��t����C�6|�[jq�����75�iGS|��Cu[5�#���Sޚz7v�~w���9�x�1�6\�;��p�d�&;=�)^^�˔��CF^����y�%���rJo�3����;u����G��豪8k"�}�5}'q����UǗ�o��;3j�㬉�R����<�u�w�#y�l�ϙ.bf��`V�˕p�D�K�i'��|�f|ș���3����a�0��F���+�Z�<�'��&ͺ!�^Ӓ��|xjW;��.�>`�]F[[��Ǫ�ϱ����o�-y��Խ�o�<b`�9�����pIR�\�����qz�mF�������`��L���}igxs�*z�RT\m��eWI�u����9blT�P��qA7�h��~��ݹ؋�sHO����F�q���Nͧ�qӜ��>(�Ԋط�07��:�X�m�۲m�tY��=e�f�?4'�L4�O{���(�H�e:ݨTΕ}�Ͼ�}��`���.�t���7׍��|L5����D��]�{��̑���	�4G7J7�ku�U|=O�P�ڦ�]]RK��MJ�ol�
�m��q�Kg�қ�K���������n�R�����1]?)8��}���!��A����b�I�����CNE��Ӭ���й��.��W+bi�x+�ښ�.���$�)v��f�*n7i�e������O��y��\X���z�7�ա#U���k���u}��u���d��L$@�>���X���]�+ĥkVt�7c���Y�,��>���?��K�l�N�!y��/n���ܗY�\i����o��T[`{�&PǸ��-O�Ĉr���lz.'�7'����rL���ү����n����tu��M��j��c�[߮��ѻ�I��<iS�����~�����U���>ַe���uS9�M�����9��3�@{�;�}��=�qݖ���Os������(��S��:?���1�p�z��|7[���O^V����w:�P��LN2U?ks�m����u:��m7럑�Y��z���;T7����U��.',���-��<Q	9�77FO�8�@���3��Z�fΝ�G��}˶utIO�[��R�7\�Ͷk�`O~!]�QU�4j����c]n�ׅ���i'2��$7G���D�h�l�W��矪J�:)����4�� p�`j�����:�i۬����"�K�(��y oK���"���S������0��R-堦	�fN�J�F�]=�������Im�R�l�2oR�w:�/����?x���eB�zn�Ǹ�M0:7=�v�nsZ�4�*�R��>�h�I��Ӭ�]���GӼf[�����G{M�/ނ���F]�ƿ9�w
x�&�2^�q\�3�������sT��.�l�����}-eb��Z�_!��n��k�+���	�-7ø ���Q�\���~�{p�V2���޼�����l-Tr�R�u�b?䋝���%��y�sv��������I����&o3]�&�kG"�ݤIe�hY��V�������˧��Љ�?���M.�19wU���*�N}�'��x�?�����א����g�W��K��h�Ѽ��_y��D��o�i�֚8K�Ƭ��z��U=x���]&k�c9�t�����]�Α���wMC[�P�Ӗ�y����[��A!�T=Z,�:�lh�u��dGOp�&���۵O��*�>��v�9�K�!�vgH�mL/��λ�4�m��<�u��,�����}�x����d7�Tb+]�!����S����2<�;����!�B^����R꠹{Js}I죸��^T(T9�d�/��ߊMѼ2�P�F����)�JXS}��fb���c�rDc�tmj����k:r���/S��NCn�#/Ӄ�@�Qb��h�U��<��G��ۃ��	9yz!ҕ׍�iI�c��!sQE 7-��hf�@B�ؼW_?{[�'��bv��j�N��������0_�k���.�L���rVN]h5e��HmGi�(7�<B��fJ?��R�6b����G�|��T��K��J��G<��YOZ�z��+��G�cһ�͏�Ʋ�Sv5=�eᐙj�:&us�PН鄐����ʅ�����0�w��G�����oPg������Vݼ=��p�7�+}ρ�Ԯ��v����B�X�T:%�5S�>����!QJ���"�yq=ծݹ�
P�węr{N���TYʧY��.��'�q*�t��/'�b~ §I]�M䲦7������~�so���6�����֞];�:���}��Ǹ�_r[/q���ܼr��@�k��}    >0,V�~��qZJk��9� {_���}rA0���w�����_^u _/���^�FS���!!�Cّ|��vgBN�����HC�s�`�m.�u�>���ڛ}��O7��Io�6St��;'�,ZĪC�Rt�a�������w\c����RƷ��dV�[M�wU�8��%� ��K�n�=��{�d8����g�r��Q�N���8�NjdC��쪊�do��լ�L��3���N7���W���8}��~�r4��㌡�V������E�?�N�/�����'�2N��ӹ�dC�T8������{ʓl�����7E:-�9~U���o��T�;T��KƟLWs�jY���v>ŷ܂ַ*�u��N���eY����|C��(���m���#�U�����jO��>�e�d>��&���j�[LG����𸎇{�F?��N�<*�|R���[������4g�Oh�!�'Y���7�Y*��n��A������_T2�$�u�\�2�P�>���'�[m��;��~V�\;�orU���)MS�m��ؽY�j�1>K�v��;���w�O�V�R�al�-(9���>O���悗�҇��4?�����{�ޤ���P{���i��;?�1�y%���Kj>1�1$�;*F��y���%�;����8oӱ���~R��Ԏ'�9��K��E���}1��p�o���T��	�C��M���n*��fqQN������j�����S�Eٿ��\�ޤ�J�9y5�T�<@<�M��G^p�Yn�ϸ���)o�ġq ��r|Н�+M�l�7��������y��X3�o�8�;��$9	{��MkV\�&�&RJ9ش�7���A?�W���{T��9���J�[|J����٭t�[�j��oKn��?�4ioS���<�tҭ���D
�]5y.	g������0y;m):�é�:�ġI��/���l.�B����<ao����m.���m��n�Ta+�9V:NPՁ��:$�/%��mj��Վ�Ц1JL��5��T�Cz�o6E=mm�em��f	��י��õ�?��.g���|9Wd�����_?u��$!�d���f��BR)K���n�ɓ^U�o�ڕQ�J��ȵw|V�BE�������mb�T�IMx��iNo�߷y�?ul������;��>�}� x�@��g ��{�Yz���O
@D�/ �,�C\an/���_�AG�9
+����;�{�I^��VJ���;�å^8�~�q6��i����D��#��N�:[��<�)��ʎ3�����j�=z6:��Ϝ��y��fa{��9쾙P�l���i���C��+�;G���	��6�Z�1�j_חJ����~z�1)\��\''o+�����O�m��^�Sc3}����˺Mk$���n~p��ه�]�C�L)��ޫ僊��*c����V
�Ɓy�	�t�S������`Mk��F'}rڛvܴ�����Lf�f23�\2S}�Om'K�h=�^e1��%�9��G;����Y��٠yMܸ&��f6�R��=2��m�ݏs��7�i���M�ȻS$�]C��4���>	���]f��c�d3�S���t�[�#���"u�x�\���&GJ��d�N����-��n�R���j�Εw�U��͇��]�4Y<��)9�Z.��6�n��+m#L���K����D����i�����wn�*���^�s/��➦?��mK������*��W�B�z���T��鄝c�P����]qέ6��ɛn]��JC:9�_F���y�7c���|���g�ǟ�U�_~�����|�~N^sN�t4�0���:v��廟�='�G�Y>��wfPu�h��~G��^������ҡK|N�����e{�-߫[\��������ɢ��4�81����gUK4G�u��ճ�8&X��W��dn�|�f��ǐ��'{��Σ�K�S|��+=�2�nμBO�����SUUt���9�i6J]���R�9�{�U.�g6.����:�G%T�z����/�s�<z�ܘ�e8�r�ξ�miT��x�QYSo$��h�c�3��H�ظ����~98$��GY�]�b�&�.�0B�*�}���'��{u\���'�p����p.'Gl��N-ߧ�&h�il�S�d���?ׯ�@�sJ�K!0wK'[?�U��W���J���[�����g'ݣ�*����W�wٚ�de����̐k�8\��	CN6׳Ly�Q����!�"c�ן��i����Q����0q��iE�3����Flc(�g��O~j�ۿ\��C)k��M��:{�m���ӧ'X(	R�C4�HΗ�~3��{����Os?j�	:��m�7D��Ǔ+?�PwM��u�M{��L>?h��!�����w}y���q3�2���&(�I���5����>�q���m�G���zo���v�?R�V$�n���L�����t�K�hFz3*�&���&y��ON�ˍ�kc:�U���Ъ��Ӫ�p���K�F �W�6[�}��<���Nf���Ky(UL�woG:{����_��0��������4'M2��i��Y~h��r��U�yس�|7���d�H�)㋭�kW�U�|��E�w�ໆ�f��ݨ�Phӟ��ce�q�S�N�ʥ�,��.>m��~�Λ�%J��T����hXZ���dOm�KT)v���dcuHuh�=��\�휨���].�H�b7�sQ|���'I�g~�"-7�t���x�Mo�hv?�,���F>����q��M��0کp#_����t�4��?�Ͷ�
���Ow5��L��o;�r�W!�ɛp��vS�7�r����\pʯr
���K��#?Ʒ~;����׫��>���)��Nǧ}�'���$�D���!��zO�CFxL�m��Kn��g��h� ��͚������ѳM��%a3��ϔ���}?[�;�m[��s�����r�t�]�sv����i��:@j����%gs�_ǰW�զn�����fYs���4%2��א���NU��֔+<'�1�k���7�<��6���.���!s2����(�w��;7�G��p�W.�C��w�t��ȫLAە~
��t�i�~���_!�4�!-��3�Ё�ٹ�ͷ�_LB7t�w��ܱ=�%�)�T6���^>;.Fɖ�P��!�h�S�duk�?���=��vv;<�QToT���O�az��x��9_G1@���~���{v��c/�!Ue:����b'����P��BҬ�"m��R�c��{���s����UG���]�C"����A[}��S�զ�,�v.�0j�D���V6dl�ut�����M�'�03�����&O9;1���z_p������(�zZ��bhD��ڮK	u�N�:��i��[Ww��l��N��hoO�X����R�IӉ�� �>����^��U�Co9]�H�����'�ف��K͍��WwA���~���e��r9��i3�K�ܶs�'�y���N=dSa�vB�<��)(����Ss&���X~\{��T\Џ���Uɿ�$GKI�����L�d[v��y-�	
���G��zR��l���&/|}gm1z��k�����8O�c��QZ&+���K�_��_^�� �Miy�����}_��<��*6��y37N1Se��p�6@��d��y��(�W5���>�П�����f~��q�t��z��Pһg��$
�d��n��/�lz�d+M����tᒝw���s�ד�Ğpw�^�[�!���ĲL��1�sQ�8�M���z�Jr�Ⰼ���ۡ_�A�=�?�C��!S��f3���e�y�_�	����V>�I����=4_9'���1F��܅�ly��pe.���W��x�C71�>?�b�O��E�x�U��gbG���}B�ګ����#�("ݐ��tP���͇O-%��yJ}��/��0^U֋�Y�����޵!�FkK�ћ󓚐&b�G��GU���Q�˜�9z�Hq�Χطӟ��W`͜���F�Ù��'n4����8?����71��*9�#�4�^\�m���� EA?��岽�B���������Z2۽���✭��pڏմ�O���9�Ln�[IY�*�v��S��d���k[Զ�+�    ��n#�N�P���1��~�_*���1�Y��)��������>oԤc�N=z�i��.�)O_s�uR�_�P��R0z~�ډ�(�fcS��m���T;6\��qL��w<�?c�*���|�)�~$��R;yt�6��e�4��o.������G�w`�D�7I�.�j8}�i��!�j�By�Óx�4�)����5ѵ�!�s{���mZr5J��}����Go�V�o����>�T��m���ē�TytR)�>�����V��{m��"WK����]��/�zs:��mQU����XW��ݫ3:����s�Tv�����2�Lw]�v�u�G��"�\!T����m"����,��y�̅v���<镉3Uc5S^�>#�}�.��̰]U��3�,~8��9?��-I��3<�_����d��)�Wq�~��=���8�������-7(.L���wT���RCT���Y�u��t;�'띚d.��tT�8�rS+��^�ª�#5��K���8�������W �¼�%g8WmO��^L\��0iD��6J^�����a���|s�q�u�������g�gB���^�J���Iר�5)Y.�d^WTƩ�l�F�P<~5���m�y-��XZ��e,P��N�uT��.�w��v��:SS3��a�ҝ��	O���$�����\=���Si���z!8տ_���
��_gֽ�t���=�!N���u�ȇ���shd�YU�U�:虷�����1(�����ߞ���� �d��j�t��F=g�N\ ����s��s��/'eY�W �H���wK�f��:�����F�O8p1�ʌD/���㯧�2���b�q���i�ۘ��?>�v���/.�W�f8���؟�g/uO��e�s[��0�}{�]����3ܭvWm����ae�6�bGS��V���A�~Q�>x1�mSLLF�{�S��΅����L��m��]��|W�x������7��S��L?�X����q��"x�7���i�
�R��y��4�`}���i֞�/u�j'�r��M_�>�=�^�+�E���B�L��[7u�7�.�����74=)�>�q�����%����NnA���X)���n9�|y#1Zo�a�C�y�t�lW%@���z�!�6%Wu�����ճ��w�0;�t��I����i����h��)+��}���;�a��Ij�uk�߯���nYd�2��dm����j����&��&��;�p宴�_�K�w�Û��TUڱږ�'SY����:4�����]��;%$�~���#�:�P>�v��MS���f�+l��V ���w��C�RJiZiz���IBf����DA���;f�![�C�rP5��;�a�5ɑQ�@�[�N�6�+~�b�ۤ��4-N��&�ǅ�_�
٦�2��\z@\�]����lD�
��Ԭ��~�>2o3o[ěj����D�l _h������}�eF-��$�i2�R�?�d��������}��V�T̿�������>�VOw5���9곮���4_��w.��j2�����(�ު�r�:���9����;�'��~����xX�N��Y7?Ys�މ��:z��
6�x�63R�L�(���}�����:C۔8�2䀼%�D����XT̓&�ި���s��6��du��8����xiGo�^)�n0��m���w�7n2ݸ������m���Z���V>�I���ϔ}'�Ed�������Y�����9`ov<'���#���yva\<�@��}b��g4�6���|��F��}~�,�v'��ew����!�8��Y�݌��ȟP-���&�_�E�dٯ2wa(�^���3"YEI9LQ�{�w�9���G{�À�ؒ��AZՁ���d(9��+I�9f��E�깽�Y��Pt.���ߴ9��!�jw�J����M���CD�<t��B�i�_�R�ҡw�㸁({��h��	������Ӽ4��B��}�sorZ�j����n���]&j)S9nwɸR����d*Q��t��D�9'��ܩ�rm�B)@+t��4)�I��>�n���Z�yt�јN����7?��ϙ�؃7S��������9nm1"�c~�^-��f����WU�-wC���+�b1MooQ_���_5L�@N���}�7KV�����h���d�
*�:�[��� ��[I��]-��Ng?�G�t��o?���|�>�A�5�8���"uD� \ ��E�k��m}�9�sI��?��M�m���'�aӗ3Ѯ��5տO2��ɤ����z7z�3��[P�V�7
��Y�����;�aR�VO����\J��YMirI��p+�P�uYV��Jc�~��-�}���p�*9��gv���_9�nMj��4�e��v7J�&^Uf)K�"6J��4�
���Ǳ�#���m.�o4��HȞ�f�����-i�꩚9b֢��N�6�B�x����>f�P��Fg�[�ܹ!�5����f�_�t���]{�]��}ReSͧ=@��ͷi����m��}(]ힷ}��l��"'��������T�p"of�C���G�N}������;y'������L����4��N�>��<+VJ�Bs�م��W�=usUK�;t �GW��cr�# x��O�є�u5��6�K��u�6��/6Q�z���RyV��]�.�������C��_2󮝲�j-~A���[�H��`5~�K�N�xmleݦo�$����A}h��)���氻�V��������yI�^����b̊4�T��d,ӷ��Ͽw7�Z���p)����n+"��24�/��6�7d1�Q������}Z���P;:Kꠜ���"����C��9���W��~T�o�xK{��bI��g|�|b�$/ʏ[���mҦv��H��w;����]w�'˻����|�C����r�!j��%��uL"�6'L��;��_}ci�RX�y^����y�1ï��D��Fl��ￍv��$v�qE戠+�����S����q�7��ڶ%?:_MQ�:�ө]:�M��Ba�W7;q�қV4��.��3�hd�����l��.���}4T=ɯ�j��n~һy�U���?&����Ik3����,{��4b<Vǥ28)?N��&��8|��P8h��s���ik�l�{��K?Z��i���R&�M��E��W�zc?r���Y��oWM�_5Q��ߪ��WM˿���6z���nz�Tb���2�Ix��ʤb��ukc��'�%o�aJ��u�>�[I�n���mw1��s�?���绹K�5O9�uҤ����O!�x������Yܿ�o��M���g�&{M�V�Ҏ����鿻#R�2�	�V/彩�H�ܦ*M�&��BM�Lw��6��'Ed�c�>��ՌT*`��q/7�N�ٖr\�x\�USF��(n��н�o�	Q��|,��I_�и/hۨ�eW�5�Ｂ4D��^KÜ�ׂ�g���trT��ҵ�d#%�_O^;m	Zۗ��Ο%Tc��J��{�>(Y�8�ݯ�n��E����������ӎ?Ⴞ���>i�M䞛��M��c��1]��3*�ӟ�n[�*���z��s��`j����8f��n� �����e��R�R��Q��kA�/������y}`����M����ݛMTѸ�R���~����RH|�z\�.H���y�lӗ6��� M��m�HS��Ƀ��>Z�UU>���v�C�ʩ޾�g����&�sy�_EZ<���m�����P����c�a�uC<�U�����>Ȁ��O���>B�;}:�[7�>�I~m�P`��47�A�8'�b�c?��z�r��t[��K��o��IUEC�l�t�<>;Ώ|��J��Ғ�x�}��6�8��p�s��,4��(�&)L���c2r>w�I�X�SZ���Ԛ&�/csl*�O��n�f�JN(��:�mا4{8���6�7܈����)ţ�=���P>(�?Tv�}�/4�FLl���=�^?��j^Z�������zJ�����\7�^�ǝR�����q^|�%�!�Ǭ�}��&7�9ڡ�Aob){�bo�g�ki���	q�����|�Yx��Q��J�='xX�y��*����f�V�?2�ZĲ�e�;�s��^YmNbBu���Kmi�<�7dk=<�J�	    з�r���鿪��K5܌���:-�C`󏩀j�4S�*��;�ã�I�vD�>�霖�ن��I;Y�r�Gf��	l��.߱���L�gO��Sn��^�F+��� tS$DU����x YG��T1t��޿,�fe�4z��"H���I�f���j��(�|���\��43��rL��ɯs�?����>y<I��x��Un� ��q������53�`���˓��F̓�Y#�8�J����m����S���/��e�k2���v����4֧D���E 1��،*X'}o����f��Y���W7��7��n�����(���o7�<�k��*(s�v.h�(H����]O��}�=���5��s�pŚ���:������C��u}݈��1ڊa��N���h����C;P�;�ɀKQ���v���IV�ş��OPO�;��0m/6JVR[�U�_?��o�A嶻��H8�o��J;���=:t�|i��]m�I�Iѱ�~��o�c�e��ټ�Q�WĆ8f�����P��Ԑ,���������"]���_ C��A���އ���K9<�ޜ���݇[�PZi	Н%���,q0.���6�&��6�~}GF
�����5ѹg�;~�(�UD�k�I��)U��(����O^��"S����fԧ�����^�����~5O�+|�iV�ΗN�L���׋�G�^m�]��1_�|g���W�d��Q�W���O�lٷ?f�ߡ����9}�`o�ԝ������3PR�9f��&È�Qb%D*ˇ{&�t�!.
]����'}�[�}C�����z��66��NĂ���I[��{�h�(E~��l�E�h�6T���՚F�N��N�j?&w��m�{�����S�~=�!�����@�a�B��m6�cY�]�y�����I��n��_�,�6r�Ӎm	��"��tWU���n��&y��Ѽ�z �x�����%��}��n��B����5R6������;]I��v��M~7�;Rhʸ_�&3�8�x�ݍ/��D��T��.��ƽ4�C�D�j�ѷ��o�Gm'�b|���g�1L7�O���h2i��&�8n6����^t���s�Z��s�iw�G��w�-�\%��$��ONyh�����<�i�,�����#���Ֆ.�����1j���a7������K�U��bL��M1��!|���[�+C����|�W����8�Dm2�s�8��x���S�P�5�l�����2���;(�J=Z�h꾶k�y��Wzf7Ե.�-�틶����+=F�����M���m��+����`K���'90ϴ�%h�CgZ>�ԩ~��g�����+���o�m}?f��
��K��^�Gt.֩\��>�sz6�w=f�"�m$��ӂ�7E����r����ʒ����:�͆	h�:F��3����ES��:d������S&/~�U�zZ��p��WT�5Y<���]�)	r���oVYO���P&#/�нv����}>�[Xm�N�U5���s��T�YD�|��z}Y�β�ȘjU������<�Ȋ߳�t"�9�x�:�Q��h��K��1{�ٝ�����S���Z{2y"��6��e܈&)16[�:�6��5�uf������o�Ue�#A��Yڮ�R�`eUM�0x�)��]j �)���?��A_��>��D�A����9�䀾�e�H�I{����R�Y�I*;���R�A}�9�d�\����/u{��3ٛ%�����<��⤫�ٸ���	C'��ϼJ���$�����:d�����4��M�\'o��|Eۗ��s���N�.x%��a�8�t�z��ls���T5�D�N������uZFG���N�$�:l;������{��~�{�_*�{����S�7���r�R�ft�	�_�Jm���?h�?)��~��|�T�u2�`uu*�&�y}z��'P�,�y�����.��j�Av��"7�>�\?ͯ���n�L�_>��j~ �6�2�ȇ�g���h��\�#}��J����$)�F��LU�Ki&�}�YU�����'�����M߇���˅���t�6�$��(}G�*�c~n��	�t���!J���:�u�hw�4�&_�&v��%�_�p>�M����G&�����k9��yT��f�r���z�+�n1md��"������p4��R=�X��F�y�O&�4�G�*D�v�P}w*|��)�Ӟ��v3��]1%6z�jd'�@3�mh�w?_{�!G�������q}/��*��*��E�^w�H��s\eW�.�v��)�����n� ������}r�x��')�z|�w�muCmN!�oj�x�:D���Ƀsr>0�R�ò����.��������������mt�-:���nz��mt���E��W�J�T������Myv��}!�</�?��e~A��$��s:Q�Ouao��<g#�N}�(�=�O0{?eR����2��h������\���}��i�g��s�ݶ�퉉���'1�M�S=�?�#�n�E��4}zQw��?���ϻ��5�N���X*׉Q�@O��N*O����V&Mw+�v{�a�WwEe�5Yѹ�4p5[T���f7M����f��yI�/��}��r�NBĩ���]���=�<No��1���E�g�n��]��S�g�9L*����n5ļ�K��ڹ��,����%}Isyb�f'U���.���^��{�*��iЁ��VW_&�u&������+T'|����G��~�:hbؤ�ۿMj�e���R�" ��<��ꅮ�N�1��3�A�ޏ숇ěm�%����q�M��T�ln�UN�L��g�O����:z~m�[��{�H�e��
���O��n6S�n����g�sj6��IVnO'�b�L�/�oV����*�v�jD�������>dy\���X8iP;�K�Fqr��=v���ϻ�"�늵�BvOLsUs�Ɉ���ؽd�P�SU�s���E����F��r|�Nj9���ѡ�a���$�=��������}ۦT��`X=�Y5%��M�0U���a)ߛ��Q��5���f8��dC��)�+8$��&���v�4��q����iC���؋��|�#��v�@Ud<&�E���!������3������>,ćd���r��҇��������������1�
��N�{�I����Ԁ�{���+�}��u�un��9I+M�rr�ܸ�a�4l$<������kd�TG]r!���6|ݪ�Nz�47d; ,a옷i�JsK۠\���%�I�7�)_�f�{ڧK�b��3?i��j�#���m��Pm�f��f��o&����<�?>��Fs>��}��i�*(U^�@�[��o�
?��MJ�;�����G+�)��T=۾���c��x*��z�Z�IxΔ��"e�ߞ
�M6M���8C%fMjæ��8USp�������}l�r��ќ�(�A⋱Q�Im]ͰU	o�NRK�=�(>_��o�Ufs�LI��D��T�Mq� \��Q��Y]vU�<�C�.yn�/�N~�-�#s>uޟ�+��s��"�v �{{zA���k�������l�^�����z@�]I��p���5n��}MK��������n{ҷ���F��=h�P����l��
�9;���Λ?����}��J{�FR�ݜ����{��@�>�71�2�w]����O�W&�;���v�14��gt�&����M��Qh��	����X��ϋ���6��|L���gZYEm�V|Ԥ*�t��$�^���K���4�w�%b���.t�E���u�JNq��qH.�:|֛��	c����C�S�\hL����x�H[���7��1�����=�A����;_{�_�Ɨ	'���8���l�����$��2doW��~��q�
��[�-�#Z������˖I�]��ko���}x�#{P#7�3;���I��6[�H�ZJ{M~ �l���:��c��f<���r*]q��훑ϧ*�%�f17���w������[�6�R"��В� jR-Y����9M;�[L����-�~�Ժp)N��.;0��J��o���i�����ܝ}'w��u    �� R�B�ݭ���4�[f��O����l�z��>���j�����^/�Ў,y�}6�*TZ9ɻ�-�MnG		O��Gm�����V��k��Z5��z�ƅ{�]�d.t�+�.{�D{�K�����Fb�ܩNPy#9̎Q�F	���Kf~���P<u��g~���#42s=zoΉ�U��ѿ���7�����i�E���y��M]��c�7�[1A���k�ζ�ƛ��z��N���^i�Gv�ݗ�]i��7O�<�(����3��1�����2�"\ցB���t|	����H�Wf��I�)O3%I�y����6����-jMb�#=[���_(@���uv;>�NA��j�N���O��t��ږ�����q��{\���xr?�2���)����Z���!�`��M��$����>�s��wE�we��,�z�9x����o����T��Ԙ�7��NY��5���&�˳�`��c��U��y��h�Q�����kg��󤋼K �{��]p�����矠��kO��Sy�ӂ�<c��v9=����h�Vz�4O����f����JY�'��d�n��gw�9�U2Ut�4,�c0��m�$z�R��8Xdw�Z۝��Q�Ȗ�V���b��X$�_R{����PI__���>1
o�|�BJ�~
����~&=}�]�Kl��]��O�37i�;�8l��ԲO���.q�(���cmjSM~`�'E�����M
z�V���;���?�p�RN��)�Лgy�p�H���2e[)������o��*��m<�s|����T�=s�����Y���LD��h-��e��l��4����E�i9�`�����R�J��w�)쮫Ư�ܓ���>~M.��7�yAΉ�V9�����I2�+I)U��6$̞��`mkMC���Jr��uϦ��֍�g#R�􆉑�������{Ϡ�:�If� \Ҟ�~��cC�N?"�l����$�h{�6���#Wk��?R�-R+۠��W=�Q�ns��긡R,j�n�+ZR���txgO�G�_�Ɇw��s�?�Ǧ��ā�=��>��GE�$�w	����.��P���[��ݾ)�Mְp�H�����K�����x_���}1u��I��4�J�I[����u�n�n��iv�����y�n(��aO���%���ɥ�d�tK�ip����Y��o,m����ڻ�JRƞ�q���ٕ^���/v'G����͛:c�۰qf=v�̟�zÍ{���vw��=�)��6���K�qa1?��o�}����|�t�䪢θ��8�%G~�������s�v���d��֧M�9�^s/Jw�~����������{3�y[܇t��?���
#RE�қ����ˠS�R�LꏉsZ更��P:��qI*;wR+�;M���s��矓U4�B�d+�o�oU����o"�2���iz����, �E��ʶ����w��<��ۨ�뒘�aM���J���n���K�Z�A:�$�ΨJ�h0�o衿��U��>�jC.x���[11����ז�Xb	���[�̣�����-�h��yK�jƞw}���)3�\3�������)�~Ǖ�����uT��I���9�!��a�j�d;�t��vj��l��7�wjW����d Γn�
㔻�]�D��u7�1n�U�%@�u7��� ���?gW���OnrY�Ҩ+�j��0��V_P0��V���)�8VO$���d��� F��f�ŧ�'ܴ�܄�|f�U�����h�+d��wN"M@��rdi���{G^�|�]�8��7���&O�fq�����v��o�����NK���o�	&��Yd�f�h�r�ܟ��O��Z���:�s�}���Jn����S�?d�T���K~���9O�m���ͤ)����+�:���\ ����?:�IeT��}��V�!q�1s��P����'~��������>���;����Oz �����N�)n��ajR��	+u��2%̱P�PN�3��7g�)G��P遲o�>���J���_��̓Nﴷ) �W�1|Sp��/��?����޹uf��=2�2]��ӎ�3�o�J����<�m���J��a��(�)����7S��6���+��@.x����7��"��K-�is���}WDU��VO��[���q�@z~�Y�N8���|��$���zwwH�_�/E��v����*��C�D+U{�M���Q��N�4�����<0T�[4���v~�^%����(�AF�hNr���L�,i�̘s����U���䃟�\q�j�p���H�2`Ӕ�5��6?մ�E����2�x�;2Biu�M5�␮���y�55W�{��ɐ��~�~}�a�p>h\�&�Ǫ��"�zU�q�o���Ԋ��;�s�Zq^~y`K��i����#���~IwI����乌��PQ:WNo��2�{_?��4J�޿I�9f9�S6���M|�6��Ž�nӑ�7�@s��F�9Ym?v�O�~W��U��#�WM6WS����i"ە��;��?Q���X0 $V��$��Rtô�mN[fw��6�Մ�܆�6��m�c4y�È<���h���#!��)H��Dgh�~n�m��i;A�д�9�Im�sU���Ji��޵�5%SJ��a&��:$d��W
ٻ=5�Յ�������l��HP�o2/�i�Ϛ�k����=���y7g��w{�En�I�'��ӱ�
��1����qw^���w^Y�1=��.�~�fo)���52	�>��~��sZ��n�3�^P�mW+�m�P���i2�{�G���[�C4��G��Ces��~P�ݜXK��meb����=��hM+2J�e���H�:������z�/A��S^�Cݷ�W4��Y��r��ɫ��_j�������Э�k��x�cl�)6_�#��2�N����ͤ�_#j^κ�j�J�1͛y��O�*�C^竢�D���	D�p�@����p&K���훷Թ�扽�i��e�Uqy���
׻���\?���ݧ���m-}E��q�m#b6�Kg�,�^v\.�������s��(��R��>ԌMX˯�u�i7rꚙ=�Q/��%2ZUC������:D���MI����e�o�������;����D�|���;}Q߫��k�F�T%�ڢ�U.���?�i*S����K�I��P���otd�?�_zQc�ƃ�������������^,��ӡ����h�*Kԩ����Yl/�F��э^f��kܛ~�\b*|F�X�:�Cکfn'ji*}�w�!s�=�!8\4~w�9�/q���n�o���t�]~��)ف���u�K��O�b^���7��ej��O�~���+��C�i�I[gj�QfC^Zp!�z��7���7i{x��l<���:��9����a~+,���+{��6��qG��>wm��v=w�Vύ�y�6f%ǿ�'^So�J�)<�m]�-�OE��u��?g7�3��\�ŧ���)���p�W7/��8�s�ϕ
8�������������Q�}�����S��o���[����+.Tib3k\e���S����n����Zo���hO�}����ub�
��;�pnn�������%rڄls��ϼ���>���vJ�?x��>���J�;�䂁�C/QM��l��[י������]���r"#�s��?�;���i����=�L���q��H�m�S�%?�-{
�Ew����n'���Xv~|$�uv&�e����M����s:�KP��tg�74ϲi��́5�6n��[���m'��窱����92���q��[��z�>Ce-����&�tH��K�a��	j�J9���i��G����������?����h�똾�W>��Uy���wՍ/����}-�zn6=����y�i(a�t�[�o�!�jؿ��uq"[_ΐ���.w�9|�vu��k<G��sR��oy{}��Ikɱ��}fv���;WG��i���d�?����]����ć�g��ʏ��r?�N���ґ)�g�o�nΟW�f���o;���-�n�?	+��zŘ|�}��[Ւ���-���oJ�{�M���3��x�}�_�- 2  �ZI����Σ����D�E����9�<[N���ec�����D!�X�ua� ��ל�N�g}UY�շ���Po����G�����M�|��~�������1>1$�d�����H�|ȫ��ep�{���g��S񙙷��pd]��o��e���j�q��6�+Ӽ�]QQ<l ˭[!)15�0���<�1pwߞR�i(���;jԂu�MO|���Ui�"��wY�<�7��W����x6l�Z��)q��sn�����^���_�J\�p��e퓜%ۘn<��*3�+���7�o�w3���܅NM�ݎ�P�6k��Í�`K��PI���,R�p��&R��P-���w����q��szFk�����4.".Æ�o3qϡA��s��_Թw��e�g�L�˟��b|�_o"�p�ç�ߓ�[��8Y�'�n�#��ycp����e���*�)w�����{=my��%-|�z�qgRzL�)G��a�x~�ao4�L��7��%.�~Ғ{��ʪ4����$@�=l��[+���٢9eUNT>���sR҉�4�M�U%^}�iY�l3��l鯿�=�_����c�m�?ٜ�=�&��K�Iq�P�<�e��Ϝ:H|mR��=9]����̶��ѿP�6)�j9������@ȅ�]�����U��{R�e_�!�?�n@~�A���\���c�sq�t���8���)Io�Y�-C
�fL-	:umy����H�e�'JȎ��uA?<8?��ؤ�i�������)�A�嗣���6>�cN��&2⇕�jӸʀ�g��z��d�w�bt?��y�~��"�H��>|��A�\FT�Ɉ�$sKW���O�N�e\�a��>�}��d/x̗wI)��8��~��g�mah��v�JҔ����;�җv�Ш�:�v�(_�'���0|�H����OD�f��i��<�����pdJ�VSV_��ܸ�wY�+W�2��1[�*v�(S���t����Gu���Ys���@�F>�����_Q/lҪ�E��uL�-�2�O9���6$��>��CF��):�m�ʵ�;&f/�9���,��I�[]-�<����\�uPJ��^�t�>9��f
�l)�$�ʌ����3}N!�@�n��_��8�iumGꞗ���YnJUv�F��K��z�d�qf�������vi�s݇�(��a/��y��9����w8�~dX�xM�t�N���_Z��m��}M��?�t������QfV��}�w�Sg�����N�Q~�P&�l����\������c��O:����۹�4Q��.�qb7�`��)�	���HH�J+��x֝$8�x�>~VY��t�ۑ�UO;>��gF�ڦD��<��Si����ݮE��_��~��?]B����%�DV�T΅���8��/��U�Q�Ď��/uf9O(�X֑ӫ��!V�Ȭ��nU�0����5�)�z�I�Ƞ��.k�`'Mf�n��*}�����W}��zj�-Ӵ��V��x0�![�uB{�n���Ú�6�8�ÔuG=p1.t����pJ�QyB�ܺ;h�)�p-t�Z�Xi�Ժ�IG��JKSYT�h���.�ĠL�ʉ�6�Ћm�9�	���VD�����Q�;�߂�jaj�������s��M I�3!S���zE7e�d=��̩�3��F���Wv$j��G�ڌ���z����#Gm
h���ks���Z|i�]��>�#�`\X��Q5��n�����������u�\���#�[F>z�ʩ��HϾ'��T�A>������rF�3n��?�����:�g���씡V\�%H����^�֚�����jϋ(�5��E�5�؃k�^��4��ݫ�xu��lm4�`�O�`�n����8`1��R�Wt]�k}��N��fψ;w/?�8:��k'�$�û��qpS5�����H���@ѵ���sTT�tk��-�3t6����I$Y�qV��ӧ��:��ǌ#���H*�U��&��ܣѵ!?��0��� ޗ�n��Z؝��(Yu�v�p�&p��W�9�f���a�㼪6S�,ꑌ-��� ��5q�[8[zK�d�Yn��JN�9yJFf�2�좼�s-�NM��������������> �'`_      `      x�3�4�4����� �\      V      x������ � �      N      x������ � �      R      x������ � �      e   -   x�3�4Bc�N##S]]C+##+C=K#�=... �-�      ;   �   x���K�0�ϛ�b����[�(��S/���@���7m@o�0,���7���	@�2�����a�P������8t��,��0.�v��ʗ��%C���yz��9��G�$��%	$��l˪&E�-D�O*?�C��.��&�3�>L+�|d�:��-�B�7
!O      H      x�3�4�?.#N2�9AȈ���� P��      g   J   x�3�L��+.�)I�/�L�-.M,��W((MMIU�I)���LuLt,��L����,L�,��b���� ���     