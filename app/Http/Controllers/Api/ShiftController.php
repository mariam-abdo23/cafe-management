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
        $shifts = Shift::with(['users' => function ($query) {
            $query->select('users.id', 'name')
                ->withPivot('shift_date');
        }])->get();

        $shifts->map(function ($shift) {
            $shift->shift_date = $shift->users->first()->pivot->shift_date ?? null;
            return $shift;
        });

        return $this->sendSuccess($shifts, 'All shifts retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
            'user_ids'    => 'nullable|array',
            'user_ids.*'  => 'exists:users,id',
            'shift_date'  => $request->filled('user_ids') ? 'required|date' : 'nullable|date',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $shift = Shift::create([
            'name'       => $request->name,
            'start_time' => $request->start_time,
            'end_time'   => $request->end_time,
        ]);

        if ($request->has('user_ids')) {
            foreach ($request->user_ids as $userId) {
                $shift->users()->attach($userId, ['shift_date' => $request->shift_date]);
            }
        }

        return $this->sendSuccess([$shift->load('users')], 'Shift created successfully');
    }

    public function update(Request $request, $id)
    {
        $shift = Shift::find($id);
        if (!$shift) return $this->sendError([], 'Shift not found');

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|string',
            'start_time'  => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'user_ids'    => 'nullable|array',
            'user_ids.*'  => 'exists:users,id',
            'shift_date'  => $request->filled('user_ids') ? 'required|date' : 'nullable|date',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $shift->update($request->only('name', 'start_time', 'end_time'));

        if ($request->has('user_ids') && $request->has('shift_date')) {
            $syncData = [];
            foreach ($request->user_ids as $userId) {
                $syncData[$userId] = ['shift_date' => $request->shift_date];
            }
            $shift->users()->sync($syncData);
        }

        return $this->sendSuccess([$shift->load('users')], 'Shift updated successfully');
    }

    public function destroy($id)
    {
        $shift = Shift::find($id);
        if (!$shift) return $this->sendError([], 'Shift not found');

        $shift->users()->detach();
        $shift->delete();

        return $this->sendSuccess([], 'Shift deleted successfully');
    }

    public function myShifts()
    {
        $user = auth()->user();

        $shifts = $user->shifts()
            ->with(['users.staffProfile'])
            ->get()
            ->map(function ($shift) use ($user) {
                return [
                    'id' => $shift->id,
                    'name' => $shift->name,
                    'start_time' => $shift->start_time,
                    'end_time' => $shift->end_time,
                    'date' => $shift->pivot->shift_date,
                    'position' => $user->staffProfile->position ?? 'Not Assigned',
                    'salary' => $user->staffProfile->salary ?? 'Not Assigned',
                    'coworkers' => $shift->users
                        ->where('id', '!=', $user->id)
                        ->map(function ($coworker) {
                            return [
                                'id' => $coworker->id,
                                'name' => $coworker->name,
                                'position' => $coworker->staffProfile->position ?? 'N/A',
                                'salary' => $coworker->staffProfile->salary ?? 'N/A',
                            ];
                        })->values(),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $shifts
        ]);
    }
}
