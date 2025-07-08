<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Traits\ResponseTrait;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Http\Resources\ItemResource;

class ItemController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $items = Item::with('category')->get();
        return $this->sendSuccess(ItemResource::collection($items), 'All items retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'price'       => 'required|numeric',
            'available'   => 'boolean',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $itemc = Item::create($request->all());

        return $this->sendSuccess(new ItemResource($itemc), 'Item created successfully');
    }

    public function show($id)
{
    $item = Item::with(['category', 'recipeIngredients.inventory'])->find($id);

    if (!$item) {
        return $this->sendError([], 'Item not found');
    }

    return $this->sendSuccess(new ItemResource($item), 'Item details retrieved successfully');
}


    public function update(Request $request, $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return $this->sendError([], 'Item not found');
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|required|string',
            'description' => 'nullable|string',
            'price'       => 'sometimes|required|numeric',
            'available'   => 'boolean',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $item->update($request->all());

        return $this->sendSuccess(new ItemResource($item), 'Item updated successfully');
    }

    public function destroy($id)
    {
        $itemc = Item::find($id);

        if (!$itemc) {
            return $this->sendError([], 'Item not found');
        }

        $itemc->delete();

        return $this->sendSuccess([], 'Item deleted successfully');
    }
}