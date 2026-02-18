-- FUNCTION: public.insert_ticket_status_history(integer, integer, integer, integer, integer, integer, integer, integer, integer)

CREATE OR REPLACE FUNCTION public.insert_ticket_status_history(
	p_id_ticket integer,
	p_changedstatus_by integer,
	p_new_status integer,
	p_new_action integer,
	p_new_status_lab integer,
	p_new_status_payment integer,
	p_new_status_domiciliacion integer,
	p_id_coordinador integer DEFAULT NULL::integer,
	p_id_payment_record integer DEFAULT NULL::integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_last_history_id integer;
    v_last_action integer;
    v_last_time timestamp without time zone;
    v_interval interval;
BEGIN
    -- 1. Obtener el último historial de este ticket
    SELECT id_history, new_action, changedstatus_at
    INTO v_last_history_id, v_last_action, v_last_time
    FROM public.tickets_status_history
    WHERE id_ticket = p_id_ticket
    ORDER BY changedstatus_at DESC, id_history DESC
    LIMIT 1;

    -- Calcular diferencia de tiempo
    IF v_last_time IS NOT NULL THEN
        v_interval := NOW() - v_last_time;
    END IF;

    -- 2. Lógica de FUSIÓN (Merge):
    -- Si la acción es la MISMA que la anterior (incluso si es 0, 4, etc.)
    -- Y ha pasado menos de 5 segundos (indica actualizaciones en ráfaga del mismo proceso)
    -- ENTONCES: Actualizamos el registro existente en lugar de crear basura.
    IF v_last_history_id IS NOT NULL 
       AND v_last_action IS NOT DISTINCT FROM p_new_action  -- Misma acción
       AND v_interval < '5 seconds'::interval               -- Ráfaga rápida
    THEN
        UPDATE public.tickets_status_history
        SET 
            changedstatus_by = p_changedstatus_by,
            new_status = NULLIF(p_new_status, 0),
            new_status_lab = NULLIF(p_new_status_lab, 0),
            new_status_payment = NULLIF(p_new_status_payment, 0), 
            new_status_domiciliacion = NULLIF(p_new_status_domiciliacion, 0),
            id_coordinador = p_id_coordinador,
            id_payment_record = p_id_payment_record,
            changedstatus_at = NOW() -- Actualizamos fecha para reflejar el último cambio de la ráfaga
        WHERE id_history = v_last_history_id;
    ELSE
        -- 3. Inserción NORMAL (Nueva acción o paso de tiempo)
        INSERT INTO public.tickets_status_history (
            id_ticket, 
            changedstatus_by, 
            new_status, 
            new_action, 
            new_status_lab, 
            new_status_payment, 
            new_status_domiciliacion, 
            id_coordinador,
            id_payment_record,
            changedstatus_at
        )
        VALUES (
            p_id_ticket, 
            p_changedstatus_by, 
            NULLIF(p_new_status, 0), 
            p_new_action,            -- SE RESPETA EL VALOR (incluso 0)
            NULLIF(p_new_status_lab, 0),
            NULLIF(p_new_status_payment, 0), 
            NULLIF(p_new_status_domiciliacion, 0),
            p_id_coordinador,
            p_id_payment_record,
            NOW()
        );
    END IF;
END;
$BODY$;

ALTER FUNCTION public.insert_ticket_status_history(integer, integer, integer, integer, integer, integer, integer, integer, integer)
    OWNER TO postgres;
