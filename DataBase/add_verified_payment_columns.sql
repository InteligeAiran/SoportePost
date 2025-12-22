-- Agregar columnas para datos verificados de pago en payment_records
ALTER TABLE payment_records 
ADD COLUMN IF NOT EXISTS nro_payment_reference_verified VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_date_verified DATE;

-- Comentarios para las nuevas columnas
COMMENT ON COLUMN payment_records.nro_payment_reference_verified IS 'Número de referencia de pago verificado/corregido durante la aprobación del documento';
COMMENT ON COLUMN payment_records.payment_date_verified IS 'Fecha de pago verificada/corregida durante la aprobación del documento';

