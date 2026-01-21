<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'message' => 'Goi den api promotion thanh cong',
            'data' => Promotion::query()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:promotions,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0.01',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ], [
            'code.required' => 'Vui lòng nhập mã khuyến mãi',
            'code.unique' => 'Mã khuyến mãi đã tồn tại',
            'name.required' => 'Vui lòng nhập tên mã',
            'discount_type.required' => 'Vui lòng chọn loại giảm',
            'discount_type.in' => 'Loại giảm không hợp lệ',
            'discount_value.required' => 'Vui lòng nhập giá trị giảm',
            'discount_value.numeric' => 'Giá trị giảm phải là số',
            'discount_value.min' => 'Giá trị giảm phải lớn hơn 0',
            'start_date.required' => 'Vui lòng chọn ngày bắt đầu',
            'start_date.date' => 'Ngày bắt đầu không hợp lệ',
            'end_date.required' => 'Vui lòng chọn ngày kết thúc',
            'end_date.date' => 'Ngày kết thúc không hợp lệ',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
        ]);

        $promotion = Promotion::create($validated);

        return response()->json([
            'message' => 'Tao ma khuyen mai thanh cong',
            'data' => $promotion,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:promotions,code,' . $promotion->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0.01',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ], [
            'code.required' => 'Vui lòng nhập mã khuyến mãi',
            'code.unique' => 'Mã khuyến mãi đã tồn tại',
            'name.required' => 'Vui lòng nhập tên mã',
            'discount_type.required' => 'Vui lòng chọn loại giảm',
            'discount_type.in' => 'Loại giảm không hợp lệ',
            'discount_value.required' => 'Vui lòng nhập giá trị giảm',
            'discount_value.numeric' => 'Giá trị giảm phải là số',
            'discount_value.min' => 'Giá trị giảm phải lớn hơn 0',
            'start_date.required' => 'Vui lòng chọn ngày bắt đầu',
            'start_date.date' => 'Ngày bắt đầu không hợp lệ',
            'end_date.required' => 'Vui lòng chọn ngày kết thúc',
            'end_date.date' => 'Ngày kết thúc không hợp lệ',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
        ]);

        $promotion->update($validated);

        return response()->json([
            'message' => 'Cap nhat ma khuyen mai thanh cong',
            'data' => $promotion->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return response()->json([
            'message' => 'Xoa ma khuyen mai thanh cong',
        ]);
    }
}
