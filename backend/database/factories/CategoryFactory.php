<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$categories = [
			'Laptops',
			'Desktops',
			'Monitors',
			'Keyboards',
			'Mice',
			'Headphones',
			'Speakers',
			'Webcams',
			'Microphones',
			'RAM',
			'SSD',
			'HDD',
			'Graphics Cards',
			'Processors',
			'Motherboards',
			'Power Supplies',
			'Cases',
			'Cooling',
			'Networking',
			'Cables'
		];
		$name = fake()->unique()->randomElement($categories);
		$slug = Str::slug($name);

		return [
			'name' => $name,
			'slug' => $slug,
			'description' => fake()->sentence(15),
			'parent_id' => null,
			'created_at' => now(),
			'updated_at' => now(),
		];
	}
}
