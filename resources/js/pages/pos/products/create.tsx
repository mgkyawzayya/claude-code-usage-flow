import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { FormActions } from '@/components/form-actions';
import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/types';

interface Props {
    categories: Category[];
}

export default function ProductCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        sku: '',
        name: '',
        description: '',
        barcode: '',
        cost_price: '',
        regular_price: '',
        sale_price: '',
        stock_quantity: '',
        reorder_point: '',
        reorder_quantity: '',
        unit: 'pcs',
        category_id: '',
        is_active: true,
        track_inventory: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pos/products');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Products', href: '/pos/products' },
                { title: 'Create', href: '/pos/products/create' },
            ]}
        >
            <Head title="Create Product" />

            <PageContainer>
                <Card>
                    <CardHeader>
                        <CardTitle>Create Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Basic Information</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU *</Label>
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.sku} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="barcode">Barcode</Label>
                                        <Input
                                            id="barcode"
                                            value={data.barcode}
                                            onChange={(e) => setData('barcode', e.target.value)}
                                        />
                                        <InputError message={errors.barcode} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setData('description', e.target.value)
                                        }
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Pricing</h3>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="cost_price">Cost Price *</Label>
                                        <Input
                                            id="cost_price"
                                            type="number"
                                            step="0.01"
                                            value={data.cost_price}
                                            onChange={(e) => setData('cost_price', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.cost_price} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="regular_price">Regular Price *</Label>
                                        <Input
                                            id="regular_price"
                                            type="number"
                                            step="0.01"
                                            value={data.regular_price}
                                            onChange={(e) => setData('regular_price', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.regular_price} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sale_price">Sale Price</Label>
                                        <Input
                                            id="sale_price"
                                            type="number"
                                            step="0.01"
                                            value={data.sale_price}
                                            onChange={(e) => setData('sale_price', e.target.value)}
                                        />
                                        <InputError message={errors.sale_price} />
                                    </div>
                                </div>
                            </div>

                            {/* Inventory */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Inventory</h3>

                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                                        <Input
                                            id="stock_quantity"
                                            type="number"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData('stock_quantity', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.stock_quantity} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="unit">Unit *</Label>
                                        <Input
                                            id="unit"
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            placeholder="e.g., pcs, kg, liter"
                                            required
                                        />
                                        <InputError message={errors.unit} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reorder_point">Reorder Point *</Label>
                                        <Input
                                            id="reorder_point"
                                            type="number"
                                            value={data.reorder_point}
                                            onChange={(e) => setData('reorder_point', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.reorder_point} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reorder_quantity">Reorder Quantity *</Label>
                                        <Input
                                            id="reorder_quantity"
                                            type="number"
                                            value={data.reorder_quantity}
                                            onChange={(e) => setData('reorder_quantity', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.reorder_quantity} />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="track_inventory"
                                        checked={data.track_inventory}
                                        onCheckedChange={(checked) => setData('track_inventory', checked === true)}
                                    />
                                    <Label htmlFor="track_inventory" className="cursor-pointer font-normal">
                                        Track inventory for this product
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked === true)}
                                    />
                                    <Label htmlFor="is_active" className="cursor-pointer font-normal">
                                        Product is active
                                    </Label>
                                </div>
                            </div>

                            <FormActions>
                                <Link href="/pos/products">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Product'}
                                </Button>
                            </FormActions>
                        </form>
                    </CardContent>
                </Card>
            </PageContainer>
        </AppLayout>
    );
}
