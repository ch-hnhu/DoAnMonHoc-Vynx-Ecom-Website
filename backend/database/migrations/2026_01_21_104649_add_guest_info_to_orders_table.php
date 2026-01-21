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
		Schema::table('orders', function (Blueprint $table) {
			$table->unsignedBigInteger('user_id')->nullable()->change();
			$table->unsignedBigInteger('address_id')->nullable()->change();

			// Add shipping info columns
			$table->string('shipping_name')->nullable()->after('address_id');
			$table->string('shipping_phone')->nullable()->after('shipping_name');
			$table->string('shipping_email')->nullable()->after('shipping_phone');
			$table->text('shipping_address')->nullable()->after('shipping_email');
			$table->text('shipping_note')->nullable()->after('shipping_address');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::table('orders', function (Blueprint $table) {
			$table->unsignedBigInteger('user_id')->nullable(false)->change();
			$table->unsignedBigInteger('address_id')->nullable(false)->change();

			$table->dropColumn([
				'shipping_name',
				'shipping_phone',
				'shipping_email',
				'shipping_address',
				'shipping_note',
			]);
		});
	}
};
