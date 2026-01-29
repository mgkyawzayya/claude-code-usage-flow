<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;
        $purchaseOrderId = $this->route('purchase_order')->id;

        return [
            'po_number' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('purchase_orders', 'po_number')->where('user_id', $userId)->ignore($purchaseOrderId),
            ],
            'supplier_id' => [
                'required',
                Rule::exists('suppliers', 'id')->where('user_id', $userId),
            ],
            'order_date' => ['required', 'date'],
            'expected_date' => ['nullable', 'date', 'after_or_equal:order_date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                Rule::exists('products', 'id')->where('user_id', $userId),
            ],
            'items.*.quantity_ordered' => ['required', 'integer', 'min:1'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_id.required' => 'Supplier is required.',
            'supplier_id.exists' => 'Selected supplier does not exist or does not belong to you.',
            'order_date.required' => 'Order date is required.',
            'expected_date.after_or_equal' => 'Expected date must be on or after the order date.',
            'items.required' => 'At least one item is required for the purchase order.',
            'items.min' => 'At least one item is required for the purchase order.',
            'items.*.product_id.required' => 'Product is required for each item.',
            'items.*.product_id.exists' => 'Selected product does not exist or does not belong to you.',
            'items.*.quantity_ordered.required' => 'Quantity is required for each item.',
            'items.*.quantity_ordered.min' => 'Quantity must be at least 1.',
            'items.*.unit_cost.required' => 'Unit cost is required for each item.',
        ];
    }
}
