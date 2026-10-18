<?php
// Copy to private-config.php ONLY if no working private config already exists.
// Set both flags true only after confirming this Google project has no billing attached.
// Never put the API key in JavaScript, a URL, an email, or a chat message.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}
return [
    'enabled' => false,
    'unbilled_project_confirmed' => false,
    'gemini_key' => 'PASTE_EXISTING_GEMINI_API_KEY_HERE',
    'model' => 'gemini-3.5-flash-lite',
    'daily_limit' => 30,
];
