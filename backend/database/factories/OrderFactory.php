<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
		$paymentMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cod'];
		$paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

		$status = fake()->randomElement($statuses);
		$paymentStatus = $status === 'cancelled' ? 'refunded' : ($status === 'pending' ? 'pending' : 'paid');

		$subtotal = fake()->randomFloat(0, 500000, 20000000);
		$tax = $subtotal * 0.1;
		$shippingFee = fake()->randomElement([0, 30000, 50000, 100000]);
		$discount = fake()->boolean(30) ? fake()->randomFloat(0, 0, $subtotal * 0.3) : 0;
		$total = $subtotal + $tax + $shippingFee - $discount;

		return [
			'user_id' => User::inRandomOrder()->first()?->id ?? 1,
			'order_number' => 'ORD-' . fake()->unique()->numerify('######'),
			'status' => $status,
			'payment_method' => fake()->randomElement($paymentMethods),
			'payment_status' => $paymentStatus,
			'subtotal' => $subtotal,
			'tax' => $tax,
			'shipping_fee' => $shippingFee,
			'discount' => $discount,
			'total' => $total,
			'shipping_address' => fake()->address(),
			'shipping_city' => fake()->city(),
			'shipping_district' => fake()->citySuffix(),
			'shipping_ward' => fake()->streetSuffix(),
			'shipping_phone' => fake()->phoneNumber(),
			'notes' => fake()->boolean(30) ? fake()->sentence() : null,
			'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
			'updated_at' => now(),
		];
	}
}
