<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Group;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'group_id' => Group::factory(),
            'title' => fake()->title(),
            'description' => fake()->description(),
            'tag' => Tag::factory(),
            'img_url' => "https://i.pinimg.com/564x/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg",
            'status' => "public",
            'likes' => "[1, 2, 3]"
        ];
    }
}
