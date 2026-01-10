<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('brands')->insert([
            [
                'name' => 'Kingston',
                'logo_url' => 'http://localhost:8000/storage/brands/kingston.png',
                'description' => 'Thương hiệu nổi tiếng về linh kiện máy tính và thiết bị chơi game hiệu suất cao',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Acer',
                'logo_url' => 'http://localhost:8000/storage/brands/acer.png',
                'description' => 'Tập đoàn công nghệ Đài Loan chuyên sản xuất máy tính và thiết bị điện tử tiêu dùng',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sony',
                'logo_url' => 'http://localhost:8000/storage/brands/sony.png',
                'description' => 'Tập đoàn công nghệ Nhật Bản nổi tiếng với các sản phẩm điện tử giải trí và âm thanh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dell',
                'logo_url' => 'http://localhost:8000/storage/brands/dell.png',
                'description' => 'Công ty máy tính hàng đầu chuyên về laptop, desktop và giải pháp doanh nghiệp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MSI',
                'logo_url' => 'http://localhost:8000/storage/brands/msi.png',
                'description' => 'Công ty hàng đầu về sản xuất laptop gaming và linh kiện máy tính hiệu suất cao',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
