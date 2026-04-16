<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$recaptcha = $data['recaptcha'] ?? '';

// Validation
if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
    exit;
}

// Verify reCAPTCHA
$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
$verifyData = [
    'secret' => RECAPTCHA_SECRET,
    'response' => $recaptcha
];

$options = [
    'http' => [
        'method' => 'POST',
        'content' => http_build_query($verifyData)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($verifyUrl, false, $context);
$captcha = json_decode($result);

if (!$captcha->success) {
    echo json_encode(['success' => false, 'message' => 'CAPTCHA verification failed']);
    exit;
}

// Hash password
$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $hash]);
    
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} catch (PDOException $e) {
    if ($e->errorInfo[1] == 1062) {
        echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
}
?>