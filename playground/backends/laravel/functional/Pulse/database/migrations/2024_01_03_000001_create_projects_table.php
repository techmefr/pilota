<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('status', ['ok', 'warning', 'critical', 'inactive'])->default('ok');
            $table->integer('open_bugs')->default(0);
            $table->json('deployments');
            $table->string('team');
            $table->string('url')->nullable();
            $table->integer('sentry_issues')->default(0);
            $table->integer('sentry_criticals')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
