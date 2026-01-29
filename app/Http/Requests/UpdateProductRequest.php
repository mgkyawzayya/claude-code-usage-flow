<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;
        $productId = $this->route('product')->id;

        return [
            'sku' => [
                'required',
                'string',
                'max:100',
                Rule::unique('products', 'sku')->where('user_id', $userId)->ignore($productId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'barcode' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'barcode')->where('user_id', $userId)->ignore($productId),
            ],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->where('user_id', $userId),
            ],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'lt:regular_price'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'reorder_point' => ['nullable', 'integer', 'min:0'],
            'reorder_quantity' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:50'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'track_inventory' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'sku.unique' => 'A product with this SKU already exists.',
            'barcode.unique' => 'A product with this barcode already exists.',
            'category_id.exists' => 'Selected category does not exist or does not belong to you.',
            'sale_price.lt' => 'Sale price must be less than regular price.',
            'regular_price.required' => 'Regular price is required.',
            'stock_quantity.required' => 'Stock quantity is required.',
        ];
    }
}
