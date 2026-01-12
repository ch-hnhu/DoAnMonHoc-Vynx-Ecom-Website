<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

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
            'data' => $products
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
