<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryAttributeSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$mappings = [
			// Laptop (category_id = 2)
			['category_id' => 2, 'attribute_id' => 3, 'used_for_variant' => false],  // CPU
			['category_id' => 2, 'attribute_id' => 4, 'used_for_variant' => false],  // RAM
			['category_id' => 2, 'attribute_id' => 5, 'used_for_variant' => false],  // Ổ cứng
			['category_id' => 2, 'attribute_id' => 6, 'used_for_variant' => false],  // Kích thước màn hình
			['category_id' => 2, 'attribute_id' => 7, 'used_for_variant' => false],  // Card đồ họa
			['category_id' => 2, 'attribute_id' => 8, 'used_for_variant' => false],  // Độ phân giải
			['category_id' => 2, 'attribute_id' => 1, 'used_for_variant' => true],   // Màu sắc
			['category_id' => 2, 'attribute_id' => 2, 'used_for_variant' => true],   // Dung lượng

			// Tai nghe (category_id = 4)
			['category_id' => 4, 'attribute_id' => 9, 'used_for_variant' => false],  // Loại kết nối
			['category_id' => 4, 'attribute_id' => 10, 'used_for_variant' => false], // Driver
			['category_id' => 4, 'attribute_id' => 11, 'used_for_variant' => false], // Tần số
			['category_id' => 4, 'attribute_id' => 12, 'used_for_variant' => false], // Micro
			['category_id' => 4, 'attribute_id' => 1, 'used_for_variant' => true],   // Màu sắc

			// Chuột (category_id = 5)
			['category_id' => 5, 'attribute_id' => 9, 'used_for_variant' => false],  // Loại kết nối
			['category_id' => 5, 'attribute_id' => 13, 'used_for_variant' => false], // DPI
			['category_id' => 5, 'attribute_id' => 14, 'used_for_variant' => false], // Số nút bấm
			['category_id' => 5, 'attribute_id' => 16, 'used_for_variant' => false], // LED
			['category_id' => 5, 'attribute_id' => 1, 'used_for_variant' => true],   // Màu sắc

			// Bàn phím (category_id = 6)
			['category_id' => 6, 'attribute_id' => 9, 'used_for_variant' => false],  // Loại kết nối
			['category_id' => 6, 'attribute_id' => 15, 'used_for_variant' => false], // Kiểu switch
			['category_id' => 6, 'attribute_id' => 16, 'used_for_variant' => false], // LED
			['category_id' => 6, 'attribute_id' => 1, 'used_for_variant' => true],   // Màu sắc

			// Lót chuột (category_id = 7)
			['category_id' => 7, 'attribute_id' => 1, 'used_for_variant' => true],   // Màu sắc

			// RAM (category_id = 8)
			['category_id' => 8, 'attribute_id' => 4, 'used_for_variant' => false],  // RAM (capacity)
			['category_id' => 8, 'attribute_id' => 17, 'used_for_variant' => false], // Bus RAM
			['category_id' => 8, 'attribute_id' => 18, 'used_for_variant' => false], // Loại RAM
			['category_id' => 8, 'attribute_id' => 2, 'used_for_variant' => true],   // Dung lượng

			// Ổ cứng SSD (category_id = 9)
			['category_id' => 9, 'attribute_id' => 19, 'used_for_variant' => false], // Dung lượng lưu trữ
			['category_id' => 9, 'attribute_id' => 20, 'used_for_variant' => false], // Chuẩn kết nối
			['category_id' => 9, 'attribute_id' => 21, 'used_for_variant' => false], // Tốc độ đọc
			['category_id' => 9, 'attribute_id' => 22, 'used_for_variant' => false], // Tốc độ ghi
			['category_id' => 9, 'attribute_id' => 2, 'used_for_variant' => true],   // Dung lượng

			// Card màn hình VGA (category_id = 10)
			['category_id' => 10, 'attribute_id' => 4, 'used_for_variant' => false], // RAM (VRAM)
			['category_id' => 10, 'attribute_id' => 17, 'used_for_variant' => false], // Bus (memory bus)
		];

		foreach ($mappings as $mapping) {
			DB::table('category_attributes')->insert([
				'category_id' => $mapping['category_id'],
				'attribute_id' => $mapping['attribute_id'],
				'used_for_variant' => $mapping['used_for_variant'],
				'created_at' => now(),
				'updated_at' => now(),
			]);
		}
	}
}
