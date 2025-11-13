<?php
/**
 * Endpoint para crear una nueva venta.
 * Requiere autenticación de usuario (sesión activa).
 * Recibe datos de la venta por POST (JSON) y los guarda en la base de datos.
 *
 * Campos requeridos en el JSON:
 *  - producto: string
 *  - cantidad: int
 *  - precioUnit: float
 *  - fecha: string (formato reconocible por strtotime)
 *  - moneda: string (opcional, por defecto 'USD')
 *
 * Respuestas posibles:
 *  - 201: Venta creada exitosamente, retorna el id
 *  - 401: No autenticado
 *  - 400: Datos incompletos
 *  - 500: Error al crear venta
 */
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

// Decodifica el cuerpo JSON recibido
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->producto) && !empty($data->cantidad) && !empty($data->precioUnit) && !empty($data->fecha)) {
    // Calcula el importe total
    $importe = $data->cantidad * $data->precioUnit;
    $fechaISO = date('Y-m-d', strtotime($data->fecha));
    $mes = substr($fechaISO, 0, 7);
    $moneda = $data->moneda ?? 'USD';

    // Inserta la venta en la base de datos
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
