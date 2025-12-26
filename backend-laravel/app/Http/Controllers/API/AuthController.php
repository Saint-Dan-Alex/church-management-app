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
     *     summary="Connexion utilisateur",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", format="password")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Connexion réussie ou 2FA requis", @OA\JsonContent(oneOf={
     *         @OA\Schema(properties={@OA\Property(property="token", type="string")}),
     *         @OA\Schema(properties={@OA\Property(property="two_factor_required", type="boolean"), @OA\Property(property="message", type="string")})
     *     }))
     * )
     */
    public function login(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('LOGIN ATTEMPT', [
            'input' => $request->all(),
            'ip' => $request->ip()
        ]);

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        \Illuminate\Support\Facades\Log::info('USER LOOKUP', [
            'email_searched' => $request->email,
            'user_found' => $user ? $user->id : 'NULL',
        ]);

        if (! $user || ! Hash::check($request->password, $user->password)) {
            \Illuminate\Support\Facades\Log::warning('LOGIN FAILED', [
                'user_exists' => (bool)$user,
                'hash_check' => $user ? Hash::check($request->password, $user->password) : 'N/A'
            ]);
            
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }
        
        \Illuminate\Support\Facades\Log::info('LOGIN SUCCESS - 2FA Generation');

        // Logic 2FA : Toujours activé
        $this->twoFactorService->generateCode($user);

        return response()->json([
            'message' => 'Code de vérification envoyé à votre email.',
            'two_factor_required' => true,
            'email' => $user->email // Utile pour le frontend
        ]);
        
        // Note: Si on voulait désactiver la 2FA, on retournerait le token ici :
        // $token = $user->createToken('auth-token')->plainTextToken;
        // return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * @OA\Post(
     *     path="/auth/verify-2fa",
     *     tags={"Authentication"},
     *     summary="Vérifier le code 2FA",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "code"},
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="code", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Token retourné")
     * )
     */
    public function verifyTwoFactor(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! $this->twoFactorService->validateCode($user, $request->code)) {
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
                'role' => strtoupper($user->user_type ?? 'USER'),
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/auth/resend-code",
     *     tags={"Authentication"},
     *     summary="Renvoyer le code 2FA",
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="email", type="string")))
     * )
     */
    public function resendCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        $user = User::where('email', $request->email)->firstOrFail();
        
        $this->twoFactorService->generateCode($user);
        
        return response()->json(['message' => 'Nouveau code envoyé']);
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
