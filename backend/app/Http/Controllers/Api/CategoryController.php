<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'message' => 'Goi den api category thanh cong',
            'data' => Category::with('category')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'description' => 'nullable|string|max:1000',
            'parent_id' => 'nullable|integer|exists:categories,id',
        ]);

        $category = Category::create($validated);
        $category->load('category');

        return response()->json([
            'message' => 'Tao danh muc thanh cong',
            'data' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($category->id),
            ],
            'description' => 'nullable|string|max:1000',
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                Rule::notIn([$category->id]),
            ],
        ]);

        $category->update($validated);
        $category->load('category');

        return response()->json([
            'message' => 'Cap nhat danh muc thanh cong',
            'data' => $category,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //Lấy số lượng danh mục con và sản phẩm liên quan
        $childCount = $category->categories()->count();
        $productCount = $category->products()->count();
        //Kiểm tra nếu có danh mục con hoặc sản phẩm liên quan thì không cho xóa
        if ($childCount > 0 || $productCount > 0) {
            return response()->json([
                'message' => 'Khong the xoa danh muc vi van con danh muc con hoac san pham',
                'errors' => [
                    'child_categories' => $childCount,
                    'products' => $productCount,
                ],
            ], 409);
        }

        $category->delete();

        return response()->json([
            'message' => 'Xoa danh muc thanh cong',
        ]);
    }
}
