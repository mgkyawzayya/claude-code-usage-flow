import { Head, Link, router } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ProductCard } from '@/components/pos/product-card';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { ResponsiveGrid } from '@/components/responsive-grid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category, PaginatedData, Product } from '@/types';

interface Props {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        stock_status?: string;
    };
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/pos/products',
            {
                search: value,
                category: filters.category,
                stock_status: filters.stock_status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleCategoryFilter = (category: string) => {
        router.get(
            '/pos/products',
            {
                search,
                category: category === 'all' ? undefined : category,
                stock_status: filters.stock_status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStockFilter = (stockStatus: string) => {
        router.get(
            '/pos/products',
            {
                search,
                category: filters.category,
                stock_status: stockStatus === 'all' ? undefined : stockStatus,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'POS', href: '/pos' }, { title: 'Products', href: '/pos/products' }]}>
            <Head title="Products" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Products"
                        description="Manage your product inventory"
                        actions={
                            <Button asChild>
                                <Link href="/pos/products/create">Add Product</Link>
                            </Button>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search products by name, SKU, or barcode..."
                    >
                        <Select value={filters.category ?? 'all'} onValueChange={handleCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filters.stock_status ?? 'all'} onValueChange={handleStockFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Stock Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stock</SelectItem>
                                <SelectItem value="in_stock">In Stock</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterBar>

                    {/* Product Grid */}
                    {products.data.length > 0 ? (
                        <ResponsiveGrid columns={{ default: 1, md: 2, lg: 3 }}>
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} href={`/pos/products/${product.id}`} />
                            ))}
                        </ResponsiveGrid>
                    ) : (
                        <EmptyState
                            icon={Package}
                            title="No products found"
                            description="Get started by creating your first product."
                            action={{ label: 'Create your first product', href: '/pos/products/create' }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={products.meta} links={products.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
