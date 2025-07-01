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

    public function index()
    {
        $invoices = Invoice::with('order')->get();
        return $this->sendSuccess($invoices, 'All invoices retrieved successfully');
    }

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

        $invoice = Invoice::create($request->all());

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice created successfully');
    }

    public function show($id)
    {
        $invoice = Invoice::with('order')->find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        return $this->sendSuccess(['invoice' => $invoice], 'Invoice details retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
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

    public function destroy($id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return $this->sendError([], 'Invoice not found');
        }

        $invoice->delete();

        return $this->sendSuccess([], 'Invoice deleted successfully');
    }
}