<?php
// Copy to private-config.php only after verifying the provider project has NO billing account.
// Never paste the real key in chat, commit it, or add a payment method for this feature.
return [
    'enabled' => false,
    'unbilled_project_confirmed' => false,
    'gemini_key' => '',
    'model' => '', // Choose a currently supported model with free-tier availability.
    'daily_limit' => 30,
];
