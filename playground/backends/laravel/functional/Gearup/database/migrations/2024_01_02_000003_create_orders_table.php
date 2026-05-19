<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('ref')->unique();
            $table->enum('type', ['hardware', 'parts', 'consumable']);
            $table->string('item');
            $table->integer('quantity');
            $table->string('reason');
            $table->string('requested_by');
            $table->enum('status', ['pending', 'approved', 'ordered', 'delivered'])->default('pending');
            $table->date('created_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
