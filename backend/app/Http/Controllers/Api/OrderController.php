<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		try {
			$orders = Order::with(['user', 'user_address', 'order_items.product', 'promotion'])->get();

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach don hang thanh cong',
				'data' => $orders,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach don hang',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			]);
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
}