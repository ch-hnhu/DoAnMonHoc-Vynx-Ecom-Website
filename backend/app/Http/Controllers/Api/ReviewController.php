<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		try {
			$perPage = $request->input('per_page', 25);
			$query = ProductReview::with(['product', 'user']);
			if ($request->has('product_id')) {
				$query->where('product_id', $request->product_id);
			}
			if ($request->has('user_id')) {
				$query->where('user_id', $request->user_id);
			}
			$sort = $request->input('sort', 'rating_desc');
			switch ($sort) {
				case 'newest':
					$query->orderBy('created_at', 'desc');
					break;
				case 'oldest':
					$query->orderBy('created_at', 'asc');
					break;
				case 'rating_desc':
					$query->orderBy('rating', 'desc');
					break;
				case 'rating_asc':
					$query->orderBy('rating', 'asc');
					break;
			}
			$reviews = $query->paginate($perPage);

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach review thanh cong',
				'data' => $reviews->items(),
				'error' => null,
				'pagination' => [
					'total' => $reviews->total(),
					'per_page' => $reviews->perPage(),
					'current_page' => $reviews->currentPage(),
					'last_page' => $reviews->lastPage(),
					'from' => $reviews->firstItem(),
					'to' => $reviews->lastItem(),
				],
				'filters' => [
					'product_id' => $request->input('product_id'),
					'user_id' => $request->input('user_id'),
				],
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach review',
				'data' => [],
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Lấy danh sách đơn hàng đã đánh giá của user
	 * GET /api/reviews/reviewed-orders
	 */
	public function getReviewedOrders(Request $request)
	{
		try {
			$user = $request->user();

			// Lấy các đơn hàng đã giao hàng và đã có đánh giá
			$orders = Order::where('user_id', $user->id)
				->where('delivery_status', 'delivered')
				->whereHas('product_reviews') // Chỉ lấy đơn hàng đã có đánh giá
				->with([
					'order_items.product',
					'product_reviews' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}
				])
				->orderBy('created_at', 'desc')
				->get();

			// Format dữ liệu trả về
			$formattedOrders = $orders->map(function ($order) {
				return [
					'id' => $order->id,
					'total_amount' => $order->total_amount,
					'created_at' => $order->created_at,
					'updated_at' => $order->updated_at,
					'items' => $order->order_items->map(function ($item) use ($order) {
						// Tìm review của sản phẩm này trong đơn hàng
						$review = $order->product_reviews->firstWhere('product_id', $item->product_id);

						return [
							'product_id' => $item->product_id,
							'product_name' => $item->product->name ?? 'N/A',
							'product_image' => $item->product->image_url[0] ?? null,
							'quantity' => $item->quantity,
							'price' => $item->price,
							'review' => $review ? [
								'id' => $review->id,
								'rating' => $review->rating,
								'content' => $review->content,
								'created_at' => $review->created_at,
							] : null,
						];
					}),
				];
			});

			return response()->json([
				'success' => true,
				'message' => 'Lấy danh sách đơn hàng đã đánh giá thành công',
				'orders' => $formattedOrders,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Lỗi khi lấy danh sách đơn hàng đã đánh giá',
				'orders' => [],
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Lấy danh sách đơn hàng chưa đánh giá của user
	 * GET /api/reviews/pending-orders
	 */
	public function getPendingReviewOrders(Request $request)
	{
		try {
			$user = $request->user();

			// Lấy các đơn hàng đã giao hàng nhưng chưa có đánh giá
			$orders = Order::where('user_id', $user->id)
				->where('delivery_status', 'delivered')
				->whereDoesntHave('product_reviews') // Chỉ lấy đơn hàng chưa có đánh giá
				->with(['order_items.product'])
				->orderBy('created_at', 'desc')
				->get();

			// Format dữ liệu trả về
			$formattedOrders = $orders->map(function ($order) {
				return [
					'id' => $order->id,
					'total_amount' => $order->total_amount,
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
				'message' => 'Lấy danh sách đơn hàng chưa đánh giá thành công',
				'orders' => $formattedOrders,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Lỗi khi lấy danh sách đơn hàng chưa đánh giá',
				'orders' => [],
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Tạo đánh giá mới cho đơn hàng
	 * POST /api/reviews
	 */
	public function store(Request $request)
	{
		try {
			$user = $request->user();

			// Validate dữ liệu
			$validated = $request->validate([
				'order_id' => 'required|integer|exists:orders,id',
				'reviews' => 'required|array|min:1',
				'reviews.*.product_id' => 'required|integer|exists:products,id',
				'reviews.*.rating' => 'required|integer|min:1|max:5',
				'reviews.*.content' => 'nullable|string|max:1000',
			]);

			// Kiểm tra đơn hàng có thuộc về user không
			$order = Order::where('id', $validated['order_id'])
				->where('user_id', $user->id)
				->firstOrFail();

			// Kiểm tra đơn hàng đã giao hàng chưa
			if ($order->delivery_status !== 'delivered') {
				return response()->json([
					'success' => false,
					'message' => 'Chỉ có thể đánh giá đơn hàng đã giao hàng',
					'error' => 'Invalid order status',
					'timestamp' => now(),
				], 400);
			}

			// Kiểm tra đơn hàng đã được đánh giá chưa
			$existingReviews = ProductReview::where('order_id', $order->id)
				->where('user_id', $user->id)
				->exists();

			if ($existingReviews) {
				return response()->json([
					'success' => false,
					'message' => 'Đơn hàng này đã được đánh giá',
					'error' => 'Already reviewed',
					'timestamp' => now(),
				], 400);
			}

			// Tạo đánh giá cho từng sản phẩm
			$createdReviews = [];
			foreach ($validated['reviews'] as $reviewData) {
				$review = ProductReview::create([
					'product_id' => $reviewData['product_id'],
					'user_id' => $user->id,
					'order_id' => $order->id,
					'rating' => $reviewData['rating'],
					'content' => $reviewData['content'] ?? '',
				]);

				$createdReviews[] = $review;
			}

			return response()->json([
				'success' => true,
				'message' => 'Đánh giá thành công',
				'data' => $createdReviews,
				'error' => null,
				'timestamp' => now(),
			], 201);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Lỗi khi tạo đánh giá',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, ProductReview $review)
	{
		$validated = $request->validate([
			'review_reply' => 'nullable|string|max:1000',
			'review_reply_by' => 'nullable|integer',
		]);

		$review->update($validated);

		return response()->json([
			'message' => 'Cap nhat phan hoi danh gia thanh cong',
			'data' => $review->load(['product', 'user']),
		]);
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(ProductReview $review)
	{
		$review->delete();

		return response()->json([
			'message' => 'Xoa danh gia thanh cong',
		]);
	}
}
