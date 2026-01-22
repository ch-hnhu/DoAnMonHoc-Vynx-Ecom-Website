<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttributeSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		DB::table('attributes')->insert([
			// Variant attributes (dùng để tạo biến thể sản phẩm)
			[
				'name' => 'Màu sắc',
				'attribute_type' => 'variant',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Dung lượng',
				'attribute_type' => 'variant',
				'data_type' => 'string',
				'unit' => 'GB',
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],

			// Laptop specifications
			[
				'name' => 'CPU',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'RAM',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => 'GB',
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Ổ cứng',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Kích thước màn hình',
				'attribute_type' => 'specification',
				'data_type' => 'decimal',
				'unit' => 'inch',
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Card đồ họa',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Độ phân giải',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => false,
				'created_at' => now(),
				'updated_at' => now(),
			],

			// Headphones specifications
			[
				'name' => 'Loại kết nối',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Driver',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => 'mm',
				'is_filterable' => false,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Tần số',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => 'Hz',
				'is_filterable' => false,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Micro',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],

			// Mouse & Keyboard specifications
			[
				'name' => 'DPI',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Số nút bấm',
				'attribute_type' => 'specification',
				'data_type' => 'integer',
				'unit' => null,
				'is_filterable' => false,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Kiểu switch',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'LED',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],

			// RAM specifications
			[
				'name' => 'Bus RAM',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => 'MHz',
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Loại RAM',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],

			// SSD specifications
			[
				'name' => 'Dung lượng lưu trữ',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => 'GB',
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Chuẩn kết nối',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => null,
				'is_filterable' => true,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Tốc độ đọc',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => 'MB/s',
				'is_filterable' => false,
				'created_at' => now(),
				'updated_at' => now(),
			],
			[
				'name' => 'Tốc độ ghi',
				'attribute_type' => 'specification',
				'data_type' => 'string',
				'unit' => 'MB/s',
				'is_filterable' => false,
				'created_at' => now(),
				'updated_at' => now(),
			],
		]);
	}
}
