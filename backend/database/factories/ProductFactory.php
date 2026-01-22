<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Promotion;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
	/**
	 * Map category ID to image folder
	 */
	private function getCategoryImageFolder(int $categoryId): string
	{
		// Map category IDs to image folders
		// Based on CategorySeeder:
		// 1: Linh kiện máy tính, 2: Laptop, 3: Phụ kiện
		// 4: Tai nghe, 5: Chuột, 6: Bàn phím, 7: Lót chuột
		// 8: Ram, 9: Ổ cứng SSD, 10: Card màn hình VGA
		$categoryMap = [
			2 => 'laptops',       // Laptop
			4 => 'headphones',    // Tai nghe
			5 => 'mouses',        // Chuột
			6 => 'keyboards',     // Bàn phím
			7 => 'mouses',        // Lót chuột -> use mouses as fallback
			8 => 'ram',           // Ram
			9 => 'ssd',           // Ổ cứng SSD
			10 => 'laptops',      // Card màn hình VGA -> use laptops as fallback
		];

		// Default to laptops if category not mapped
		return $categoryMap[$categoryId] ?? 'laptops';
	}

	/**
	 * Get random images from actual storage folder based on category
	 */
	private function getRandomImages(int $categoryId): array
	{
		$imageFolder = $this->getCategoryImageFolder($categoryId);
		$storagePath = storage_path("app/public/products/$imageFolder");

		if (!is_dir($storagePath)) {
			return ["http://localhost:8000/storage/products/laptops/1-251027012518.png"];
		}

		// Get all image files
		$files = glob($storagePath . '/*.{png,jpg,jpeg,webp}', GLOB_BRACE);

		if (empty($files)) {
			return ["http://localhost:8000/storage/products/laptops/1-251027012518.png"];
		}

		// Shuffle and pick random number of images (1-4)
		shuffle($files);
		$numImages = fake()->numberBetween(1, min(4, count($files)));
		$selectedFiles = array_slice($files, 0, $numImages);

		// Convert to URLs
		$images = [];
		foreach ($selectedFiles as $file) {
			$filename = basename($file);
			$images[] = "http://localhost:8000/storage/products/$imageFolder/$filename";
		}

		return $images;
	}

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		$productTypes = [
			'Laptop',
			'Desktop',
			'Monitor',
			'Keyboard',
			'Mouse',
			'Headphones',
			'Speakers',
			'Webcam',
			'Microphone',
			'RAM',
			'SSD',
			'HDD',
			'Graphics Card',
			'Processor',
			'Motherboard'
		];

		$adjectives = ['Gaming', 'Professional', 'Ultra', 'Premium', 'Budget', 'Wireless', 'Mechanical', 'RGB', 'Silent', 'Portable'];

		$type = fake()->randomElement($productTypes);
		$adjective = fake()->randomElement($adjectives);
		$model = fake()->bothify('??-####');
		$name = trim("$adjective $type $model");
		$slug = Str::slug($name);

		// Select category first
		$categoryId = Category::inRandomOrder()->first()?->id ?? 1;

		// Get images based on the selected category
		$images = $this->getRandomImages($categoryId);

		$price = fake()->randomFloat(0, 500000, 50000000);

		return [
			'name' => $name,
			'slug' => $slug,
			'description' => fake()->paragraph(3),
			'price' => $price,
			'image_url' => $images,
			'category_id' => $categoryId,
			'brand_id' => Brand::inRandomOrder()->first()?->id ?? 1,
			'promotion_id' => fake()->boolean(30) ? Promotion::inRandomOrder()->first()?->id : null,
			'stock_quantity' => fake()->numberBetween(0, 200),
			'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
			'updated_at' => now(),
		];
	}
}
