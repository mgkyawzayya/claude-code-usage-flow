import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, History, Package, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { StockBadge } from '@/components/pos/stock-badge';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PosStatistics, Product } from '@/types';

interface Props {
    statistics: PosStatistics;
    lowStockProducts: Product[];
    outOfStockProducts: Product[];
}

export default function InventoryIndex({ statistics, lowStockProducts, outOfStockProducts }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'POS', href: '/pos' }, { title: 'Inventory', href: '/pos/inventory' }]}
        >
            <Head title="Inventory Management" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Inventory Management"
                        description="Monitor and manage your product inventory"
                        actions={
                            <>
                                <Button variant="outline" asChild>
                                    <Link href="/pos/inventory/movements">
                                        <History className="mr-2 h-4 w-4" />
                                        View History
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/pos/inventory/adjust">
                                        <TrendingUp className="mr-2 h-4 w-4" />
                                        Adjust Stock
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    {/* Statistics Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.total_products}</div>
                                <p className="text-muted-foreground text-xs">Active inventory items</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{statistics.low_stock_count}</div>
                                <p className="text-muted-foreground text-xs">Need reordering soon</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                                <TrendingUp className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(statistics.total_stock_value)}</div>
                                <p className="text-muted-foreground text-xs">Based on cost price</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Out of Stock Products */}
                    {outOfStockProducts.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    Out of Stock ({outOfStockProducts.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Reorder Qty</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {outOfStockProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-sm">
                                                    {product.sku}
                                                </TableCell>
                                                <TableCell>{product.category?.name ?? 'Uncategorized'}</TableCell>
                                                <TableCell>
                                                    {product.reorder_quantity} {product.unit}
                                                </TableCell>
                                                <TableCell>
                                                    <StockBadge
                                                        stockQuantity={product.stock_quantity}
                                                        reorderPoint={product.reorder_point}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/pos/products/${product.id}`}>View</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Low Stock Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                Low Stock Products ({lowStockProducts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lowStockProducts.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Current Stock</TableHead>
                                            <TableHead>Reorder Point</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lowStockProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-sm">
                                                    {product.sku}
                                                </TableCell>
                                                <TableCell>{product.category?.name ?? 'Uncategorized'}</TableCell>
                                                <TableCell>
                                                    {product.stock_quantity} {product.unit}
                                                </TableCell>
                                                <TableCell>{product.reorder_point}</TableCell>
                                                <TableCell>
                                                    <StockBadge
                                                        stockQuantity={product.stock_quantity}
                                                        reorderPoint={product.reorder_point}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/pos/products/${product.id}`}>View</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-muted-foreground py-8 text-center">
                                    <p>All products are adequately stocked</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
