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
        $this->updateTableStatuses();

        $reservations = Reservation::with(['user', 'diningTable'])->get();
        return $this->sendSuccess($reservations, 'All reservations retrieved successfully');
    }

    public function show($id)
    {
        $reservation = Reservation::with(['user', 'diningTable'])->find($id);

        if (!$reservation) {
            return $this->sendError([], 'Reservation not found');
        }

        return $this->sendSuccess($reservation->toArray(), 'Reservation retrieved successfully');
    }

   public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'dining_table_id'  => 'required|exists:dining_tables,id',
        'reservation_time' => 'required|date',
        'duration_minutes' => 'required|integer|min:15',
        'notes'            => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return $this->sendError($validator->errors(), 'Validation failed');
    }

    $reservation = Reservation::create([
        'user_id'          => $request->user()->id,
        'dining_table_id'  => $request->dining_table_id,
        'reservation_time' => $request->reservation_time,
        'duration_minutes' => $request->duration_minutes,
        'notes'            => $request->notes,
    ]);

    $reservation->load('diningTable');

    if ($reservation->diningTable) {
        $reservation->diningTable->update(['status' => 'reserved']);
    }

    return $this->sendSuccess(
        ['reservation' => $reservation->toArray()],
        'Reservation created successfully'
    );
}

    public function update(Request $request, $id)
    {
        $reservation = Reservation::with('diningTable')->find($id);

        if (!$reservation) {
            return $this->sendError([], 'Reservation not found');
        }

        $validator = Validator::make($request->all(), [
            'dining_table_id'  => 'sometimes|exists:dining_tables,id',
            'reservation_time' => 'sometimes|date',
            'duration_minutes' => 'sometimes|integer|min:15',
            'status'           => 'sometimes|in:pending,confirmed,cancelled',
            'notes'            => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        if (
            $request->has('dining_table_id') &&
            $request->dining_table_id != $reservation->dining_table_id &&
            $reservation->diningTable
        ) {
            $reservation->diningTable->update(['status' => 'available']);
        }

        if ($request->has('status')) {
            if ($request->status === 'cancelled' && $reservation->diningTable) {
                $reservation->diningTable->update(['status' => 'available']);
            }

            if ($request->status === 'confirmed' && $reservation->diningTable) {
                $reservation->diningTable->update(['status' => 'reserved']);
            }
        }

        $reservation->update($request->all());

        if ($request->has('dining_table_id')) {
            $reservation->load('diningTable');
            if ($reservation->diningTable) {
                $reservation->diningTable->update(['status' => 'reserved']);
            }
        }

        return $this->sendSuccess(['reservation' => $reservation->toArray()], 'Reservation updated successfully');
    }

    public function destroy($id)
    {
        $reservation = Reservation::with('diningTable')->find($id);

        if (!$reservation) {
            return $this->sendError([], 'Reservation not found');
        }

        if ($reservation->diningTable) {
            $reservation->diningTable->update(['status' => 'available']);
        }

        $reservation->delete();

        return $this->sendSuccess([], 'Reservation deleted successfully');
    }

    public function updateTableStatuses()
    {
        $now = now();

        $reservations = Reservation::with('diningTable')->get();

        foreach ($reservations as $reservation) {
            $table = $reservation->diningTable;

            if (!$table) continue;

            if ($reservation->status === 'cancelled') {
                $table->status = 'available';
            } else {
                $endTime = \Carbon\Carbon::parse($reservation->reservation_time)
                    ->addMinutes($reservation->duration_minutes);

                $table->status = $now->greaterThanOrEqualTo($endTime) ? 'available' : 'reserved';
            }

            $table->save();
        }

        return response()->json(['message' => 'Statuses updated successfully']);
    }

    public function myReservation()
    {
        $reservations = Reservation::with('diningTable')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'data' => $reservations
        ]);
    }
}