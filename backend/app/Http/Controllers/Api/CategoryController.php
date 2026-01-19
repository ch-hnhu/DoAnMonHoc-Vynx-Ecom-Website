<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $categories = Category::whereNull('parent_id')
                ->with('categories')
                ->get();
            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach danh muc thanh cong',
                'data' => $categories,
                'error' => null,
                'timestamp' => now(),
            ]);
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
     * Build nested tree from flat category array
     *
     * @param array $items
     * @param int|null $parentId
     * @return array
     */
    // private function buildTree(array $items, $parentId = null)
    // {
    //     $branch = [];

    //     foreach ($items as $item) {
    //         $pid = isset($item['parent_id']) ? $item['parent_id'] : null;
    //         if ($pid == $parentId) {
    //             $children = $this->buildTree($items, $item['id']);
    //             if ($children) {
    //                 $item['children'] = $children;
    //             }
    //             $branch[] = $item;
    //         }
    //     }

    //     return $branch;
    // }

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
        $category->load('categories');

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
