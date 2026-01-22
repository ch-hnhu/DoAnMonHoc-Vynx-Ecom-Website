<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'message' => 'Goi den api attribute thanh cong',
            'data' => Attribute::query()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:attributes,name',
            'attribute_type' => ['required', Rule::in(['specification', 'variant', 'both'])],
            'data_type' => 'required|string|max:255',
            'unit' => 'nullable|string|max:255',
            'is_filterable' => 'boolean',
        ]);

        $attribute = Attribute::create($validated);

        return response()->json([
            'message' => 'Tao thuoc tinh thanh cong',
            'data' => $attribute,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attribute $attribute)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('attributes', 'name')->ignore($attribute->id),
            ],
            'attribute_type' => ['required', Rule::in(['specification', 'variant', 'both'])],
            'data_type' => 'required|string|max:255',
            'unit' => 'nullable|string|max:255',
            'is_filterable' => 'boolean',
        ]);

        $attribute->update($validated);

        return response()->json([
            'message' => 'Cap nhat thuoc tinh thanh cong',
            'data' => $attribute,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribute $attribute)
    {
        $attribute->delete();

        return response()->json([
            'message' => 'Xoa thuoc tinh thanh cong',
        ]);
    }

    /**
     * Display a listing of trashed attributes.
     */
    public function trashed(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 25);

            $attributes = Attribute::onlyTrashed()->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach thuoc tinh da xoa thanh cong',
                'data' => $attributes->items(),
                'error' => null,
                'pagination' => [
                    'total' => $attributes->total(),
                    'per_page' => $attributes->perPage(),
                    'current_page' => $attributes->currentPage(),
                    'last_page' => $attributes->lastPage(),
                    'from' => $attributes->firstItem(),
                    'to' => $attributes->lastItem(),
                ],
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi lay danh sach thuoc tinh da xoa',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }

    /**
     * Restore a trashed attribute.
     */
    public function restore(string $id)
    {
        try {
            $attribute = Attribute::onlyTrashed()->findOrFail($id);
            $attribute->restore();

            return response()->json([
                'success' => true,
                'message' => 'Khoi phuc thuoc tinh thanh cong',
                'data' => $attribute,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi khoi phuc thuoc tinh',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }

    /**
     * Permanently delete a trashed attribute.
     */
    public function forceDelete(string $id)
    {
        try {
            $attribute = Attribute::onlyTrashed()->findOrFail($id);
            $attribute->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Xoa vinh vien thuoc tinh thanh cong',
                'data' => null,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi xoa vinh vien thuoc tinh',
                'data' => null,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }
}
