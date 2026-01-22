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
            ->with(['user:id,email'])
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

    /**
     * Display a listing of trashed support requests.
     */
    public function trashed(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 25);

            $supportRequests = SupportRequest::onlyTrashed()
                ->with(['user:id,email'])
                ->orderByDesc('deleted_at')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach lien he da xoa thanh cong',
                'data' => $supportRequests->items(),
                'error' => null,
                'pagination' => [
                    'total' => $supportRequests->total(),
                    'per_page' => $supportRequests->perPage(),
                    'current_page' => $supportRequests->currentPage(),
                    'last_page' => $supportRequests->lastPage(),
                    'from' => $supportRequests->firstItem(),
                    'to' => $supportRequests->lastItem(),
                ],
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi lay danh sach lien he da xoa',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }

    /**
     * Restore a trashed support request.
     */
    public function restore(string $id): JsonResponse
    {
        try {
            $supportRequest = SupportRequest::onlyTrashed()->with(['user:id,email'])->findOrFail($id);
            $supportRequest->restore();

            return response()->json([
                'success' => true,
                'message' => 'Khoi phuc lien he thanh cong',
                'data' => $supportRequest,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi khoi phuc lien he',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }

    /**
     * Permanently delete a trashed support request.
     */
    public function forceDelete(string $id): JsonResponse
    {
        try {
            $supportRequest = SupportRequest::onlyTrashed()->findOrFail($id);
            $supportRequest->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Xoa vinh vien lien he thanh cong',
                'data' => null,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi xoa vinh vien lien he',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }
}
