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
     * Get random images from actual storage folder
     */
    private function getRandomImages(): array
    {
        $categories = [
            'laptops' => 64,
            'headphones' => 3,
            'keyboards' => 2,
            'mouses' => 21,
            'speakers' => 2,
            'ssd' => 1,
        ];

        // Pick a random category
        $category = fake()->randomElement(array_keys($categories));
        $storagePath = storage_path("app/public/products/$category");

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
            $images[] = "http://localhost:8000/storage/products/$category/$filename";
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

        // Get random images from actual storage
        $images = $this->getRandomImages();

        $price = fake()->randomFloat(0, 500000, 50000000);

        return [
            'name' => $name,
            'description' => fake()->paragraph(3),
            'price' => $price,
            'image_url' => json_encode($images),
            'category_id' => Category::inRandomOrder()->first()?->id ?? 1,
            'brand_id' => Brand::inRandomOrder()->first()?->id ?? 1,
            'promotion_id' => fake()->boolean(30) ? Promotion::inRandomOrder()->first()?->id : null,
            'stock_quantity' => fake()->numberBetween(0, 200),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'updated_at' => now(),
        ];
    }
}
