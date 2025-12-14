import { Head, Link, router } from '@inertiajs/react';
import { Edit, Package, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { StockBadge } from '@/components/pos/stock-badge';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product, StockMovement } from '@/types';

interface Props {
    product: Product;
    stockMovements: StockMovement[];
}

export default function ProductShow({ product, stockMovements = [] }: Props) {
    if (!product?.id) {
        return null;
    }

    const formatCurrency = (amount: number | null | undefined) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount ?? 0);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/pos/products/${product.id}`);
        }
    };

    const movementTypeColors: Record<string, string> = {
        purchase: 'bg-blue-100 text-blue-800',
        sale: 'bg-green-100 text-green-800',
        adjustment: 'bg-yellow-100 text-yellow-800',
        return: 'bg-purple-100 text-purple-800',
        transfer: 'bg-gray-100 text-gray-800',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Products', href: '/pos/products' },
                { title: product.name, href: `/pos/products/${product.id}` },
            ]}
        >
            <Head title={product.name} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={product.name}
                        description={`SKU: ${product.sku}`}
                        actions={
                            <>
                                <Button variant="outline" asChild>
                                    <Link href={`/pos/products/${product.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </>
                        }
                    >
                        <div className="flex flex-wrap gap-2">
                            <StockBadge
                                stockQuantity={product.stock_quantity}
                                reorderPoint={product.reorder_point}
                                isActive={product.is_active}
                            />
                            {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
                        </div>
                    </PageHeader>

                    {/* Product Details */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Product Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {product.image_url && (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-48 w-full rounded object-cover"
                                    />
                                )}

                                {product.description && (
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Description</p>
                                        <p className="mt-1">{product.description}</p>
                                    </div>
                                )}

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">SKU</p>
                                        <p className="mt-1 font-mono">{product.sku}</p>
                                    </div>

                                    {product.barcode && (
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Barcode</p>
                                            <p className="mt-1 font-mono">{product.barcode}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Unit</p>
                                        <p className="mt-1">{product.unit}</p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Category</p>
                                        <p className="mt-1">{product.category?.name ?? 'Uncategorized'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            {/* Pricing */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cost Price:</span>
                                        <span className="font-semibold">{formatCurrency(product.cost_price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Regular Price:</span>
                                        <span className="font-semibold">{formatCurrency(product.regular_price)}</span>
                                    </div>
                                    {product.sale_price && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Sale Price:</span>
                                            <span className="font-semibold text-green-600">
                                                {formatCurrency(product.sale_price)}
                                            </span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium">Current Price:</span>
                                        <span className="text-lg font-bold">{formatCurrency(product.current_price)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Inventory */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Inventory</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Stock Quantity:</span>
                                        <span className="font-semibold">
                                            {product.stock_quantity} {product.unit}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Reorder Point:</span>
                                        <span className="font-semibold">{product.reorder_point}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Reorder Quantity:</span>
                                        <span className="font-semibold">{product.reorder_quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Track Inventory:</span>
                                        <span className="font-semibold">{product.track_inventory ? 'Yes' : 'No'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Stock Movements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Movement History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stockMovements.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Before</TableHead>
                                            <TableHead>After</TableHead>
                                            <TableHead>Reason</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stockMovements.map((movement) => (
                                            <TableRow key={movement.id}>
                                                <TableCell className="text-sm">{formatDate(movement.created_at)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={movementTypeColors[movement.type]}
                                                    >
                                                        {movement.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {movement.quantity > 0 ? '+' : ''}
                                                        {movement.quantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{movement.quantity_before}</TableCell>
                                                <TableCell>{movement.quantity_after}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {movement.reason ?? '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-muted-foreground py-8 text-center">
                                    <p>No stock movements recorded yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
