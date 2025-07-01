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

    public function index()
    {
        $profiles = StaffProfile::with('user')->get();
        return $this->sendSuccess($profiles, 'All staff profiles retrieved successfully');
    }

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

        $profile = StaffProfile::create($request->all());

        return $this->sendSuccess([$profile], 'Staff profile created successfully'); // هنا غلفناه في array
    }

    public function show($id)
    {
        $profile = StaffProfile::with('user')->find($id);

        if (!$profile) {
            return $this->sendError([], 'Staff profile not found');
        }

        return $this->sendSuccess([$profile], 'Staff profile details retrieved successfully'); // هنا برضو
    }

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

        return $this->sendSuccess([$profile], 'Staff profile updated successfully'); // وهنا كمان
    }

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