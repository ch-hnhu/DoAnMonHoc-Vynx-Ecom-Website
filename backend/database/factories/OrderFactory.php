<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Promotion;

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
		$paymentMethods = ['vnpay', 'cod'];  // Chỉ có 2 options theo migration
		$paymentStatuses = ['pending', 'paid', 'failed'];
		$deliveryMethods = ['standard', 'express'];
		$deliveryStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

		// Random user with address
		$user = User::where('role', 'customer')->inRandomOrder()->first();
		$address = $user ? UserAddress::where('user_id', $user->id)->inRandomOrder()->first() : null;

		// Random có promotion không (30% chance)
		$promotion = fake()->boolean(30) ? Promotion::inRandomOrder()->first() : null;

		// Tính toán số tiền
		$subtotal = fake()->randomFloat(0, 500000, 50000000);
		$discount = 0;

		if ($promotion) {
			if ($promotion->discount_type === 'percentage') {
				$discount = $subtotal * ($promotion->discount_value / 100);
			} else {
				$discount = $promotion->discount_value;
			}
		}

		$shippingFee = fake()->randomElement([0, 30000, 50000]);
		$total = $subtotal - $discount + $shippingFee;

		// Payment và delivery status logic
		$paymentMethod = fake()->randomElement($paymentMethods);
		$deliveryStatus = fake()->randomElement($deliveryStatuses);

		// Nếu đã delivered thì phải paid
		$paymentStatus = in_array($deliveryStatus, ['delivered', 'shipping'])
			? 'paid'
			: ($paymentMethod === 'cod' ? 'pending' : fake()->randomElement($paymentStatuses));

		return [
			'user_id' => $user?->id ?? 1,
			'promotion_id' => $promotion?->id,
			'address_id' => $address?->id ?? 1,
			'subtotal_amount' => $subtotal,
			'discount_amount' => $discount,
			'shipping_fee' => $shippingFee,
			'total_amount' => $total,
			'payment_method' => $paymentMethod,
			'payment_status' => $paymentStatus,
			'delivery_method' => fake()->randomElement($deliveryMethods),
			'delivery_status' => $deliveryStatus,
			'shipping_name' => $user?->full_name ?? fake()->name(),
			'shipping_phone' => $user?->phone ?? '0' . fake()->numerify('#########'),
			'shipping_email' => $user?->email ?? fake()->email(),
			'shipping_address' => $address ?
				"{$address->address_line}, {$address->ward}, {$address->district}, {$address->city}" :
				fake()->address(),
			'shipping_note' => fake()->boolean(20) ? fake()->sentence() : null,
			'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
			'updated_at' => now(),
		];
	}
}
