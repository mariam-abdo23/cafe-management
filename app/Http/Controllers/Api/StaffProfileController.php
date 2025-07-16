<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffProfile;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StaffProfileController extends Controller
{
    use ResponseTrait;

    // عرض كل الموظفين
    public function index()
    {
        $profiles = StaffProfile::with('user')->get();
        return $this->sendSuccess($profiles, 'All staff profiles retrieved successfully');
    }

    // إنشاء ملف موظف (في حال حابة تديري الموظفين يدويًا)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => 'required|exists:users,id',
            'position'   => 'required|string',
            'salary'     => 'required|numeric|min:0',
            'shift_time' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        // لو موجود بالفعل، نرجع خطأ
        if (StaffProfile::where('user_id', $request->user_id)->exists()) {
            return $this->sendError([], 'Staff profile already exists for this user');
        }

        $profile = StaffProfile::create($request->all());

        return $this->sendSuccess([$profile], 'Staff profile created successfully');
    }

    // عرض ملف موظف واحد
    public function show($id)
    {
        $profile = StaffProfile::with('user')->find($id);

        if (!$profile) {
            return $this->sendError([], 'Staff profile not found');
        }

        return $this->sendSuccess([$profile], 'Staff profile details retrieved successfully');
    }

    // تعديل بيانات موظف
    public function update(Request $request, $id)
    {
        $profile = StaffProfile::find($id);

        if (!$profile) {
            return $this->sendError([], 'Staff profile not found');
        }

        $validator = Validator::make($request->all(), [
            'user_id'    => 'sometimes|exists:users,id',
            'position'   => 'sometimes|string',
            'salary'     => 'sometimes|numeric|min:0',
            'shift_time' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $profile->update($request->all());

        return $this->sendSuccess([$profile], 'Staff profile updated successfully');
    }

    // حذف موظف
    public function destroy($id)
    {
        $profile = StaffProfile::find($id);

        if (!$profile) {
            return $this->sendError([], 'Staff profile not found');
        }

        $profile->delete();

        return $this->sendSuccess([], 'Staff profile deleted successfully');
    }
}
