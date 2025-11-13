<?php
session_start();
require_once '../../config/database.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;

if ($id) {
    $query = "DELETE FROM ventas WHERE id = :id AND uid = :uid";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':uid', $_SESSION['user_id']);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Venta eliminada']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al eliminar']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
}
