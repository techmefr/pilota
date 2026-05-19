<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['warranty', 'age', 'performance', 'security']);
            $table->enum('severity', ['critical', 'warning', 'info']);
            $table->string('device');
            $table->string('serial');
            $table->string('employee');
            $table->text('description');
            $table->date('due_date');
            $table->enum('status', ['active', 'acknowledged', 'resolved'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
