PGDMP                      }           SoportePost    16.4    16.4 �    %           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            &           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            '           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            (           1262    44789    SoportePost    DATABASE     �   CREATE DATABASE "SoportePost" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "SoportePost";
                postgres    false                        3079    44790    dblink 	   EXTENSION     :   CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;
    DROP EXTENSION dblink;
                   false            )           0    0    EXTENSION dblink    COMMENT     _   COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';
                        false    2                        3079    44836    lo 	   EXTENSION     6   CREATE EXTENSION IF NOT EXISTS lo WITH SCHEMA public;
    DROP EXTENSION lo;
                   false            *           0    0    EXTENSION lo    COMMENT     7   COMMENT ON EXTENSION lo IS 'Large Object maintenance';
                        false    3            H           1255    44841 ;   check_password_exists(character varying, character varying)    FUNCTION     `  CREATE FUNCTION public.check_password_exists(p_username character varying, p_password character varying) RETURNS TABLE(username character varying, password character varying)
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
       public          postgres    false            K           1255    44842 (   check_username_exists(character varying)    FUNCTION     �   CREATE FUNCTION public.check_username_exists(p_username character varying) RETURNS TABLE(username character varying)
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
       public          postgres    false            L           1255    45206 '   get_client_by_serial(character varying)    FUNCTION     e  CREATE FUNCTION public.get_client_by_serial(p_serialpos character varying) RETURNS TABLE(razonsocial character varying, coddocumento character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        (remote_table).razonsocial,
        (remote_table).coddocumento
    FROM
        dblink(
            'host=127.0.0.1 port=5432 dbname=Intelipunto user=postgres password=Airan1234',
            'SELECT
                clie.razonsocial,
                clie.coddocumento
            FROM
                clie_tblclientepotencial clie
            INNER JOIN
                tblinventariopos inv ON inv.id_cliente::text = clie.id_consecutivo::text
            WHERE
                inv.serialpos = ''' || p_serialpos || ''''
        ) AS remote_table (
            razonsocial VARCHAR(200),
            coddocumento VARCHAR(15)
        );
END;
$$;
 J   DROP FUNCTION public.get_client_by_serial(p_serialpos character varying);
       public          postgres    false            ,           1255    45196    get_data_coordinator()    FUNCTION     �  CREATE FUNCTION public.get_data_coordinator() RETURNS TABLE(id_user integer, national_id character varying, full_name character varying, email character varying)
    LANGUAGE plpgsql
    AS $$
	BEGIN
	    RETURN QUERY
	   SELECT usr.id_user, usr.national_id, CAST(CONCAT(usr.name, ' ' ,usr.surname) as VARCHAR) as full_name, usr.email 
	   FROM users usr
	   WHERE usr.id_rolusr = 4;
	END;
	
$$;
 -   DROP FUNCTION public.get_data_coordinator();
       public          postgres    false            .           1255    44843 %   get_failed_attempts_by_username(text)    FUNCTION       CREATE FUNCTION public.get_failed_attempts_by_username(p_username text) RETURNS TABLE(trying_failedpassw integer)
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
       public          postgres    false            D           1255    44844    get_failures_level_1()    FUNCTION     ;  CREATE FUNCTION public.get_failures_level_1() RETURNS TABLE(id_failure integer, name_failure character varying, id_failure_level integer)
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
       public          postgres    false                       1255    44845    get_failures_level_2()    FUNCTION     ;  CREATE FUNCTION public.get_failures_level_2() RETURNS TABLE(id_failure integer, name_failure character varying, id_failure_level integer)
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
       public          postgres    false            :           1255    44846    get_install_day_pos(text)    FUNCTION        CREATE FUNCTION public.get_install_day_pos(p_serialpos text) RETURNS TABLE(inst_ticket date)
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
       public          postgres    false                       1255    44847    get_last_date_ticket(text)    FUNCTION     `  CREATE FUNCTION public.get_last_date_ticket(p_serialpos text) RETURNS TABLE(ult_ticket date)
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
       public          postgres    false            1           1255    44848 =   get_user_by_credentials(character varying, character varying)    FUNCTION     �  CREATE FUNCTION public.get_user_by_credentials(p_username character varying, p_password character varying) RETURNS TABLE(id_user integer, usuario character varying, clave character varying, cedula character varying, nombres character varying, apellidos character varying, correo character varying, codtipousuario integer, name_rol character varying, status integer)
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
       public          postgres    false            7           1255    44849 $   get_user_by_email(character varying)    FUNCTION     �  CREATE FUNCTION public.get_user_by_email(p_email character varying) RETURNS TABLE(email character varying, coddocumento character varying, id_user integer, nombre_completo character varying)
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
       public          postgres    false                       1255    44850    getcoordinator()    FUNCTION     �   CREATE FUNCTION public.getcoordinator() RETURNS TABLE(id_user integer, full_name text)
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
       public          postgres    false                       1255    44851    getdataclientbyrif(text)    FUNCTION     :  CREATE FUNCTION public.getdataclientbyrif(p_rif text) RETURNS TABLE(id_cliente integer, razonsocial text, rif text, tipocomunicacion integer, nombre_tipo_pos text, name_modelopos text, modelopos integer, serial_pos text, afiliacion text, fechainstalacion date, banco text, direccion_instalacion text, id_estado integer, estado text, id_municipio integer, municipio text)
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
       public          postgres    false            W           1255    45208    getdataticket1()    FUNCTION     k  CREATE FUNCTION public.getdataticket1() RETURNS TABLE(id_ticket integer, create_ticket text, serial_pos character varying, id_status_ticket integer, name_status_ticket character varying, id_process_ticket integer, name_process_ticket character varying, id_accion_ticket integer, name_accion_ticket character varying, id_level_failure integer, id_failure integer, name_failure character varying, full_name_tecnico text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    tik.id_ticket,
    to_char(tik.date_create_ticket, 'DD-MM-YYYY HH12:MI') as create_ticket,
    tik.serial_pos,
    tik.id_status_ticket,
    stutik.name_status_ticket,
    tik.id_process_ticket,
    procs.name_process_ticket,
    tik.id_accion_ticket,
    accti.name_accion_ticket,
    tik.id_level_failure,
    tik.id_failure,
    fail.name_failure,
    CONCAT(usr.name, ' ', usr.surname)
  FROM
    tickets tik
  INNER JOIN
    status_tickets stutik ON stutik.id_status_ticket = tik.id_status_ticket
  INNER JOIN
    process_tickets procs ON procs.id_process_ticket = tik.id_process_ticket
  INNER JOIN
    accions_tickets accti ON accti.id_accion_ticket = tik.id_accion_ticket
  INNER JOIN
    failures fail ON fail.id_failure = tik.id_failure
  INNER JOIN
    users usr ON usr.id_user = tik.id_user
  WHERE
    tik.id_level_failure = 1
  ORDER BY
    tik.date_create_ticket DESC
  LIMIT 1;
END;
$$;
 '   DROP FUNCTION public.getdataticket1();
       public          postgres    false            M           1255    44852    getinstalldate()    FUNCTION     �   CREATE FUNCTION public.getinstalldate() RETURNS bigint
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
       public          postgres    false            >           1255    44853    getpassworduser(text, text)    FUNCTION     ^  CREATE FUNCTION public.getpassworduser(p_username text, p_password text) RETURNS TABLE(username character varying, password character varying)
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
       public          postgres    false            Z           1255    44854    getposserialsbyrif(text)    FUNCTION     B  CREATE FUNCTION public.getposserialsbyrif(p_rif text) RETURNS TABLE(serial text)
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
       public          postgres    false            '           1255    44855    getstateregionbyid(integer)    FUNCTION     �  CREATE FUNCTION public.getstateregionbyid(p_id_state integer) RETURNS TABLE(id_state integer, name_state character varying, id_region integer, name_region character varying)
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
       public          postgres    false            &           1255    44856     getuserbycredentials(text, text)    FUNCTION     �  CREATE FUNCTION public.getuserbycredentials(p_username text, p_password text) RETURNS TABLE(id_user integer, usuario character varying, clave character varying, cedula character varying, nombres character varying, apellidos character varying, correo character varying, codtipousuario integer, status integer)
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
       public          postgres    false            Y           1255    44857    getusername(text)    FUNCTION     �   CREATE FUNCTION public.getusername(p_username text) RETURNS TABLE(username character varying)
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
       public          postgres    false            6           1255    44858 ~   insert_session_user(text, integer, timestamp without time zone, text, character varying, integer, timestamp without time zone) 	   PROCEDURE     :  CREATE PROCEDURE public.insert_session_user(IN p_id_session text, IN p_id_user integer, IN p_start_date timestamp without time zone, IN p_user_agent text, IN p_ip_address character varying, IN p_active integer, IN p_expiry_time timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO sessions_users (id_session, id_user, start_date, user_agent, ip_address, active, expiry_time)
    VALUES (p_id_session, p_id_user, p_start_date, p_user_agent, p_ip_address, p_active, p_expiry_time);

    COMMIT; -- Asegura que la inserción se guarde
END;
$$;
    DROP PROCEDURE public.insert_session_user(IN p_id_session text, IN p_id_user integer, IN p_start_date timestamp without time zone, IN p_user_agent text, IN p_ip_address character varying, IN p_active integer, IN p_expiry_time timestamp without time zone);
       public          postgres    false            N           1255    44859    insertticketfailure(integer)    FUNCTION     �   CREATE FUNCTION public.insertticketfailure(p_id_failure integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO tickets_failures (id_failure)
    VALUES (p_id_failure);
END;
$$;
 @   DROP FUNCTION public.insertticketfailure(p_id_failure integer);
       public          postgres    false                       1255    44860 X   save_data_failures2(text, integer, integer, integer, integer, integer, text, text, text)    FUNCTION     O  CREATE FUNCTION public.save_data_failures2(p_serial text, p_descripcion integer, p_nivel_falla integer, p_id_status_payment integer, p_coordinador integer, p_id_user integer, p_ruta_base_datos text DEFAULT NULL::text, p_ruta_exo text DEFAULT NULL::text, p_ruta_anticipo text DEFAULT NULL::text) RETURNS boolean
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
       public          postgres    false                       1255    44861 R   save_data_failures2(text, text, integer, integer, text, integer, text, text, text)    FUNCTION     I  CREATE FUNCTION public.save_data_failures2(p_serial text, p_descripcion text, p_nivel_falla integer, p_id_status_payment integer, p_coordinador text, p_id_user integer, p_ruta_base_datos text DEFAULT NULL::text, p_ruta_exo text DEFAULT NULL::text, p_ruta_anticipo text DEFAULT NULL::text) RETURNS boolean
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
       public          postgres    false            F           1255    44862 R   save_data_failures2(text, text, text, integer, integer, integer, text, text, text)    FUNCTION     I  CREATE FUNCTION public.save_data_failures2(p_serial text, p_coordinador text, p_descripcion text, p_nivel_falla integer, p_id_status_payment integer, p_id_user integer, p_ruta_base_datos text DEFAULT NULL::text, p_ruta_exo text DEFAULT NULL::text, p_ruta_anticipo text DEFAULT NULL::text) RETURNS boolean
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
       public          postgres    false            V           1255    44863 .   savedatafalla(text, integer, integer, integer)    FUNCTION     �  CREATE FUNCTION public.savedatafalla(p_serial_pos text, p_id_failure integer, p_id_level_failure integer, p_id_user integer) RETURNS boolean
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
        3,
        1,
        1,
        p_id_failure,
        p_id_level_failure
    );

    RETURN TRUE;

EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
 |   DROP FUNCTION public.savedatafalla(p_serial_pos text, p_id_failure integer, p_id_level_failure integer, p_id_user integer);
       public          postgres    false            4           1255    44864 V   savedatafalla2(text, integer, integer, integer, integer, integer, bytea, bytea, bytea)    FUNCTION       CREATE FUNCTION public.savedatafalla2(p_serial_pos text, p_id_user_coord integer, p_id_failure integer, p_id_level_failure integer, p_id_status_payment integer, p_id_user integer, p_downl_send_to_rosal bytea, p_downl_exoneration bytea, p_downl_payment bytea) RETURNS boolean
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
       public          postgres    false                       1255    44865    searchserial(text)    FUNCTION     �  CREATE FUNCTION public.searchserial(p_serial text) RETURNS TABLE(serial_pos text, id_cliente integer, numero_terminal text, nombre_tipo_comunicacion text, numero_sim text, usuario_carga text, estatus_pos text, serial_mifi text, usuario_carga2 text, fecha_carga date, usuario_parametros text, fecha_parametros date, modelo integer)
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
       public          postgres    false            
           1255    44866    searchtypepos(text)    FUNCTION     �  CREATE FUNCTION public.searchtypepos(p_serial text) RETURNS TABLE(codmodelopos text)
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
       public          postgres    false            /           1255    44867 %   trying_failedpassw(character varying)    FUNCTION     �  CREATE FUNCTION public.trying_failedpassw(p_username character varying) RETURNS integer
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
       public          postgres    false            9           1255    44868 )   update_user_password_by_email(text, text) 	   PROCEDURE     5  CREATE PROCEDURE public.update_user_password_by_email(IN p_email text, IN p_new_password text)
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
       public          postgres    false                       1255    44869    verifingbranches(text)    FUNCTION     �  CREATE FUNCTION public.verifingbranches(p_rif text) RETURNS TABLE(id_estado text, nombre_estado text)
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
       public          postgres    false            T           1255    44870    verifingclient(text)    FUNCTION     q  CREATE FUNCTION public.verifingclient(p_rif text) RETURNS TABLE(id_cliente integer, rif text)
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
       public          postgres    false            �            1259    44871    accion    TABLE     �   CREATE TABLE public.accion (
    id_accion integer NOT NULL,
    name_accion character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.accion;
       public         heap    postgres    false            �            1259    44875    accion_id_accion_seq    SEQUENCE     �   CREATE SEQUENCE public.accion_id_accion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.accion_id_accion_seq;
       public          postgres    false    218            +           0    0    accion_id_accion_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.accion_id_accion_seq OWNED BY public.accion.id_accion;
          public          postgres    false    219            �            1259    44876    accions_tickets    TABLE     }   CREATE TABLE public.accions_tickets (
    id_accion_ticket integer NOT NULL,
    name_accion_ticket character varying(50)
);
 #   DROP TABLE public.accions_tickets;
       public         heap    postgres    false            �            1259    44879    areas    TABLE     b   CREATE TABLE public.areas (
    id_area integer NOT NULL,
    name_area character varying(100)
);
    DROP TABLE public.areas;
       public         heap    postgres    false            �            1259    44882    assignments_tickets    TABLE     �   CREATE TABLE public.assignments_tickets (
    id_assginment_ticket integer NOT NULL,
    id_ticket integer,
    id_coordinator integer,
    id_tecnico integer,
    date_sendcoordinator date,
    note character varying(200),
    date_assign_tec2 date
);
 '   DROP TABLE public.assignments_tickets;
       public         heap    postgres    false            �            1259    44885    branches    TABLE     �   CREATE TABLE public.branches (
    id_branches integer NOT NULL,
    name_branches character varying(100),
    id_region integer
);
    DROP TABLE public.branches;
       public         heap    postgres    false            �            1259    44888    departments    TABLE     �   CREATE TABLE public.departments (
    id_department integer NOT NULL,
    name_department character varying(100),
    id_coordinador_rol integer
);
    DROP TABLE public.departments;
       public         heap    postgres    false            �            1259    44891    departments_id_department_seq    SEQUENCE     �   CREATE SEQUENCE public.departments_id_department_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.departments_id_department_seq;
       public          postgres    false    221            ,           0    0    departments_id_department_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.departments_id_department_seq OWNED BY public.areas.id_area;
          public          postgres    false    225            �            1259    44892    departments_id_department_seq1    SEQUENCE     �   CREATE SEQUENCE public.departments_id_department_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.departments_id_department_seq1;
       public          postgres    false    224            -           0    0    departments_id_department_seq1    SEQUENCE OWNED BY     `   ALTER SEQUENCE public.departments_id_department_seq1 OWNED BY public.departments.id_department;
          public          postgres    false    226            �            1259    44893    failures    TABLE     �   CREATE TABLE public.failures (
    id_failure integer NOT NULL,
    name_failure character varying(100),
    id_failure_level integer
);
    DROP TABLE public.failures;
       public         heap    postgres    false            �            1259    44896    failures_id_failure_seq    SEQUENCE     �   CREATE SEQUENCE public.failures_id_failure_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.failures_id_failure_seq;
       public          postgres    false    227            .           0    0    failures_id_failure_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.failures_id_failure_seq OWNED BY public.failures.id_failure;
          public          postgres    false    228            �            1259    44897    levels_tecnicos    TABLE     �   CREATE TABLE public.levels_tecnicos (
    id_level_tecnico integer NOT NULL,
    name_level character varying(100),
    description character varying(200)
);
 #   DROP TABLE public.levels_tecnicos;
       public         heap    postgres    false            �            1259    44900 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE     �   CREATE SEQUENCE public.levels_tecnicos_id_level_tecnico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.levels_tecnicos_id_level_tecnico_seq;
       public          postgres    false    229            /           0    0 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.levels_tecnicos_id_level_tecnico_seq OWNED BY public.levels_tecnicos.id_level_tecnico;
          public          postgres    false    230            �            1259    44901    process_tickets    TABLE        CREATE TABLE public.process_tickets (
    id_process_ticket integer NOT NULL,
    name_process_ticket character varying(50)
);
 #   DROP TABLE public.process_tickets;
       public         heap    postgres    false            �            1259    44904    regions    TABLE     �   CREATE TABLE public.regions (
    id_region integer NOT NULL,
    name_region character varying(100),
    "id_statusReg" integer
);
    DROP TABLE public.regions;
       public         heap    postgres    false            �            1259    44907    regions_id_region_seq    SEQUENCE     �   CREATE SEQUENCE public.regions_id_region_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.regions_id_region_seq;
       public          postgres    false    232            0           0    0    regions_id_region_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.regions_id_region_seq OWNED BY public.regions.id_region;
          public          postgres    false    233            �            1259    44908    regionstecnicos    TABLE     }   CREATE TABLE public.regionstecnicos (
    id_regionstecnicos integer NOT NULL,
    id_region integer,
    id_user integer
);
 #   DROP TABLE public.regionstecnicos;
       public         heap    postgres    false            �            1259    44911 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE     �   CREATE SEQUENCE public.regionstecnicos_id_regionstecnicos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.regionstecnicos_id_regionstecnicos_seq;
       public          postgres    false    234            1           0    0 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.regionstecnicos_id_regionstecnicos_seq OWNED BY public.regionstecnicos.id_regionstecnicos;
          public          postgres    false    235            �            1259    44912    roles    TABLE     b   CREATE TABLE public.roles (
    id_rolusr integer NOT NULL,
    name_rol character varying(50)
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    44915    roles_id_rolusr_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_rolusr_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.roles_id_rolusr_seq;
       public          postgres    false    236            2           0    0    roles_id_rolusr_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.roles_id_rolusr_seq OWNED BY public.roles.id_rolusr;
          public          postgres    false    237            �            1259    44916    sessions_users    TABLE     t  CREATE TABLE public.sessions_users (
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
       public         heap    postgres    false            �            1259    44923    states    TABLE     �   CREATE TABLE public.states (
    id_state integer NOT NULL,
    name_state character varying(255) NOT NULL,
    id_region integer
);
    DROP TABLE public.states;
       public         heap    postgres    false            �            1259    44926    states_id_state_seq    SEQUENCE     �   CREATE SEQUENCE public.states_id_state_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.states_id_state_seq;
       public          postgres    false    223            3           0    0    states_id_state_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.states_id_state_seq OWNED BY public.branches.id_branches;
          public          postgres    false    240            �            1259    44927 
   status_lab    TABLE     r   CREATE TABLE public.status_lab (
    id_status_lab integer NOT NULL,
    name_status_lab character varying(50)
);
    DROP TABLE public.status_lab;
       public         heap    postgres    false            �            1259    44930    status_lab_id_status_lab_seq    SEQUENCE     �   CREATE SEQUENCE public.status_lab_id_status_lab_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.status_lab_id_status_lab_seq;
       public          postgres    false    241            4           0    0    status_lab_id_status_lab_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.status_lab_id_status_lab_seq OWNED BY public.status_lab.id_status_lab;
          public          postgres    false    242            �            1259    44931    status_payments    TABLE        CREATE TABLE public.status_payments (
    id_status_payment integer NOT NULL,
    name_status_payment character varying(50)
);
 #   DROP TABLE public.status_payments;
       public         heap    postgres    false            �            1259    44934 %   status_payments_id_status_payment_seq    SEQUENCE     �   CREATE SEQUENCE public.status_payments_id_status_payment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.status_payments_id_status_payment_seq;
       public          postgres    false    243            5           0    0 %   status_payments_id_status_payment_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.status_payments_id_status_payment_seq OWNED BY public.status_payments.id_status_payment;
          public          postgres    false    244            �            1259    44935    status_tickets    TABLE     |   CREATE TABLE public.status_tickets (
    id_status_ticket integer NOT NULL,
    name_status_ticket character varying(50)
);
 "   DROP TABLE public.status_tickets;
       public         heap    postgres    false            �            1259    44938 #   status_tickets_id_status_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.status_tickets_id_status_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.status_tickets_id_status_ticket_seq;
       public          postgres    false    245            6           0    0 #   status_tickets_id_status_ticket_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.status_tickets_id_status_ticket_seq OWNED BY public.status_tickets.id_status_ticket;
          public          postgres    false    246            �            1259    44939    tickets_id_ticket_seq    SEQUENCE     ~   CREATE SEQUENCE public.tickets_id_ticket_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.tickets_id_ticket_seq;
       public          postgres    false            �            1259    44940    tickets    TABLE     b  CREATE TABLE public.tickets (
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
       public         heap    postgres    false    247            �            1259    44946    tickets_failures    TABLE     �   CREATE TABLE public.tickets_failures (
    id_tickets_failures integer NOT NULL,
    id_ticket integer NOT NULL,
    id_failure integer
);
 $   DROP TABLE public.tickets_failures;
       public         heap    postgres    false            �            1259    44949    tickets_failures_id_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_failures_id_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.tickets_failures_id_ticket_seq;
       public          postgres    false    249            7           0    0    tickets_failures_id_ticket_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.tickets_failures_id_ticket_seq OWNED BY public.tickets_failures.id_ticket;
          public          postgres    false    250            �            1259    44950 (   tickets_failures_id_tickets_failures_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_failures_id_tickets_failures_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.tickets_failures_id_tickets_failures_seq;
       public          postgres    false    249            8           0    0 (   tickets_failures_id_tickets_failures_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.tickets_failures_id_tickets_failures_seq OWNED BY public.tickets_failures.id_tickets_failures;
          public          postgres    false    251            �            1259    44951    tickets_status_history    TABLE     _  CREATE TABLE public.tickets_status_history (
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
       public         heap    postgres    false            �            1259    44954 %   tickets_status_history_id_history_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_history_id_history_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.tickets_status_history_id_history_seq;
       public          postgres    false    252            9           0    0 %   tickets_status_history_id_history_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.tickets_status_history_id_history_seq OWNED BY public.tickets_status_history.id_history;
          public          postgres    false    253            �            1259    44955    tickets_status_lab    TABLE     �   CREATE TABLE public.tickets_status_lab (
    id_ticket_status_lab integer NOT NULL,
    id_ticket integer,
    id_status_lab integer
);
 &   DROP TABLE public.tickets_status_lab;
       public         heap    postgres    false            �            1259    44958 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 B   DROP SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq;
       public          postgres    false    254            :           0    0 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE OWNED BY     {   ALTER SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq OWNED BY public.tickets_status_lab.id_ticket_status_lab;
          public          postgres    false    255                        1259    44959    tickets_status_tickets    TABLE     �   CREATE TABLE public.tickets_status_tickets (
    id_ticket_status_ticket integer NOT NULL,
    id_ticket integer,
    id_status_ticket integer,
    "date _status_ticket" date,
    level_failure integer
);
 *   DROP TABLE public.tickets_status_tickets;
       public         heap    postgres    false                       1259    44962 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq;
       public          postgres    false    256            ;           0    0 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq OWNED BY public.tickets_status_tickets.id_ticket_status_ticket;
          public          postgres    false    257                       1259    44963    user_permissions    TABLE     
  CREATE TABLE public.user_permissions (
    id_permission integer NOT NULL,
    id_user integer NOT NULL,
    id_view integer,
    id_accion integer,
    permitido boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 $   DROP TABLE public.user_permissions;
       public         heap    postgres    false                       1259    44968 "   user_permissions_id_permission_seq    SEQUENCE     �   CREATE SEQUENCE public.user_permissions_id_permission_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.user_permissions_id_permission_seq;
       public          postgres    false    258            <           0    0 "   user_permissions_id_permission_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.user_permissions_id_permission_seq OWNED BY public.user_permissions.id_permission;
          public          postgres    false    259                       1259    44969    users    TABLE     �  CREATE TABLE public.users (
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
       public         heap    postgres    false                       1259    44972    users_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_id_user_seq;
       public          postgres    false    260            =           0    0    users_id_user_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;
          public          postgres    false    261                       1259    44973    users_tickets    TABLE     �   CREATE TABLE public.users_tickets (
    id_user_ticket integer NOT NULL,
    id_user integer,
    id_ticket integer,
    types_tickets integer
);
 !   DROP TABLE public.users_tickets;
       public         heap    postgres    false                       1259    44976     users_tickets_id_user_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.users_tickets_id_user_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.users_tickets_id_user_ticket_seq;
       public          postgres    false    262            >           0    0     users_tickets_id_user_ticket_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.users_tickets_id_user_ticket_seq OWNED BY public.users_tickets.id_user_ticket;
          public          postgres    false    263                       1259    44977    views    TABLE     �   CREATE TABLE public.views (
    id_view integer NOT NULL,
    name_view character varying(255) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.views;
       public         heap    postgres    false            	           1259    44983    views_id_view_seq    SEQUENCE     �   CREATE SEQUENCE public.views_id_view_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.views_id_view_seq;
       public          postgres    false    264            ?           0    0    views_id_view_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.views_id_view_seq OWNED BY public.views.id_view;
          public          postgres    false    265            �           2604    44984    accion id_accion    DEFAULT     t   ALTER TABLE ONLY public.accion ALTER COLUMN id_accion SET DEFAULT nextval('public.accion_id_accion_seq'::regclass);
 ?   ALTER TABLE public.accion ALTER COLUMN id_accion DROP DEFAULT;
       public          postgres    false    219    218            �           2604    44985    areas id_area    DEFAULT     z   ALTER TABLE ONLY public.areas ALTER COLUMN id_area SET DEFAULT nextval('public.departments_id_department_seq'::regclass);
 <   ALTER TABLE public.areas ALTER COLUMN id_area DROP DEFAULT;
       public          postgres    false    225    221            �           2604    44986    branches id_branches    DEFAULT     w   ALTER TABLE ONLY public.branches ALTER COLUMN id_branches SET DEFAULT nextval('public.states_id_state_seq'::regclass);
 C   ALTER TABLE public.branches ALTER COLUMN id_branches DROP DEFAULT;
       public          postgres    false    240    223            �           2604    44987    departments id_department    DEFAULT     �   ALTER TABLE ONLY public.departments ALTER COLUMN id_department SET DEFAULT nextval('public.departments_id_department_seq1'::regclass);
 H   ALTER TABLE public.departments ALTER COLUMN id_department DROP DEFAULT;
       public          postgres    false    226    224            �           2604    44988    failures id_failure    DEFAULT     z   ALTER TABLE ONLY public.failures ALTER COLUMN id_failure SET DEFAULT nextval('public.failures_id_failure_seq'::regclass);
 B   ALTER TABLE public.failures ALTER COLUMN id_failure DROP DEFAULT;
       public          postgres    false    228    227            �           2604    44989     levels_tecnicos id_level_tecnico    DEFAULT     �   ALTER TABLE ONLY public.levels_tecnicos ALTER COLUMN id_level_tecnico SET DEFAULT nextval('public.levels_tecnicos_id_level_tecnico_seq'::regclass);
 O   ALTER TABLE public.levels_tecnicos ALTER COLUMN id_level_tecnico DROP DEFAULT;
       public          postgres    false    230    229            �           2604    44990    regions id_region    DEFAULT     v   ALTER TABLE ONLY public.regions ALTER COLUMN id_region SET DEFAULT nextval('public.regions_id_region_seq'::regclass);
 @   ALTER TABLE public.regions ALTER COLUMN id_region DROP DEFAULT;
       public          postgres    false    233    232            �           2604    44991 "   regionstecnicos id_regionstecnicos    DEFAULT     �   ALTER TABLE ONLY public.regionstecnicos ALTER COLUMN id_regionstecnicos SET DEFAULT nextval('public.regionstecnicos_id_regionstecnicos_seq'::regclass);
 Q   ALTER TABLE public.regionstecnicos ALTER COLUMN id_regionstecnicos DROP DEFAULT;
       public          postgres    false    235    234            �           2604    44992    roles id_rolusr    DEFAULT     r   ALTER TABLE ONLY public.roles ALTER COLUMN id_rolusr SET DEFAULT nextval('public.roles_id_rolusr_seq'::regclass);
 >   ALTER TABLE public.roles ALTER COLUMN id_rolusr DROP DEFAULT;
       public          postgres    false    237    236            �           2604    44993    status_lab id_status_lab    DEFAULT     �   ALTER TABLE ONLY public.status_lab ALTER COLUMN id_status_lab SET DEFAULT nextval('public.status_lab_id_status_lab_seq'::regclass);
 G   ALTER TABLE public.status_lab ALTER COLUMN id_status_lab DROP DEFAULT;
       public          postgres    false    242    241            �           2604    44994 !   status_payments id_status_payment    DEFAULT     �   ALTER TABLE ONLY public.status_payments ALTER COLUMN id_status_payment SET DEFAULT nextval('public.status_payments_id_status_payment_seq'::regclass);
 P   ALTER TABLE public.status_payments ALTER COLUMN id_status_payment DROP DEFAULT;
       public          postgres    false    244    243            �           2604    44995    status_tickets id_status_ticket    DEFAULT     �   ALTER TABLE ONLY public.status_tickets ALTER COLUMN id_status_ticket SET DEFAULT nextval('public.status_tickets_id_status_ticket_seq'::regclass);
 N   ALTER TABLE public.status_tickets ALTER COLUMN id_status_ticket DROP DEFAULT;
       public          postgres    false    246    245            �           2604    44996 $   tickets_failures id_tickets_failures    DEFAULT     �   ALTER TABLE ONLY public.tickets_failures ALTER COLUMN id_tickets_failures SET DEFAULT nextval('public.tickets_failures_id_tickets_failures_seq'::regclass);
 S   ALTER TABLE public.tickets_failures ALTER COLUMN id_tickets_failures DROP DEFAULT;
       public          postgres    false    251    249            �           2604    44997    tickets_failures id_ticket    DEFAULT     �   ALTER TABLE ONLY public.tickets_failures ALTER COLUMN id_ticket SET DEFAULT nextval('public.tickets_failures_id_ticket_seq'::regclass);
 I   ALTER TABLE public.tickets_failures ALTER COLUMN id_ticket DROP DEFAULT;
       public          postgres    false    250    249            �           2604    44998 !   tickets_status_history id_history    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_history ALTER COLUMN id_history SET DEFAULT nextval('public.tickets_status_history_id_history_seq'::regclass);
 P   ALTER TABLE public.tickets_status_history ALTER COLUMN id_history DROP DEFAULT;
       public          postgres    false    253    252            �           2604    44999 '   tickets_status_lab id_ticket_status_lab    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_lab ALTER COLUMN id_ticket_status_lab SET DEFAULT nextval('public.tickets_status_lab_id_ticket_status_lab_seq'::regclass);
 V   ALTER TABLE public.tickets_status_lab ALTER COLUMN id_ticket_status_lab DROP DEFAULT;
       public          postgres    false    255    254            �           2604    45000 .   tickets_status_tickets id_ticket_status_ticket    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_tickets ALTER COLUMN id_ticket_status_ticket SET DEFAULT nextval('public.tickets_status_tickets_id_ticket_status_ticket_seq'::regclass);
 ]   ALTER TABLE public.tickets_status_tickets ALTER COLUMN id_ticket_status_ticket DROP DEFAULT;
       public          postgres    false    257    256            �           2604    45001    user_permissions id_permission    DEFAULT     �   ALTER TABLE ONLY public.user_permissions ALTER COLUMN id_permission SET DEFAULT nextval('public.user_permissions_id_permission_seq'::regclass);
 M   ALTER TABLE public.user_permissions ALTER COLUMN id_permission DROP DEFAULT;
       public          postgres    false    259    258                       2604    45002    users id_user    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    261    260                       2604    45003    users_tickets id_user_ticket    DEFAULT     �   ALTER TABLE ONLY public.users_tickets ALTER COLUMN id_user_ticket SET DEFAULT nextval('public.users_tickets_id_user_ticket_seq'::regclass);
 K   ALTER TABLE public.users_tickets ALTER COLUMN id_user_ticket DROP DEFAULT;
       public          postgres    false    263    262                       2604    45004    views id_view    DEFAULT     n   ALTER TABLE ONLY public.views ALTER COLUMN id_view SET DEFAULT nextval('public.views_id_view_seq'::regclass);
 <   ALTER TABLE public.views ALTER COLUMN id_view DROP DEFAULT;
       public          postgres    false    265    264            �          0    44871    accion 
   TABLE DATA           D   COPY public.accion (id_accion, name_accion, created_at) FROM stdin;
    public          postgres    false    218   /�      �          0    44876    accions_tickets 
   TABLE DATA           O   COPY public.accions_tickets (id_accion_ticket, name_accion_ticket) FROM stdin;
    public          postgres    false    220   ��      �          0    44879    areas 
   TABLE DATA           3   COPY public.areas (id_area, name_area) FROM stdin;
    public          postgres    false    221   ߏ      �          0    44882    assignments_tickets 
   TABLE DATA           �   COPY public.assignments_tickets (id_assginment_ticket, id_ticket, id_coordinator, id_tecnico, date_sendcoordinator, note, date_assign_tec2) FROM stdin;
    public          postgres    false    222   =�      �          0    44885    branches 
   TABLE DATA           I   COPY public.branches (id_branches, name_branches, id_region) FROM stdin;
    public          postgres    false    223   Z�      �          0    44888    departments 
   TABLE DATA           Y   COPY public.departments (id_department, name_department, id_coordinador_rol) FROM stdin;
    public          postgres    false    224   r�      �          0    44893    failures 
   TABLE DATA           N   COPY public.failures (id_failure, name_failure, id_failure_level) FROM stdin;
    public          postgres    false    227   ��      �          0    44897    levels_tecnicos 
   TABLE DATA           T   COPY public.levels_tecnicos (id_level_tecnico, name_level, description) FROM stdin;
    public          postgres    false    229   a�                 0    44901    process_tickets 
   TABLE DATA           Q   COPY public.process_tickets (id_process_ticket, name_process_ticket) FROM stdin;
    public          postgres    false    231   Ԕ                0    44904    regions 
   TABLE DATA           I   COPY public.regions (id_region, name_region, "id_statusReg") FROM stdin;
    public          postgres    false    232   ��                0    44908    regionstecnicos 
   TABLE DATA           Q   COPY public.regionstecnicos (id_regionstecnicos, id_region, id_user) FROM stdin;
    public          postgres    false    234   a�                0    44912    roles 
   TABLE DATA           4   COPY public.roles (id_rolusr, name_rol) FROM stdin;
    public          postgres    false    236   ~�                0    44916    sessions_users 
   TABLE DATA           �   COPY public.sessions_users (id_session, id_user, start_date, user_agent, ip_address, active, end_date, expiry_time) FROM stdin;
    public          postgres    false    238   ��                0    44923    states 
   TABLE DATA           A   COPY public.states (id_state, name_state, id_region) FROM stdin;
    public          postgres    false    239   ֖      
          0    44927 
   status_lab 
   TABLE DATA           D   COPY public.status_lab (id_status_lab, name_status_lab) FROM stdin;
    public          postgres    false    241   �                0    44931    status_payments 
   TABLE DATA           Q   COPY public.status_payments (id_status_payment, name_status_payment) FROM stdin;
    public          postgres    false    243   �                0    44935    status_tickets 
   TABLE DATA           N   COPY public.status_tickets (id_status_ticket, name_status_ticket) FROM stdin;
    public          postgres    false    245   ��                0    44940    tickets 
   TABLE DATA           �  COPY public.tickets (id_ticket, date_create_ticket, serial_pos, id_status_ticket, id_process_ticket, id_accion_ticket, id_level_failure, id_failure, id_user, id_status_payment, id_user_coord, downl_exoneration, downl_payment, downl_send_to_rosal, date_send_lab, date_send_torosal_fromlab, id_status_domiciliacion, data_sendkey, date_receivekey, downl_send_fromrosal, date_receivefrom_desti, motive_close) FROM stdin;
    public          postgres    false    248   ј                0    44946    tickets_failures 
   TABLE DATA           V   COPY public.tickets_failures (id_tickets_failures, id_ticket, id_failure) FROM stdin;
    public          postgres    false    249   :�                0    44951    tickets_status_history 
   TABLE DATA           �   COPY public.tickets_status_history (id_history, id_ticket, old_status, new_status, changed_by, changed_at, notes, old_process, new_process, old_action, new_action) FROM stdin;
    public          postgres    false    252   c�                0    44955    tickets_status_lab 
   TABLE DATA           \   COPY public.tickets_status_lab (id_ticket_status_lab, id_ticket, id_status_lab) FROM stdin;
    public          postgres    false    254   ��                0    44959    tickets_status_tickets 
   TABLE DATA           �   COPY public.tickets_status_tickets (id_ticket_status_ticket, id_ticket, id_status_ticket, "date _status_ticket", level_failure) FROM stdin;
    public          postgres    false    256   ��                0    44963    user_permissions 
   TABLE DATA           m   COPY public.user_permissions (id_permission, id_user, id_view, id_accion, permitido, created_at) FROM stdin;
    public          postgres    false    258   ��                0    44969    users 
   TABLE DATA           �   COPY public.users (id_user, national_id, id_statususr, name, surname, username, password, id_rolusr, email, id_area, trying_failedpassw, date_create, id_level_tecnico) FROM stdin;
    public          postgres    false    260   ��                0    44973    users_tickets 
   TABLE DATA           Z   COPY public.users_tickets (id_user_ticket, id_user, id_ticket, types_tickets) FROM stdin;
    public          postgres    false    262   ��      !          0    44977    views 
   TABLE DATA           L   COPY public.views (id_view, name_view, descripcion, created_at) FROM stdin;
    public          postgres    false    264   ؚ      @           0    0    accion_id_accion_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.accion_id_accion_seq', 4, true);
          public          postgres    false    219            A           0    0    departments_id_department_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.departments_id_department_seq', 3, true);
          public          postgres    false    225            B           0    0    departments_id_department_seq1    SEQUENCE SET     M   SELECT pg_catalog.setval('public.departments_id_department_seq1', 1, false);
          public          postgres    false    226            C           0    0    failures_id_failure_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.failures_id_failure_seq', 42, true);
          public          postgres    false    228            D           0    0 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.levels_tecnicos_id_level_tecnico_seq', 1, false);
          public          postgres    false    230            E           0    0    regions_id_region_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.regions_id_region_seq', 6, true);
          public          postgres    false    233            F           0    0 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.regionstecnicos_id_regionstecnicos_seq', 1, false);
          public          postgres    false    235            G           0    0    roles_id_rolusr_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.roles_id_rolusr_seq', 2, true);
          public          postgres    false    237            H           0    0    states_id_state_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.states_id_state_seq', 22, true);
          public          postgres    false    240            I           0    0    status_lab_id_status_lab_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.status_lab_id_status_lab_seq', 1, false);
          public          postgres    false    242            J           0    0 %   status_payments_id_status_payment_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.status_payments_id_status_payment_seq', 8, true);
          public          postgres    false    244            K           0    0 #   status_tickets_id_status_ticket_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.status_tickets_id_status_ticket_seq', 1, false);
          public          postgres    false    246            L           0    0    tickets_failures_id_ticket_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.tickets_failures_id_ticket_seq', 2, true);
          public          postgres    false    250            M           0    0 (   tickets_failures_id_tickets_failures_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.tickets_failures_id_tickets_failures_seq', 2, true);
          public          postgres    false    251            N           0    0    tickets_id_ticket_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tickets_id_ticket_seq', 2, true);
          public          postgres    false    247            O           0    0 %   tickets_status_history_id_history_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.tickets_status_history_id_history_seq', 1, false);
          public          postgres    false    253            P           0    0 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.tickets_status_lab_id_ticket_status_lab_seq', 1, false);
          public          postgres    false    255            Q           0    0 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.tickets_status_tickets_id_ticket_status_ticket_seq', 1, false);
          public          postgres    false    257            R           0    0 "   user_permissions_id_permission_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.user_permissions_id_permission_seq', 1, false);
          public          postgres    false    259            S           0    0    users_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_id_user_seq', 2, true);
          public          postgres    false    261            T           0    0     users_tickets_id_user_ticket_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.users_tickets_id_user_ticket_seq', 1, false);
          public          postgres    false    263            U           0    0    views_id_view_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.views_id_view_seq', 1, true);
          public          postgres    false    265                       2606    45008    accion accion_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.accion
    ADD CONSTRAINT accion_pkey PRIMARY KEY (id_accion);
 <   ALTER TABLE ONLY public.accion DROP CONSTRAINT accion_pkey;
       public            postgres    false    218                       2606    45010 $   accions_tickets accions_tickets_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.accions_tickets
    ADD CONSTRAINT accions_tickets_pkey PRIMARY KEY (id_accion_ticket);
 N   ALTER TABLE ONLY public.accions_tickets DROP CONSTRAINT accions_tickets_pkey;
       public            postgres    false    220            
           2606    45012    areas departments_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.areas
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id_area);
 @   ALTER TABLE ONLY public.areas DROP CONSTRAINT departments_pkey;
       public            postgres    false    221                       2606    45014 *   assignments_tickets pk_assignments_tickets 
   CONSTRAINT     z   ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT pk_assignments_tickets PRIMARY KEY (id_assginment_ticket);
 T   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT pk_assignments_tickets;
       public            postgres    false    222                       2606    45016    departments pk_departments 
   CONSTRAINT     c   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT pk_departments PRIMARY KEY (id_department);
 D   ALTER TABLE ONLY public.departments DROP CONSTRAINT pk_departments;
       public            postgres    false    224                       2606    45018    failures pk_failures 
   CONSTRAINT     Z   ALTER TABLE ONLY public.failures
    ADD CONSTRAINT pk_failures PRIMARY KEY (id_failure);
 >   ALTER TABLE ONLY public.failures DROP CONSTRAINT pk_failures;
       public            postgres    false    227                       2606    45020 "   levels_tecnicos pk_levels_tecnicos 
   CONSTRAINT     n   ALTER TABLE ONLY public.levels_tecnicos
    ADD CONSTRAINT pk_levels_tecnicos PRIMARY KEY (id_level_tecnico);
 L   ALTER TABLE ONLY public.levels_tecnicos DROP CONSTRAINT pk_levels_tecnicos;
       public            postgres    false    229            (           2606    45022    status_lab pk_status_lab 
   CONSTRAINT     a   ALTER TABLE ONLY public.status_lab
    ADD CONSTRAINT pk_status_lab PRIMARY KEY (id_status_lab);
 B   ALTER TABLE ONLY public.status_lab DROP CONSTRAINT pk_status_lab;
       public            postgres    false    241            *           2606    45024 "   status_payments pk_status_payments 
   CONSTRAINT     o   ALTER TABLE ONLY public.status_payments
    ADD CONSTRAINT pk_status_payments PRIMARY KEY (id_status_payment);
 L   ALTER TABLE ONLY public.status_payments DROP CONSTRAINT pk_status_payments;
       public            postgres    false    243            ,           2606    45026     status_tickets pk_status_tickets 
   CONSTRAINT     l   ALTER TABLE ONLY public.status_tickets
    ADD CONSTRAINT pk_status_tickets PRIMARY KEY (id_status_ticket);
 J   ALTER TABLE ONLY public.status_tickets DROP CONSTRAINT pk_status_tickets;
       public            postgres    false    245            6           2606    45028 (   tickets_status_lab pk_tickets_status_lab 
   CONSTRAINT     x   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT pk_tickets_status_lab PRIMARY KEY (id_ticket_status_lab);
 R   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT pk_tickets_status_lab;
       public            postgres    false    254            :           2606    45030 0   tickets_status_tickets pk_tickets_status_tickets 
   CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT pk_tickets_status_tickets PRIMARY KEY (id_ticket_status_ticket);
 Z   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT pk_tickets_status_tickets;
       public            postgres    false    256            F           2606    45032    users_tickets pk_users_tickets  
   CONSTRAINT     k   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT "pk_users_tickets " PRIMARY KEY (id_user_ticket);
 K   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT "pk_users_tickets ";
       public            postgres    false    262                       2606    45034 $   process_tickets process_tickets_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.process_tickets
    ADD CONSTRAINT process_tickets_pkey PRIMARY KEY (id_process_ticket);
 N   ALTER TABLE ONLY public.process_tickets DROP CONSTRAINT process_tickets_pkey;
       public            postgres    false    231                       2606    45036    regions regions_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id_region);
 >   ALTER TABLE ONLY public.regions DROP CONSTRAINT regions_pkey;
       public            postgres    false    232                       2606    45038 $   regionstecnicos regionstecnicos_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT regionstecnicos_pkey PRIMARY KEY (id_regionstecnicos);
 N   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT regionstecnicos_pkey;
       public            postgres    false    234            "           2606    45040    roles roles_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rolusr);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    236            $           2606    45042 "   sessions_users sessions_users_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.sessions_users
    ADD CONSTRAINT sessions_users_pkey PRIMARY KEY (id_session);
 L   ALTER TABLE ONLY public.sessions_users DROP CONSTRAINT sessions_users_pkey;
       public            postgres    false    238                       2606    45044    branches states_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.branches
    ADD CONSTRAINT states_pkey PRIMARY KEY (id_branches);
 >   ALTER TABLE ONLY public.branches DROP CONSTRAINT states_pkey;
       public            postgres    false    223            &           2606    45046    states states_pkey1 
   CONSTRAINT     W   ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey1 PRIMARY KEY (id_state);
 =   ALTER TABLE ONLY public.states DROP CONSTRAINT states_pkey1;
       public            postgres    false    239            0           2606    45048 &   tickets_failures tickets_failures_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT tickets_failures_pkey PRIMARY KEY (id_tickets_failures);
 P   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT tickets_failures_pkey;
       public            postgres    false    249            4           2606    45050 2   tickets_status_history tickets_status_history_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.tickets_status_history
    ADD CONSTRAINT tickets_status_history_pkey PRIMARY KEY (id_history);
 \   ALTER TABLE ONLY public.tickets_status_history DROP CONSTRAINT tickets_status_history_pkey;
       public            postgres    false    252            .           2606    45052    tickets tickets_unified_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_pkey PRIMARY KEY (id_ticket);
 F   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_pkey;
       public            postgres    false    248                       2606    45054 :   assignments_tickets unq_assignments_tickets_id_coordinator 
   CONSTRAINT        ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT unq_assignments_tickets_id_coordinator UNIQUE (id_coordinator);
 d   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT unq_assignments_tickets_id_coordinator;
       public            postgres    false    222                       2606    45056 5   assignments_tickets unq_assignments_tickets_id_ticket 
   CONSTRAINT     u   ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT unq_assignments_tickets_id_ticket UNIQUE (id_ticket);
 _   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT unq_assignments_tickets_id_ticket;
       public            postgres    false    222                        2606    45058 +   regionstecnicos unq_regionstecnicos_id_user 
   CONSTRAINT     i   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT unq_regionstecnicos_id_user UNIQUE (id_user);
 U   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT unq_regionstecnicos_id_user;
       public            postgres    false    234            2           2606    45060 /   tickets_failures unq_tickets_failures_id_ticket 
   CONSTRAINT     o   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT unq_tickets_failures_id_ticket UNIQUE (id_ticket);
 Y   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT unq_tickets_failures_id_ticket;
       public            postgres    false    249            8           2606    45062 3   tickets_status_lab unq_tickets_status_lab_id_ticket 
   CONSTRAINT     s   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT unq_tickets_status_lab_id_ticket UNIQUE (id_ticket);
 ]   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT unq_tickets_status_lab_id_ticket;
       public            postgres    false    254            <           2606    45064 B   tickets_status_tickets unq_tickets_status_tickets_id_status_ticket 
   CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT unq_tickets_status_tickets_id_status_ticket UNIQUE (id_status_ticket);
 l   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT unq_tickets_status_tickets_id_status_ticket;
       public            postgres    false    256            >           2606    45066 ;   tickets_status_tickets unq_tickets_status_tickets_id_ticket 
   CONSTRAINT     {   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT unq_tickets_status_tickets_id_ticket UNIQUE (id_ticket);
 e   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT unq_tickets_status_tickets_id_ticket;
       public            postgres    false    256            H           2606    45068 )   users_tickets unq_users_tickets_id_ticket 
   CONSTRAINT     i   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT unq_users_tickets_id_ticket UNIQUE (id_ticket);
 S   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT unq_users_tickets_id_ticket;
       public            postgres    false    262            J           2606    45070 '   users_tickets unq_users_tickets_id_user 
   CONSTRAINT     e   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT unq_users_tickets_id_user UNIQUE (id_user);
 Q   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT unq_users_tickets_id_user;
       public            postgres    false    262            B           2606    45072 &   user_permissions user_permissions_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id_permission);
 P   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT user_permissions_pkey;
       public            postgres    false    258            D           2606    45074    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    260            L           2606    45076    views views_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.views
    ADD CONSTRAINT views_pkey PRIMARY KEY (id_view);
 :   ALTER TABLE ONLY public.views DROP CONSTRAINT views_pkey;
       public            postgres    false    264            ?           1259    45077    idx_id_vista_accion    INDEX     ^   CREATE INDEX idx_id_vista_accion ON public.user_permissions USING btree (id_view, id_accion);
 '   DROP INDEX public.idx_id_vista_accion;
       public            postgres    false    258    258            @           1259    45078    idx_user_id_view_accion    INDEX     k   CREATE INDEX idx_user_id_view_accion ON public.user_permissions USING btree (id_user, id_view, id_accion);
 +   DROP INDEX public.idx_user_id_view_accion;
       public            postgres    false    258    258    258            N           2606    45079 &   departments fk_departments_departments    FK CONSTRAINT     �   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT fk_departments_departments FOREIGN KEY (id_coordinador_rol) REFERENCES public.roles(id_rolusr);
 P   ALTER TABLE ONLY public.departments DROP CONSTRAINT fk_departments_departments;
       public          postgres    false    236    224    4898            O           2606    45084 #   regionstecnicos fk_regionestecnicos    FK CONSTRAINT     �   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT fk_regionestecnicos FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 M   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT fk_regionestecnicos;
       public          postgres    false    234    232    4892            P           2606    45089 (   regionstecnicos fk_regionstecnicos_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT fk_regionstecnicos_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 R   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT fk_regionstecnicos_users;
       public          postgres    false    4932    234    260            Q           2606    45094 &   sessions_users fk_sessions_users_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.sessions_users
    ADD CONSTRAINT fk_sessions_users_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 P   ALTER TABLE ONLY public.sessions_users DROP CONSTRAINT fk_sessions_users_users;
       public          postgres    false    260    4932    238            M           2606    45099    branches fk_state_region    FK CONSTRAINT     �   ALTER TABLE ONLY public.branches
    ADD CONSTRAINT fk_state_region FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 B   ALTER TABLE ONLY public.branches DROP CONSTRAINT fk_state_region;
       public          postgres    false    4892    232    223            Y           2606    45104 -   tickets_failures fk_tickets_failures_failures    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT fk_tickets_failures_failures FOREIGN KEY (id_failure) REFERENCES public.failures(id_failure);
 W   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT fk_tickets_failures_failures;
       public          postgres    false    249    227    4886            Z           2606    45109 ,   tickets_failures fk_tickets_failures_tickets    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT fk_tickets_failures_tickets FOREIGN KEY (id_ticket) REFERENCES public.tickets(id_ticket);
 V   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT fk_tickets_failures_tickets;
       public          postgres    false    248    249    4910            [           2606    45114 (   tickets_status_lab fk_tickets_status_lab    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT fk_tickets_status_lab FOREIGN KEY (id_status_lab) REFERENCES public.status_lab(id_status_lab);
 R   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT fk_tickets_status_lab;
       public          postgres    false    241    254    4904            \           2606    45119 0   tickets_status_tickets fk_tickets_status_tickets    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT fk_tickets_status_tickets FOREIGN KEY (id_status_ticket) REFERENCES public.status_tickets(id_status_ticket);
 Z   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT fk_tickets_status_tickets;
       public          postgres    false    4908    245    256            ]           2606    45124 +   user_permissions fk_user_permissions_accion    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT fk_user_permissions_accion FOREIGN KEY (id_accion) REFERENCES public.accion(id_accion) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT fk_user_permissions_accion;
       public          postgres    false    218    4870    258            ^           2606    45129 -   user_permissions fk_user_permissions_failures    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT fk_user_permissions_failures FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 W   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT fk_user_permissions_failures;
       public          postgres    false    260    4932    258            _           2606    45134 )   user_permissions fk_user_permissions_view    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT fk_user_permissions_view FOREIGN KEY (id_view) REFERENCES public.views(id_view) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.user_permissions DROP CONSTRAINT fk_user_permissions_view;
       public          postgres    false    4940    264    258            `           2606    45139    users fk_users_areas    FK CONSTRAINT     x   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_areas FOREIGN KEY (id_area) REFERENCES public.areas(id_area);
 >   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_areas;
       public          postgres    false    221    4874    260            a           2606    45144    users fk_users_levels_tecnicos    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_levels_tecnicos FOREIGN KEY (id_level_tecnico) REFERENCES public.levels_tecnicos(id_level_tecnico);
 H   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_levels_tecnicos;
       public          postgres    false    4888    229    260            b           2606    45149    users fk_users_rolsusr    FK CONSTRAINT     ~   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_rolsusr FOREIGN KEY (id_rolusr) REFERENCES public.roles(id_rolusr);
 @   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_rolsusr;
       public          postgres    false    260    4898    236            c           2606    45154 $   users_tickets fk_users_tickets_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT fk_users_tickets_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 N   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT fk_users_tickets_users;
       public          postgres    false    4932    262    260            R           2606    45159    states states_id_region_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_id_region_fkey FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 F   ALTER TABLE ONLY public.states DROP CONSTRAINT states_id_region_fkey;
       public          postgres    false    4892    239    232            S           2606    45164 -   tickets tickets_unified_id_accion_ticket_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_accion_ticket_fkey FOREIGN KEY (id_accion_ticket) REFERENCES public.accions_tickets(id_accion_ticket);
 W   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_accion_ticket_fkey;
       public          postgres    false    4872    248    220            T           2606    45169 .   tickets tickets_unified_id_process_ticket_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_process_ticket_fkey FOREIGN KEY (id_process_ticket) REFERENCES public.process_tickets(id_process_ticket);
 X   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_process_ticket_fkey;
       public          postgres    false    231    4890    248            U           2606    45174 .   tickets tickets_unified_id_status_payment_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_status_payment_fkey FOREIGN KEY (id_status_payment) REFERENCES public.status_payments(id_status_payment);
 X   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_status_payment_fkey;
       public          postgres    false    243    248    4906            V           2606    45179 -   tickets tickets_unified_id_status_ticket_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_status_ticket_fkey FOREIGN KEY (id_status_ticket) REFERENCES public.status_tickets(id_status_ticket);
 W   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_status_ticket_fkey;
       public          postgres    false    248    245    4908            W           2606    45184 *   tickets tickets_unified_id_user_coord_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_user_coord_fkey FOREIGN KEY (id_user_coord) REFERENCES public.users(id_user);
 T   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_user_coord_fkey;
       public          postgres    false    260    4932    248            X           2606    45189 $   tickets tickets_unified_id_user_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_unified_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 N   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_unified_id_user_fkey;
       public          postgres    false    260    4932    248            �   H   x�3�L.JM,I�4202�50�5�P04�25�24�3�
�qq����Wc�	4&�
�҂�V��qqq ���      �   H   x�3�J-.M�)��2�t�S((�ON-��2�K��LIL����2ʔe&��+$�(8���d�yE\1z\\\ �i!      �   N   x�3�t��K̫J,�2�tL����,.)JL����2�I��I-Rp��I�,I�2�ʦ�&r�r��(�'�p��qqq A       �      x������ � �      �     x�-P�n�0<��"_���c�����c/K��(�t#�ñ�"?�M���hwfv��K��dM7�S�L��.y�abz���r�BiT5F�|;<��BR�ls�<<)�P��N����
��i�l�'�Sw$�YbG�6�c��ZR^BS�3�9^\�zd�̱"��.���=Jed��T��أ�Z�z�e'���9�ã9���
l��`'��J��nQ:
\��ҏ��J��4��<���{����sO��p���ܸZ�ϙR���b*      �      x������ � �      �   �  x�}T�r1=���19$�0,��H�*�'�\M����&ZH9��'���=,�.ȅ�����21I!�����8P~���"�t�X�F����%���<��Xz��*:�Iz�V��D����M��C�`_̌t�;�xW&�F++�k ����B	D������z�e��hK$l(
g��1��a��(�˳�sKA,�ـ\���R,��\[��H������2r%ne�B��L^���4+���a���'H�t�NdbjW̼w�-���jղ��,�o�(�1m��i&�-��������? uW���b�`��{?]�\�m��c�>J�}j⮳������y���7��t/�bG,T�V;�(?�Ԝ`g���"���y�zd�vah���fk.�.��+�~&$�Q���{܆��q���V���)'�,�n��iÂ�`)�{v틻⊢��ć�g7���b��S7�fy[��d�����i;`����V;]HC=%��w��E�&�������Z��|o���ӖO�0j���[���1:��TԆ)�Ӕ">�����qe(�sqM�笻�w��}~=gB�U��Plb��|�
�6�7�W�g �D4X9Z �!?��$R�6��^*����d���y�#w�}{$H�u��Tɶ�+��/,���<���}!V���d�Yd�_;�B�%s4��x)���d������6��      �   c   x�]�1� �ᙞ�0&�=�]v ��@��Bt0N���g�Oh͚�	{�s�N�9E�*�W��u Cc�-�$%7�-��EC&V�m�A�+M             x�3��/�/*IU������ 8��         R   x�3��/�L�+I�4�2�t��s�lN��bǼ��b ����I��q�8���3S���!���9���A�c����              x������ � �         R   x�3�.-H-rL����2�IM��L��2�t��/J��KL�/�2�rS��3sb�L9��3�K���f�n@uyU��\1z\\\ k@e         �   x�͐�N�@Ek�+�L$���}��T��"��Y����3��c$��@���^�3h�We�5�3O�][ʼ>�SD#��#Pj���F��+4�K�@XB[v<�P��Q�4j	�}���Ϸ�h�
i`�}��o�	��{_���^���'$�Ɵ�gwtc��D�R�$�"[��$�L_�2�4Cƾ���<�\�|�ץ
.��TfI�+e��le�S���r��_D��_mM           x�%�=N1���)r{���hB"BѼl�őY��ڑ�mRRPq��Ϣ��G3��sܑo�����$�xK�je���0]�풃Q��.��јM��d�4���z��ԲͿv�7�c��+�k�����s:9
kb�Ke��O�c�I�1x�6}a�؈>�C@���q�ʔغ1��a���E��Zc��s&�͐�K&4��te����G�5�2�!�Pb'��pk��&��ю-�0u�DjH�2s��o�RS�^�      
      x������ � �         {   x�u�A
�@E��9AAZ�z�t'���1H@�!3�_AA(����ߪ�f��ǔ���b�6�d��@����d�=�%o3�Փ���Ks�e�CZ$Ҡp=yϢ�s���}���FI�/�~i!/� ��LD         .   x�3�tL�L-*��2�t�S((�ON-��2�tN-*JL������ ݢ
�         Y   x���1�0C�9=h�iC��31��� � ����>�-�2����QV�Eѷ��V�*z��n�J� �XУ�@����YRJ'1z'a            x�3�4�42�2�BC�=... 8n            x������ � �            x������ � �            x������ � �         -   x�3�4Bc�N##S]]C+##+C=K#�=... �-�         �   x���K�0�ϛ�b����[�(��S/���@���7m@o�0�{�����"�e^]c�
Þ��!HSI��q��*Ef/a\��ؗ�/CK�8.<��=���M?r
?�dIR{K:�o	$�mߖUM�N[5�?����ʀŗ������;%2�m!�x��O            x�3�4�?.#N2�9AȈ���� P��      !   J   x�3�L��+.�)I�/�L�-.M,��W((MMIU�I)���LuLt,��L����,L�,��b���� ���     