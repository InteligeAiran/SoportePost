<?php
/**
 * SoportePost - Sistema de Gestión de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raíz del proyecto
 */

class DatabaseCon
{
    private string $bd_hostname;
    private string $mvc_port;
    private string $bd_usuario;
    private string $bd_clave;
    private string $database;
    private mixed  $conexion  = null;
    private mixed  $pgquery   = null;
    private mixed  $fetch     = null;

    private static ?self $instancia = null;

    // -------------------------------------------------------------------------
    // Constructor y Singleton
    // -------------------------------------------------------------------------

    private function __construct(
        string $bd_hostname,
        string $mvc_port,
        string $bd_usuario,
        string $bd_clave,
        string $database
    ) {
        $this->bd_hostname = $bd_hostname;
        $this->mvc_port    = $mvc_port;
        $this->bd_usuario  = $bd_usuario;
        $this->bd_clave    = $bd_clave;
        $this->database    = $database;

        $this->connect();
    }

    private function __clone() {}

    public static function getInstance(
        string $bd_hostname,
        string $mvc_port,
        string $bd_usuario,
        string $bd_clave,
        string $database
    ): self {
        if (!(self::$instancia instanceof self)) {
            self::$instancia = new self($bd_hostname, $mvc_port, $bd_usuario, $bd_clave, $database);
        }
        return self::$instancia;
    }

    // -------------------------------------------------------------------------
    // Conexión
    // -------------------------------------------------------------------------

    private function connect(): void
    {
        $connString = sprintf(
            "host=%s port=%s dbname=%s user=%s password=%s",
            $this->bd_hostname,
            $this->mvc_port,
            $this->database,
            $this->bd_usuario,
            $this->bd_clave
        );

        // pg_pconnect puede emitir warnings — los capturamos limpiamente
        set_error_handler(function (int $errno, string $errstr): bool {
            throw new RuntimeException("Error de conexión PostgreSQL: {$errstr}", $errno);
        });

        try {
            $this->conexion = pg_pconnect($connString);
        } catch (RuntimeException $e) {
            restore_error_handler();
            error_log('[SoportePost] DB Connect Error: ' . $e->getMessage());
            die(
                "<h2 style='font-family:sans-serif;color:#c0392b;'>Error de Base de Datos</h2>" .
                "<p style='font-family:sans-serif;'>No se pudo establecer la conexión. " .
                "Verifique la configuración en el archivo .env</p>"
            );
        }

        restore_error_handler();

        if (!$this->conexion) {
            $error = pg_last_error();
            error_log('[SoportePost] DB Connect Failed: ' . $error);
            die(
                "<h2 style='font-family:sans-serif;color:#c0392b;'>Error de Base de Datos</h2>" .
                "<p style='font-family:sans-serif;'>No se pudo conectar a la base de datos.</p>"
            );
        }
    }

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------

    /**
     * Ejecuta una query SQL y retorna el resultado o false si falla.
     */
    public function pgquery(string $sql): mixed
    {
        $result = pg_query($this->conexion, $sql);

        if ($result === false) {
            error_log('[SoportePost] Query Error: ' . pg_last_error($this->conexion));
            return false;
        }

        return $result;
    }

    /**
     * Ejecuta una query SQL. Retorna el recurso si usa RETURNING, true si no.
     */
    public function pgquery1(string $sql): mixed
    {
        $result = pg_query($this->conexion, $sql);

        if ($result === false) {
            error_log('[SoportePost] Query1 Error: ' . pg_last_error($this->conexion));
            return false;
        }

        if (str_contains(strtoupper($sql), 'RETURNING')) {
            return $result;
        }

        return true;
    }

    // -------------------------------------------------------------------------
    // Fetch
    // -------------------------------------------------------------------------

    /**
     * Retorna la primera fila de un resultado, o false si está vacío.
     */
    public function pgfetch(mixed $query): mixed
    {
        if (!$query) {
            return false;
        }

        $numrows = pg_num_rows($query);

        if ($numrows > 0) {
            return pg_fetch_assoc($query);
        }

        return false;
    }

    /**
     * Retorna todas las filas de un resultado como array.
     */
    public function pgfetchAll(mixed $query): array
    {
        if (!$query) {
            return [];
        }

        $results = [];
        while ($row = pg_fetch_assoc($query)) {
            $results[] = $row;
        }

        return $results;
    }

    /**
     * Retorna el número de filas de un resultado.
     */
    public function pgNumrows(mixed $query): int
    {
        if (!$query) {
            return 0;
        }
        return pg_num_rows($query);
    }

    // -------------------------------------------------------------------------
    // Queries Preparadas
    // -------------------------------------------------------------------------

    /**
     * Prepara una query con parámetros (previene SQL Injection).
     */
    public function prepare(string $name, string $sql): bool
    {
        $result = pg_prepare($this->conexion, $name, $sql);

        if ($result === false) {
            error_log('[SoportePost] Prepare Error: ' . pg_last_error($this->conexion));
            return false;
        }

        return true;
    }

    /**
     * Ejecuta una query preparada con sus parámetros.
     */
    public function execute(string $name, array $params): mixed
    {
        $result = pg_execute($this->conexion, $name, $params);

        if ($result === false) {
            error_log('[SoportePost] Execute Error: ' . pg_last_error($this->conexion));
            return false;
        }

        return $result;
    }

    /**
     * ✅ Query segura con parámetros — USAR ESTA para datos del usuario.
     * Previene SQL Injection combinando prepare() + execute() en un solo paso.
     *
     * Uso:
     *   $result = $db->pgqueryParams(
     *       "SELECT * FROM usuarios WHERE usuario = $1 AND clave = $2",
     *       [$usuario, $clave]
     *   );
     *   $row = $db->pgfetch($result);
     *
     * @param string $sql    Query con marcadores $1, $2, $3...
     * @param array  $params Array de valores a sustituir en orden
     * @return mixed         Resultado de la query o false si falla
     */
    public function pgqueryParams(string $sql, array $params): mixed
    {
        $result = pg_query_params($this->conexion, $sql, $params);

        if ($result === false) {
            error_log('[SoportePost] pgqueryParams Error: ' . pg_last_error($this->conexion));
            return false;
        }

        return $result;
    }

    // -------------------------------------------------------------------------
    // Imágenes
    // -------------------------------------------------------------------------

    public static function getResultImg(string $sql, self $db): array
    {
        try {
            $result = $db->pgquery($sql);
            if ($result) {
                return ['row' => $db->pgfetch($result)];
            }
            return ['error' => pg_last_error($db->getConnection())];
        } catch (\Throwable $e) {
            error_log('[SoportePost] GetResultImg Error: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    // -------------------------------------------------------------------------
    // Conexión
    // -------------------------------------------------------------------------

    public function getConnection(): mixed
    {
        return $this->conexion;
    }

    public function closeConnection(): void
    {
        if ($this->conexion) {
            pg_close($this->conexion);
            $this->conexion = null;
        }
    }

    public function __destruct()
    {
        $this->closeConnection();
    }
}
?>
