<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'message' => 'Goi den api review thanh cong',
            'data' => ProductReview::with(['product', 'user'])->get(),
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
