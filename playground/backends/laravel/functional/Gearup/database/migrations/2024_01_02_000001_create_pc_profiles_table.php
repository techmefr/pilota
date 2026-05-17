<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pc_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('role');
            $table->string('model_tier');
            $table->string('model_name');
            $table->string('cpu');
            $table->string('ram');
            $table->string('storage');
            $table->string('gpu');
            $table->integer('screens');
            $table->string('screen_spec');
            $table->string('profile_ram');
            $table->integer('total');
            $table->integer('stock');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pc_profiles');
    }
};
