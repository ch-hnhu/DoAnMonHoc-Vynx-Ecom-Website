<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
	/**
	 * Display a listing of the resource.
	 * Lấy danh sách đơn hàng của user đang đăng nhập
	 * Có thể filter theo trạng thái delivery_status
	 */
	public function index(Request $request)
	{
		try {
			// Lấy user đang đăng nhập (nếu có)
			$user = $request->user();

			// Nếu không có user (chưa đăng nhập), trả về tất cả đơn hàng (cho admin)
			$query = Order::with(['user', 'user_address', 'order_items.product', 'promotion']);

			// Nếu có user, chỉ lấy đơn hàng của user đó
			if ($user) {
				$query->where('user_id', $user->id);
			}

			// Filter theo trạng thái nếu có
			if ($request->has('status')) {
				$query->where('delivery_status', $request->status);
			}

			// Sắp xếp theo ngày tạo mới nhất
			$orders = $query->orderBy('created_at', 'desc')->get();

			// Format dữ liệu trả về
			$formattedOrders = $orders->map(function ($order) {
				return [
					'id' => $order->id,
					'user_id' => $order->user_id,
					'total_amount' => $order->total_amount,
					'payment_method' => $order->payment_method,
					'payment_status' => $order->payment_status,
					'delivery_method' => $order->delivery_method,
					'status' => $order->delivery_status, // Trạng thái giao hàng
					'created_at' => $order->created_at,
					'updated_at' => $order->updated_at,
					'items' => $order->order_items->map(function ($item) {
						return [
							'product_id' => $item->product_id,
							'product_name' => $item->product->name ?? 'N/A',
							'product_image' => $item->product->image_url[0] ?? null,
							'quantity' => $item->quantity,
							'price' => $item->price,
						];
					}),
				];
			});

			return response()->json([
				'success' => true,
				'message' => 'Lấy danh sách đơn hàng thành công',
				'orders' => $formattedOrders,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Lỗi khi lấy danh sách đơn hàng',
				'orders' => [],
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		try {
			$validated = $request->validate([
				'payment_status' => 'sometimes|in:paid,pending,failed,refunded,cancelled',
				'delivery_status' => 'sometimes|in:delivered,shipping,confirmed,pending,failed,returned,cancelled',
			]);

			$order = Order::findOrFail($id);

			$order->update($validated);

			$order->load(['user', 'order_items.product', 'promotion']);

			return response()->json([
				'success' => true,
				'message' => 'Cap nhat don hang thanh cong',
				'data' => $order,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi cap nhat don hang',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			]);
		}
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		try {
			$order = Order::findOrFail($id);
			$order->delete();

			return response()->json([
				'success' => true,
				'message' => 'Xoa don hang thanh cong',
				'data' => null,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi xoa don hang',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			]);
		}
	}

	/**
	 * Hủy đơn hàng
	 * Chỉ cho phép hủy nếu trạng thái là "pending" (Đang chờ xử lý)
	 */
	public function cancel(Request $request, string $id)
	{
		try {
			// Lấy user đang đăng nhập
			$user = $request->user();

			// Tìm đơn hàng
			$order = Order::findOrFail($id);

			// Kiểm tra xem đơn hàng có thuộc về user không
			if ($order->user_id !== $user->id) {
				return response()->json([
					'success' => false,
					'message' => 'Bạn không có quyền hủy đơn hàng này',
					'error' => 'Unauthorized',
					'timestamp' => now(),
				], 403);
			}

			// Kiểm tra trạng thái đơn hàng
			if ($order->delivery_status !== 'pending') {
				return response()->json([
					'success' => false,
					'message' => 'Chỉ có thể hủy đơn hàng đang chờ xử lý',
					'error' => 'Invalid status',
					'timestamp' => now(),
				], 400);
			}

			// Cập nhật trạng thái thành "cancelled"
			$order->delivery_status = 'cancelled';
			$order->payment_status = 'cancelled';
			$order->save();

			return response()->json([
				'success' => true,
				'message' => 'Hủy đơn hàng thành công',
				'data' => $order,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Lỗi khi hủy đơn hàng',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}
}