<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
	public function vnpay_payment(Request $request)
	{
		$data = $request->all();
		$code_cart = $data['order_id'];
		$vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
		$vnp_Returnurl = "http://localhost:5173/thanh-toan-thanh-cong";
		$vnp_TmnCode = "6KHAYZFD";
		$vnp_HashSecret = "BDIEVYW9TK7D1VF3NVMRW8GN2W4RUYA0";

		$vnp_TxnRef = $code_cart;
		$vnp_OrderInfo = 'Thanh toán đơn hàng #' . $code_cart;
		$vnp_OrderType = 'billpayment';

		$amount = isset($data['total_vnpay']) ? $data['total_vnpay'] : 0;
		$vnp_Amount = $amount * 100;

		$vnp_Locale = 'vn';
		$vnp_IpAddr = $request->ip();

		$inputData = array(
			"vnp_Version" => "2.1.0",
			"vnp_TmnCode" => $vnp_TmnCode,
			"vnp_Amount" => $vnp_Amount,
			"vnp_Command" => "pay",
			"vnp_CreateDate" => date('YmdHis'),
			"vnp_CurrCode" => "VND",
			"vnp_IpAddr" => $vnp_IpAddr,
			"vnp_Locale" => $vnp_Locale,
			"vnp_OrderInfo" => $vnp_OrderInfo,
			"vnp_OrderType" => $vnp_OrderType,
			"vnp_ReturnUrl" => $vnp_Returnurl,
			"vnp_TxnRef" => $vnp_TxnRef,
		);

		if (isset($data['vnp_BankCode']) && $data['vnp_BankCode'] != "") {
			$inputData['vnp_BankCode'] = $data['vnp_BankCode'];
		}
		if (isset($data['vnp_Bill_State']) && $data['vnp_Bill_State'] != "") {
			$inputData['vnp_Bill_State'] = $data['vnp_Bill_State'];
		}

		ksort($inputData);
		$query = "";
		$i = 0;
		$hashdata = "";
		foreach ($inputData as $key => $value) {
			if ($i == 1) {
				$hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
			} else {
				$hashdata .= urlencode($key) . "=" . urlencode($value);
				$i = 1;
			}
			$query .= urlencode($key) . "=" . urlencode($value) . '&';
		}

		$vnp_Url = $vnp_Url . "?" . $query;
		if (isset($vnp_HashSecret)) {
			$vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
			$vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
		}

		return response()->json([
			'code' => '00',
			'message' => 'success',
			'data' => $vnp_Url
		]);
	}
}
