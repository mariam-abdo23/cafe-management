<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RecipeIngredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\ResponseTrait;

class RecipeIngredientController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $ingredients = RecipeIngredient::with(['item', 'inventory'])->get();
        return $this->sendSuccess($ingredients, 'All recipe ingredients retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_id'       => 'required|exists:items,id',
            'inventory_id'  => 'required|exists:inventories,id',
            'quantity'      => 'required|numeric|min:0',
            'unit'          => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation error');
        }

        $ingredient = RecipeIngredient::create($request->all());
        return $this->sendSuccess(['ingredient' => $ingredient], 'Recipe ingredient created successfully');
    }

    public function show($id)
    {
        $ingredient = RecipeIngredient::with(['item', 'inventory'])->find($id);

        if (!$ingredient) {
            return $this->sendError([], 'Recipe ingredient not found');
        }

        return $this->sendSuccess(['ingredient' => $ingredient], 'Recipe ingredient details');
    }

    public function update(Request $request, $id)
    {
        $ingredient = RecipeIngredient::find($id);

        if (!$ingredient) {
            return $this->sendError([], 'Recipe ingredient not found');
        }

        $validator = Validator::make($request->all(), [
            'item_id'       => 'sometimes|exists:items,id',
            'inventory_id'  => 'sometimes|exists:inventories,id',
            'quantity'      => 'sometimes|numeric|min:0',
            'unit'          => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation error');
        }

        $ingredient->update($request->all());
        return $this->sendSuccess(['ingredient' => $ingredient], 'Recipe ingredient updated successfully');
    }

    public function destroy($id)
    {
        $ingredient = RecipeIngredient::find($id);

        if (!$ingredient) {
            return $this->sendError([], 'Recipe ingredient not found');
        }

        $ingredient->delete();
        return $this->sendSuccess([], 'Recipe ingredient deleted successfully');
    }
}
