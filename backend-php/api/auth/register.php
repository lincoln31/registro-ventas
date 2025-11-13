<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $query = "SELECT id FROM usuarios WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Email ya registrado']);
    } else {
        $query = "INSERT INTO usuarios (email, password, nombre) VALUES (:email, :password, :nombre)";
        $stmt = $db->prepare($query);
        
        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
        $nombre = $data->nombre ?? null;
        
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':nombre', $nombre);

        if ($stmt->execute()) {
            $user_id = $db->lastInsertId();
            session_start();
            $_SESSION['user_id'] = $user_id;
            $_SESSION['email'] = $data->email;

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user_id,
                    'email' => $data->email,
                    'displayName' => $nombre
                ],
                'token' => session_id()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al registrar usuario']);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}
