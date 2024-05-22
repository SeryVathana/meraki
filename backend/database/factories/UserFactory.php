<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->name(),
            'last_name' => fake()->name(),
            'username' => $this->fake()->unique()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => "admin",
            'pf_img_url' => "https://i.pinimg.com/736x/2f/21/94/2f21940ee0948af25337e339d4899c36.jpg",
            'social_login_info' => "{'id': 1, 'token': 'asdasdasd'}",
            'followers' => "[1, 2, 3]",
            'followings' => "[1, 2, 3]",
            'remember_token' => Str::random(10),
        ];
    }
}
