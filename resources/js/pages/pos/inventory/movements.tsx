import { Head, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, History } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaginatedData, Product, StockMovement } from '@/types';

interface Props {
    movements: PaginatedData<StockMovement>;
    products: Pick<Product, 'id' | 'name' | 'sku'>[];
    filters: {
        product_id?: string;
        type?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function StockMovements({ movements, products, filters }: Props) {
    const [productId, setProductId] = useState(filters.product_id ?? 'all');
    const [type, setType] = useState(filters.type ?? 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        const mergedFilters = {
            product_id: productId === 'all' ? undefined : productId,
            type: type === 'all' ? undefined : type,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            ...newFilters,
        };

        router.get('/pos/inventory/movements', mergedFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleProductChange = (value: string) => {
        setProductId(value);
        applyFilters({ product_id: value === 'all' ? undefined : value });
    };

    const handleTypeChange = (value: string) => {
        setType(value);
        applyFilters({ type: value === 'all' ? undefined : value });
    };

    const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFrom(e.target.value);
        applyFilters({ date_from: e.target.value || undefined });
    };

    const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateTo(e.target.value);
        applyFilters({ date_to: e.target.value || undefined });
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

    const typeColors: Record<string, string> = {
        purchase: 'bg-green-100 text-green-800',
        sale: 'bg-blue-100 text-blue-800',
        adjustment: 'bg-yellow-100 text-yellow-800',
        return: 'bg-purple-100 text-purple-800',
        transfer: 'bg-gray-100 text-gray-800',
    };

    const typeLabels: Record<string, string> = {
        purchase: 'Purchase',
        sale: 'Sale',
        adjustment: 'Adjustment',
        return: 'Return',
        transfer: 'Transfer',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Inventory', href: '/pos/inventory' },
                { title: 'Stock Movements', href: '/pos/inventory/movements' },
            ]}
        >
            <Head title="Stock Movements" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Stock Movements"
                        description="Track all inventory changes including purchases, sales, and adjustments"
                    />

                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label>Product</Label>
                                    <Select value={productId} onValueChange={handleProductChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Products" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Products</SelectItem>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} ({product.sku})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={type} onValueChange={handleTypeChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="purchase">Purchase</SelectItem>
                                            <SelectItem value="sale">Sale</SelectItem>
                                            <SelectItem value="adjustment">Adjustment</SelectItem>
                                            <SelectItem value="return">Return</SelectItem>
                                            <SelectItem value="transfer">Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>From Date</Label>
                                    <Input type="date" value={dateFrom} onChange={handleDateFromChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>To Date</Label>
                                    <Input type="date" value={dateTo} onChange={handleDateToChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Movements Table */}
                    {movements.data.length > 0 ? (
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                            <TableHead className="text-right">Before</TableHead>
                                            <TableHead className="text-right">After</TableHead>
                                            <TableHead>Reason</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {movements.data.map((movement) => (
                                            <TableRow key={movement.id}>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {formatDate(movement.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{movement.product?.name}</p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {movement.product?.sku}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={typeColors[movement.type]}>
                                                        {typeLabels[movement.type] ?? movement.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={`inline-flex items-center gap-1 font-semibold ${
                                                            movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}
                                                    >
                                                        {movement.quantity > 0 ? (
                                                            <ArrowUp className="h-3 w-3" />
                                                        ) : (
                                                            <ArrowDown className="h-3 w-3" />
                                                        )}
                                                        {movement.quantity > 0 ? '+' : ''}
                                                        {movement.quantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-right">
                                                    {movement.quantity_before}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {movement.quantity_after}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-sm">
                                                    {movement.reason ?? '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <EmptyState
                            icon={History}
                            title="No stock movements found"
                            description="Stock movements will appear here when inventory changes occur."
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={movements.meta} links={movements.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
