<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page');

        if ($perPage) {
            $users = User::query()->orderByDesc('created_at')->paginate((int) $perPage);
            return response()->json([
                'message' => 'Goi den api user thanh cong',
                'data' => $users->items(),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ],
            ]);
        }

        return response()->json([
            'message' => 'Goi den api user thanh cong',
            'data' => User::query()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(['admin', 'employee', 'customer'])],
            'is_active' => 'required|boolean',
        ], [
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'is_active' => $validated['is_active'],
        ]);

        return response()->json([
            'message' => 'Tao nguoi dung thanh cong',
            'data' => $user,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json([
            'message' => 'Lay thong tin nguoi dung thanh cong',
            'data' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:6',
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'role' => ['sometimes', 'required', Rule::in(['admin', 'employee', 'customer'])],
            'is_active' => 'sometimes|required|boolean',
        ], [
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ]);

        if (isset($validated['password']) && $validated['password'] !== '') {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Cap nhat nguoi dung thanh cong',
            'data' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Xoa nguoi dung thanh cong',
        ]);
    }

    /**
     * Display a listing of trashed users.
     */
    public function trashed(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 25);
            $users = User::onlyTrashed()
                ->orderBy('deleted_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach nguoi dung da xoa thanh cong',
                'data' => $users->items(),
                'error' => null,
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ],
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi lay danh sach nguoi dung da xoa',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }

    /**
     * Restore a trashed user.
     */
    public function restore(string $id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);
            $user->restore();

            return response()->json([
                'success' => true,
                'message' => 'Khoi phuc nguoi dung thanh cong',
                'data' => $user,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi khoi phuc nguoi dung',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }

    /**
     * Permanently delete a trashed user.
     */
    public function forceDelete(string $id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);
            $user->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Xoa vinh vien nguoi dung thanh cong',
                'data' => null,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi xoa vinh vien nguoi dung',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }
}
