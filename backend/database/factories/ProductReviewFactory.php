<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductReview>
 */
class ProductReviewFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$rating = fake()->numberBetween(1, 5);

		$reviews = [
			1 => ['Terrible product', 'Waste of money', 'Very disappointed', 'Do not buy'],
			2 => ['Below expectations', 'Not worth it', 'Poor quality', 'Could be better'],
			3 => ['Average product', 'It\'s okay', 'Decent for the price', 'Nothing special'],
			4 => ['Good product', 'Happy with purchase', 'Works well', 'Recommended'],
			5 => ['Excellent!', 'Amazing quality', 'Best purchase ever', 'Highly recommended', 'Perfect!']
		];

		$comment = fake()->randomElement($reviews[$rating]) . '. ' . fake()->sentence(10);

		return [
			'product_id' => Product::inRandomOrder()->first()?->id ?? 1,
			'user_id' => User::inRandomOrder()->first()?->id ?? 1,
			'order_id' => Order::inRandomOrder()->first()?->id ?? 1,
			'rating' => $rating,
			'content' => $comment,
			'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
			'updated_at' => now(),
		];
	}
}
