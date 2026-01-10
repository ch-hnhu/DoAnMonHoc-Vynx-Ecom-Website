<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'MSI Gaming GF63 Thin',
                'slug' => 'msi-gaming-gf63-thin',
                'description' => 'Laptop gaming mỏng nhẹ với card đồ họa NVIDIA GeForce GTX 1650, màn hình 15.6 inch Full HD 120Hz',
                'price' => 19990000,
                'image_url' => json_encode([
                    'http://localhost:8000/storage/products/laptops/1-251027012518.png',
                    'http://localhost:8000/storage/products/laptops/1-251027014616.png',
                    'http://localhost:8000/storage/products/laptops/1-251027015412.png'
                ]),
                'category_id' => 2, // Laptop
                'brand_id' => 5, // MSI
                'promotion_id' => 1, // NEWYEAR2026
                'stock_quantity' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Acer Aspire 5',
                'slug' => 'acer-aspire-5',
                'description' => 'Laptop văn phòng với hiệu năng ổn định, màn hình 15.6 inch Full HD',
                'price' => 15990000,
                'image_url' => json_encode([
                    'http://localhost:8000/storage/products/laptops/25p2312-250205033859.png',
                    'http://localhost:8000/storage/products/laptops/80gg93-250205032448.png'
                ]),
                'category_id' => 2, // Laptop
                'brand_id' => 2, // Acer
                'promotion_id' => null,
                'stock_quantity' => 40,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dell XPS 15',
                'slug' => 'dell-xps-15',
                'description' => 'Laptop cao cấp cho dân văn phòng và sáng tạo nội dung, màn hình 4K OLED, Intel Core i7 thế hệ 13',
                'price' => 45990000,
                'image_url' => json_encode([
                    'http://localhost:8000/storage/products/laptops/laptop-dell-15-dc15250-71071928-intel-core-i5-1334-251021085652.png',
                    'http://localhost:8000/storage/products/laptops/laptop-dell-15-dc15250-71073959-intel-core-i7-1355-251021100434.png',
                    'http://localhost:8000/storage/products/laptops/laptop-dell-15-dc15250-71084746-i5-1334u-16gb-512gb-ssd-15-6-inch-fhd-120hz-win-11-office-silver-260108112747.jpg',
                    'http://localhost:8000/storage/products/laptops/laptop-dell-15-dc15250-dc5i5357w1-intel-core-i5-13-251021084544.png'
                ]),
                'category_id' => 2, // Laptop
                'brand_id' => 4, // Dell
                'promotion_id' => null,
                'stock_quantity' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'slug' => 'sony-wh-1000xm5',
                'description' => 'Tai nghe chống ồn tốt nhất thế giới, âm thanh Hi-Res, pin 30 giờ, kết nối đa điểm',
                'price' => 8990000,
                'image_url' => json_encode([
                    'http://localhost:8000/storage/products/headphones/tai-nghe-chup-tai 06.39.01.png',
                    'http://localhost:8000/storage/products/headphones/tai-nghe-khong-day 06.39.01.png'
                ]),
                'category_id' => 4, // Tai nghe
                'brand_id' => 3, // Sony
                'promotion_id' => 3, // SUMMER20
                'stock_quantity' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'RAM Kingston NV1 1TB M.2 NVMe SSD',
                'slug' => 'ram-kingston-nv1-1tb-m2-nvme-ssd',
                'description' => 'Kingston Fury Beast Black có khả năng tự động ép xung với tần số lên đến 3200 MHz và độ trễ thấp, CL16-18-18. Theo đó khả năng hoạt động tương thích  bộ vi xử lý Intel XMP sẽ tăng lên đáng kể, mang đến sự mượt mà cho những tác vụ nặng trên thiết bị.',
                'price' => 2490000,
                'image_url' => json_encode([
                    'http://localhost:8000/storage/products/ram/group_265_4_.webp',
                    'http://localhost:8000/storage/products/ram/ram-kingston-ddr5-5600mhz-16gb-kvr56s46bs8-16wp_1_.webp'
                ]),
                'category_id' => 8, // Ram
                'brand_id' => 1, // Kingston
                'promotion_id' => null,
                'stock_quantity' => 75,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
