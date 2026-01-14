<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SupportRequestController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'full_name' => 'required|string|max:255',
            'email'     => 'required|email|max:255',
            'phone'     => 'nullable|string|max:20',
            'content'   => 'required|string|max:1000',
        ]);

        $supportRequest = SupportRequest::create([
            'full_name' => $validatedData['full_name'],
            'email'     => $validatedData['email'],
            'phone'     => $validatedData['phone'] ?? null,
            'content'   => $validatedData['content'],
            'status'    => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Yêu cầu hỗ trợ đã được gửi thành công.',
            'data'    => $supportRequest,
        ], 201);
    }
}