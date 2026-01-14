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
        return response()->json([
            'message' => 'Goi den api order thanh cong',
            'data' => Order::with(['user', 'user_address', 'order_items.product', 'promotion'])->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        // Validate input
        $validated = $request->validate([
            'payment_status' => 'sometimes|in:paid,pending,failed,refunded,cancelled',
            'delivery_status' => 'sometimes|in:delivered,shipping,confirmed,pending,failed,returned,cancelled',
        ]);

        // Update order
        $order->update($validated);

        // Reload relationships
        $order->load(['user', 'order_items.product', 'promotion']);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật đơn hàng thành công',
            'data' => $order
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'message' => 'Xoa don hang thanh cong',
        ]);
    }
}
