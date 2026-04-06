-- FUNCTION: public.insert_ticket_status_history (CORREGIDA con NOW() y manejo de NULLs)
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
BEGIN
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
        changedstatus_at -- NUEVO: Asegurar fecha
    )
    VALUES (
        p_id_ticket, 
        p_changedstatus_by, 
        -- NUEVO: Manejo de NULLIF para estatus y acciones principales
        NULLIF(p_new_status, 0), 
        NULLIF(p_new_action, 0),
        -- NUEVO: Si llega 0 desde PHP, lo tratamos como NULL
        NULLIF(p_new_status_lab, 0),
        NULLIF(p_new_status_payment, 0), 
        NULLIF(p_new_status_domiciliacion, 0),
        p_id_coordinador,
        p_id_payment_record,
        NOW() -- NUEVO: Forzar timestamp actual
    );
END;
$BODY$;

-- (La función get_ticket_history_details se mantiene igual a la versión anterior ya que el problema estaba en la inserción)
CREATE OR REPLACE FUNCTION public.get_ticket_history_details(
	p_id_ticket_param integer)
    RETURNS TABLE(
        id_history integer, 
        nro_ticket character varying, 
        serial_pos character varying, 
        full_name_tecnico_gestion text, 
        id_ticket integer, 
        name_status_ticket character varying, 
        fecha_de_cambio text, 
        name_accion_ticket character varying, 
        full_name_coordinador text, 
        name_status_lab character varying, 
        name_status_domiciliacion character, 
        name_status_payment character varying, 
        full_name_tecnico_n2_history text, 
        components_list text, 
        components_changes text, 
        name_motivo_rechazo text, 
        changedstatus_at timestamp without time zone, 
        pago text, 
        exoneracion text, 
        envio text, 
        envio_destino text, 
        convenio_firmado text, 
        pago_fecha text, 
        exoneracion_fecha text, 
        envio_fecha text, 
        envio_destino_fecha text, 
        convenio_firmado_fecha text, 
        comment_devolution text, 
        comment_reasignation text, 
        nombre_coordinacion text, 
        operador_ticket text, 
        usuario_gestion text,
        nro_payment_reference character varying,
        record_number character varying
    ) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    tikhis.id_history,
	tik.nro_ticket,
	tik.serial_pos,
    CASE 
      WHEN acctik.name_accion_ticket = 'Asignado al Técnico' THEN 'Coordinador'
      WHEN tikhis.changedstatus_by = (
        SELECT ut_n2.id_tecnico_n2
        FROM users_tickets ut_n2
        WHERE ut_n2.id_ticket = tikhis.id_ticket
          AND ut_n2.id_tecnico_n2 IS NOT NULL
          AND ut_n2.date_assign_tec2 <= tikhis.changedstatus_at
        ORDER BY ut_n2.date_assign_tec2 DESC, ut_n2.id_user_ticket DESC
        LIMIT 1
      ) THEN 'Técnico Gestion'
      ELSE 'Usuario Gestion'
    END AS full_name_tecnico_gestion,
    tikhis.id_ticket,
    sttik.name_status_ticket,
    TO_CHAR(tikhis.changedstatus_at, 'DD-MM-YYYY HH12:MI') AS fecha_de_cambio,
    acctik.name_accion_ticket,
    CASE 
      WHEN tikhis.id_coordinador IS NULL OR tikhis.id_coordinador = 0 THEN 'Sin gestionar'
      ELSE COALESCE(CONCAT(usr_coord_hist.name, ' ', usr_coord_hist.surname), 'No Asignado')
    END AS full_name_coordinador,
    stlab.name_status_lab,
    stdom.name_status_domiciliacion,
    stpay.name_status_payment,
    COALESCE(CONCAT(usr_n2_history.name, ' ', usr_n2_history.surname), 'No Asignado') AS full_name_tecnico_n2_history,
    (
      SELECT STRING_AGG(DISTINCT c.name_component, ', ' ORDER BY c.name_component)
      FROM tickets_componets_history tch
      JOIN components c ON c.id_component = tch.id_components
      JOIN tickets_componets tc ON tc.id_ticket = tch.id_ticket 
                                AND tc.id_components = tch.id_components
      WHERE tch.id_ticket = tikhis.id_ticket
        AND tch.action_type IN ('INSERT', 'CHECK')
        AND tch.action_date <= tikhis.changedstatus_at
        AND NOT EXISTS (
          SELECT 1 FROM tickets_componets_history tch_uncheck
          JOIN tickets_componets tc_uncheck ON tc_uncheck.id_ticket = tch_uncheck.id_ticket
                                            AND tc_uncheck.id_components = tch_uncheck.id_components
          WHERE tch_uncheck.id_ticket = tch.id_ticket
            AND tch_uncheck.id_components = tch.id_components
            AND tch_uncheck.action_type = 'UPDATE'
            AND tch_uncheck.action_date > tch.action_date
            AND tch_uncheck.action_date <= tikhis.changedstatus_at
            AND tc_uncheck.add = FALSE
        )
    ) AS components_list,
    (
      SELECT 
        CASE 
          WHEN COUNT(*) = 1 THEN 'Se desmarcó ' || STRING_AGG(c.name_component, ', ' ORDER BY c.name_component)
          ELSE 'Se desmarcaron ' || COUNT(*)::text || ' componentes: ' || STRING_AGG(c.name_component, ', ' ORDER BY c.name_component)
        END
      FROM tickets_componets_history tch
      JOIN components c ON c.id_component = tch.id_components
      JOIN tickets_componets tc ON tc.id_ticket = tch.id_ticket 
                                AND tc.id_components = tch.id_components
      WHERE tch.id_ticket = tikhis.id_ticket
        AND tikhis.new_action = 20
        AND tch.action_type = 'UPDATE'
        AND tc.add = FALSE
        AND tch.action_date <= tikhis.changedstatus_at
        AND NOT EXISTS (
          SELECT 1 FROM tickets_componets_history tch2
          JOIN tickets_componets tc2 ON tc2.id_ticket = tch2.id_ticket 
                                     AND tc2.id_components = tch2.id_components
          WHERE tch2.id_ticket = tch.id_ticket
            AND tch2.id_components = tch.id_components
            AND tch2.action_type IN ('CHECK', 'UPDATE')
            AND tch2.action_date > tch.action_date
            AND tch2.action_date <= tikhis.changedstatus_at
            AND tc2.add = TRUE
        )
    ) AS components_changes,
    (SELECT motrec_new.name_motivo_rechazo 
     FROM payment_records pr_new
     JOIN archivos_adjuntos aa_new ON aa_new.record_number = pr_new.record_number
     JOIN motivos_rechazo motrec_new ON motrec_new.id_motivo_rechazo = aa_new.id_motivo_rechazo
     WHERE pr_new.id_payment_record = tikhis.id_payment_record
     LIMIT 1) AS name_motivo_rechazo,
    tikhis.changedstatus_at,
    CASE WHEN EXISTS (SELECT 1 FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Anticipo' AND aa.uploaded_at <= tikhis.changedstatus_at) THEN 'Sí' ELSE 'No' END AS pago,
    CASE WHEN EXISTS (SELECT 1 FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Exoneracion' AND aa.uploaded_at <= tikhis.changedstatus_at) THEN 'Sí' ELSE 'No' END AS exoneracion,
    CASE WHEN EXISTS (SELECT 1 FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Envio' AND aa.uploaded_at <= tikhis.changedstatus_at) THEN 'Sí' ELSE 'No' END AS envio,
    CASE WHEN EXISTS (SELECT 1 FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Envio_Destino' AND aa.uploaded_at <= tikhis.changedstatus_at) THEN 'Sí' ELSE 'No' END AS envio_destino,
    CASE WHEN EXISTS (SELECT 1 FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'convenio_firmado' AND aa.uploaded_at <= tikhis.changedstatus_at) THEN 'Sí' ELSE 'No' END AS convenio_firmado,
    (SELECT TO_CHAR(aa.uploaded_at, 'DD-MM-YYYY HH12:MI') FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Anticipo' AND aa.uploaded_at <= tikhis.changedstatus_at ORDER BY aa.uploaded_at DESC LIMIT 1) AS pago_fecha,
    (SELECT TO_CHAR(aa.uploaded_at, 'DD-MM-YYYY HH12:MI') FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Exoneracion' AND aa.uploaded_at <= tikhis.changedstatus_at ORDER BY aa.uploaded_at DESC LIMIT 1) AS exoneracion_fecha,
    (SELECT TO_CHAR(aa.uploaded_at, 'DD-MM-YYYY HH12:MI') FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Envio' AND aa.uploaded_at <= tikhis.changedstatus_at ORDER BY aa.uploaded_at DESC LIMIT 1) AS envio_fecha,
    (SELECT TO_CHAR(aa.uploaded_at, 'DD-MM-YYYY HH12:MI') FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'Envio_Destino' AND aa.uploaded_at <= tikhis.changedstatus_at ORDER BY aa.uploaded_at DESC LIMIT 1) AS envio_destino_fecha,
    (SELECT TO_CHAR(aa.uploaded_at, 'DD-MM-YYYY HH12:MI') FROM archivos_adjuntos aa WHERE CAST(aa.nro_ticket AS TEXT) = tik.nro_ticket AND aa.document_type = 'convenio_firmado' AND aa.uploaded_at <= tikhis.changedstatus_at ORDER BY aa.uploaded_at DESC LIMIT 1) AS convenio_firmado_fecha,
    COALESCE(tik.comment_devolution, '') AS comment_devolution,
    COALESCE(ut_history.commentchangetec, '') AS comment_reasignation,
    COALESCE(dept.name_department::text, 'Sin Coordinación') AS nombre_coordinacion,
    COALESCE(CONCAT(usr_tecnico_n1.name, ' ', usr_tecnico_n1.surname), 'No Asignado') AS operador_ticket,
    COALESCE(CONCAT(usr_gestion.name, ' ', usr_gestion.surname), 'No Asignado') AS usuario_gestion,
    -- NUEVOS CAMPOS VINCULADOS
    (SELECT pr.payment_reference FROM payment_records pr WHERE pr.id_payment_record = tikhis.id_payment_record) AS nro_payment_reference,
    (SELECT pr.record_number FROM payment_records pr WHERE pr.id_payment_record = tikhis.id_payment_record) AS record_number
  FROM tickets_status_history tikhis
  INNER JOIN accions_tickets acctik ON acctik.id_accion_ticket = tikhis.new_action
  INNER JOIN status_tickets sttik ON sttik.id_status_ticket = tikhis.new_status
  LEFT JOIN users usr_gestion ON usr_gestion.id_user = tikhis.changedstatus_by
  LEFT JOIN users usr_coord_hist ON usr_coord_hist.id_user = tikhis.id_coordinador
  LEFT JOIN status_lab stlab ON stlab.id_status_lab = tikhis.new_status_lab
  LEFT JOIN status_domiciliacion stdom ON stdom.id_status_domiciliacion = tikhis.new_status_domiciliacion
  LEFT JOIN status_payments stpay ON stpay.id_status_payment = tikhis.new_status_payment
  LEFT JOIN tickets tik ON tik.id_ticket = tikhis.id_ticket
  LEFT JOIN LATERAL (SELECT ut_n1.id_tecnico_n1 FROM users_tickets ut_n1 WHERE ut_n1.id_ticket = tikhis.id_ticket AND ut_n1.id_tecnico_n1 IS NOT NULL ORDER BY ut_n1.date_create_ticket ASC LIMIT 1) AS first_tecnico_n1 ON TRUE
  LEFT JOIN users usr_tecnico_n1 ON usr_tecnico_n1.id_user = first_tecnico_n1.id_tecnico_n1
  LEFT JOIN LATERAL (SELECT ut_coor.id_department FROM users_tickets ut_coor WHERE ut_coor.id_ticket = tikhis.id_ticket AND ut_coor.id_department IS NOT NULL ORDER BY ut_coor.date_assign_tec2 DESC, ut_coor.id_user_ticket DESC LIMIT 1) AS latest_dept ON TRUE
  LEFT JOIN departments dept ON dept.id_department = latest_dept.id_department
  LEFT JOIN LATERAL (SELECT ut_n2.id_tecnico_n2 FROM users_tickets ut_n2 WHERE ut_n2.id_ticket = tikhis.id_ticket AND ut_n2.id_tecnico_n2 IS NOT NULL AND ut_n2.date_assign_tec2 <= tikhis.changedstatus_at ORDER BY ut_n2.date_assign_tec2 DESC, ut_n2.id_user_ticket DESC LIMIT 1) AS latest_n2_at_history ON TRUE
  LEFT JOIN users usr_n2_history ON usr_n2_history.id_user = latest_n2_at_history.id_tecnico_n2
  LEFT JOIN LATERAL (SELECT ut_comment.commentchangetec FROM users_tickets ut_comment WHERE ut_comment.id_ticket = tikhis.id_ticket AND ut_comment.commentchangetec IS NOT NULL AND ut_comment.date_assign_tec2 <= tikhis.changedstatus_at ORDER BY ut_comment.date_assign_tec2 DESC, ut_comment.id_user_ticket DESC LIMIT 1) AS ut_history ON TRUE
  WHERE tikhis.id_ticket = p_id_ticket_param
  ORDER BY tikhis.changedstatus_at DESC;
END;
$BODY$;
