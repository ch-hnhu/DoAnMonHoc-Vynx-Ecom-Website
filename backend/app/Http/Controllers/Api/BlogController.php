<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BlogController extends Controller
{
	public function index(Request $request): JsonResponse
	{
		try {
			$perPage = (int) $request->input('per_page', 10);
			$search = trim((string) $request->input('search', ''));
			$hasActiveFilter = $request->has('is_active');
			$isActive = $hasActiveFilter
				? filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN)
				: null;

			$query = Blog::query()->orderByDesc('published_at')->orderByDesc('created_at');

			if ($hasActiveFilter) {
				$query->where('is_active', $isActive);
			}

			if ($search !== '') {
				$query->where(function ($subQuery) use ($search) {
					$subQuery->where('title', 'like', '%' . $search . '%')
						->orWhere('content', 'like', '%' . $search . '%')
						->orWhere('author_name', 'like', '%' . $search . '%');
				});
			}

			$blogs = $query->paginate($perPage);

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach bai viet thanh cong',
				'data' => $blogs->items(),
				'pagination' => [
					'total' => $blogs->total(),
					'per_page' => $blogs->perPage(),
					'current_page' => $blogs->currentPage(),
					'last_page' => $blogs->lastPage(),
					'from' => $blogs->firstItem(),
					'to' => $blogs->lastItem(),
				],
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach bai viet',
				'data' => null,
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	public function show(Blog $blog): JsonResponse
	{
		return response()->json([
			'success' => true,
			'message' => 'Lay bai viet thanh cong',
			'data' => $blog,
			'timestamp' => now(),
		]);
	}

	public function store(Request $request): JsonResponse
	{
		try {
			$validated = $request->validate([
				'author_name' => 'required|string|max:255',
				'published_at' => 'nullable|date',
				'title' => 'required|string|max:255',
				'content' => 'required|string',
				'is_active' => 'nullable|boolean',
				'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
				'image_url' => 'nullable|string|max:255',
			]);

			$imageUrl = null;
			if ($request->hasFile('image')) {
				$imagePath = $request->file('image')->store('blogs/images', 'public');
				$imageUrl = 'http://localhost:8000/storage/' . $imagePath;
			} elseif ($request->filled('image_url')) {
				$imageUrl = $request->input('image_url');
			}

			if ($imageUrl !== null) {
				$validated['image_url'] = $imageUrl;
			}

			unset($validated['image']);

			$blog = Blog::create($validated);

			return response()->json([
				'success' => true,
				'message' => 'Tao bai viet thanh cong',
				'data' => $blog,
				'timestamp' => now(),
			], 201);
		} catch (ValidationException $ex) {
			throw $ex;
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi tao bai viet',
				'data' => null,
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	public function update(Request $request, Blog $blog): JsonResponse
	{
		try {
			$validated = $request->validate([
				'author_name' => 'sometimes|required|string|max:255',
				'published_at' => 'sometimes|nullable|date',
				'title' => 'sometimes|required|string|max:255',
				'content' => 'sometimes|required|string',
				'is_active' => 'sometimes|nullable|boolean',
				'image' => 'sometimes|nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
				'image_url' => 'sometimes|nullable|string|max:255',
			]);

			$imageUrl = null;
			$hasImageChange = false;

			if ($request->hasFile('image')) {
				$imagePath = $request->file('image')->store('blogs/images', 'public');
				$imageUrl = 'http://localhost:8000/storage/' . $imagePath;
				$hasImageChange = true;
			} elseif ($request->has('image_url')) {
				$imageUrl = $request->input('image_url');
				$hasImageChange = true;
			}

			if ($hasImageChange) {
				$validated['image_url'] = $imageUrl;
			}

			unset($validated['image']);

			$blog->fill($validated);
			$blog->save();

			return response()->json([
				'success' => true,
				'message' => 'Cap nhat bai viet thanh cong',
				'data' => $blog,
				'timestamp' => now(),
			]);
		} catch (ValidationException $ex) {
			throw $ex;
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi cap nhat bai viet',
				'data' => null,
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	public function destroy(Blog $blog): JsonResponse
	{
		try {
			$blog->delete();

			return response()->json([
				'success' => true,
				'message' => 'Xoa bai viet thanh cong',
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi xoa bai viet',
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Display a listing of trashed blogs.
	 */
	public function trashed(Request $request): JsonResponse
	{
		try {
			$perPage = (int) $request->input('per_page', 25);
			$search = trim((string) $request->input('search', ''));

			$query = Blog::onlyTrashed()->orderByDesc('deleted_at');

			if ($search !== '') {
				$query->where(function ($subQuery) use ($search) {
					$subQuery->where('title', 'like', '%' . $search . '%')
						->orWhere('content', 'like', '%' . $search . '%')
						->orWhere('author_name', 'like', '%' . $search . '%');
				});
			}

			$blogs = $query->paginate($perPage);

			return response()->json([
				'success' => true,
				'message' => 'Lay danh sach bai viet da xoa thanh cong',
				'data' => $blogs->items(),
				'pagination' => [
					'total' => $blogs->total(),
					'per_page' => $blogs->perPage(),
					'current_page' => $blogs->currentPage(),
					'last_page' => $blogs->lastPage(),
					'from' => $blogs->firstItem(),
					'to' => $blogs->lastItem(),
				],
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi lay danh sach bai viet da xoa',
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Restore a trashed blog.
	 */
	public function restore(string $id): JsonResponse
	{
		try {
			$blog = Blog::onlyTrashed()->findOrFail($id);
			$blog->restore();

			return response()->json([
				'success' => true,
				'message' => 'Khoi phuc bai viet thanh cong',
				'data' => $blog,
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi khoi phuc bai viet',
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}

	/**
	 * Permanently delete a trashed blog.
	 */
	public function forceDelete(string $id): JsonResponse
	{
		try {
			$blog = Blog::onlyTrashed()->findOrFail($id);
			$blog->forceDelete();

			return response()->json([
				'success' => true,
				'message' => 'Xoa vinh vien bai viet thanh cong',
				'timestamp' => now(),
			]);
		} catch (\Throwable $th) {
			return response()->json([
				'success' => false,
				'message' => 'Loi khi xoa vinh vien bai viet',
				'error' => $th->getMessage(),
				'timestamp' => now(),
			], 500);
		}
	}
}