<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$product = Product::inRandomOrder()->first();
		$quantity = fake()->numberBetween(1, 5);
		$price = $product ? $product->price : fake()->randomFloat(0, 100000, 10000000);
		$total = $price * $quantity;

		return [
			'order_id' => Order::inRandomOrder()->first()?->id ?? 1,
			'product_id' => $product?->id ?? 1,
			'quantity' => $quantity,
			'price' => $price,
			'total' => $total,
			'created_at' => now(),
			'updated_at' => now(),
		];
	}
}
