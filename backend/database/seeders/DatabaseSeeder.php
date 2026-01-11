<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed data theo thứ tự phù hợp với foreign key constraints

        // 1. Các bảng cơ bản không phụ thuộc
        $this->call([
            BrandSeeder::class,
            CategorySeeder::class,
            AttributeSeeder::class,
            PromotionSeeder::class,
            ConfigurationSeeder::class,
            SlideshowSeeder::class,
        ]);

        // 2. Users và địa chỉ
        $this->call([
            UserSeeder::class,
            UserAddressSeeder::class,
            SupportRequestSeeder::class,
        ]);

        // 3. Products và relations
        $this->call([
            CategoryAttributeSeeder::class,
            ProductSeeder::class,
            ProductAttributeValueSeeder::class,
        ]);

        // 4. Shopping carts và Orders
        $this->call([
            ShoppingCartSeeder::class,
            CartItemSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            ProductReviewSeeder::class,
        ]);

        // 5. (Optional) Generate thêm dữ liệu sử dụng factories
        // Uncomment dòng dưới nếu muốn thêm nhiều dữ liệu test
        // $this->call([
        // 	FactoryDataSeeder::class,
        // ]);
    }
}
