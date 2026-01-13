<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'brand', 'promotion'])
            ->withAvg('product_reviews as rating_average', 'rating')
            ->withCount('product_reviews as rating_count')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lay danh sach san pham thanh cong',
            'data' => $products,
            'error' => null,
            'timestamp' => now(),
        ]);
    }

    /**
     * Display a paginated listing of the resource.
     */
    public function paginated(Request $request)
    {
        $perPage = $request->input('per_page', 9);
        $products = Product::with(['category', 'brand', 'promotion'])
            ->withAvg('product_reviews as rating_average', 'rating')
            ->withCount('product_reviews as rating_count')
            ->paginate($perPage);

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
            'timestamp' => now(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
            'hero_image' => 'nullable|image|max:5120',
            'gallery_images.*' => 'nullable|image|max:5120',
        ]);

        // Handle image uploads
        $imageUrls = [];

        // Upload hero image first
        if ($request->hasFile('hero_image')) {
            $heroImage = $request->file('hero_image');
            $heroPath = $heroImage->store('products/images', 'public');
            $imageUrls[] = '/storage/' . $heroPath;
        }

        // Upload gallery images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $galleryImage) {
                $galleryPath = $galleryImage->store('products/images', 'public');
                $imageUrls[] = '/storage/' . $galleryPath;
            }
        }

        // Add image URLs to validated data
        $validated['image_url'] = json_encode($imageUrls);

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tao san pham thanh cong',
            'data' => $product,
            'error' => null,
            'timestamp' => now(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with(['category', 'brand', 'promotion'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Lay chi tiet san pham thanh cong',
            'data' => $product,
            'error' => null,
            'timestamp' => now(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:products,name,' . $id,
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'image_url' => 'nullable|string|max:255',
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'brand_id' => 'sometimes|required|integer|exists:brands,id',
            'promotion_id' => 'nullable|integer|exists:promotions,id',
            'stock_quantity' => 'sometimes|required|integer',
        ]);

        $product = Product::findOrFail($id);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thành công',
            'data' => $product,
            'error' => null,
            'timestamp' => now(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        $imageUrls = $product->image_url;
        $paths = [];

        if (is_array($imageUrls)) {
            $paths = $imageUrls;
        } elseif (is_string($imageUrls)) {
            $paths = [$imageUrls];
        }

        foreach ($paths as $url) {
            if (!is_string($url)) {
                continue;
            }
            if (str_starts_with($url, '/storage/')) {
                $storagePath = str_replace('/storage/', '', $url);
                Storage::disk('public')->delete($storagePath);
            }
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công',
            'data' => null,
            'error' => null,
            'timestamp' => now(),
        ]);
    }
}
