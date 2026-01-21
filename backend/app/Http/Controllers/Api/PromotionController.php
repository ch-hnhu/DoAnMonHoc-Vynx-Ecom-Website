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

	public function check(Request $request)
	{
		$code = $request->input('code');
		if (!$code) {
			return response()->json(['success' => false, 'message' => 'Vui lòng nhập mã giảm giá']);
		}

		$promotion = Promotion::where('code', $code)->first();

		if (!$promotion) {
			return response()->json(['success' => false, 'message' => 'Mã giảm giá không tồn tại']);
		}

		$now = now();
		if ($now < $promotion->start_date || $now > $promotion->end_date) {
			return response()->json(['success' => false, 'message' => 'Mã giảm giá đã hết hiệu lực']);
		}

		return response()->json([
			'success' => true,
			'message' => 'Áp dụng mã giảm giá thành công',
			'data' => $promotion
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
