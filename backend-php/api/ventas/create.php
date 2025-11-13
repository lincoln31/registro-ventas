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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->producto) && !empty($data->cantidad) && !empty($data->precioUnit) && !empty($data->fecha)) {
    $importe = $data->cantidad * $data->precioUnit;
    $fechaISO = date('Y-m-d', strtotime($data->fecha));
    $mes = substr($fechaISO, 0, 7);
    $moneda = $data->moneda ?? 'USD';

    $query = "INSERT INTO ventas (uid, producto, cantidad, precioUnit, importe, moneda, fecha, fechaISO, mes) 
              VALUES (:uid, :producto, :cantidad, :precioUnit, :importe, :moneda, :fecha, :fechaISO, :mes)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':uid', $_SESSION['user_id']);
    $stmt->bindParam(':producto', $data->producto);
    $stmt->bindParam(':cantidad', $data->cantidad);
    $stmt->bindParam(':precioUnit', $data->precioUnit);
    $stmt->bindParam(':importe', $importe);
    $stmt->bindParam(':moneda', $moneda);
    $stmt->bindParam(':fecha', $fechaISO);
    $stmt->bindParam(':fechaISO', $fechaISO);
    $stmt->bindParam(':mes', $mes);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear venta']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}
