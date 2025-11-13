<?php
session_start();
session_destroy();

header('Content-Type: application/json');
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
