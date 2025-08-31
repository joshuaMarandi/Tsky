<?php
// Test the auth endpoint directly
$url = 'http://localhost/BIGMAN/bigman-react/backend/auth.php';

$data = [
    'action' => 'login',
    'username' => 'admin',
    'password' => 'admin123'
];

$postData = json_encode($data);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($postData)
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

echo "Testing auth endpoint..." . PHP_EOL;
echo "URL: $url" . PHP_EOL;
echo "Data: $postData" . PHP_EOL . PHP_EOL;

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Code: $httpCode" . PHP_EOL;
echo "Response: $response" . PHP_EOL;

if (curl_errno($ch)) {
    echo "cURL Error: " . curl_error($ch) . PHP_EOL;
}

curl_close($ch);

// Try to decode JSON
$decoded = json_decode($response, true);
if ($decoded) {
    echo PHP_EOL . "Decoded response:" . PHP_EOL;
    print_r($decoded);
} else {
    echo PHP_EOL . "Response is not valid JSON" . PHP_EOL;
}
?>
