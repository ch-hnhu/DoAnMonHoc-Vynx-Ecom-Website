<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
use Exception;

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
