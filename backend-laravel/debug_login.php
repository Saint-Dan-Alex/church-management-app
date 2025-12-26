<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate request data
$email = 'random_invalid_email@test.com'; // Should fail
$password = 'wrongpassword';

echo "Testing login with: $email / $password\n";

$user = User::where('email', $email)->first();

if (!$user) {
    echo "User not found (CORRECT).\n";
} else {
    echo "User FOUND: " . $user->email . " (ID: " . $user->id . ")\n";
    if (Hash::check($password, $user->password)) {
        echo "Password MATCH (CRITICAL ERROR if password is wrong!)\n";
    } else {
        echo "Password mismatch (CORRECT).\n";
    }
}

// Test with valid admin email if known (assuming admin@eglise.com from screenshot placeholder)
// Finding the admin user
$admin = User::where('id', 1)->first();
if ($admin) {
    echo "\nTesting with Admin email: " . $admin->email . " and WRONG password...\n";
    if (Hash::check('wrong', $admin->password)) {
        echo "Password MATCH (CRITICAL ERROR!)\n";
    } else {
        echo "Password mismatch (CORRECT).\n";
    }
}
