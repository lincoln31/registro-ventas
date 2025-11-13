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

$filter = $_GET['filter'] ?? 'all';
$value = $_GET['value'] ?? null;

$query = "SELECT * FROM ventas WHERE uid = :uid";

if ($filter === 'day' && $value) {
    $query .= " AND fechaISO = :value";
} elseif ($filter === 'month' && $value) {
    $query .= " AND mes = :value";
} elseif ($filter === 'currency' && $value) {
    $query .= " AND moneda = :value";
}

$query .= " ORDER BY created_at DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(':uid', $_SESSION['user_id']);

if ($value) {
    $stmt->bindParam(':value', $value);
}

$stmt->execute();
$ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(['success' => true, 'data' => $ventas]);
