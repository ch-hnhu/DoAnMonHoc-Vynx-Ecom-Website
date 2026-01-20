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
    public function index(Request $request)
    {
        try {
            $flat = $request->input('flat', false);
            $perPage = $request->input('per_page', 10);
            $parent_id = $request->input('parent_id', 0);
            $parent_slug = $request->input('parent_slug', null);

            if ($parent_slug) {
                // Danh mục con của danh mục cha theo slug
                $parent_id = Category::where('slug', $parent_slug)->value('id');
                if (!$parent_id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Danh muc cha khong ton tai',
                        'data' => null,
                        'error' => null,
                        'timestamp' => now(),
                    ], 404);
                }
                $categories = Category::where('parent_id', $parent_id)->orderBy('name')->paginate($perPage);
                return response()->json([
                    'success' => true,
                    'message' => 'Lay danh sach danh muc thanh cong',
                    'data' => $categories->items(),
                    'error' => null,
                    'timestamp' => now(),
                ]);
            }

            if ($parent_id) {
                // Danh mục con của danh mục cha
                $categories = Category::where('parent_id', $parent_id)->orderBy('name')->paginate($perPage);
                return response()->json([
                    'success' => true,
                    'message' => 'Lay danh sach danh muc thanh cong',
                    'data' => $categories->items(),
                    'error' => null,
                    'timestamp' => now(),
                ]);
            }

            if ($flat) {
                // Danh mục phẳng kèm phân trang
                $categories = Category::with('category')->orderBy('name')->paginate($perPage);

                return response()->json([
                    'success' => true,
                    'message' => 'Lay danh sach danh muc thanh cong',
                    'data' => $categories->items(),
                    'error' => null,
                    'pagination' => [
                        'total' => $categories->total(),
                        'per_page' => $categories->perPage(),
                        'current_page' => $categories->currentPage(),
                        'last_page' => $categories->lastPage(),
                        'from' => $categories->firstItem(),
                        'to' => $categories->lastItem(),
                    ],
                    'timestamp' => now(),
                ]);
            } else {
                // Danh mục phân cấp
                $categories = Category::whereNull('parent_id')->with('childrenRecursive')->get();
                return response()->json([
                    'success' => true,
                    'message' => 'Lay danh sach danh muc thanh cong',
                    'data' => $categories,
                    'error' => null,
                    'timestamp' => now(),
                ]);
            }
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Lay danh sach danh muc that bai',
                'data' => null,
                'error' => $ex->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
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
        $category->delete();

        return response()->json([
            'message' => 'Xoa danh muc thanh cong',
        ]);
    }
}
