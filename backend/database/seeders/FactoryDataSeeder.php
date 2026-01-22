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

		// Tự động tạo attribute values cho products
		$this->command->info('Auto-generating product attributes...');
		$this->call(AutoProductAttributeValueSeeder::class);

		// Tạo reviews cho products
		$this->command->info('Creating 100 product reviews...');
		ProductReview::factory(100)->create();

		// Tạo orders và order items
		$this->command->info('Creating 30 orders with items...');
		$orders = Order::factory(30)->create();

		// Tạo order items cho mỗi order
		foreach ($orders as $order) {
			// Mỗi order có 1-5 sản phẩm ngẫu nhiên
			$numItems = rand(1, 5);
			$products = Product::inRandomOrder()->take($numItems)->get();

			$orderSubtotal = 0;

			foreach ($products as $product) {
				$quantity = rand(1, 3);
				$price = $product->promotion && $product->promotion->discount_type === 'percentage'
					? $product->price * (1 - $product->promotion->discount_value / 100)
					: $product->price;

				OrderItem::create([
					'order_id' => $order->id,
					'product_id' => $product->id,
					'quantity' => $quantity,
					'price' => $price,
				]);

				$orderSubtotal += $price * $quantity;
			}

			// Cập nhật lại subtotal_amount và total_amount của order
			$order->update([
				'subtotal_amount' => $orderSubtotal,
				'total_amount' => $orderSubtotal - $order->discount_amount + $order->shipping_fee,
			]);
		}

		$this->command->info('Factory data seeding completed successfully!');
	}
}
