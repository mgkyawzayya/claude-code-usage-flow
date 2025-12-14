import { Head, Link, router } from '@inertiajs/react';
import { Receipt } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PaginatedData, Sale } from '@/types';

interface Props {
    sales: PaginatedData<Sale>;
    filters: {
        search?: string;
        status?: string;
        payment_method?: string;
    };
}

export default function SalesIndex({ sales, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/pos/sales',
            {
                search: value,
                status: filters.status,
                payment_method: filters.payment_method,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            '/pos/sales',
            {
                search,
                status: status === 'all' ? undefined : status,
                payment_method: filters.payment_method,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePaymentFilter = (paymentMethod: string) => {
        router.get(
            '/pos/sales',
            {
                search,
                status: filters.status,
                payment_method: paymentMethod === 'all' ? undefined : paymentMethod,
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        refunded: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'POS', href: '/pos' }, { title: 'Sales', href: '/pos/sales' }]}>
            <Head title="Sales History" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Sales History"
                        description="View and manage all sales transactions"
                        actions={
                            <Button asChild>
                                <Link href="/pos/sales/pos">New Sale</Link>
                            </Button>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search by invoice number or customer name..."
                    >
                        <Select value={filters.status ?? 'all'} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.payment_method ?? 'all'} onValueChange={handlePaymentFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payments</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterBar>

                    {/* Sales List */}
                    {sales.data.length > 0 ? (
                        <div className="space-y-3">
                            {sales.data.map((sale) => (
                                <Link key={sale.id} href={`/pos/sales/${sale.id}`}>
                                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                                        <Receipt className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{sale.invoice_number}</p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {formatDate(sale.created_at)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {sale.customer_name && (
                                                        <div className="hidden md:block">
                                                            <p className="text-muted-foreground text-sm">Customer</p>
                                                            <p className="font-medium">{sale.customer_name}</p>
                                                        </div>
                                                    )}

                                                    <div className="text-right">
                                                        <p className="text-muted-foreground text-sm">Total</p>
                                                        <p className="text-lg font-bold">{formatCurrency(sale.total)}</p>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Badge variant="secondary" className={statusColors[sale.status]}>
                                                            {sale.status}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {sale.payment_method.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Receipt}
                            title="No sales found"
                            description="Start making sales at the POS."
                            action={{ label: 'Go to POS', href: '/pos/sales/pos' }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={sales.meta} links={sales.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
