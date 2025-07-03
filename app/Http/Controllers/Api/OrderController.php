<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\ResponseTrait;
use App\Http\Resources\OrderResource;

class OrderController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $orders = Order::with(['user', 'diningTable', 'items'])->get();
        return $this->sendSuccess(OrderResource::collection($orders), 'All orders retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'         => 'required|exists:users,id',
            'order_type'      => 'required|in:dine_in,takeaway,delivery',
            'dining_table_id' => 'nullable|exists:dining_tables,id',
            'items'           => 'required|array',
            'items.*.id'      => 'required|exists:items,id',
            'items.*.quantity'=> 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $total = 0;
        foreach ($request->items as $item) {
            $itemModel = Item::find($item['id']);
            $total += $itemModel->price * $item['quantity'];
        }

        $order = Order::create([
            'user_id'         => $request->user_id,
            'dining_table_id' => $request->dining_table_id,
            'order_type'      => $request->order_type,
            'total_price'     => $total,
            'status'          => 'pending',
        ]);

        foreach ($request->items as $item) {
            $itemModel = Item::find($item['id']);
            $order->items()->attach($itemModel->id, [
                'quantity' => $item['quantity'],
                'price'    => $itemModel->price,
            ]);
        }

        return $this->sendSuccess(new OrderResource($order->load(['user', 'diningTable', 'items'])), 'Order created successfully');
    }

    public function show($id)
    {
        $order = Order::with(['user', 'diningTable', 'items'])->find($id);

        if (!$order) {
            return $this->sendError([], 'Order not found');
        }

        return $this->sendSuccess(new OrderResource($order), 'Order details retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return $this->sendError([], 'Order not found');
        }

        $validator = Validator::make($request->all(), [
            'status' => 'in:pending,preparing,ready,delivered'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $order->update($request->only('status'));

        return $this->sendSuccess(new OrderResource($order->load(['user', 'diningTable', 'items'])), 'Order updated successfully');
    }

    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return $this->sendError([], 'Order not found');
        }

        $order->items()->detach();
        $order->delete();

        return $this->sendSuccess([], 'Order deleted successfully');
    }
}