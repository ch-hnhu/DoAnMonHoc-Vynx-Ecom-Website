<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class ProductController extends Controller
{
	/**
	 * Display a listing of the resource with filtering & sorting.
	 */
	public function index(Request $request)
	{
		try {
			$perPage = $request->input('per_page', 9);

			// query gốc lấy tất cả sản phẩm
			$query = Product::with(['category', 'brand', 'promotion'])
				->withAvg('product_reviews as rating_average', 'rating')
				->withCount('product_reviews as rating_count');

			// bắt đầu lọc danh sách sản phẩm đã lấy

			// lọc theo danh mục
			if ($request->has('category_slug')) {
				$query->whereHas('category', function ($query) use ($request) {
					$query->where('slug', $request->category_slug)
						->orWhere('parent_id', Category::where('slug', $request->category_slug)->value('id'));
				});
			}

			// lọc theo thương hiệu
			if ($request->has('brand_id')) {
				$query->where('brand_id', $request->brand_id);
			}

			// lọc theo khoảng giá
			if ($request->has('min_price')) {
				$query->where('price', '>=', $request->min_price);
			}
			if ($request->has('max_price')) {
				$query->where('price', '<=', $request->max_price);
			}

			// lọc theo sản phẩm có khuyến mãi
			if ($request->input('has_promotion') == 1) {
				$query->whereNotNull('promotion_id');
			}

			// tìm kiếm theo tên + mô tả
			$searchTerm = $request->input('search');
			if (!empty($searchTerm)) {
				$query->where(function ($subQuery) use ($searchTerm) {
					$subQuery->where('name', 'like', '%' . $searchTerm . '%')
						->orWhere('description', 'like', '%' . $searchTerm . '%');
				});
			}

			// bắt đầu sắp xếp danh sách sản phẩm
			$sort = $request->input('sort', 'newest');
			switch ($sort) {
				case 'newest':
					// sắp xếp theo ngày tạo mới nhất
					$query->where('created_at', '>=', now()->subDays(30));
					break;

				case 'oldest':
					// sắp xếp theo ngày tạo cũ nhất
					$query->orderBy('created_at', 'asc');
					break;

				case 'bestseller':
					// sắp xếp theo sản phẩm xuất hiện trong nhiều đơn hàng nhất
					$query->withCount('order_items')->orderBy('order_items_count', 'desc');
					break;

				case 'price_asc':
					// sắp xếp theo giá tăng dần
					$query->orderBy('price', 'asc');
					break;

				case 'price_desc':
					// sắp xếp theo giá giảm dần
					$query->orderBy('price', 'desc');
					break;

				case 'rating':
					// sắp xếp theo đánh giá cao nhất
					$query->orderBy('rating_average', 'desc');
					break;

				case 'name_asc':
					// sắp xếp theo tên tăng dần
					$query->orderBy('name', 'asc');
					break;

				case 'name_desc':
					// sắp xếp theo tên giảm dần
					$query->orderBy('name', 'desc');
					break;

				default:
					// mặc định sắp xếp theo ngày tạo mới nhất
					$query->orderBy('created_at', 'desc');
			}

			$products = $query->paginate($perPage);

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach san pham thanh cong',
				'data' => $products->items(),
				'error' => null,
				'pagination' => [
					'total' => $products->total(),
					'per_page' => $products->perPage(),
					'current_page' => $products->currentPage(),
					'last_page' => $products->lastPage(),
					'from' => $products->firstItem(),
					'to' => $products->lastItem(),
				],
				'filters' => [
					'category_slug' => $request->input('category_slug'),
					'brand_id' => $request->input('brand_id'),
					'sort' => $sort,
					'featured' => $request->input('featured'),
					'min_price' => $request->input('min_price'),
					'max_price' => $request->input('max_price'),
					'search' => $request->input('search'),
				],
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach san pham',
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
				'name' => 'required|string|max:255|unique:products,name',
				'slug' => 'required|string|max:255|unique:products,slug',
				'description' => 'nullable|string',
				'price' => 'required|numeric',
				'hero_image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
				'gallery_images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
				'category_id' => 'required|integer|exists:categories,id',
				'brand_id' => 'required|integer|exists:brands,id',
				'promotion_id' => 'nullable|integer|exists:promotions,id',
				'stock_quantity' => 'required|integer',
			]);

			// Handle image uploads
			$imageUrls = [];

			// Upload hero image first
			if ($request->hasFile('hero_image')) {
				$heroImage = $request->file('hero_image');
				$heroPath = $heroImage->store('products/images', 'public');
				$imageUrls[] = 'http://localhost:8000/storage/' . $heroPath;
			}

			// Upload gallery images
			if ($request->hasFile('gallery_images')) {
				foreach ($request->file('gallery_images') as $galleryImage) {
					$galleryPath = $galleryImage->store('products/images', 'public');
					$imageUrls[] = 'http://localhost:8000/storage/' . $galleryPath;
				}
			}

			// Add image URLs to validated data
			$validated['image_url'] = $imageUrls;

			$product = Product::create($validated);

			return response()->json([
				'success' => true,
				'message' => 'Tao san pham thanh cong',
				'data' => $product,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi tao san pham',
				'data' => null,
				'error' => $th->getMessage(),
				'timestamp' => now(),
			]);
		}
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $slug)
	{
		try {
			$product = Product::with(['category', 'brand', 'promotion', 'specifications'])
				->withAvg('product_reviews as rating_average', 'rating')
				->withCount('product_reviews as rating_count')
				->where('slug', $slug)
				->firstOrFail();

			$specifications = $product->specifications->map(function ($attribute) {
				return [
					'id' => $attribute->id,
					'name' => $attribute->name,
					'value' => $attribute->pivot->value,
					'unit' => $attribute->unit,
				];
			});
			$product->setAttribute('specifications', $specifications);
			$product->unsetRelation('specifications');

			// Calculate rating distribution
			$ratingDistribution = [];
			for ($i = 5; $i >= 1; $i--) {
				$ratingDistribution[$i] = $product->product_reviews()
					->where('rating', $i)
					->count();
			}
			$product->setAttribute('rating_distribution', $ratingDistribution);

			return response()->json([
				'success' => true,
				'message' => 'Lay chi tiet san pham thanh cong',
				'data' => $product,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'San pham khong ton tai',
				'data' => null,
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 404);
		}
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		try {
			$validated = $request->validate([
				'name' => 'sometimes|required|string|max:255|unique:products,name,' . $id,
				'slug' => 'required|string|max:255|unique:products,slug,' . $id,
				'description' => 'nullable|string',
				'price' => 'required|numeric',
				'hero_image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
				'gallery_images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
				'existing_images' => 'nullable|string',
				'category_id' => 'required|integer|exists:categories,id',
				'brand_id' => 'required|integer|exists:brands,id',
				'promotion_id' => 'nullable|integer|exists:promotions,id',
				'stock_quantity' => 'required|integer',
			]);

			$product = Product::findOrFail($id);

			// Xử lý ảnh
			$imageUrls = [];
			$hasImageChange = false;

			// Lấy ảnh cũ muốn giữ từ frontend
			if ($request->has('existing_images')) {
				$existingImages = json_decode($request->input('existing_images'), true);
				if (is_array($existingImages)) {
					$imageUrls = $existingImages;
				}

				// So sánh với ảnh hiện tại trong DB để phát hiện xóa ảnh
				$currentImages = is_array($product->image_url) ? $product->image_url : [];
				if (json_encode($existingImages) !== json_encode($currentImages)) {
					$hasImageChange = true; // User đã xóa/sắp xếp lại ảnh
				}
			}

			// Upload hero image mới nếu có
			if ($request->hasFile('hero_image')) {
				$heroImage = $request->file('hero_image');
				$heroPath = $heroImage->store('products/images', 'public');
				$newHeroUrl = 'http://localhost:8000/storage/' . $heroPath;

				// Thêm hero image mới vào đầu array
				array_unshift($imageUrls, $newHeroUrl);
				$hasImageChange = true;
			}

			// Upload gallery images mới nếu có
			if ($request->hasFile('gallery_images')) {
				foreach ($request->file('gallery_images') as $galleryImage) {
					$galleryPath = $galleryImage->store('products/images', 'public');
					$imageUrls[] = 'http://localhost:8000/storage/' . $galleryPath;
				}
				$hasImageChange = true;
			}

			// Chỉ update image_url khi thực sự có thay đổi
			if ($hasImageChange) {
				$validated['image_url'] = $imageUrls;
			}

			$product->update($validated);

			$product->refresh();

			return response()->json([
				'success' => true,
				'message' => 'Cap nhat san pham thanh cong',
				'data' => $product,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi cap nhat san pham',
				'data' => null,
				'error' => $th->getMessage(),
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
			$product = Product::findOrFail($id);
			$product->delete();

			return response()->json([
				'success' => true,
				'message' => 'Xoa san pham thanh cong (soft delete)',
				'data' => null,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi xoa san pham',
				'data' => null,
				'error' => $th->getMessage(),
				'timestamp' => now(),
			]);
		}
	}

	/**
	 * Display a listing of trashed products.
	 */
	public function trashed(Request $request)
	{
		try {
			$perPage = $request->input('per_page', 25);

			$products = Product::onlyTrashed()
				->with(['category', 'brand', 'promotion'])
				->paginate($perPage);

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach san pham da xoa thanh cong',
				'data' => $products->items(),
				'error' => null,
				'pagination' => [
					'total' => $products->total(),
					'per_page' => $products->perPage(),
					'current_page' => $products->currentPage(),
					'last_page' => $products->lastPage(),
					'from' => $products->firstItem(),
					'to' => $products->lastItem(),
				],
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach san pham da xoa',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			]);
		}
	}

	/**
	 * Restore a trashed product.
	 */
	public function restore(string $id)
	{
		try {
			$product = Product::onlyTrashed()->findOrFail($id);
			$product->restore();

			return response()->json([
				'success' => true,
				'message' => 'Khoi phuc san pham thanh cong',
				'data' => $product,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi khoi phuc san pham',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			]);
		}
	}

	/**
	 * Permanently delete a trashed product.
	 */
	public function forceDelete(string $id)
	{
		try {
			$product = Product::onlyTrashed()->findOrFail($id);
			$product->forceDelete();

			return response()->json([
				'success' => true,
				'message' => 'Xoa vinh vien san pham thanh cong',
				'data' => null,
				'error' => null,
				'timestamp' => now(),
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi xoa vinh vien san pham',
				'data' => null,
				'error' => $e->getMessage(),
				'timestamp' => now(),
			]);
		}
	}
}
