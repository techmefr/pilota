<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_orders', function (Blueprint $table) {
            $table->id();
            $table->string('stripe_session_id')->nullable()->unique();
            $table->string('stripe_payment_intent_id')->nullable();
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->string('full_name');
            $table->string('email');
            $table->string('address');
            $table->string('city');
            $table->string('zip_code', 10);
            $table->string('phone')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_orders');
    }
};
