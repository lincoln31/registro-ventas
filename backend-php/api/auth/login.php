<?php
/**
 * Endpoint de autenticación de usuario.
 * Recibe email y password por POST (JSON), verifica credenciales y responde con datos del usuario y token de sesión.
 *
 * Respuestas posibles:
 *  - 200: Autenticación exitosa, retorna usuario y token
 *  - 401: Contraseña incorrecta
 *  - 404: Usuario no encontrado
 *  - 400: Datos incompletos
 */
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

header('Content-Type: application/json');

// Decodifica el cuerpo JSON recibido
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    // Busca el usuario por email
    $query = "SELECT id, email, nombre, password FROM usuarios WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verifica la contraseña
        if (password_verify($data->password, $row['password'])) {
            session_start();
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['email'] = $row['email'];
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $row['id'],
                    'email' => $row['email'],
                    'displayName' => $row['nombre']
                ],
                'token' => session_id()
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}
