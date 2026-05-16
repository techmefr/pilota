<?php

namespace Functional\Users\Database\Seeders;

use Functional\Users\Models\Post;
use Functional\Users\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
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
