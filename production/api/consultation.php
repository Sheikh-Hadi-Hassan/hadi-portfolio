<?php
// Compatibility for the earlier description-organising action.
// Shares Sera's private configuration and Gemini connection; no second AI key.
declare(strict_types=1);
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $raw = file_get_contents('php://input', false, null, 0, 8001);
    $data = is_string($raw) && strlen($raw) <= 8000 ? json_decode($raw, true) : null;
    if (!is_array($data) || !is_string($data['description'] ?? null) || strlen(trim($data['description'])) < 5 || strlen($data['description']) > 6000) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Add a short project description.']);
        exit;
    }
    // Calling this legacy action specifically requests AI organisation of this description.
    // Do not include contact fields or unrelated form values.
    $GLOBALS['sera_input'] = ['question' => $data['description'], 'consent' => true, 'context' => []];
    $GLOBALS['sera_legacy'] = true;
}
require dirname(__DIR__) . '/intellignce-support/ask.php';
