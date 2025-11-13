<?php
/**
 * Configuración y clase de conexión a la base de datos MySQL.
 * Incluye cabeceras CORS para permitir peticiones desde el frontend.
 *
 * Métodos:
 *  - getConnection(): Devuelve una instancia PDO conectada a la base de datos.
 *
 * Cabeceras CORS:
 *  - Permite origen: http://localhost:4200
 *  - Métodos: GET, POST, PUT, DELETE, OPTIONS
 *  - Headers: Content-Type, Authorization
 *  - Credenciales: true
 *
 * Si la petición es OPTIONS, responde 200 y termina.
 */
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Clase Database para gestionar la conexión PDO a MySQL.
 */
class Database {
    private $host = 'localhost';
    private $db_name = 'registro_ventas';
    private $username = 'root';
    private $password = '';
    private $conn;

    /**
     * Obtiene la conexión PDO a la base de datos.
     * @return PDO|null Instancia de PDO o null si falla la conexión
     */
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            echo "Error de conexión: " . $e->getMessage();
        }
        return $this->conn;
    }
}
