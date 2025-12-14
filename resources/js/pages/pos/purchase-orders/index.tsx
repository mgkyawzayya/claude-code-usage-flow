import { Head, Link, router } from '@inertiajs/react';
import { FileText } from 'lucide-react';
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
import type { PaginatedData, PurchaseOrder } from '@/types';

interface Props {
    purchaseOrders: PaginatedData<PurchaseOrder>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function PurchaseOrdersIndex({ purchaseOrders, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/pos/purchase-orders',
            { search: value, status: filters.status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            '/pos/purchase-orders',
            { search, status: status === 'all' ? undefined : status },
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
        });
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        received: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Purchase Orders', href: '/pos/purchase-orders' },
            ]}
        >
            <Head title="Purchase Orders" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Purchase Orders"
                        description="Manage purchase orders from suppliers"
                        actions={
                            <Button asChild>
                                <Link href="/pos/purchase-orders/create">Create PO</Link>
                            </Button>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search by PO number or supplier..."
                    >
                        <Select value={filters.status ?? 'all'} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="received">Received</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterBar>

                    {/* Purchase Orders List */}
                    {purchaseOrders.data.length > 0 ? (
                        <div className="space-y-3">
                            {purchaseOrders.data.map((po) => (
                                <Link key={po.id} href={`/pos/purchase-orders/${po.id}`}>
                                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{po.po_number}</p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {po.supplier?.name ?? 'Unknown Supplier'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="hidden text-right md:block">
                                                        <p className="text-muted-foreground text-sm">Order Date</p>
                                                        <p className="font-medium">{formatDate(po.order_date)}</p>
                                                    </div>

                                                    {po.expected_date && (
                                                        <div className="hidden text-right md:block">
                                                            <p className="text-muted-foreground text-sm">Expected</p>
                                                            <p className="font-medium">{formatDate(po.expected_date)}</p>
                                                        </div>
                                                    )}

                                                    <div className="text-right">
                                                        <p className="text-muted-foreground text-sm">Total</p>
                                                        <p className="text-lg font-bold">{formatCurrency(po.total)}</p>
                                                    </div>

                                                    <Badge variant="secondary" className={statusColors[po.status]}>
                                                        {po.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={FileText}
                            title="No purchase orders found"
                            description="Create purchase orders to track inventory purchases."
                            action={{ label: 'Create your first PO', href: '/pos/purchase-orders/create' }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={purchaseOrders.meta} links={purchaseOrders.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
