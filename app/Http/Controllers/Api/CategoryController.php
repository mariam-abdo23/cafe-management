<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Traits\ResponseTrait;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $categories = Category::all();
        return $this->sendSuccess($categories, 'All Categories');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:categories,name',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation error');
        }

        $category = Category::create([
            'name' => $request->name
        ]);

        return $this->sendSuccess($category->toArray(), 'Category created successfully');
    }

    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->sendError([], 'Category not found');
        }

        return $this->sendSuccess($category->toArray(), 'Category details');
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->sendError([], 'Category not found');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:categories,name,' . $id,
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation error');
        }

        $category->update([
            'name' => $request->name
        ]);

        return $this->sendSuccess($category->toArray(), 'Category updated successfully');
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->sendError([], 'Category not found');
        }

        $category->delete();

        return $this->sendSuccess([], 'Category deleted successfully');
    }
}