<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TwoFactorAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $twoFactorService;

    public function __construct(TwoFactorAuthService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    /**
     * @OA\Post(
     *     path="/auth/login",
     *     tags={"Authentication"},
     *     summary="Connexion utilisateur par email ou téléphone",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"identifier", "password"},
     *             @OA\Property(property="identifier", type="string", description="Email ou numéro de téléphone"),
     *             @OA\Property(property="password", type="string", format="password")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Connexion réussie ou 2FA requis")
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string', // Email ou téléphone
            'password' => 'required',
        ]);

        $identifier = $request->identifier;
        
        // Détecter si c'est un email ou un téléphone
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
        
        if ($isEmail) {
            $user = User::where('email', $identifier)->first();
            $channel = 'email';
            $contactInfo = $identifier;
        } else {
            // C'est un numéro de téléphone - chercher dans la table users ou via le moniteur/enfant lié
            $user = User::where('telephone', $identifier)->first();
            
            // Si pas trouvé, chercher via le téléphone du moniteur
            if (!$user) {
                $monitor = \App\Models\Monitor::where('telephone', $identifier)->first();
                if ($monitor) {
                    $user = User::where('user_type', 'monitor')->where('user_id', $monitor->id)->first();
                }
            }
            
            $channel = 'sms';
            $contactInfo = $identifier;
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Vérifier si le compte est actif
        if (isset($user->active) && !$user->active) {
            throw ValidationException::withMessages([
                'identifier' => ['Ce compte est désactivé.'],
            ]);
        }

        // Générer et envoyer le code 2FA selon le canal
        $this->twoFactorService->generateCode($user, $channel, $channel === 'sms' ? $contactInfo : null);

        $messageChannel = $channel === 'sms' ? 'votre téléphone' : 'votre email';

        return response()->json([
            'message' => "Code de vérification envoyé à {$messageChannel}.",
            'two_factor_required' => true,
            'channel' => $channel,
            'identifier' => $isEmail ? $user->email : $contactInfo // Pour le frontend
        ]);
    }

    /**
     * @OA\Post(
     *     path="/auth/verify-2fa",
     *     tags={"Authentication"},
     *     summary="Vérifier le code 2FA",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"identifier", "code"},
     *             @OA\Property(property="identifier", type="string", description="Email ou téléphone"),
     *             @OA\Property(property="code", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Token retourné")
     * )
     */
    public function verifyTwoFactor(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'code' => 'required|string|size:6',
        ]);

        $user = $this->findUserByIdentifier($request->identifier);

        if (!$user || !$this->twoFactorService->validateCode($user, $request->code)) {
            throw ValidationException::withMessages([
                'code' => ['Le code est invalide ou a expiré.'],
            ]);
        }

        $this->twoFactorService->clearCode($user);

        // Générer le token Sanctum
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Authentification réussie',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'telephone' => $user->telephone,
                'role' => strtoupper($user->user_type ?? 'USER'),
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/auth/resend-code",
     *     tags={"Authentication"},
     *     summary="Renvoyer le code 2FA",
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="identifier", type="string")))
     * )
     */
    public function resendCode(Request $request)
    {
        $request->validate(['identifier' => 'required|string']);
        
        $identifier = $request->identifier;
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
        
        $user = $this->findUserByIdentifier($identifier);
        
        if (!$user) {
            throw ValidationException::withMessages([
                'identifier' => ['Utilisateur non trouvé.'],
            ]);
        }
        
        $channel = $isEmail ? 'email' : 'sms';
        $this->twoFactorService->generateCode($user, $channel, $channel === 'sms' ? $identifier : null);
        
        return response()->json(['message' => 'Nouveau code envoyé']);
    }
    
    /**
     * Trouver un utilisateur par email ou téléphone
     */
    protected function findUserByIdentifier(string $identifier): ?User
    {
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
        
        if ($isEmail) {
            return User::where('email', $identifier)->first();
        }
        
        // Chercher par téléphone
        $user = User::where('telephone', $identifier)->first();
        
        if (!$user) {
            $monitor = \App\Models\Monitor::where('telephone', $identifier)->first();
            if ($monitor) {
                $user = User::where('user_type', 'monitor')->where('user_id', $monitor->id)->first();
            }
        }
        
        return $user;
    }

    /**
     * @OA\Post(path="/auth/logout", tags={"Authentication"}, summary="Déconnexion")
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }
    
    /**
     * @OA\Get(path="/auth/me", tags={"Authentication"}, summary="Utilisateur actuel")
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
