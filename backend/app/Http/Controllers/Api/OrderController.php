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
	public function index(Request $request)
	{
		try {
			$perPage = $request->input('per_page', 10);

			$query = Order::with(['user', 'user_address', 'order_items.product', 'promotion']);

			if ($request->has('user_id')) {
				$query->where('user_id', $request->user_id);
			}

			if ($request->has('payment_status')) {
				$query->where('payment_status', $request->payment_status);
			}

			if ($request->has('delivery_status')) {
				$query->where('delivery_status', $request->delivery_status);
			}

			$sort = $request->input('sort', 'newest');
			switch ($sort) {
				case 'newest':
					$query->orderBy('created_at', 'desc');
					break;
				case 'oldest':
					$query->orderBy('created_at', 'asc');
					break;
			}

			$orders = $query->paginate($perPage);

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach don hang thanh cong',
				'data' => $orders->items(),
				'error' => null,
				'pagination' => [
					'total' => $orders->total(),
					'per_page' => $orders->perPage(),
					'current_page' => $orders->currentPage(),
					'last_page' => $orders->lastPage(),
					'from' => $orders->firstItem(),
					'to' => $orders->lastItem(),
				],
				'filters' => [
					'user_id' => $request->input('user_id'),
					'payment_status' => $request->input('payment_status'),
					'delivery_status' => $request->input('delivery_status'),
					'sort' => $sort,
				],
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
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		try {
			$validated = $request->validate([
				'user_id' => 'nullable|exists:users,id',
				'address_id' => 'nullable|exists:user_addresses,id',
				'shipping_name' => 'required_without:address_id|nullable|string',
				'shipping_phone' => 'required_without:address_id|nullable|string',
				'shipping_address' => 'required_without:address_id|nullable|string',
				'shipping_email' => 'nullable|email',
				'shipping_note' => 'nullable|string',
				'payment_method' => 'required|in:cod,vnpay',
				'subtotal_amount' => 'required|numeric',
				'discount_amount' => 'required|numeric',
				'shipping_fee' => 'required|numeric',
				'total_amount' => 'required|numeric',
			]);

			$order = Order::create($validated);

			return response()->json([
				'success' => true,
				'message' => 'Tao don hang thanh cong',
				'data' => $order,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi tao don hang',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			]);
		}
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		try {
			$order = Order::with(['user', 'user_address', 'order_items.product', 'promotion'])->findOrFail($id);

			return response()->json([
				'success' => true,
				'message' => 'Lay chi tiet don hang thanh cong',
				'data' => $order,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay chi tiet don hang',
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
