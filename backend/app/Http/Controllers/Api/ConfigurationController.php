<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
use Exception;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $configuration = Configuration::where('is_active', true)->get();
            return response()->json([
                'success' => true,
                'message' => 'Lay chi tiet cau hinh thanh cong',
                'data' => $configuration,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi lay chi tiet cau hinh',
                'data' => null,
                'error' => $ex->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'logo' => 'nullable|string|max:255',
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:255',
                'is_active' => 'sometimes|boolean',
            ]);

            $configuration = Configuration::findOrFail($id);
            $configuration->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cap nhat cau hinh thanh cong',
                'data' => $configuration,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi cap nhat cau hinh',
                'data' => null,
                'error' => $ex->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Configuration $configuration)
    {
        $configuration->delete();

        return response()->json([
            'message' => 'Xoa cau hinh thanh cong',
        ]);
    }
}