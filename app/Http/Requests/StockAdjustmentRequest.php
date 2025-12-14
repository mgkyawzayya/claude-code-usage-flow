<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    public function rules(): array
    {
        return [
            'adjustments' => ['required', 'array', 'min:1'],
            'adjustments.*.product_id' => ['required', 'exists:products,id'],
            'adjustments.*.new_quantity' => ['required', 'integer', 'min:0'],
            'adjustments.*.reason' => ['required', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'adjustments.required' => 'At least one adjustment is required.',
            'adjustments.min' => 'At least one adjustment is required.',
            'adjustments.*.product_id.required' => 'Product is required for each adjustment.',
            'adjustments.*.product_id.exists' => 'Selected product does not exist.',
            'adjustments.*.new_quantity.required' => 'New quantity is required for each adjustment.',
            'adjustments.*.new_quantity.min' => 'New quantity must be 0 or greater.',
            'adjustments.*.reason.required' => 'Reason is required for each adjustment.',
            'adjustments.*.reason.max' => 'Reason must not exceed 500 characters.',
        ];
    }
}
