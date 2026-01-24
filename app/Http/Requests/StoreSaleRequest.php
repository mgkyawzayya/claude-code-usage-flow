<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'invoice_number' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('sales', 'invoice_number')->where('user_id', $userId),
            ],
            'status' => ['nullable', 'string', 'in:pending,completed,cancelled'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                Rule::exists('products', 'id')->where('user_id', $userId),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'in:cash,card,bank_transfer,other'],
            'amount_paid' => ['required', 'numeric', 'min:0', 'gte:total'],
            'total' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'customer_name' => ['nullable', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Calculate total for validation if not provided
        if (!$this->has('total') && $this->has('items')) {
            $subtotal = collect($this->items)->sum(function ($item) {
                return ($item['unit_price'] ?? 0) * ($item['quantity'] ?? 0) - ($item['discount'] ?? 0);
            });
            $tax = $this->tax ?? 0;
            $discount = $this->discount ?? 0;

            $this->merge([
                'total' => $subtotal + $tax - $discount,
            ]);
        }
    }

    public function messages(): array
    {
        return [
            'items.required' => 'At least one item is required for the sale.',
            'items.min' => 'At least one item is required for the sale.',
            'items.*.product_id.required' => 'Product is required for each item.',
            'items.*.product_id.exists' => 'Selected product does not exist or does not belong to you.',
            'items.*.quantity.required' => 'Quantity is required for each item.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.unit_price.required' => 'Unit price is required for each item.',
            'payment_method.required' => 'Payment method is required.',
            'payment_method.in' => 'Invalid payment method selected.',
            'amount_paid.required' => 'Amount paid is required.',
            'amount_paid.min' => 'Amount paid must be greater than or equal to 0.',
            'amount_paid.gte' => 'Amount paid must be greater than or equal to the total.',
        ];
    }
}
