-- Tabla de componentes disponibles
CREATE TABLE IF NOT EXISTS `componentes` (
  `id_component` int(11) NOT NULL AUTO_INCREMENT,
  `name_component` varchar(255) NOT NULL,
  `estado` enum('Disponible','No Disponible') DEFAULT 'Disponible',
  `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_component`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de relación entre componentes y dispositivos
CREATE TABLE IF NOT EXISTS `componentes_dispositivo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_ticket` int(11) NOT NULL,
  `serial_dispositivo` varchar(100) NOT NULL,
  `id_component` int(11) NOT NULL,
  `fecha_asignacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_componente_dispositivo_componente` (`id_component`),
  KEY `fk_componente_dispositivo_ticket` (`id_ticket`),
  CONSTRAINT `fk_componente_dispositivo_componente` FOREIGN KEY (`id_component`) REFERENCES `componentes` (`id_component`) ON DELETE CASCADE,
  CONSTRAINT `fk_componente_dispositivo_ticket` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id_ticket`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vista para obtener componentes de un dispositivo
CREATE OR REPLACE VIEW `v_componentes_dispositivo` AS
SELECT 
    cd.id,
    cd.id_ticket,
    cd.serial_dispositivo,
    cd.id_component,
    c.name_component,
    cd.fecha_asignacion
FROM componentes_dispositivo cd
JOIN componentes c ON cd.id_component = c.id_component
ORDER BY cd.fecha_asignacion DESC;

-- Insertar algunos componentes de ejemplo
INSERT INTO `componentes` (`name_component`, `estado`) VALUES
('Teclado', 'Disponible'),
('Mouse', 'Disponible'),
('Monitor', 'Disponible'),
('Impresora', 'Disponible'),
('Scanner', 'Disponible'),
('Cable de Red', 'Disponible'),
('Cable de Alimentación', 'Disponible'),
('Batería', 'Disponible'),
('Tarjeta de Red', 'Disponible'),
('Memoria RAM', 'Disponible'),
('Disco Duro', 'Disponible'),
('Procesador', 'Disponible'),
('Placa Base', 'Disponible'),
('Fuente de Poder', 'Disponible'),
('Ventilador', 'Disponible');
