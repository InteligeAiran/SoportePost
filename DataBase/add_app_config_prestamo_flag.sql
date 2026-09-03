-- =====================================================================
-- FEATURE: Interruptor GLOBAL (no por usuario) para el lanzamiento del
-- boton "Solicitar Prestamo de POS" en Gestion Tecnico.
--
-- Reemplaza el intento anterior (add_can_request_pos_loan_flag.sql, que
-- agregaba users.can_request_pos_loan por usuario) -- se pidio que fuera
-- un solo interruptor general: activado, lo ven todos los tecnicos;
-- desactivado, no lo ve ninguno.
--
-- Tabla generica de configuracion (key/value) por si en el futuro hacen
-- falta mas interruptores como este.
-- =====================================================================

CREATE TABLE IF NOT EXISTS app_config (
    config_key    character varying(100) PRIMARY KEY,
    config_value  character varying(255) NOT NULL,
    updated_at    timestamp NOT NULL DEFAULT now(),
    updated_by    integer REFERENCES users(id_user)
);

INSERT INTO app_config (config_key, config_value)
VALUES ('can_request_pos_loan', 'false')
ON CONFLICT (config_key) DO NOTHING;
