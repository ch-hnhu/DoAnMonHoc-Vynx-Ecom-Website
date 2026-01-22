<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Attribute;
use Illuminate\Support\Facades\DB;

class AutoProductAttributeValueSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$this->command->info('Auto-seeding product attribute values...');

		$products = Product::with('category')->get();

		foreach ($products as $product) {
			// Get attributes for this product's category
			$categoryAttributes = DB::table('category_attributes')
				->where('category_id', $product->category_id)
				->where('used_for_variant', false) // Only specifications, not variants
				->get();

			foreach ($categoryAttributes as $categoryAttribute) {
				$value = $this->generateAttributeValue($product->category_id, $categoryAttribute->attribute_id);

				if ($value !== null) {
					// Check if this combination already exists
					$exists = DB::table('product_attribute_values')
						->where('product_id', $product->id)
						->where('attribute_id', $categoryAttribute->attribute_id)
						->exists();

					if (!$exists) {
						DB::table('product_attribute_values')->insert([
							'product_id' => $product->id,
							'attribute_id' => $categoryAttribute->attribute_id,
							'value' => $value,
							'created_at' => now(),
							'updated_at' => now(),
						]);
					}
				}
			}
		}

		$this->command->info('Product attribute values seeded successfully!');
	}

	/**
	 * Generate realistic attribute values based on category and attribute
	 */
	private function generateAttributeValue(int $categoryId, int $attributeId): ?string
	{
		switch ($categoryId) {
			case 2: // Laptop
				return $this->getLaptopAttributeValue($attributeId);
			case 4: // Tai nghe
				return $this->getHeadphoneAttributeValue($attributeId);
			case 5: // Chuột
				return $this->getMouseAttributeValue($attributeId);
			case 6: // Bàn phím
				return $this->getKeyboardAttributeValue($attributeId);
			case 8: // RAM
				return $this->getRamAttributeValue($attributeId);
			case 9: // Ổ cứng SSD
				return $this->getSsdAttributeValue($attributeId);
			case 10: // Card màn hình VGA
				return $this->getGpuAttributeValue($attributeId);
			default:
				return null;
		}
	}

	private function getLaptopAttributeValue(int $attributeId): ?string
	{
		$values = [
			3 => ['Intel Core i3-1115G4', 'Intel Core i5-1335U', 'Intel Core i7-1355U', 'AMD Ryzen 5 5500U', 'AMD Ryzen 7 5700U', 'Intel Core i5-12450H', 'Intel Core i7-12650H'],  // CPU
			4 => ['8', '16', '32'],  // RAM
			5 => ['256GB SSD', '512GB SSD', '1TB SSD', '512GB SSD + 1TB HDD'],  // Ổ cứng
			6 => ['13.3', '14', '15.6', '16', '17.3'],  // Kích thước màn hình
			7 => ['Intel UHD Graphics', 'Intel Iris Xe Graphics', 'NVIDIA GeForce GTX 1650', 'NVIDIA GeForce RTX 3050', 'NVIDIA GeForce RTX 3060', 'AMD Radeon Graphics'],  // Card đồ họa
			8 => ['1920x1080 (Full HD)', '2560x1440 (2K)', '2560x1600 (WQXGA)', '3840x2160 (4K)'],  // Độ phân giải
		];

		return $values[$attributeId][array_rand($values[$attributeId])] ?? null;
	}

	private function getHeadphoneAttributeValue(int $attributeId): ?string
	{
		$values = [
			9 => ['Bluetooth', 'Có dây 3.5mm', 'USB Type-C', 'Bluetooth + 3.5mm'],  // Loại kết nối
			10 => ['40', '50', '53'],  // Driver (mm)
			11 => ['20Hz - 20kHz', '10Hz - 40kHz', '15Hz - 25kHz'],  // Tần số
			12 => ['Có', 'Không', 'Có (chống ồn)'],  // Micro
		];

		return $values[$attributeId][array_rand($values[$attributeId])] ?? null;
	}

	private function getMouseAttributeValue(int $attributeId): ?string
	{
		$values = [
			9 => ['Bluetooth', 'USB Wireless 2.4GHz', 'Có dây USB', 'Bluetooth + USB Wireless'],  // Loại kết nối
			13 => ['800-1600', '1000-3200', '100-8000', '100-16000', '200-25600'],  // DPI
			14 => ['3', '5', '6', '7', '8'],  // Số nút bấm
			16 => ['RGB', 'LED đơn sắc', 'Không có'],  // LED
		];

		return $values[$attributeId][array_rand($values[$attributeId])] ?? null;
	}

	private function getKeyboardAttributeValue(int $attributeId): ?string
	{
		$values = [
			9 => ['Bluetooth', 'USB Wireless 2.4GHz', 'Có dây USB', 'Bluetooth + USB Wireless'],  // Loại kết nối
			15 => ['Membrane', 'Mechanical Blue', 'Mechanical Red', 'Mechanical Brown', 'Optical Switch'],  // Kiểu switch
			16 => ['RGB', 'LED đơn sắc', 'Không có'],  // LED
		];

		return $values[$attributeId][array_rand($values[$attributeId])] ?? null;
	}

	private function getRamAttributeValue(int $attributeId): ?string
	{
		$values = [
			4 => ['8', '16', '32', '64'],  // RAM capacity
			17 => ['2400', '2666', '3200', '3600', '4800', '5600'],  // Bus RAM
			18 => ['DDR4', 'DDR5'],  // Loại RAM
		];

		return $values[$attributeId][array_rand($values[$attributeId])] ?? null;
	}

	private function getSsdAttributeValue(int $attributeId): ?string
	{
		$values = [
			19 => ['128', '256', '512', '1024', '2048'],  // Dung lượng lưu trữ
			20 => ['SATA III', 'M.2 NVMe PCIe 3.0', 'M.2 NVMe PCIe 4.0', 'M.2 NVMe PCIe 5.0'],  // Chuẩn kết nối
			21 => ['550', '3500', '5000', '7000', '12000'],  // Tốc độ đọc
			22 => ['500', '3000', '4500', '6500', '10000'],  // Tốc độ ghi
		];

		return $values[$attributeId][array_rand($values[$attributeId])] ?? null;
	}

	private function getGpuAttributeValue(int $attributeId): ?string
	{
		$values = [
			4 => ['4', '6', '8', '12', '16', '24'],  // VRAM
			17 => ['128-bit', '192-bit', '256-bit', '384-bit'],  // Memory bus
		];

		return $values[$attributeId][array_rand($values[$attributeId])] ?? null;
	}
}
