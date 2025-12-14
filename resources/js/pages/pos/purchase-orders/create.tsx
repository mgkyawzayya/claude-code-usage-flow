import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { FormActions } from '@/components/form-actions';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Product, Supplier } from '@/types';

interface Props {
    suppliers: Supplier[];
    products: Product[];
}

interface PurchaseOrderItem {
    product_id: string;
    quantity_ordered: string;
    unit_cost: string;
}

export default function CreatePurchaseOrder({ suppliers = [], products = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_date: '',
        notes: '',
        items: [] as PurchaseOrderItem[],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                product_id: '',
                quantity_ordered: '',
                unit_cost: '',
            },
        ]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateItem = (index: number, field: keyof PurchaseOrderItem, value: string) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const updateItemWithProduct = (index: number, productId: string) => {
        const newItems = [...data.items];
        const selectedProduct = products.find((p) => p?.id && String(p.id) === productId);
        newItems[index] = {
            ...newItems[index],
            product_id: productId,
            unit_cost: selectedProduct?.cost_price != null ? String(selectedProduct.cost_price) : '',
        };
        setData('items', newItems);
    };

    const getProduct = (productId: string) => {
        return products.find((p) => p?.id && String(p.id) === productId);
    };

    const calculateItemTotal = (item: PurchaseOrderItem) => {
        const quantity = parseFloat(item.quantity_ordered) || 0;
        const cost = parseFloat(item.unit_cost) || 0;
        return quantity * cost;
    };

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pos/purchase-orders');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Purchase Orders', href: '/pos/purchase-orders' },
                { title: 'Create', href: '/pos/purchase-orders/create' },
            ]}
        >
            <Head title="Create Purchase Order" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader title="Create Purchase Order" description="Create a new purchase order from supplier" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Supplier */}
                                    <div className="space-y-2">
                                        <Label htmlFor="supplier_id">Supplier *</Label>
                                        <Select value={data.supplier_id} onValueChange={(value) => setData('supplier_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suppliers
                                                    .filter((supplier) => supplier?.id)
                                                    .map((supplier) => (
                                                        <SelectItem key={supplier.id} value={String(supplier.id)}>
                                                            {supplier.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.supplier_id} />
                                    </div>

                                    {/* Order Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="order_date">Order Date *</Label>
                                        <Input
                                            id="order_date"
                                            type="date"
                                            value={data.order_date}
                                            onChange={(e) => setData('order_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.order_date} />
                                    </div>

                                    {/* Expected Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="expected_date">Expected Delivery Date</Label>
                                        <Input
                                            id="expected_date"
                                            type="date"
                                            value={data.expected_date}
                                            onChange={(e) => setData('expected_date', e.target.value)}
                                        />
                                        <InputError message={errors.expected_date} />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="mt-6 space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Additional notes for this purchase order..."
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-semibold">Order Items</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>

                                {data.items.length === 0 ? (
                                    <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
                                        <p className="text-sm">No items added yet. Click "Add Item" to start.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data.items.map((item, index) => {
                                            const product = getProduct(item.product_id);
                                            const itemTotal = calculateItemTotal(item);

                                            return (
                                                <div key={index} className="rounded-lg border p-4">
                                                    <div className="grid gap-4 md:grid-cols-12">
                                                        {/* Product */}
                                                        <div className="md:col-span-5">
                                                            <Label htmlFor={`item-${index}-product`}>Product *</Label>
                                                            <Select
                                                                value={item.product_id}
                                                                onValueChange={(value) => updateItemWithProduct(index, value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select product" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {products
                                                                        .filter((product) => product?.id)
                                                                        .map((product) => (
                                                                            <SelectItem key={product.id} value={String(product.id)}>
                                                                                {product.name} ({product.sku})
                                                                            </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError message={errors[`items.${index}.product_id` as keyof typeof errors]} />
                                                        </div>

                                                        {/* Quantity */}
                                                        <div className="md:col-span-2">
                                                            <Label htmlFor={`item-${index}-quantity`}>Quantity *</Label>
                                                            <Input
                                                                id={`item-${index}-quantity`}
                                                                type="number"
                                                                min="1"
                                                                step="1"
                                                                value={item.quantity_ordered}
                                                                onChange={(e) =>
                                                                    updateItem(index, 'quantity_ordered', e.target.value)
                                                                }
                                                                required
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[`items.${index}.quantity_ordered` as keyof typeof errors]
                                                                }
                                                            />
                                                        </div>

                                                        {/* Unit Cost */}
                                                        <div className="md:col-span-2">
                                                            <Label htmlFor={`item-${index}-cost`}>Unit Cost *</Label>
                                                            <Input
                                                                id={`item-${index}-cost`}
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={item.unit_cost}
                                                                onChange={(e) => updateItem(index, 'unit_cost', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={errors[`items.${index}.unit_cost` as keyof typeof errors]} />
                                                        </div>

                                                        {/* Total */}
                                                        <div className="md:col-span-2">
                                                            <Label>Total</Label>
                                                            <div className="flex h-10 items-center font-semibold">
                                                                {formatCurrency(itemTotal)}
                                                            </div>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <div className="flex items-end md:col-span-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeItem(index)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {product && (
                                                        <p className="text-muted-foreground mt-2 text-sm">
                                                            Current stock: {product.stock_quantity} {product.unit}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Total Summary */}
                                        <div className="flex justify-end border-t pt-4">
                                            <div className="w-64">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total:</span>
                                                    <span>{formatCurrency(calculateTotal())}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <FormActions>
                            <Link href="/pos/purchase-orders">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing || data.items.length === 0}>
                                {processing ? 'Creating...' : 'Create Purchase Order'}
                            </Button>
                        </FormActions>
                    </form>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
