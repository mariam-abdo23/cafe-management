<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\ResponseTrait;

class ReservationController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $reservations = Reservation::with(['user', 'diningTable'])->get();
        return $this->sendSuccess($reservations, 'All reservations retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'         => 'required|exists:users,id',
            'dining_table_id' => 'required|exists:dining_tables,id',
            'reservation_time'=> 'required|date',
            'duration_minutes'=> 'required|integer|min:15',
            'status'          => 'in:pending,confirmed,cancelled',
            'notes'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $reservation = Reservation::create($request->all());

        return $this->sendSuccess(['reservation' => $reservation], 'Reservation created successfully');
    }

    public function show($id)
    {
        $reservation = Reservation::with(['user', 'diningTable'])->find($id);

        if (!$reservation) {
            return $this->sendError([], 'Reservation not found');
        }

        return $this->sendSuccess(['reservation' => $reservation], 'Reservation details retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return $this->sendError([], 'Reservation not found');
        }

        $validator = Validator::make($request->all(), [
            'user_id'         => 'sometimes|exists:users,id',
            'dining_table_id' => 'sometimes|exists:dining_tables,id',
            'reservation_time'=> 'sometimes|date',
            'duration_minutes'=> 'sometimes|integer|min:15',
            'status'          => 'in:pending,confirmed,cancelled',
            'notes'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $reservation->update($request->all());

        return $this->sendSuccess(['reservation' => $reservation], 'Reservation updated successfully');
    }

    public function destroy($id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return $this->sendError([], 'Reservation not found');
        }

        $reservation->delete();

        return $this->sendSuccess([], 'Reservation deleted successfully');
    }
}