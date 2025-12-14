export interface Product {
    id: number;
    user_id: number;
    category_id?: number;
    sku: string;
    name: string;
    description?: string;
    barcode?: string;
    cost_price: number;
    regular_price: number;
    sale_price?: number;
    current_price: number; // Computed
    stock_quantity: number;
    reorder_point: number;
    reorder_quantity: number;
    unit: string;
    image_url?: string;
    is_active: boolean;
    track_inventory: boolean;
    is_low_stock: boolean; // Computed
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    user_id: number;
    parent_id?: number;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    products_count?: number;
    children?: Category[];
    parent?: Category;
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: number;
    user_id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    contact_person?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Sale {
    id: number;
    user_id: number;
    invoice_number: string;
    status: 'pending' | 'completed' | 'refunded' | 'cancelled';
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: 'cash' | 'card' | 'bank_transfer' | 'other';
    amount_paid: number;
    change: number;
    notes?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    completed_at?: string;
    items?: SaleItem[];
    created_at: string;
    updated_at: string;
}

export interface SaleItem {
    id: number;
    sale_id: number;
    product_id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    discount: number;
    total: number;
    product?: Product;
}

export interface StockMovement {
    id: number;
    user_id: number;
    product_id: number;
    type: 'purchase' | 'sale' | 'adjustment' | 'return' | 'transfer';
    quantity: number;
    quantity_before: number;
    quantity_after: number;
    reference_type?: string;
    reference_id?: number;
    reason?: string;
    product?: Product;
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrder {
    id: number;
    user_id: number;
    supplier_id: number;
    po_number: string;
    status: 'draft' | 'sent' | 'received' | 'cancelled';
    total: number;
    order_date: string;
    expected_date?: string;
    received_date?: string;
    notes?: string;
    supplier?: Supplier;
    items?: PurchaseOrderItem[];
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrderItem {
    id: number;
    purchase_order_id: number;
    product_id: number;
    quantity_ordered: number;
    quantity_received: number;
    unit_cost: number;
    total: number;
    product?: Product;
}

export interface CartItem {
    product: Product;
    quantity: number;
    subtotal: number;
}

export interface PosStatistics {
    total_products: number;
    low_stock_count: number;
    out_of_stock_count: number;
    total_stock_value: number;
    today_sales: number;
    today_revenue: number;
    total_sales: number;
    total_revenue: number;
}
