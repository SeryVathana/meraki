<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function handleProviderCallback($provider)
    {
        $userSocial = Socialite::driver($provider)->stateless()->user();

        //split name into first and last name
        $fullName = explode(" ", $userSocial->getName());

        $user = User::updateOrCreate(
            [
                'provider_id' => $userSocial->getId(),
                'provider' => $provider,
            ],
            [
                'first_name' => $fullName[0],
                'last_name' => $fullName[1],
                'email' => $userSocial->getEmail(),
                'avatar' => $userSocial->getAvatar(),
                'pf_img_url' => $userSocial->getAvatar(),
                'password' => Hash::make(Str::random(16)), // Generate a random password
                'role' => "user", // Default role is "user
                'provider_token' => $userSocial->token,
                'provider_refresh_token' => $userSocial->refreshToken,
            ]
        );

        $token = $user->createToken('authToken')->plainTextToken;

        return redirect()->away('http://localhost:5173/login?token=' . $token);
    }
}
