<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected string $apiUrl;
    protected string $apiId;
    protected string $apiPassword;
    protected string $senderId;

    public function __construct()
    {
        // Configuration SMS Dream Digital
        $this->apiUrl = config('services.sms.api_url', env('SMS_API_URL', 'https://api2.dream-digital.info/api/SendSMS'));
        $this->apiId = config('services.sms.api_id', env('SMS_API_ID', ''));
        $this->apiPassword = config('services.sms.api_password', env('SMS_API_PASSWORD', ''));
        $this->senderId = config('services.sms.sender_id', env('SMS_SENDER_ID', 'Church Management'));
    }

    /**
     * Envoyer un SMS via Dream Digital API
     */
    public function send(string $phoneNumber, string $message): bool
    {
        // Nettoyer le numéro de téléphone
        $phoneNumber = $this->formatPhoneNumber($phoneNumber);

        if (empty($phoneNumber)) {
            Log::warning('SMS: Numéro de téléphone invalide');
            return false;
        }

        Log::info("SMS: Tentative d'envoi à {$phoneNumber}");

        try {
            // Appel API Dream Digital
            $response = Http::get($this->apiUrl, [
                'api_id' => $this->apiId,
                'api_password' => $this->apiPassword,
                'sms_type' => 'T', // Texte
                'encoding' => 'T', // Text encoding
                'sender_id' => $this->senderId,
                'phonenumber' => $phoneNumber,
                'textmessage' => $message,
            ]);

            $responseBody = $response->body();
            
            // Dream Digital retourne généralement un code de succès
            if ($response->successful() && (str_contains($responseBody, 'OK') || str_contains($responseBody, 'success') || $response->status() === 200)) {
                Log::info("SMS envoyé à {$phoneNumber} - Response: {$responseBody}");
                return true;
            }

            Log::error("Échec envoi SMS à {$phoneNumber}: " . $responseBody);
            return false;

        } catch (\Exception $e) {
            Log::error("Erreur SMS: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Envoyer un code 2FA par SMS
     */
    public function sendTwoFactorCode(string $phoneNumber, string $code): bool
    {
        $message = "Votre code de connexion Church Management est: {$code}. Ce code expire dans 10 minutes.";
        return $this->send($phoneNumber, $message);
    }

    /**
     * Envoyer le mot de passe par défaut
     */
    public function sendDefaultPassword(string $phoneNumber, string $name, string $password): bool
    {
        $message = "Bienvenue {$name}! Votre compte Church Management a été créé. Mot de passe: {$password}";
        return $this->send($phoneNumber, $message);
    }

    /**
     * Formater le numéro de téléphone (format international sans +)
     */
    protected function formatPhoneNumber(string $phone): string
    {
        // Supprimer les espaces et caractères spéciaux
        $phone = preg_replace('/[^0-9+]/', '', $phone);

        // Supprimer le + au début si présent
        $phone = ltrim($phone, '+');

        // Si le numéro commence par 0, ajouter l'indicatif RDC (243)
        if (str_starts_with($phone, '0')) {
            $phone = '243' . substr($phone, 1);
        }

        return $phone;
    }
}
