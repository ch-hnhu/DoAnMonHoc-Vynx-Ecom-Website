<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slideshow;
use Exception;

class SlideshowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $slideshows = Slideshow::orderBy('position')->get();

            return response()->json([
                'success' => true,
                'message' => 'Lay danh sach slideshow thanh cong',
                'data' => $slideshows,
                'error' => null,
                'timestamp' => now(),
            ]);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Loi khi lay danh sach slideshow',
                'data' => null,
                'error' => $ex->getMessage(),
                'timestamp' => now(),
            ]);
        }
    }
}
