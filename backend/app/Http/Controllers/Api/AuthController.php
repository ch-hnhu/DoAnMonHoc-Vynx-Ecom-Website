<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Đăng ký người dùng mới
     */
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ], [
            'email.unique' => 'Email này đã được sử dụng.',
            'username.unique' => 'Tên đăng nhập này đã được sử dụng.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
        ]);

        // Tạo user mới với role mặc định là customer
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'role' => 'customer', // Mặc định là customer
            'is_active' => true,
        ]);

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Dang ky thanh cong',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'image' => $user->image,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * Đăng nhập người dùng
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Tên đăng nhập hoặc mật khẩu không chính xác.'],
            ]);
        }

        // Kiểm tra tài khoản có active không
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Tai khoan cua ban da bi vo hieu hoa.',
            ], 403);
        }

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Dang nhap thanh cong',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'image' => $user->image,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Đăng xuất người dùng
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Dang xuat thanh cong',
        ], 200);
    }

    /**
     * Lấy thông tin người dùng hiện tại
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'dob' => $user->dob,
                'email' => $user->email,
                'phone' => $user->phone,
                'image' => $user->image,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ],
        ], 200);
    }

    /**
     * Cập nhật thông tin người dùng
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Chuyển chuỗi rỗng thành null trước khi validate
        if ($request->dob === '') {
            $request->merge(['dob' => null]);
        }
        if ($request->phone === '') {
            $request->merge(['phone' => null]);
        }

        // Validate dữ liệu
        $request->validate([
            'full_name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'email.unique' => 'Email này đã được sử dụng.',
            'full_name.required' => 'Họ và tên không được để trống.',
            'email.required' => 'Email không được để trống.',
            'email.email' => 'Email không hợp lệ.',
            'image.image' => 'File phải là ảnh.',
            'image.mimes' => 'Ảnh phải có định dạng: jpeg, png, jpg, gif.',
            'image.max' => 'Kích thước ảnh không được vượt quá 2MB.',
        ]);

        // Cập nhật thông tin
        $user->full_name = $request->full_name;
        $user->email = $request->email;
        // Chuỗi rỗng sẽ được chuyển thành null (đã xử lý ở trên)
        $user->dob = $request->dob;
        $user->phone = $request->phone;

        // Xử lý upload ảnh
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu có
            if ($user->image && file_exists(public_path($user->image))) {
                unlink(public_path($user->image));
            }

            // Lưu ảnh mới
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/avatars'), $imageName);
            $user->image = '/uploads/avatars/' . $imageName;
        }

        $user->save();

        return response()->json([
            'message' => 'Cập nhật thông tin thành công',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'dob' => $user->dob,
                'email' => $user->email,
                'phone' => $user->phone,
                'image' => $user->image,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ],
        ], 200);
    }
}