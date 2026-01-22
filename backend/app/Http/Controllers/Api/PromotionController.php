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

	/**
	 * Display a listing of trashed promotions.
	 */
	public function trashed(Request $request)
	{
		try {
			$perPage = (int) $request->input('per_page', 25);
			$search = trim((string) $request->input('search', ''));

			$query = Promotion::onlyTrashed()->orderByDesc('deleted_at');

			if ($search !== '') {
				$query->where(function ($subQuery) use ($search) {
					$subQuery->where('code', 'like', '%' . $search . '%')
						->orWhere('name', 'like', '%' . $search . '%')
						->orWhere('description', 'like', '%' . $search . '%');
				});
			}

			$promotions = $query->paginate($perPage);

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach ma khuyen mai da xoa thanh cong',
				'data' => $promotions->items(),
				'pagination' => [
					'total' => $promotions->total(),
					'per_page' => $promotions->perPage(),
					'current_page' => $promotions->currentPage(),
					'last_page' => $promotions->lastPage(),
					'from' => $promotions->firstItem(),
					'to' => $promotions->lastItem(),
				],
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach ma khuyen mai da xoa',
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Restore a trashed promotion.
	 */
	public function restore(string $id)
	{
		try {
			$promotion = Promotion::onlyTrashed()->findOrFail($id);
			$promotion->restore();

			return response()->json([
				'success' => true,
				'message' => 'Khoi phuc ma khuyen mai thanh cong',
				'data' => $promotion,
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi khoi phuc ma khuyen mai',
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Permanently delete a trashed promotion.
	 */
	public function forceDelete(string $id)
	{
		try {
			$promotion = Promotion::onlyTrashed()->findOrFail($id);
			$promotion->forceDelete();

			return response()->json([
				'success' => true,
				'message' => 'Xoa vinh vien ma khuyen mai thanh cong',
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi xoa vinh vien ma khuyen mai',
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}
	public function check(Request $request)
	{
		$code = $request->input('code');

		if (!$code) {
			return response()->json([
				'success' => false,
				'message' => 'Vui lòng nhập mã giảm giá',
			]);
		}

		$promotion = Promotion::where('code', $code)->first();

		if (!$promotion) {
			return response()->json([
				'success' => false,
				'message' => 'Mã giảm giá không tồn tại',
			]);
		}

		$now = now();
		if ($now < $promotion->start_date) {
			return response()->json([
				'success' => false,
				'message' => 'Mã giảm giá chưa bắt đầu',
			]);
		}

		if ($now > $promotion->end_date) {
			return response()->json([
				'success' => false,
				'message' => 'Mã giảm giá đã hết hạn',
			]);
		}

		return response()->json([
			'success' => true,
			'message' => 'Áp dụng mã giảm giá thành công',
			'data' => $promotion,
		]);
	}
}