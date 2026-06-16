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
5.  **Protección CSRF Global**:
    *   Toda petición HTTP de cambio de estado (POST, PUT, DELETE, PATCH) en el backend es validada usando tokens CSRF únicos por sesión.
    *   Un interceptor global en el frontend intercepta automáticamente `XMLHttpRequest`, `window.fetch` y peticiones AJAX de jQuery para adjuntar la cabecera `X-CSRF-TOKEN` sin alterar el código JS existente.
6.  **Limitación de Tasa (API Rate Limiting)**:
    *   Protección contra ataques de fuerza bruta y denegación de servicio (DoS) en endpoints sensibles y de propósito general en la API, implementada a nivel de controlador mediante almacenamiento de registros temporales ligeros en formato JSON por IP y ruta.

---

## 🔒 Seguridad (CSRF & Rate Limiting)

Para garantizar la seguridad de los recursos y la integridad de las operaciones del sistema, se han integrado dos capas protectoras clave en el motor base:

### 🛡️ Protección CSRF (Cross-Site Request Forgery)
*   **Generación**: Al inicializarse el controlador base ([Controller.php](file:///c:/xampp/htdocs/SoportePost/libs/Controller.php)), se inicia la sesión de PHP (si no está activa) y se genera un token criptográfico seguro único en `$_SESSION['csrf_token']`.
*   **Inyección en Frontend**: En la clase de renderizado ([View.php](file:///c:/xampp/htdocs/SoportePost/libs/View.php)), antes de cargar cualquier plantilla HTML, se inyecta un interceptor JavaScript global que captura e inyecta la cabecera `X-CSRF-TOKEN` de forma transparente en todas las peticiones `fetch()`, `XMLHttpRequest` y AJAX de `jQuery`.
*   **Validación**: Todas las peticiones con métodos de modificación (`POST`, `PUT`, `DELETE`, `PATCH`) se validan contra el token de la sesión. Si el token falta o es incorrecto, el servidor responde inmediatamente con un código **`403 Forbidden`** y bloquea la operación.
*   **Excepciones**: Las rutas de cara al público/inicio de sesión (`api/users/access`, `api/users/checkUser`, `api/users/getEmailByUsername`, y `api/users/logout`) están exentas para no interrumpir el flujo de inicio de sesión o recuperación de contraseñas.

### ⏱️ Limitación de Tasa (API Rate Limiting)
El sistema controla la frecuencia de las solicitudes realizadas a las APIs para evitar el abuso, escaneos automáticos de fuerza bruta y sobrecargas de peticiones:
*   **Puntos de Enlace Protegidos**: Aplica a cualquier ruta que empiece con `api/` (ej. `/api/users/access`, `/api/tickets/create`, etc.).
*   **Políticas de Límites (Ventana Móvil de 60 segundos)**:
    *   **Acceso e Inicio de Sesión (`api/users/access`)**: Máximo **10 peticiones por minuto** por dirección IP.
    *   **Subida de Archivos** (cualquier ruta de API que contenga `upload`): Máximo **10 peticiones por minuto** por dirección IP.
    *   **APIs Generales**: Máximo **100 peticiones por minuto** por dirección IP.
*   **Resolución de IP Segura**: Soporta de forma nativa redes locales y balanceadores de carga / proxys inversos leyendo las cabeceras `HTTP_CLIENT_IP`, `HTTP_X_FORWARDED_FOR` y cayendo a `REMOTE_ADDR` como último recurso.
*   **Almacenamiento Local Eficiente**: Diseñado para entornos XAMPP y servidores tradicionales sin dependencias externas (como Redis o bases de datos adicionales). Utiliza archivos JSON locales temporales cifrados por MD5 (`tmp/rate_limit/{md5(IP_Ruta)}.json`) que expiran solos dinámicamente.
*   **Respuestas y Cabeceras**: Cuando un cliente supera el límite establecido, el servidor responde inmediatamente con:
    *   Código de estado HTTP **`429 Too Many Requests`**.
    *   Cabecera **`Retry-After`** con los segundos restantes que debe esperar el cliente para volver a intentar.
    *   Respuesta en formato JSON: `{"success": false, "error": "Too many requests. Please try again later.", "retry_after": X}`.

---

## 📄 Licencia

Copyright © 2026 **Inteligensa**.

Todos los derechos reservados. Este software y su código fuente son propiedad exclusiva de Inteligensa. Queda prohibida la reproducción, distribución, modificación o uso del mismo sin autorización expresa y por escrito de la empresa.

