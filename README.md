# 🎟️ SoportePost - Sistema de Gestión de Tickets

¡Bienvenido a **SoportePost**! Un sistema de gestión de tickets de soporte técnico robusto, moderno y elegante, diseñado para optimizar el flujo de trabajo entre clientes, técnicos y administradores. Este sistema ha sido estructurado utilizando un patrón **MVC (Modelo-Vista-Controlador)** personalizado en PHP con arquitectura de **Repositorios** y **Servicios** para mayor seguridad, escalabilidad y orden.

---

## 🛠️ Tecnologías y Requisitos

El proyecto está construido sobre las siguientes bases:

*   **Lenguaje**: PHP 8.2+
*   **Base de Datos**: PostgreSQL 12+
*   **Servidor Web**: Apache (con `mod_rewrite` habilitado mediante `.htaccess`)
*   **Manejador de Dependencias**: Composer
*   **Librerías Clave**:
    *   **PHPMailer (v6.9)**: Gestión y envío de correos electrónicos vía SMTP (Gmail, etc.).
    *   **SweetAlert2 / Bootstrap**: Interfaz interactiva y moderna de cara al usuario.

---

## 📁 Estructura del Proyecto

El código está organizado siguiendo buenas prácticas de separación de responsabilidades:

```text
SoportePost/
├── app/
│   ├── controllers/      # Controladores que manejan el flujo de la aplicación (incluye controladores de API)
│   ├── models/           # Modelos que interactúan directamente con la base de datos a nivel SQL
│   ├── repositories/     # Capa intermedia que aísla las consultas SQL de los controladores
│   ├── Services/         # Servicios reutilizables (ej. EmailServices para envíos SMTP)
│   └── views/            # Vistas HTML, CSS y JS del frontend (SuperAdmin, Técnico, Login, etc.)
├── config/
│   └── paths.php         # Definición de rutas y constantes de entorno globales
├── libs/
│   ├── Bootstrap.php     # Enrutador personalizado (gestión de URLs amigables)
│   ├── Controller.php    # Clase controladora base
│   ├── Model.php         # Clase modelo base
│   ├── View.php          # Clase vista base
│   ├── EnvLoader.php     # Lector de variables de entorno (.env)
│   ├── database.php      # Configuración de base de datos y cargador de constantes
│   └── database_cn.php   # Clase Singleton DatabaseCon para la conexión segura con PostgreSQL
├── vendor/               # Dependencias de Composer (PHPMailer, etc.)
├── .env.example          # Plantilla de configuración de variables de entorno
├── index.php             # Punto de entrada de la aplicación (bootstrap del MVC)
└── LICENSE               # Archivo de licencia propietaria del proyecto
```

---

## 🚀 Instalación y Configuración

Sigue estos pasos para desplegar el sistema en tu entorno local (ej. utilizando XAMPP con PHP 8.2 y PostgreSQL):

### 1. Clonar el repositorio
Descarga o clona el código fuente en tu servidor local (generalmente en `c:\xampp\htdocs\SoportePost`).

### 2. Instalar dependencias mediante Composer
Abre una terminal en la raíz del proyecto y ejecuta:
```bash
composer install
```
Esto creará el directorio `vendor/` e instalará **PHPMailer** y sus dependencias necesarias.

### 3. Configurar variables de entorno
Crea una copia del archivo `.env.example` en la raíz del proyecto y cámbiale el nombre a `.env`:
```bash
cp .env.example .env
```
Abre el archivo `.env` y rellena los datos según tu entorno:
*   **Base de Datos**: Host, puerto, credenciales de PostgreSQL y el nombre de la base de datos.
*   **Uploads**: La ruta absoluta donde se guardarán los archivos adjuntos y documentos del sistema (ej. `C:\Documentos_SoportePost\`).
*   **SMTP Correo**: Credenciales de tu servidor de correos (ej. Gmail con contraseña de aplicación) para que funcionen las notificaciones por correo y el restablecimiento de contraseñas.

### 4. Configurar la base de datos en PostgreSQL
*   Crea la base de datos en PostgreSQL (ej. `SoportePost`).
*   Importa el esquema de base de datos e instala las funciones almacenadas contenidas en la carpeta `DataBase/` o `db/`.

---

## 🔑 Características Destacadas de la Arquitectura

1.  **Cargador de Entorno Seguro (`.env`)**:
    *   La configuración del servidor y credenciales sensibles están aisladas en el archivo `.env`, que nunca debe subirse al control de versiones.
2.  **Prevención de SQL Injections**:
    *   Toda la interacción con el cliente y los técnicos utiliza sentencias preparadas mediante `pg_query_params` a través del método `pgqueryParams()` en [database_cn.php](file:///c:/xampp/htdocs/SoportePost/libs/database_cn.php#L224-L248).
3.  **Patrón Repository**:
    *   Los controladores nunca hacen consultas crudas de SQL. En su lugar, delegan la lógica a los repositorios (ej. `EmailRepository`), manteniendo la base de código limpia y fácil de mantener.
4.  **PHPMailer mediante Composer**:
    *   Aprovecha el cargador automático de clases (`vendor/autoload.php`), eliminando las dependencias manuales antiguas y facilitando la actualización de paquetes.

---

## 📄 Licencia

Copyright © 2026 **Airan Bracamonte** <airanbracamonte01@gmail.com>.

Todos los derechos reservados. Este software y su código fuente son propiedad exclusiva de Airan Bracamonte. Queda prohibida la reproducción, distribución, modificación o uso del mismo sin autorización expresa y por escrito del autor.
