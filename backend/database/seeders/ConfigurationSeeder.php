<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('configurations')->insert([
            [
                'logo' => 'http://localhost:8000/storage/logo/vynx-logo.png',
                'name' => 'Vynx E-commerce',
                'email' => 'contact@vynx.com',
                'phone' => '0123456789',
                'address' => '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'logo' => 'http://localhost:8000/storage/logo/vynx-logo.png',
                'name' => 'Vynx E-commerce Dark',
                'email' => 'support@vynx.com',
                'phone' => '0987654321',
                'address' => '456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'logo' => 'http://localhost:8000/storage/logo/vynx-logo.png',
                'name' => 'Vynx Flash Sale',
                'email' => 'sale@vynx.com',
                'phone' => '0369852147',
                'address' => '789 Đường Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'logo' => 'http://localhost:8000/storage/logo/vynx-logo.png',
                'name' => 'Vynx Mobile',
                'email' => 'mobile@vynx.com',
                'phone' => '0258147963',
                'address' => '321 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
