-- Feature: usuario de "Solo Lectura" (puede ver los modulos que se le asignen
-- pero no puede ejecutar ninguna accion que modifique datos).
-- El bloqueo real de acciones ocurre en libs/Controller.php (guard centralizado);
-- este script solo agrega el flag y lo expone en las funciones que ya
-- consume el modulo de Usuarios y el login.

-- 1) Columna en users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_readonly boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN users.is_readonly IS 'Si es true, el backend (libs/Controller.php) rechaza con 403 cualquier accion de este usuario que modifique datos. La visibilidad de modulos sigue rigiendose por tbl_permisosmodulos/tblpermisosubmodulos.';

-- 2) get_user_by_credentials: agregar is_readonly al SELECT para que el login
--    pueda guardarlo en $_SESSION['solo_lectura']. Cambia las columnas de
--    salida -> hay que DROP + CREATE.
DROP FUNCTION IF EXISTS public.get_user_by_credentials(character varying, character varying);

CREATE OR REPLACE FUNCTION public.get_user_by_credentials(p_username character varying, p_password character varying)
 RETURNS TABLE(id_user integer, usuario character varying, clave character varying, cedula character varying, nombres character varying, apellidos character varying, correo character varying, codtipousuario integer, name_rol character varying, status integer, id_area integer, is_readonly boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
           usr.id_statususr AS status,
           usr.id_area,
           usr.is_readonly
    FROM users usr
    INNER JOIN roles rol ON usr.id_rolusr = rol.id_rolusr
    WHERE usr.username = p_username AND usr.password = p_password;
END;
$function$;

-- 3) getalldatauser: agregar is_readonly para pintar la columna en la lista
--    de usuarios (User/index.php). Cambia columnas de salida -> DROP + CREATE.
DROP FUNCTION IF EXISTS public.getalldatauser();

CREATE OR REPLACE FUNCTION public.getalldatauser()
 RETURNS TABLE(secuencial bigint, id_user integer, full_name text, usuario character varying, cedula character varying, correo character varying, status_codigo integer, status_texto text, name_rol character varying, name_area character varying, name_level character varying, name_region character varying, is_readonly boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        row_number () OVER (ORDER BY usr.name) as consecutivo,
        usr.id_user,
        CONCAT(usr.name , ' ' ,usr.surname) AS full_name,
        usr.username AS usuario,
        usr.national_id AS cedula,
        usr.email AS correo,
        usr.id_statususr AS status_codigo,
        CASE usr.id_statususr
            WHEN 1 THEN 'Activo'
            WHEN 2 THEN 'Activo'
            WHEN 3 THEN 'Inactivo'
            WHEN 4 THEN 'Bloqueado'
            ELSE 'Desconocido'
        END AS status_texto,
        rol.name_rol AS name_rol,
        ar.name_area,
        lvtec.name_level,
        reg.name_region,
        usr.is_readonly
    FROM users usr
    inner JOIN roles rol ON usr.id_rolusr = rol.id_rolusr
    inner JOIN areas ar ON ar.id_area = usr.id_area
    inner JOIN levels_tecnicos lvtec ON lvtec.id_level_tecnico = usr.id_level_tecnico
    inner JOIN regionsusers regusr ON regusr.id_user = usr.id_user
    inner JOIN regions reg ON reg.id_region = regusr.id_region;
END;
$function$;

-- 4) sp_mostrarusuarios: agregar is_readonly para precargar el checkbox en
--    el modal de edicion. Cambia columnas de salida -> DROP + CREATE.
DROP FUNCTION IF EXISTS public.sp_mostrarusuarios(integer);

