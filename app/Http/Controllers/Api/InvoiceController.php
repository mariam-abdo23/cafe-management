<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    use ResponseTrait;

    // ✅ عرض كل الفواتير
    public function index()
    {
        $invoices = Invoice::with('order')->get();
        return $this->sendSuccess($invoices, 'All invoices retrieved successfully');
    }

    // ✅ إنشاء فاتورة
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id'       => 'required|exists:orders,id',
            'amount'         => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,online',
            'status'         => 'in:paid,unpaid',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        if (Invoice::where('order_id', $request->order_id)->exists()) {
            return $this->sendError([], 'Invoice already exists for this order');
        }

        $invoice = Invoice::create($request->all());

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice created successfully');
    }

    // ✅ عرض فاتورة معينة
    public function show($id)
    {
        $invoice = Invoice::with('order')->find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice details retrieved successfully');
    }

    // ✅ تحديث فاتورة
    public function update(Request $request, $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        if (count($request->all()) === 0) {
            return $this->sendError([], 'No data provided to update');
        }

        $validator = Validator::make($request->all(), [
            'order_id'       => 'sometimes|exists:orders,id',
            'amount'         => 'sometimes|numeric|min:0',
            'payment_method' => 'sometimes|in:cash,card,online',
            'status'         => 'in:paid,unpaid',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $invoice->update($request->all());

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice updated successfully');
    }

    // ✅ حذف فاتورة
    public function destroy($id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        $invoice->delete();

        return $this->sendSuccess([], 'Invoice deleted successfully');
    }

    // ✅ عرض الفاتورة حسب الـ Order
    public function showByOrder($orderId)
    {
        $invoice = Invoice::where('order_id', $orderId)->with('order')->first();

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice retrieved successfully');
    }

    // ✅ الدفع (تحديث وسيلة الدفع وتغيير الحالة إلى paid)
    public function payInvoice(Request $request, $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|in:cash,card,online',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $invoice->update([
            'payment_method' => $request->payment_method,
            'status' => 'paid',
        ]);

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice paid successfully');
    }

    // ✅ تغيير حالة الفاتورة فقط (مثلاً من unpaid إلى paid والعكس)
    public function updateStatus(Request $request, $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:paid,unpaid',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors(), 'Validation failed');
        }

        $invoice->update([
            'status' => $request->status,
        ]);

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice status updated successfully');
    }
}