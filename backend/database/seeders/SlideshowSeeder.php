<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SlideshowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('slideshows')->insert([
            [
                'title' => 'Khuyến mãi Tết Nguyên Đán 2026',
                'image_url' => 'http://localhost:8000/storage/slideshows/newyear-banner.jpg',
                'link_url' => '/promotions/newyear2026',
                'position' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'MSI Gaming GF63 Thin - Laptop Gaming Sinh Viên',
                'image_url' => 'http://localhost:8000/storage/slideshows/msi-gf63-banner.jpg',
                'link_url' => '/products/msi-gaming-gf63-thin',
                'position' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Laptop Dell XPS 15 - Cao cấp cho dân sáng tạo',
                'image_url' => 'http://localhost:8000/storage/slideshows/dell-xps-sale.jpg',
                'link_url' => '/products/dell-xps-15',
                'position' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tai nghe Sony WH-1000XM5 - Chống ồn hoàn hảo',
                'image_url' => 'http://localhost:8000/storage/slideshows/sony-headphone.jpg',
                'link_url' => '/products/sony-wh-1000xm5',
                'position' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
