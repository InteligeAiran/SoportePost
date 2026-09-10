-- =====================================================================
-- FEATURE: Prestamo de POS (lado SoportePost)
-- Completa el submodulo "Prestamo de Pos" (sub_modules.id_submodule=12,
-- id_module=4 "Centro de Solicitudes") que ya existia como placeholder
-- (urlarchivo vacio) en el menu, con el case ya reservado en
-- technicalConsultionRepository.php::getUrlForMenuItem().
--
-- Flujo de dos etapas:
--   1) Un POS disponible en Intelipunto (tblserialpos.estatus='0') se
--      transfiere al pool de prestamo de SoportePost. Ver
--      DataBase/add_prestamo_pos_intelipunto.sql para el lado Intelipunto
--      (sp_prestar_pos_a_soportepost / sp_recibir_pos_devuelto). Al
--      transferirse, nace una fila en prestamo_pos con estatus=0
--      (Disponible dentro del pool).
--   2) Un tecnico, solo si el cliente ya tiene un ticket creado, solicita
--      un prestamo (prestamo_solicitudes, estatus inicial = 1 "Pendiente
--      por Aprobar", reusando el catalogo request_statuses ya existente).
--      Un aprobador (Coordinador/Administrador/SuperAdmin) aprueba y
--      asigna una unidad del pool con estatus=0, que pasa a estatus=1
--      (Prestado) y queda ligada a esa solicitud.
--
-- Estatus de prestamo_pos: 0 Disponible, 1 Prestado, 2 Sustituido,
-- 3 Intelipunto (se devolvio la unidad fisica, Intelipunto vuelve a '0').
-- =====================================================================

CREATE TABLE IF NOT EXISTS status_prestamo_pos (
    id_status_prestamo_pos integer PRIMARY KEY,
    name_status_prestamo_pos character varying(50) NOT NULL
);

INSERT INTO status_prestamo_pos (id_status_prestamo_pos, name_status_prestamo_pos) VALUES
    (0, 'Disponible'),
    (1, 'Prestado'),
    (2, 'Sustituido'),
    (3, 'Intelipunto')
ON CONFLICT (id_status_prestamo_pos) DO NOTHING;

CREATE TABLE IF NOT EXISTS prestamo_pos (
    id_prestamo_pos    serial PRIMARY KEY,
    serialpos           character varying(50) NOT NULL,
    marcapos             character varying(50),
    tipopos               character varying(50),
    estatus                integer NOT NULL DEFAULT 0 REFERENCES status_prestamo_pos(id_status_prestamo_pos),
    id_solicitud          integer, -- FK agregado abajo (referencia circular con prestamo_solicitudes)
    fecha_ingreso         timestamp NOT NULL DEFAULT now(),
    usuario_ingreso       integer REFERENCES users(id_user),
    fecha_retorno         timestamp,
    usuario_retorno       integer REFERENCES users(id_user),
    observaciones          character varying(500)
);

CREATE TABLE IF NOT EXISTS prestamo_solicitudes (
    id_solicitud          serial PRIMARY KEY,
    nro_solicitud         character varying(50),
    id_ticket              integer NOT NULL REFERENCES tickets(id_ticket),
    id_cliente             integer NOT NULL,
    id_user_solicitante   integer NOT NULL REFERENCES users(id_user),
    observacion            character varying(500),
    id_status_solicitud   integer NOT NULL DEFAULT 1 REFERENCES request_statuses(id),
    id_user_aprobador     integer REFERENCES users(id_user),
    fecha_aprobacion      timestamp,
    motivo_rechazo        character varying(500),
    id_prestamo_pos       integer REFERENCES prestamo_pos(id_prestamo_pos),
    fecha_creacion         timestamp NOT NULL DEFAULT now()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_prestamo_pos_solicitud'
    ) THEN
        ALTER TABLE prestamo_pos
            ADD CONSTRAINT fk_prestamo_pos_solicitud FOREIGN KEY (id_solicitud) REFERENCES prestamo_solicitudes(id_solicitud);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_prestamo_pos_estatus ON prestamo_pos(estatus);
CREATE INDEX IF NOT EXISTS idx_prestamo_solicitudes_status ON prestamo_solicitudes(id_status_solicitud);
CREATE INDEX IF NOT EXISTS idx_prestamo_solicitudes_cliente ON prestamo_solicitudes(id_cliente);

-- ---------------------------------------------------------------------
-- Aprobar una solicitud: asigna atomicamente una unidad Disponible (0)
-- del pool a la solicitud, la pasa a Prestado (1), y marca la solicitud
-- como Gestion finalizada (3, catalogo request_statuses).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sp_aprobar_solicitud_prestamo(
    p_id_solicitud integer,
    p_id_prestamo_pos integer,
    p_id_aprobador integer
) RETURNS boolean
    LANGUAGE plpgsql
AS $function$
DECLARE
    v_estatus_pos integer;
    v_estatus_solicitud integer;
BEGIN
    SELECT estatus INTO v_estatus_pos
    FROM prestamo_pos
    WHERE id_prestamo_pos = p_id_prestamo_pos
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La unidad de prestamo % no existe.', p_id_prestamo_pos;
    END IF;

    IF v_estatus_pos <> 0 THEN
        RAISE EXCEPTION 'La unidad de prestamo % no esta Disponible (estatus actual: %).', p_id_prestamo_pos, v_estatus_pos;
    END IF;

    SELECT id_status_solicitud INTO v_estatus_solicitud
    FROM prestamo_solicitudes
    WHERE id_solicitud = p_id_solicitud
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La solicitud % no existe.', p_id_solicitud;
    END IF;

    IF v_estatus_solicitud <> 1 THEN
        RAISE EXCEPTION 'La solicitud % no esta Pendiente por Aprobar (estatus actual: %).', p_id_solicitud, v_estatus_solicitud;
    END IF;

    UPDATE prestamo_pos
    SET estatus = 1, id_solicitud = p_id_solicitud
    WHERE id_prestamo_pos = p_id_prestamo_pos;

    UPDATE prestamo_solicitudes
    SET id_status_solicitud = 3, -- Gestion finalizada
        id_user_aprobador = p_id_aprobador,
        fecha_aprobacion = now(),
        id_prestamo_pos = p_id_prestamo_pos
    WHERE id_solicitud = p_id_solicitud;

    RETURN true;
END;
$function$;

-- ---------------------------------------------------------------------
-- Menu: activar la ruta del submodulo ya reservado en el menu.
-- ---------------------------------------------------------------------
UPDATE sub_modules SET urlarchivo = 'prestamo_pos' WHERE id_submodule = 12 AND (urlarchivo IS NULL OR urlarchivo = '');

-- Habilitar el modulo (Centro de Solicitudes) y el submodulo (Prestamo de
-- Pos) para el usuario 1 (ABRACAMONTE), que hoy los tiene explicitamente
-- deshabilitados (permitido=false) desde el 2025-08-24. El resto de
-- usuarios se habilita normalmente desde Gestion de Usuarios.
UPDATE tbl_permisosmodulos SET permitido = true WHERE id_user = 1 AND id_view = 4;
UPDATE tblpermisosubmodulos SET permitido = true WHERE id_user = 1 AND id_modulo = 4 AND id_submodulo = 12;
