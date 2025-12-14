import { Head, Link, router } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
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
import type { PaginatedData, Supplier } from '@/types';

interface Props {
    suppliers: PaginatedData<Supplier>;
    filters: {
        search?: string;
    };
}

export default function SuppliersIndex({ suppliers, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/pos/suppliers',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'POS', href: '/pos' }, { title: 'Suppliers', href: '/pos/suppliers' }]}
        >
            <Head title="Suppliers" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Suppliers"
                        description="Manage your product suppliers"
                        actions={
                            <Button asChild>
                                <Link href="/pos/suppliers/create">Add Supplier</Link>
                            </Button>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search suppliers..."
                    />

                    {/* Suppliers List */}
                    {suppliers.data.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {suppliers.data.map((supplier) => (
                                <Link key={supplier.id} href={`/pos/suppliers/${supplier.id}`}>
                                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{supplier.name}</h3>
                                                        {supplier.contact_person && (
                                                            <p className="text-muted-foreground text-xs">
                                                                {supplier.contact_person}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        supplier.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }
                                                >
                                                    {supplier.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>

                                            <div className="mt-4 space-y-1">
                                                {supplier.email && (
                                                    <p className="text-muted-foreground text-sm">{supplier.email}</p>
                                                )}
                                                {supplier.phone && (
                                                    <p className="text-muted-foreground text-sm">{supplier.phone}</p>
                                                )}
                                                {supplier.address && (
                                                    <p className="text-muted-foreground line-clamp-1 text-sm">
                                                        {supplier.address}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Building2}
                            title="No suppliers found"
                            description="Add suppliers to track your product sources."
                            action={{ label: 'Create your first supplier', href: '/pos/suppliers/create' }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={suppliers.meta} links={suppliers.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
