<?php
/**
 * Endpoint para cerrar la sesión del usuario.
 * Destruye la sesión activa y responde con confirmación en formato JSON.
 *
 * Respuesta:
 *  - 200: Sesión cerrada correctamente
 */
session_start();
session_destroy();

header('Content-Type: application/json');
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
