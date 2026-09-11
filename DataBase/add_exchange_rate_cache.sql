-- =====================================================================
-- CACHE LOCAL para get_exchange_rate_by_date().
--
-- Problema: cada vez que se cambia la fecha en el formulario de pago,
-- get_exchange_rate_by_date() abre una conexion dblink EN VIVO contra la
-- base remota de Intelipunto (tbl_tasadecambio) -- medido en ~95ms por
-- llamada, y ~135ms cuando la fecha no tiene tasa publicada (fin de
-- semana/feriado), porque ahi se dispara una SEGUNDA conexion dblink de
-- fallback ("ultima tasa anterior disponible").
--
-- La tasa de un dia YA PUBLICADO nunca cambia, asi que una vez resuelta
-- una fecha, se puede cachear localmente y servir instantaneo (sin red)
-- a cualquier usuario que vuelva a pedir esa misma fecha.
--
-- Cuidado con "hoy": si se pide la fecha de hoy antes de que Intelipunto
-- publique la tasa del dia, el resultado cae al fallback (tasa de un dia
-- anterior) -- ese resultado NO se debe cachear como definitivo para hoy,
-- porque mas tarde en el mismo dia si puede aparecer la tasa real. Por
-- eso el cache solo se usa como valido si:
--   - la fecha pedida es estrictamente anterior a hoy (ya inmutable), O
--   - la fecha pedida es hoy Y lo cacheado es un match EXACTO de hoy
--     (fecha_tasa = fecha_solicitada), nunca un fallback de hoy.
-- En cualquier otro caso se vuelve a consultar Intelipunto y se
-- actualiza el cache (UPSERT) con el resultado fresco.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.cached_exchange_rates (
    fecha_solicitada date PRIMARY KEY,
    tasa_dolar       numeric NOT NULL,
    fecha_tasa       date,
    fecha_gestion    time with time zone,
    moneda           character varying,
    cached_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.cached_exchange_rates IS
  'Cache local de get_exchange_rate_by_date(): evita reconsultar por dblink a Intelipunto una fecha ya resuelta antes. Ver DataBase/add_exchange_rate_cache.sql para el detalle de invalidacion de "hoy".';

CREATE OR REPLACE FUNCTION public.get_exchange_rate_by_date(p_fecha date)
 RETURNS TABLE(tasa_dolar numeric, fecha_tasa date, fecha_gestion time with time zone, moneda character varying)
 LANGUAGE plpgsql
 ROWS 1
AS $function$
DECLARE
    v_host_intelipunto TEXT;
    v_port_intelipunto TEXT;
    v_dbname_intelipunto TEXT;
    v_username_intelipunto TEXT;
    v_password_intelipunto TEXT;
    v_dblink_conn_string_intelipunto TEXT;
    v_tasa_dolar numeric;
    v_fecha_tasa date;
    v_fecha_gestion time with time zone;
    v_moneda character varying;
BEGIN
    -- ---------------------------------------------------------------
    -- FAST PATH: ya se resolvio esta fecha antes y el resultado sigue
    -- siendo valido (ver nota de "hoy" arriba). Sin red, ~ms.
    -- ---------------------------------------------------------------
    SELECT c.tasa_dolar, c.fecha_tasa, c.fecha_gestion, c.moneda
    INTO v_tasa_dolar, v_fecha_tasa, v_fecha_gestion, v_moneda
    FROM public.cached_exchange_rates c
    WHERE c.fecha_solicitada = p_fecha
      AND (p_fecha < CURRENT_DATE OR c.fecha_tasa = p_fecha)
    LIMIT 1;

    IF FOUND THEN
        RETURN QUERY SELECT v_tasa_dolar, v_fecha_tasa, v_fecha_gestion, v_moneda;
        RETURN;
    END IF;

    -- ---------------------------------------------------------------
    -- CACHE MISS: logica original via dblink a Intelipunto.
    -- ---------------------------------------------------------------
    SELECT host, port, dbname, username, password
    INTO v_host_intelipunto, v_port_intelipunto, v_dbname_intelipunto, v_username_intelipunto, v_password_intelipunto
    FROM dblink_configs
    WHERE config_name = 'intelipunto_db';

    IF v_host_intelipunto IS NULL THEN
        RAISE EXCEPTION 'Configuración de dblink "intelipunto_db" no encontrada en dblink_configs.';
    END IF;

    v_dblink_conn_string_intelipunto := format(
        'host=%s port=%s dbname=%s user=%s password=%s',
        v_host_intelipunto, v_port_intelipunto, v_dbname_intelipunto, v_username_intelipunto, v_password_intelipunto
    );

    -- UNA sola conexion/consulta dblink en vez de dos: dentro del filtro
    -- fecha_tasa <= p_fecha, la fecha exacta (si existe) ya es el valor
    -- maximo posible de fecha_tasa, asi que ordenar DESC la trae primero
    -- sola -- no hace falta una segunda ida y vuelta por red para el
    -- fallback "ultima tasa anterior disponible".
    SELECT t1.tasa_dolar::numeric, t1.fecha_tasa::date, t1.fecha_gestion::time with time zone, t1.moneda::character varying
    INTO v_tasa_dolar, v_fecha_tasa, v_fecha_gestion, v_moneda
    FROM dblink(
        v_dblink_conn_string_intelipunto,
        format('
            SELECT
                tasa_dolar,
                fecha_tasa,
                fecha_gestion,
                moneda
            FROM tbl_tasadecambio
            WHERE fecha_tasa <= %L
                AND moneda = ''2''
            ORDER BY fecha_tasa DESC NULLS LAST, fecha_gestion DESC NULLS LAST
            LIMIT 1
        ', p_fecha)
    ) AS t1(tasa_dolar numeric, fecha_tasa date, fecha_gestion time with time zone, moneda character varying);

    IF v_tasa_dolar IS NOT NULL THEN
        INSERT INTO public.cached_exchange_rates (fecha_solicitada, tasa_dolar, fecha_tasa, fecha_gestion, moneda, cached_at)
        VALUES (p_fecha, v_tasa_dolar, v_fecha_tasa, v_fecha_gestion, v_moneda, now())
        ON CONFLICT (fecha_solicitada) DO UPDATE SET
            tasa_dolar    = EXCLUDED.tasa_dolar,
            fecha_tasa    = EXCLUDED.fecha_tasa,
            fecha_gestion = EXCLUDED.fecha_gestion,
            moneda        = EXCLUDED.moneda,
            cached_at     = EXCLUDED.cached_at;

        RETURN QUERY SELECT v_tasa_dolar, v_fecha_tasa, v_fecha_gestion, v_moneda;
    END IF;
    -- Si no se encontro nada (ni exacto ni fallback), se retornan 0 filas,
    -- igual que el comportamiento original.
END;
$function$;

-- =====================================================================
-- get_exchange_rate_today(): NO EXISTIA en la base (solo existia una
-- variante vieja renombrada "get_exchange_rate_today1"). El modelo PHP
-- (consulta_rifModel::GetExchangeRateToday) llama a
-- "SELECT * FROM public.get_exchange_rate_today();" -- sin esta funcion,
-- esa consulta fallaba con "funcion no existe", pg_query() devolvia
-- false, y el repositorio (technicalConsultionRepository::
-- GetExchangeRateToday) llamaba pg_free_result(false), lo que en PHP 8
-- truena con TypeError ("Argument #1 ($result) must be of type
-- PgSql\Result, bool given") -- eso es lo que se veia como
-- "Error al instanciar el controlador" en vez de la tasa.
--
-- Se define como un wrapper de una sola linea sobre
-- get_exchange_rate_by_date(CURRENT_DATE), asi hereda el cache y la
-- optimizacion de una sola conexion dblink de arriba, sin duplicar logica.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_exchange_rate_today()
 RETURNS TABLE(tasa_dolar numeric, fecha_tasa date, fecha_gestion time with time zone, moneda character varying)
 LANGUAGE sql
 STABLE
AS $function$
    SELECT * FROM public.get_exchange_rate_by_date(CURRENT_DATE);
$function$;
