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
            $flat = filter_var($request->query('flat', false), FILTER_VALIDATE_BOOLEAN);
            $paginate = filter_var($request->query('paginate', false), FILTER_VALIDATE_BOOLEAN);
            $perPage = (int) $request->query('per_page', 10);
            $perPage = max(1, min($perPage, 200));

            if ($flat) {
                $query = Category::query()
                    ->with(['category:id,name,slug'])
                    ->orderByRaw('COALESCE(parent_id, 0) ASC')
                    ->orderBy('name');

                if ($paginate) {
                    $paginator = $query->paginate($perPage);

                    return response()->json([
                        'success' => true,
                        'message' => 'Lay danh sach danh muc thanh cong',
                        'data' => $paginator->items(),
                        'meta' => [
                            'current_page' => $paginator->currentPage(),
                            'per_page' => $paginator->perPage(),
                            'last_page' => $paginator->lastPage(),
                            'total' => $paginator->total(),
                        ],
                        'error' => null,
                        'timestamp' => now(),
                    ]);
                }

                $categories = $query->get();
            } else {
                $categories = Category::whereNull('parent_id')
                    ->with('childrenRecursive')
                    ->get();
            }

            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach danh muc thanh cong',
                'data' => $categories,
                'meta' => null,
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
