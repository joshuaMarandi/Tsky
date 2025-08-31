<?php
// Test auth endpoint
$url = 'http://localhost/BIGMAN/bigman-react/backend/auth.php';

$data = [
    'action' => 'login',
    'username' => 'admin',
    'password' => 'admin123'
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Testing auth endpoint..." . PHP_EOL;
echo "URL: $url" . PHP_EOL;
echo "Request data: " . json_encode($data) . PHP_EOL;
echo "Response: $result" . PHP_EOL;

if ($result === FALSE) {
    echo "❌ Failed to connect to auth endpoint" . PHP_EOL;
} else {
    $response = json_decode($result, true);
    if ($response && isset($response['success'])) {
        if ($response['success']) {
            echo "✅ Authentication successful!" . PHP_EOL;
        } else {
            echo "❌ Authentication failed: " . ($response['message'] ?? 'Unknown error') . PHP_EOL;
        }
    } else {
        echo "❌ Invalid response format" . PHP_EOL;
    }
}
?>
