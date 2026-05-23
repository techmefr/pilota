<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('week_infos', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['event', 'devtalk', 'score', 'news']);
            $table->string('title');
            $table->text('detail')->nullable();
            $table->date('date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('week_infos');
    }
};
