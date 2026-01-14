<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

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
    public function index(): JsonResponse
    {
        $supportRequests = SupportRequest::query()
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'message' => 'Fetched support requests successfully.',
            'data' => $supportRequests,
        ]);
    }

    public function update(Request $request, SupportRequest $supportRequest): JsonResponse
    {
        $validatedData = $request->validate([
            'full_name'    => 'sometimes|required|string|max:255',
            'email'        => 'sometimes|required|email|max:255',
            'phone'        => 'sometimes|nullable|string|max:20',
            'content'      => 'sometimes|required|string|max:1000',
            'status'       => ['sometimes', 'required', Rule::in(['pending', 'processing', 'resolved'])],
            'supported_by' => 'sometimes|nullable|integer|exists:users,id',
        ]);

        $supportRequest->fill($validatedData);
        $supportRequest->save();

        return response()->json([
            'message' => 'Support request updated successfully.',
            'data' => $supportRequest,
        ]);
    }

    public function destroy(SupportRequest $supportRequest): JsonResponse
    {
        $supportRequest->delete();

        return response()->json([
            'message' => 'Support request deleted successfully.',
        ]);
    }
}