CREATE OR REPLACE FUNCTION public.sp_mostrarusuarios(idusuario integer)
 RETURNS TABLE(secuencial bigint, id_usuario integer, inombre character varying, iapellido character varying, usuario character varying, iprefijo text, documentoo text, cedula character varying, correo character varying, status_codigo integer, status_texto text, idrol integer, name_rol character varying, iid_area integer, name_area character varying, idlevel integer, name_level character varying, name_region character varying, idreg integer, is_readonly boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        row_number () OVER (ORDER BY usr.name) as consecutivo,
        usr.id_user,usr.name , usr.surname,
        usr.username AS usuario,
        SUBSTRING(usr.national_id,1, 2),
        SUBSTRING(usr.national_id,3, 10),
        usr.national_id AS cedula,
        usr.email AS correo,
        usr.id_statususr AS status_codigo,
        CASE usr.id_statususr
            WHEN 1 THEN 'Nuevo'
            WHEN 2 THEN 'Activo'
            WHEN 3 THEN 'Inactivo'
            WHEN 4 THEN 'Bloqueado'
            ELSE 'Desconocido'
        END AS status_texto,
        rol.id_rolusr,rol.name_rol AS name_rol, ar.id_area,
        ar.name_area,usr.id_level_tecnico,
        lvtec.name_level,
        reg.name_region,reg.id_region,
        usr.is_readonly
    FROM users usr
    inner JOIN roles rol ON usr.id_rolusr = rol.id_rolusr
    inner JOIN areas ar ON ar.id_area = usr.id_area
    inner JOIN levels_tecnicos lvtec ON lvtec.id_level_tecnico = usr.id_level_tecnico
    inner JOIN regionsusers regusr ON regusr.id_user = usr.id_user
    inner JOIN regions reg ON reg.id_region = regusr.id_region
    where usr.id_user=idusuario;
END;
$function$;

-- 5) sp_guardarusuarios: nuevo parametro opcional al final (no rompe
--    llamadas existentes) para setear is_readonly al crear el usuario.
CREATE OR REPLACE FUNCTION public.sp_guardarusuarios(iduser integer, nameusers character varying, apellidousers character varying, "contraseña" character varying, documento character varying, usuario character varying, correo character varying, areausers integer, tipousers integer, idregion integer, idnivel integer, p_is_readonly boolean DEFAULT false)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$

	declare iidusuario integer;

	Begin

			INSERT INTO users (name,   surname, password,  national_id, id_statususr,  username,   email,   id_area,   id_rolusr, user_create, date_create,id_level_tecnico, is_readonly)
			VALUES 			(upper(nameusers),upper(apellidousers),contraseña, documento,1, upper(usuario), upper(correo) ,areausers, tipousers, iduser, now(), idnivel, p_is_readonly);

			iidusuario:=(select id_user from users where username=usuario limit 1);

			INSERT INTO regionsusers (id_region,id_user)
			values (idregion,iidusuario);


			if(tipousers=1) then

				insert into tbl_permisosmodulos (id_user,id_view, id_accion, permitido, created_at)
				values  (iidusuario, 1, 3, true, now()),
						(iidusuario, 2, 3, true, now()),
						(iidusuario, 3, 3, true, now()),
						(iidusuario, 4, 3, true, now());

				insert into tblpermisosubmodulos (id_modulo, id_submodulo, permitido, id_user, created_at)
				values  (1,2,true, iidusuario, now()),
						(1,3,true, iidusuario, now()),
						(1,4,true, iidusuario, now()),
						(1,5,true, iidusuario, now()),
						(1,17,true, iidusuario, now()),
						(2,10,true, iidusuario, now()),
						(2,6,true, iidusuario, now()),
						(3,7,true, iidusuario, now()),
						(3,9,true, iidusuario, now()),
						(3,16,true, iidusuario, now()),
						(4,11,true, iidusuario, now()),
						(4,12,true, iidusuario, now()),
						(4,13,true, iidusuario, now()),
						(4,14,true, iidusuario, now()),
						(4,15,true, iidusuario, now()),
						(5,15,true, iidusuario, now())
						;

			end if;

	return true;

End;
$function$;

-- 6) sp_editarusuarios: nuevo parametro opcional al final para poder
--    activar/desactivar solo-lectura al editar un usuario existente.
CREATE OR REPLACE FUNCTION public.sp_editarusuarios(idusuario integer, nombreusers character varying, apellidousers character varying, iusuario character varying, documento character varying, correo character varying, area_users integer, regionusers integer, tipo_users integer, idnivel integer, id_usercarga integer, p_is_readonly boolean DEFAULT false)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$

	Begin

		update users set name=nombreusers, surname=apellidousers, national_id=documento, username=iusuario, email=correo, id_area=area_users,
		id_rolusr=tipo_users, date_create=now(), id_level_tecnico=idnivel, user_create=id_usercarga, is_readonly=p_is_readonly
		WHERE	id_user=idusuario;

		update regionsusers set id_region=regionusers where id_user=idusuario;

	return true;

End;
$function$;
