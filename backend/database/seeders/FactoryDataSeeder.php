<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Order;
use App\Models\OrderItem;

class FactoryDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seeder này sử dụng factories để generate nhiều dữ liệu test
     */
    public function run(): void
    {
        // Tạo thêm users
        $this->command->info('Creating 20 users...');
        User::factory(20)->create();

        // Tạo nhiều products sử dụng factory
        $this->command->info('Creating 50 products...');
        Product::factory(50)->create();

        // Tạo reviews cho products
        $this->command->info('Creating 100 product reviews...');
        ProductReview::factory(100)->create();

        $this->command->info('Factory data seeding completed successfully!');
    }
}
