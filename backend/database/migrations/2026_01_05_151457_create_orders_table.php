<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('promotion_id')->nullable()->constrained();
            $table->foreignId('address_id')->constrained('user_addresses');
            $table->decimal('subtotal_amount', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('shipping_fee', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->enum('payment_method', ['cod', 'vnpay']);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded', 'cancelled']);
            $table->enum('delivery_method', ['standard', 'express']);
            $table->enum('delivery_status', ['pending', 'confirmed', 'shipping', 'delivered', 'failed', 'returned', 'cancelled']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
