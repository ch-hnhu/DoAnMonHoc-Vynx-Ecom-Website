<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
	/**
	 * Get dashboard statistics overview
	 */
	public function statistics(Request $request)
	{
		try {
			// Tính tỷ lệ tăng trưởng
			$calculateGrowth = function ($current, $previous) {
				if ($previous == 0) {
					return $current > 0 ? 100 : 0;
				}
				return round((($current - $previous) / $previous) * 100, 1);
			};

			// Lấy ngày tháng hiện tại và tháng trước
			$currentMonthStart = now()->startOfMonth();
			$currentMonthEnd = now()->endOfMonth();
			$lastMonthStart = now()->subMonth()->startOfMonth();
			$lastMonthEnd = now()->subMonth()->endOfMonth();

			// Tính tổng doanh thu, doanh thu tháng hiện tại và tháng trước, tỷ lệ tăng trưởng
			$totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');

			$currentMonthRevenue = Order::where('payment_status', 'paid')
				->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
				->sum('total_amount');

			$lastMonthRevenue = Order::where('payment_status', 'paid')
				->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
				->sum('total_amount');

			$revenueGrowth = $calculateGrowth($currentMonthRevenue, $lastMonthRevenue);

			// Tính tổng đơn hàng, đơn hàng tháng hiện tại và tháng trước, tỷ lệ tăng trưởng
			$totalOrders = Order::count();

			$currentMonthOrders = Order::whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])->count();

			$lastMonthOrders = Order::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();

			$ordersGrowth = $calculateGrowth($currentMonthOrders, $lastMonthOrders);

			// Tính tổng khách hàng, khách hàng tháng hiện tại và tháng trước, tỷ lệ tăng trưởng
			$totalUsers = User::count();

			$currentMonthUsers = User::whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])->count();

			$lastMonthUsers = User::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();

			$usersGrowth = $calculateGrowth($currentMonthUsers, $lastMonthUsers);

			// Tính tổng sản phẩm, sản phẩm tháng hiện tại và tháng trước, tỷ lệ tăng trưởng
			$totalProducts = Product::count();

			$currentMonthProducts = Product::whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])->count();

			$lastMonthProducts = Product::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();

			$productsGrowth = $calculateGrowth($currentMonthProducts, $lastMonthProducts);

			// Tính tổng lượt bán, lượt bán tháng hiện tại và tháng trước, tỷ lệ tăng trưởng
			$totalProductsSold = OrderItem::whereHas('order', function ($query) {
				$query->where('payment_status', 'paid');
			})->sum('quantity');

			$currentMonthSold = OrderItem::whereHas('order', function ($query) use ($currentMonthStart, $currentMonthEnd) {
				$query->where('payment_status', 'paid')
					->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd]);
			})->sum('quantity');

			$lastMonthSold = OrderItem::whereHas('order', function ($query) use ($lastMonthStart, $lastMonthEnd) {
				$query->where('payment_status', 'paid')
					->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd]);
			})->sum('quantity');

			$soldGrowth = $calculateGrowth($currentMonthSold, $lastMonthSold);

			// Lấy top 5 sản phẩm bán chạy
			$topProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
				->whereHas('order', function ($query) {
					$query->where('payment_status', 'paid');
				})
				->groupBy('product_id')
				->orderBy('total_sold', 'desc')
				->limit(5)
				->with(['product'])
				->get()
				->map(function ($item) {
					$thumbnail = null;

					if (isset($item->product->image_url)) {
						$imageUrl = $item->product->image_url;

						if (is_string($imageUrl)) {
							$imageUrl = json_decode($imageUrl, true);
						}

						if (is_array($imageUrl) && count($imageUrl) > 0) {
							$thumbnail = $imageUrl[0];
						}
					}

					return [
						'product_id' => $item->product_id,
						'product_name' => $item->product->name ?? 'N/A',
						'product_thumbnail' => $thumbnail,
						'product_price' => $item->product->price ?? 0,
						'total_sold' => $item->total_sold,
					];
				});

			return response()->json([
				'success' => true,
				'message' => 'Lay thong ke dashboard thanh cong',
				'data' => [
					'overview' => [
						'total_revenue' => $totalRevenue,
						'total_orders' => $totalOrders,
						'total_users' => $totalUsers,
						'total_products' => $totalProducts,
						'total_products_sold' => $totalProductsSold,
					],
					'growth' => [
						'revenue' => [
							'percentage' => abs($revenueGrowth),
							'trend' => $revenueGrowth >= 0 ? 'up' : 'down',
						],
						'orders' => [
							'percentage' => abs($ordersGrowth),
							'trend' => $ordersGrowth >= 0 ? 'up' : 'down',
						],
						'users' => [
							'percentage' => abs($usersGrowth),
							'trend' => $usersGrowth >= 0 ? 'up' : 'down',
						],
						'products' => [
							'percentage' => abs($productsGrowth),
							'trend' => $productsGrowth >= 0 ? 'up' : 'down',
						],
						'products_sold' => [
							'percentage' => abs($soldGrowth),
							'trend' => $soldGrowth >= 0 ? 'up' : 'down',
						],
					],
					'top_products' => $topProducts,
				],
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay thong ke dashboard',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Get recent orders for dashboard
	 */
	public function recentOrders(Request $request)
	{
		try {
			$limit = $request->input('limit', 5);

			$recentOrders = Order::with(['user', 'order_items.product'])
				->orderBy('created_at', 'desc')
				->limit($limit)
				->get();

			return response()->json([
				'success' => true,
				'message' => 'Lay don hang gan day thanh cong',
				'data' => $recentOrders,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay don hang gan day',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Get chart data for dashboard (revenue by day)
	 */
	public function chartData(Request $request)
	{
		try {
			$days = $request->input('days', 30);

			if (!in_array($days, [7, 30, 90])) {
				$days = 7;
			}

			$startDate = now()->subDays($days - 1)->startOfDay();
			$endDate = now()->endOfDay();

			$chartData = [];
			$currentDate = $startDate->copy();

			while ($currentDate <= $endDate) {
				$dateString = $currentDate->format('d-m-Y');
				$dayStart = $currentDate->copy()->startOfDay();
				$dayEnd = $currentDate->copy()->endOfDay();

				$revenue = Order::where('payment_status', 'paid')
					->whereBetween('created_at', [$dayStart, $dayEnd])
					->sum('total_amount');

				$dateLabel = $currentDate->format('d/m');

				$chartData[] = [
					'date' => $dateLabel,
					'full_date' => $dateString,
					'revenue' => $revenue,
				];

				$currentDate->addDay();
			}

			return response()->json([
				'success' => true,
				'message' => 'Lay du lieu bieu do thanh cong',
				'data' => [
					'chart_data' => $chartData,
					'period' => $days,
					'start_date' => $startDate->format('d/m/Y'),
					'end_date' => $endDate->format('d/m/Y'),
				],
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay du lieu bieu do',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}
}
