<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiningableResource;
use App\Models\DiningTable;
use Illuminate\Http\Request;
use App\Traits\ResponseTrait;
use Illuminate\Support\Facades\Validator;

class DiningTableController extends Controller
{
    use ResponseTrait;

    /**
     * Display a listing of the dining tables.
     */
    public function index()
    {
        $tables = DiningTable::all();
        return $this->sendSuccess(DiningableResource::collection($tables), 'All dining tables retrieved successfully');
    }

    /**
     * Store a newly created dining table.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'   => 'required|string|unique:dining_tables,name',
            'status' => 'in:available,occupied,reserved',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $table = DiningTable::create([
            'name'   => $request->name,
            'status' => $request->status ?? 'available',
        ]);

        return $this->sendSuccess(new DiningableResource($table), 'Dining table created successfully');
    }

    /**
     * Display the specified dining table.
     */
    public function show($id)
    {
        $table = DiningTable::find($id);

        if (!$table) {
            return $this->sendError([], 'Dining table not found');
        }

        return $this->sendSuccess(new DiningableResource($table), 'Dining table details retrieved successfully');
    }

    /**
     * Update the specified dining table.
     */
    public function update(Request $request, $id)
    {
        $table = DiningTable::find($id);

        if (!$table) {
            return $this->sendError([], 'Dining table not found');
        }

        $validator = Validator::make($request->all(), [
            'name'   => 'sometimes|required|string|unique:dining_tables,name,' . $id,
            'status' => 'in:available,occupied,reserved',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $table->update($request->only('name', 'status'));

        return $this->sendSuccess(new DiningableResource($table), 'Dining table updated successfully');
    }

    /**
     * Remove the specified dining table.
     */
    public function destroy($id)
    {
        $table = DiningTable::find($id);

        if (!$table) {
            return $this->sendError([], 'Dining table not found');
        }

        $table->delete();

        return $this->sendSuccess([], 'Dining table deleted successfully');
    }
}