import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, DollarSign, Package, Receipt, ShoppingCart, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { StockBadge } from '@/components/pos/stock-badge';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PosStatistics, Product, Sale } from '@/types';

interface Props {
    statistics: PosStatistics;
    lowStockProducts: Product[];
    recentSales: Sale[];
}

export default function PosDashboard({ statistics, lowStockProducts, recentSales }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'POS', href: '/pos' }, { title: 'Dashboard', href: '/pos/dashboard' }]}>
            <Head title="POS Dashboard" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="POS Dashboard"
                        description="Overview of your point of sale operations"
                        actions={
                            <Button asChild>
                                <Link href="/pos/sales/pos">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    New Sale
                                </Link>
                            </Button>
                        }
                    />

                    {/* Statistics Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                                <Receipt className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.today_sales}</div>
                                <p className="text-muted-foreground text-xs">
                                    Revenue: {formatCurrency(statistics.today_revenue)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.total_products}</div>
                                <p className="text-muted-foreground text-xs">
                                    Stock value: {formatCurrency(statistics.total_stock_value)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.low_stock_count}</div>
                                <p className="text-muted-foreground text-xs">
                                    Out of stock: {statistics.out_of_stock_count}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <TrendingUp className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(statistics.total_revenue)}</div>
                                <p className="text-muted-foreground text-xs">{statistics.total_sales} sales total</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Low Stock Alerts */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    Low Stock Alerts
                                </CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/pos/inventory">View All</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {lowStockProducts.length > 0 ? (
                                    <div className="space-y-3">
                                        {lowStockProducts.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/pos/products/${product.id}`}
                                                className="block"
                                            >
                                                <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted">
                                                    <div className="flex-1">
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-muted-foreground text-sm">
                                                            SKU: {product.sku}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold">
                                                                {product.stock_quantity} {product.unit}
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                Reorder: {product.reorder_point}
                                                            </p>
                                                        </div>
                                                        <StockBadge
                                                            stockQuantity={product.stock_quantity}
                                                            reorderPoint={product.reorder_point}
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        <p className="text-sm">No low stock alerts</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Sales */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Recent Sales
                                </CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/pos/sales">View All</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {recentSales.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentSales.map((sale) => (
                                            <Link
                                                key={sale.id}
                                                href={`/pos/sales/${sale.id}`}
                                                className="block"
                                            >
                                                <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted">
                                                    <div>
                                                        <p className="font-semibold">{sale.invoice_number}</p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {formatDate(sale.created_at)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="font-bold">{formatCurrency(sale.total)}</p>
                                                            <p className="text-muted-foreground text-xs">
                                                                {sale.items?.length ?? 0} items
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className={
                                                                sale.status === 'completed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }
                                                        >
                                                            {sale.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        <p className="text-sm">No recent sales</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <Button asChild variant="outline" className="justify-start">
                                    <Link href="/pos/sales/pos">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        New Sale
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="justify-start">
                                    <Link href="/pos/products/create">
                                        <Package className="mr-2 h-4 w-4" />
                                        Add Product
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="justify-start">
                                    <Link href="/pos/inventory/adjust">
                                        <TrendingUp className="mr-2 h-4 w-4" />
                                        Adjust Stock
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="justify-start">
                                    <Link href="/pos/reports/sales">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        View Reports
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
