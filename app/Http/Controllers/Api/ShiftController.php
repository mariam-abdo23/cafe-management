<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShiftController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $shifts = Shift::with('user')->get();
        return $this->sendSuccess($shifts, 'All shifts retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => 'required|exists:users,id',
            'shift_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i|after:start_time',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $shift = Shift::create($request->all());

        return $this->sendSuccess(['shift' => $shift], 'Shift created successfully');
    }

    public function show($id)
    {
        $shift = Shift::with('user')->find($id);

        if (!$shift) {
            return $this->sendError([], 'Shift not found');
        }

        return $this->sendSuccess(['shift' => $shift], 'Shift details retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $shift = Shift::find($id);

        if (!$shift) {
            return $this->sendError([], 'Shift not found');
        }

        $validator = Validator::make($request->all(), [
            'user_id'    => 'sometimes|exists:users,id',
            'shift_date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time'   => 'sometimes|date_format:H:i|after:start_time',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $shift->update($request->all());

        return $this->sendSuccess(['shift' => $shift], 'Shift updated successfully');
    }

    public function destroy($id)
    {
        $shift = Shift::find($id);

        if (!$shift) {
            return $this->sendError([], 'Shift not found');
        }

        $shift->delete();

        return $this->sendSuccess([], 'Shift deleted successfully');
    }
}