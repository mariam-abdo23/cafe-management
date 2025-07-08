<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Item;
use App\Models\Reservation;
use App\Models\DiningTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\ResponseTrait;
use App\Http\Resources\OrderResource;

class OrderController extends Controller
{
    use ResponseTrait;

    public function index()
    {
        $orders = Order::with(['user', 'diningTable', 'items', 'reservation'])->get();
        return $this->sendSuccess(OrderResource::collection($orders), 'All orders retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'          => 'required|exists:users,id',
            'order_type'       => 'required|in:dine_in,takeaway,delivery',
            'dining_table_id'  => 'nullable|exists:dining_tables,id',
            'delivery_address' => 'required_if:order_type,delivery|string|nullable',
            'phone'            => 'required_if:order_type,delivery|string|nullable|digits:11',
            'items'            => 'required|array|min:1',
            'items.*.id'       => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'reservation_id'   => 'nullable|exists:reservations,id',
            'payment_method'   => 'required|in:cash,card,online',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        if ($request->order_type === 'dine_in') {
            $table = DiningTable::find($request->dining_table_id);
            if (!$request->reservation_id && $table && $table->status !== 'available') {
                return $this->sendError([], 'Table is not available');
            }
        }

        $total = 0;
        foreach ($request->items as $item) {
            $itemModel = Item::find($item['id']);
            $total += $itemModel->price * $item['quantity'];
        }

        $order = Order::create([
            'user_id'         => $request->user_id,
            'order_type'      => $request->order_type,
            'payment_method'  => $request->payment_method,
            'dining_table_id' => $request->order_type === 'dine_in' ? $request->dining_table_id : null,
            'delivery_address'=> $request->order_type === 'delivery' ? $request->delivery_address : null,
            'phone'           => $request->order_type === 'delivery' ? $request->phone : null,
            'total_price'     => $total,
            'status'          => 'pending',
            'reservation_id'  => $request->reservation_id,
        ]);
        $order->load('reservation', 'user', 'diningTable', 'items');

        foreach ($request->items as $item) {
            $itemModel = Item::find($item['id']);
            $order->items()->attach($itemModel->id, [
                'quantity' => $item['quantity'],
                'price'    => $itemModel->price,
            ]);
        }

        if ($request->reservation_id) {
            $reservation = Reservation::find($request->reservation_id);
            if ($reservation) {
                $reservation->status = 'confirmed';
                $reservation->save();
            }
        }

        return $this->sendSuccess(
            new OrderResource($order->load(['user', 'diningTable', 'items', 'reservation'])),
            'Order created successfully'
        );
    }

    public function show($id)
    {
        $order = Order::with(['user', 'diningTable', 'items', 'reservation'])->find($id);

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
            'order_type'       => 'sometimes|in:dine_in,takeaway,delivery',
            'delivery_address' => 'nullable|string',
            'phone'            => 'nullable|string|digits:11',
            'status'           => 'sometimes|in:pending,preparing,ready,delivered,cancelled',
            'items'            => 'nullable|array',
            'items.*.id'       => 'required_with:items|exists:items,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'payment_method'   => 'sometimes|in:cash,card,online',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $order->update([
            'order_type'       => $request->order_type ?? $order->order_type,
            'payment_method'   => $request->payment_method ?? $order->payment_method,
            'delivery_address' => $request->delivery_address ?? $order->delivery_address,
            'phone'            => $request->phone ?? $order->phone,
            'status'           => $request->status ?? $order->status,
        ]);

        if ($request->has('items')) {
            $order->items()->detach();
            $total = 0;

            foreach ($request->items as $item) {
                $itemModel = Item::find($item['id']);
                $total += $itemModel->price * $item['quantity'];
                $order->items()->attach($itemModel->id, [
                    'quantity' => $item['quantity'],
                    'price'    => $itemModel->price,
                ]);
            }

            $order->update(['total_price' => $total]);
        }

        return $this->sendSuccess(
            new OrderResource($order->load(['user', 'diningTable', 'items', 'reservation'])),
            'Order updated successfully'
        );
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

    public function myOrders()
    {
        $orders = Order::with(['items', 'diningTable', 'reservation'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return $this->sendSuccess(OrderResource::collection($orders), 'My Orders Retrieved');
    }
}
