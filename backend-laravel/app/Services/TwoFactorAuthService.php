<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\TwoFactorEmailCode;
use Illuminate\Support\Facades\Hash;

class TwoFactorAuthService
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    /**
     * Generate a new 2FA code for the user.
     * @param User $user
     * @param string $channel 'email' or 'sms'
     * @param string|null $phoneNumber Phone number if channel is 'sms'
     */
    public function generateCode(User $user, string $channel = 'email', ?string $phoneNumber = null): void
    {
        $code = (string) mt_rand(100000, 999999);

        $user->forceFill([
            'two_factor_email_code' => Hash::make($code),
            'two_factor_expires_at' => now()->addMinutes(10),
            'two_factor_channel' => $channel, // Stocker le canal utilisé
        ])->save();

        // Envoyer selon le canal
        if ($channel === 'sms' && $phoneNumber) {
            $this->smsService->sendTwoFactorCode($phoneNumber, $code);
        } else {
            // Par défaut, envoyer par email
            $user->notify(new TwoFactorEmailCode($code));
        }
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
            'two_factor_channel' => null,
        ])->save();
    }
}

