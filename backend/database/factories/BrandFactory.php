<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Apple', 'Samsung', 'Sony', 'LG', 'Corsair', 'Kingston', 'Western Digital', 'Seagate', 'Logitech', 'Razer', 'SteelSeries', 'HyperX'];
        $name = fake()->unique()->randomElement($brands);
        $slug = Str::slug($name);

        return [
            'name' => $name,
            'description' => fake()->sentence(10),
            'logo_url' => 'http://localhost:8000/storage/brands/' . strtolower($slug) . '.png',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
