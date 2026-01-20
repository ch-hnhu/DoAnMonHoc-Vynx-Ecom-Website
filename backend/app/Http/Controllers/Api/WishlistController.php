<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
	/**
	 * Display a listing of the user's wishlist.
	 * GET /api/wishlists
	 */
	public function index(Request $request)
	{
		try {
			$userId = Auth::id();

			$wishlists = Wishlist::with([
				'product' => function ($query) {
					$query->with(['category', 'brand', 'promotion'])
						->withAvg('product_reviews as rating_average', 'rating')
						->withCount('product_reviews as rating_count');
				}
			])
				->where('user_id', $userId)
				->orderBy('created_at', 'desc')
				->get();

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach wishlist thanh cong',
				'data' => $wishlists,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach wishlist',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Add a product to wishlist.
	 * POST /api/wishlists
	 * Request body: { product_id: number }
	 */
	public function store(Request $request)
	{
		try {
			$validated = $request->validate([
				'product_id' => 'required|integer|exists:products,id',
			]);

			$userId = Auth::id();

			// Kiểm tra xem sản phẩm đã có trong wishlist chưa (bao gồm cả soft deleted)
			$wishlist = Wishlist::withTrashed()
				->where('user_id', $userId)
				->where('product_id', $validated['product_id'])
				->first();

			if ($wishlist) {
				if (!$wishlist->trashed()) {
					return response()->json([
						'success' => false,
						'message' => 'San pham da co trong wishlist',
						'data' => null,
						'error' => 'Duplicate entry',
						'timestamp' => now(),
					], 409);
				}

				// Nếu đã bị soft delete, restore lại
				$wishlist->restore();
				$wishlist->load([
					'product' => function ($query) {
						$query->with(['category', 'brand', 'promotion'])
							->withAvg('product_reviews as rating_average', 'rating')
							->withCount('product_reviews as rating_count');
					}
				]);

				return response()->json([
					'success' => true,
					'message' => 'Them san pham vao wishlist thanh cong',
					'data' => $wishlist,
					'error' => null,
					'timestamp' => now(),
				], 201);
			}

			$wishlist = Wishlist::create([
				'user_id' => $userId,
				'product_id' => $validated['product_id'],
			]);

			$wishlist->load([
				'product' => function ($query) {
					$query->with(['category', 'brand', 'promotion'])
						->withAvg('product_reviews as rating_average', 'rating')
						->withCount('product_reviews as rating_count');
				}
			]);

			return response()->json([
				'success' => true,
				'message' => 'Them san pham vao wishlist thanh cong',
				'data' => $wishlist,
				'error' => null,
				'timestamp' => now(),
			], 201);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi them san pham vao wishlist',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Remove a product from wishlist.
	 * DELETE /api/wishlists/{product_id}
	 */
	public function destroy(string $productId)
	{
		try {
			$userId = Auth::id();

			$wishlist = Wishlist::where('user_id', $userId)
				->where('product_id', $productId)
				->first();

			if (!$wishlist) {
				return response()->json([
					'success' => false,
					'message' => 'San pham khong co trong wishlist',
					'data' => null,
					'error' => 'Not found',
					'timestamp' => now(),
				], 404);
			}

			$wishlist->delete();

			return response()->json([
				'success' => true,
				'message' => 'Xoa san pham khoi wishlist thanh cong',
				'data' => null,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi xoa san pham khoi wishlist',
				'data' => null,
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Check if a product is in the user's wishlist.
	 * GET /api/wishlists/check/{product_id}
	 */
	public function check(string $productId)
	{
		try {
			$userId = Auth::id();

			$exists = Wishlist::where('user_id', $userId)
				->where('product_id', $productId)
				->exists();

			return response()->json([
				'success' => true,
				'message' => 'Kiem tra wishlist thanh cong',
				'data' => [
					'is_in_wishlist' => $exists,
				],
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi kiem tra wishlist',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Get wishlist count.
	 * GET /api/wishlists/count
	 */
	public function count()
	{
		try {
			$userId = Auth::id();

			$count = Wishlist::where('user_id', $userId)->count();

			return response()->json([
				'success' => true,
				'message' => 'Lay so luong wishlist thanh cong',
				'data' => [
					'count' => $count,
				],
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay so luong wishlist',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}
}
