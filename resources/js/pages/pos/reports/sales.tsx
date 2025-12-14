import { Head, router } from '@inertiajs/react';
import { DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product } from '@/types';

interface SalesSummary {
    total_sales: number;
    total_subtotal: number;
    total_tax: number;
    total_discount: number;
    total_revenue: number;
}

interface SalesByPeriod {
    period: string;
    count: number;
    revenue: number;
}

interface SalesByPaymentMethod {
    payment_method: string;
    count: number;
    revenue: number;
}

interface TopProduct {
    product_id: number;
    total_quantity: number;
    total_revenue: number;
    product: Product;
}

interface Props {
    salesSummary: SalesSummary;
    salesByPeriod: SalesByPeriod[];
    salesByPaymentMethod: SalesByPaymentMethod[];
    topProducts: TopProduct[];
    filters: {
        date_from: string;
        date_to: string;
        group_by: string;
    };
}

export default function SalesReport({
    salesSummary,
    salesByPeriod,
    salesByPaymentMethod,
    topProducts,
    filters,
}: Props) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);
    const [groupBy, setGroupBy] = useState(filters.group_by);

    const applyFilters = () => {
        router.get(
            '/pos/reports/sales',
            {
                date_from: dateFrom,
                date_to: dateTo,
                group_by: groupBy,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatPeriod = (period: string) => {
        if (groupBy === 'month') {
            const [year, month] = period.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
            });
        }
        if (groupBy === 'week') {
            return `Week ${period.split('-')[1]}, ${period.split('-')[0]}`;
        }
        return new Date(period).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const paymentMethodLabels: Record<string, string> = {
        cash: 'Cash',
        card: 'Card',
        mobile: 'Mobile Payment',
        other: 'Other',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Reports', href: '/pos/reports/sales' },
                { title: 'Sales', href: '/pos/reports/sales' },
            ]}
        >
            <Head title="Sales Report" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader title="Sales Report" description="View and analyze your sales performance" />

                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date_from">From Date</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_to">To Date</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="group_by">Group By</Label>
                                    <Select value={groupBy} onValueChange={setGroupBy}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="day">Day</SelectItem>
                                            <SelectItem value="week">Week</SelectItem>
                                            <SelectItem value="month">Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={applyFilters}
                                        className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                                <Receipt className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{salesSummary.total_sales}</div>
                                <p className="text-muted-foreground text-xs">Completed transactions</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(salesSummary.total_revenue)}</div>
                                <p className="text-muted-foreground text-xs">Total collected</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
                                <TrendingUp className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(
                                        salesSummary.total_sales > 0 ? salesSummary.total_revenue / salesSummary.total_sales : 0,
                                    )}
                                </div>
                                <p className="text-muted-foreground text-xs">Per transaction</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
                                <DollarSign className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(salesSummary.total_discount)}</div>
                                <p className="text-muted-foreground text-xs">Discounts given</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Sales by Period */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales by {groupBy === 'day' ? 'Day' : groupBy === 'week' ? 'Week' : 'Month'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {salesByPeriod.length > 0 ? (
                                    <div className="space-y-3">
                                        {salesByPeriod.map((period) => (
                                            <div key={period.period} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <p className="font-medium">{formatPeriod(period.period)}</p>
                                                    <p className="text-muted-foreground text-sm">{period.count} sales</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{formatCurrency(period.revenue)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        <p className="text-sm">No sales data for this period</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sales by Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales by Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {salesByPaymentMethod.length > 0 ? (
                                    <div className="space-y-3">
                                        {salesByPaymentMethod.map((method) => (
                                            <div key={method.payment_method} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <p className="font-medium">{paymentMethodLabels[method.payment_method] || method.payment_method}</p>
                                                    <p className="text-muted-foreground text-sm">{method.count} transactions</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{formatCurrency(method.revenue)}</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {((method.revenue / salesSummary.total_revenue) * 100).toFixed(1)}%
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        <p className="text-sm">No payment data available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Selling Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((item, index) => (
                                        <div key={item.product_id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-muted-foreground text-sm">SKU: {item.product.sku}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">{item.total_quantity} units</p>
                                                    <p className="text-muted-foreground text-xs">Quantity sold</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{formatCurrency(item.total_revenue)}</p>
                                                    <p className="text-muted-foreground text-xs">Revenue</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground py-8 text-center">
                                    <p className="text-sm">No sales data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
