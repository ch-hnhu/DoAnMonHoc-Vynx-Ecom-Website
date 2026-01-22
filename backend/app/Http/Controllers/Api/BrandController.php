<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'message' => 'Goi den api brand thanh cong',
            'data' => Brand::query()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'logo_url' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('brands', 'public');
            $validated['logo_url'] = 'http://localhost:8000/storage/' . $logoPath;
        } elseif ($request->filled('logo_url')) {
            $validated['logo_url'] = $request->input('logo_url');
        }

        $brand = Brand::create($validated);

        return response()->json([
            'message' => 'Tao thuong hieu thanh cong',
            'data' => $brand,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brands', 'name')->ignore($brand->id),
            ],
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'logo_url' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('brands', 'public');
            $validated['logo_url'] = 'http://localhost:8000/storage/' . $logoPath;
        } elseif ($request->filled('logo_url')) {
            $validated['logo_url'] = $request->input('logo_url');
        } else {
            unset($validated['logo_url']);
        }

        $brand->update($validated);

        return response()->json([
            'message' => 'Cap nhat thuong hieu thanh cong',
            'data' => $brand,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();

        return response()->json([
            'message' => 'Xoa thuong hieu thanh cong',
        ]);
    }

    /**
     * Display a listing of trashed brands.
     */
    public function trashed(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 25);

            $brands = Brand::onlyTrashed()->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach thuong hieu da xoa thanh cong',
                'data' => $brands->items(),
                'error' => null,
                'pagination' => [
                    'total' => $brands->total(),
                    'per_page' => $brands->perPage(),
                    'current_page' => $brands->currentPage(),
                    'last_page' => $brands->lastPage(),
                    'from' => $brands->firstItem(),
                    'to' => $brands->lastItem(),
                ],
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi lay danh sach thuong hieu da xoa',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }

    /**
     * Restore a trashed brand.
     */
    public function restore(string $id)
    {
        try {
            $brand = Brand::onlyTrashed()->findOrFail($id);
            $brand->restore();

            return response()->json([
                'success' => true,
                'message' => 'Khoi phuc thuong hieu thanh cong',
                'data' => $brand,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi khoi phuc thuong hieu',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }

    /**
     * Permanently delete a trashed brand.
     */
    public function forceDelete(string $id)
    {
        try {
            $brand = Brand::onlyTrashed()->findOrFail($id);
            $brand->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Xoa vinh vien thuong hieu thanh cong',
                'data' => null,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi xoa vinh vien thuong hieu',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }
}
