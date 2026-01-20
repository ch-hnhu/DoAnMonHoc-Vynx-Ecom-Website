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
            $configuration = Configuration::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
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
     * Display all configurations.
     */
    public function all()
    {
        try {
            $configurations = Configuration::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach cau hinh thanh cong',
                'data' => $configurations,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi lay danh sach cau hinh',
                'data' => null,
                'error' => $ex->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }

    /**
     * Display the active configuration (only one).
     */
    public function active()
    {
        try {
            $activeConfigurations = Configuration::where('is_active', true)
                ->orderByDesc('updated_at')
                ->get();

            if ($activeConfigurations->count() > 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Co nhieu cau hinh dang active. Vui long tat bot truoc khi hien thi.',
                    'data' => $activeConfigurations,
                    'error' => 'MULTIPLE_ACTIVE_CONFIGURATIONS',
                    'timestamp' => now(),
                ], 409);
            }

            $activeConfiguration = $activeConfigurations->first();

            return response()->json([
                'success' => true,
                'message' => 'Lay chi tiet cau hinh thanh cong',
                'data' => $activeConfiguration,
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:255',
                'is_active' => 'sometimes|boolean',
            ]);

            $logoUrl = null;
            if ($request->hasFile('logo')) {
                $request->validate([
                    'logo' => 'image|mimes:jpeg,jpg,png,gif,webp|max:2048',
                ]);
                $logoPath = $request->file('logo')->store('configurations/logos', 'public');
                $logoUrl = 'http://localhost:8000/storage/' . $logoPath;
            } elseif ($request->filled('logo')) {
                $request->validate([
                    'logo' => 'string|max:255',
                ]);
                $logoUrl = $request->input('logo');
            }

            if ($logoUrl !== null) {
                $validated['logo'] = $logoUrl;
            }

            if (!empty($validated['is_active']) && $validated['is_active']) {
                Configuration::where('is_active', true)->update(['is_active' => false]);
            }

            $configuration = Configuration::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tao cau hinh thanh cong',
                'data' => $configuration,
                'error' => null,
                'timestamp' => now(),
            ], 201);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi tao cau hinh',
                'data' => null,
                'error' => $ex->getMessage(),
                'timestamp' => now(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:255',
                'is_active' => 'sometimes|boolean',
            ]);

            $configuration = Configuration::findOrFail($id);

            $logoProvided = $request->hasFile('logo') || $request->filled('logo');
            if ($logoProvided) {
                if ($request->hasFile('logo')) {
                    $request->validate([
                        'logo' => 'image|mimes:jpeg,jpg,png,gif,webp|max:2048',
                    ]);
                    $logoPath = $request->file('logo')->store('configurations/logos', 'public');
                    $validated['logo'] = 'http://localhost:8000/storage/' . $logoPath;
                } else {
                    $request->validate([
                        'logo' => 'string|max:255',
                    ]);
                    $validated['logo'] = $request->input('logo');
                }
            }

            if ($request->boolean('is_active')) {
                Configuration::where('id', '!=', $id)
                    ->where('is_active', true)
                    ->update(['is_active' => false]);
            }

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