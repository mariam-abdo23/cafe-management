<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'             => $this->id,

            // ✅ بيانات المستخدم
            'user'           => [
                'id'   => $this->user->id ?? null,
                'name' => $this->user->name ?? null,
            ],

            // ✅ بيانات الطاولة
            'dining_table'   => $this->diningTable ? [
                'id'   => $this->diningTable->id,
                'name' => $this->diningTable->name,
            ] : null,

            // ✅ نوع الطلب
            'order_type'       => $this->order_type,
            'delivery_address' => $this->delivery_address,
            'phone'            => $this->phone,
            'status'           => $this->status,
            'total_price'      => $this->total_price,
            'payment_method' => $this->payment_method,


            // ✅ تفاصيل المنتجات في الطلب
            'items' => $this->items->map(function ($item) {
                 return [
                    'id'       => $item->id,
                    'name'     => $item->name,
                    'price'    => $item->pivot->price ?? $item->price ?? 0,
                    'quantity' => $item->pivot->quantity ?? 1,
                 ];
            }),



            // ✅ بيانات الحجز المرتبط بالطلب (لو موجود)
            'reservation'    => $this->reservation ? [
                'id'               => $this->reservation->id,
                'table_id'         => $this->reservation->dining_table_id,
                'reservation_time' => $this->reservation->reservation_time,
                'duration_minutes' => $this->reservation->duration_minutes,
                'status'           => $this->reservation->status,
                'notes'            => $this->reservation->notes,
            ] : null,

            // ✅ تاريخ الإنشاء
            'created_at'     => $this->created_at->toDateTimeString(),
        ];
    }
}