<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Post::create([
            'title' => 'Highlighted Post',
            'content' => 'This is the highlighted post.',
            'is_highlighted' => true,
        ]);

        Post::create([
            'title' => 'Latest Post',
            'content' => 'This is the latest post.',
            'created_at' => now(),
        ]);
    }
}
