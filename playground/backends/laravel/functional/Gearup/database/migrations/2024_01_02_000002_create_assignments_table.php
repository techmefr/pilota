<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('employee');
            $table->string('email');
            $table->string('team');
            $table->string('department');
            $table->string('model');
            $table->string('serial');
            $table->date('assigned_at');
            $table->enum('status', ['active', 'repair', 'returned'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
