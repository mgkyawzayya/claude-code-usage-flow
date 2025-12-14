import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { FormActions } from '@/components/form-actions';
import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/types';

interface Props {
    products: Product[];
}

export default function InventoryAdjust({ products }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { data, setData, errors, reset, setError, clearErrors } = useForm({
        product_id: '',
        new_quantity: '',
        reason: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProductChange = (productId: string) => {
        setData('product_id', productId);
        const product = products.find((p) => p.id.toString() === productId);
        setSelectedProduct(product ?? null);
        setData('new_quantity', product?.stock_quantity.toString() ?? '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setIsSubmitting(true);

        // Transform flat data to adjustments array format expected by backend
        router.post(
            '/pos/inventory/adjust',
            {
                adjustments: [
                    {
                        product_id: data.product_id,
                        new_quantity: parseInt(data.new_quantity),
                        reason: data.reason,
                    },
                ],
            },
            {
                onSuccess: () => {
                    reset();
                    setSelectedProduct(null);
                },
                onError: (errors) => {
                    // Map nested errors to flat structure for display
                    if (errors['adjustments.0.product_id']) {
                        setError('product_id', errors['adjustments.0.product_id']);
                    }
                    if (errors['adjustments.0.new_quantity']) {
                        setError('new_quantity', errors['adjustments.0.new_quantity']);
                    }
                    if (errors['adjustments.0.reason']) {
                        setError('reason', errors['adjustments.0.reason']);
                    }
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const quantityDifference = selectedProduct
        ? parseInt(data.new_quantity || '0') - selectedProduct.stock_quantity
        : 0;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Inventory', href: '/pos/inventory' },
                { title: 'Adjust Stock', href: '/pos/inventory/adjust' },
            ]}
        >
            <Head title="Adjust Stock" />

            <PageContainer>
                <Card>
                    <CardHeader>
                        <CardTitle>Adjust Stock Quantity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="product_id">Product *</Label>
                                <Select value={data.product_id} onValueChange={handleProductChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {product.name} ({product.sku}) - Current: {product.stock_quantity}{' '}
                                                {product.unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.product_id} />
                            </div>

                            {/* Current Stock Display */}
                            {selectedProduct && (
                                <Card className="bg-muted">
                                    <CardContent className="pt-6">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">
                                                    Current Stock
                                                </p>
                                                <p className="mt-1 text-2xl font-bold">
                                                    {selectedProduct.stock_quantity} {selectedProduct.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">
                                                    Reorder Point
                                                </p>
                                                <p className="mt-1 text-2xl font-bold">{selectedProduct.reorder_point}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">Unit</p>
                                                <p className="mt-1 text-2xl font-bold">{selectedProduct.unit}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* New Quantity */}
                            <div className="space-y-2">
                                <Label htmlFor="new_quantity">New Quantity *</Label>
                                <Input
                                    id="new_quantity"
                                    type="number"
                                    min="0"
                                    value={data.new_quantity}
                                    onChange={(e) => setData('new_quantity', e.target.value)}
                                    required
                                    disabled={!selectedProduct}
                                />
                                <InputError message={errors.new_quantity} />

                                {selectedProduct && data.new_quantity && (
                                    <p
                                        className={`text-sm font-medium ${
                                            quantityDifference > 0
                                                ? 'text-green-600'
                                                : quantityDifference < 0
                                                  ? 'text-red-600'
                                                  : 'text-muted-foreground'
                                        }`}
                                    >
                                        {quantityDifference > 0 && `+${quantityDifference}`}
                                        {quantityDifference < 0 && quantityDifference}
                                        {quantityDifference === 0 && 'No change'}
                                        {quantityDifference !== 0 && ` ${selectedProduct.unit}`}
                                    </p>
                                )}
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for Adjustment *</Label>
                                <Textarea
                                    id="reason"
                                    value={data.reason}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('reason', e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Explain why this adjustment is needed..."
                                    required
                                />
                                <InputError message={errors.reason} />
                            </div>

                            {/* Warning */}
                            {selectedProduct && quantityDifference !== 0 && (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <p className="text-sm font-medium text-yellow-800">
                                        Warning: This will{' '}
                                        {quantityDifference > 0 ? 'increase' : 'decrease'} the stock by{' '}
                                        {Math.abs(quantityDifference)} {selectedProduct.unit}. This action will be
                                        recorded in stock movement history.
                                    </p>
                                </div>
                            )}

                            <FormActions>
                                <Link href="/pos/inventory">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !selectedProduct || quantityDifference === 0}
                                >
                                    {isSubmitting ? 'Adjusting...' : 'Adjust Stock'}
                                </Button>
                            </FormActions>
                        </form>
                    </CardContent>
                </Card>
            </PageContainer>
        </AppLayout>
    );
}
