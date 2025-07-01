<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\ResponseTrait;

class InventoryController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $inventories = Inventory::all();
        return $this->sendSuccess($inventories, 'All inventories retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string',
            'quantity'  => 'required|integer|min:0',
            'unit'      => 'nullable|string',
            'threshold' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation error');
        }

        $inventory = Inventory::create($request->all());
        return $this->sendSuccess(['inventory' => $inventory], 'Inventory created successfully');
    }

    public function show($id)
    {
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return $this->sendError([], 'Inventory not found');
        }

        return $this->sendSuccess(['inventory' => $inventory], 'Inventory details');
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return $this->sendError([], 'Inventory not found');
        }

        $validator = Validator::make($request->all(), [
            'name'      => 'sometimes|string',
            'quantity'  => 'sometimes|integer|min:0',
            'unit'      => 'sometimes|string',
            'threshold' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation error');
        }

        $inventory->update($request->all());
        return $this->sendSuccess(['inventory' => $inventory], 'Inventory updated successfully');
    }

    public function destroy($id)
    {
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return $this->sendError([], 'Inventory not found');
        }

        $inventory->delete();
        return $this->sendSuccess([], 'Inventory deleted successfully');
    }
}