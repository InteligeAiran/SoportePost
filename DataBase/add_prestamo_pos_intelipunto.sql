-- =====================================================================
-- FEATURE: Prestamo de POS - lado Intelipunto
-- Cuando SoportePost transfiere un POS al pool de prestamo, debe marcar
-- ese serial como "Prestado" en el sistema de origen (Intelipunto) para
-- que no se vuelva a asignar/instalar mientras esta prestado. El estatus
-- real vive en tblserialpos.estatus (char), que hoy solo usa '0'
-- (Disponible), '1' (Asignado) y '2' (Danado). Se agrega '3' (Prestado)
-- por convencion, sin necesidad de alterar el tipo de columna.
--
-- Estas funciones se invocan directamente desde PHP (SoportePost ya se
-- conecta a esta base con las credenciales de dblink_configs), igual que
-- el patron existente en consulta_rifModel.php::SaveAdministrativeRequest.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.sp_prestar_pos_a_soportepost(p_serial character varying, p_usuario character varying)
    RETURNS TABLE(serial character varying, marcapos character varying, tipopos character varying, activofijo character varying)
    LANGUAGE plpgsql
AS $function$
DECLARE
    v_estatus_actual "char";
BEGIN
    SELECT s.estatus INTO v_estatus_actual
    FROM tblserialpos s
    WHERE s.serial = p_serial
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El serial % no existe en tblserialpos.', p_serial;
    END IF;

    IF v_estatus_actual <> '0' THEN
        RAISE EXCEPTION 'El serial % no esta disponible (estatus actual: %). Solo se puede prestar un POS con estatus 0 = Disponible.', p_serial, v_estatus_actual;
    END IF;

    UPDATE tblserialpos
    SET estatus = '3'
    WHERE tblserialpos.serial = p_serial;

    RETURN QUERY
    SELECT s.serial, s.marcapos, s.tipopos, s.activofijo
    FROM tblserialpos s
    WHERE s.serial = p_serial;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sp_recibir_pos_devuelto(p_serial character varying)
    RETURNS boolean
    LANGUAGE plpgsql
AS $function$
DECLARE
    v_estatus_actual "char";
BEGIN
    SELECT s.estatus INTO v_estatus_actual
    FROM tblserialpos s
    WHERE s.serial = p_serial
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El serial % no existe en tblserialpos.', p_serial;
    END IF;

    IF v_estatus_actual <> '3' THEN
        RAISE EXCEPTION 'El serial % no esta en estatus Prestado (estatus actual: %).', p_serial, v_estatus_actual;
    END IF;

    UPDATE tblserialpos
    SET estatus = '0'
    WHERE tblserialpos.serial = p_serial;

    RETURN true;
END;
$function$;
