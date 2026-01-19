<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

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
