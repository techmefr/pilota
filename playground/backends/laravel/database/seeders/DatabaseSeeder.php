<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name' => "User {$i}",
                'email' => "user{$i}@pilota.dev",
            ]);

            for ($j = 1; $j <= 3; $j++) {
                Post::create([
                    'user_id' => $user->id,
                    'title' => "Post {$j} from {$user->name}",
                    'content' => "Content of post {$j} written by {$user->name}.",
                ]);
            }
        }
    }
}
