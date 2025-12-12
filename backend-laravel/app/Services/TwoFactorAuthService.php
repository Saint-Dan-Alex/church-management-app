<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\TwoFactorEmailCode;
use Illuminate\Support\Facades\Hash;

class TwoFactorAuthService
{
    /**
     * Generate a new 2FA code for the user.
     */
    public function generateCode(User $user): void
    {
        $code = (string) mt_rand(100000, 999999);

        $user->forceFill([
            'two_factor_email_code' => Hash::make($code),
            'two_factor_expires_at' => now()->addMinutes(10),
        ])->save();

        // Send notification
        $user->notify(new TwoFactorEmailCode($code));
    }

    /**
     * Validate the provided 2FA code.
     */
    public function validateCode(User $user, string $code): bool
    {
        if (!$user->two_factor_email_code || !$user->two_factor_expires_at) {
            return false;
        }

        if ($user->two_factor_expires_at->isPast()) {
            return false;
        }

        if (!Hash::check($code, $user->two_factor_email_code)) {
            return false;
        }

        return true;
    }

    /**
     * Clear the 2FA code after successful verification.
     */
    public function clearCode(User $user): void
    {
        $user->forceFill([
            'two_factor_email_code' => null,
            'two_factor_expires_at' => null,
        ])->save();
    }
}
