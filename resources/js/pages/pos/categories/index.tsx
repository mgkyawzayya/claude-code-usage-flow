import { Head, Link, router } from '@inertiajs/react';
import { FolderOpen } from 'lucide-react';
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
import type { Category, PaginatedData } from '@/types';

interface Props {
    categories: PaginatedData<Category>;
    filters: {
        search?: string;
    };
}

export default function CategoriesIndex({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/pos/categories',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'POS', href: '/pos' }, { title: 'Categories', href: '/pos/categories' }]}
        >
            <Head title="Categories" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Categories"
                        description="Organize your products into categories"
                        actions={
                            <Button asChild>
                                <Link href="/pos/categories/create">Add Category</Link>
                            </Button>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search categories..."
                    />

                    {/* Categories List */}
                    {categories.data.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.data.map((category) => (
                                <Link key={category.id} href={`/pos/categories/${category.id}/edit`}>
                                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                                        <FolderOpen className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{category.name}</h3>
                                                        {category.parent && (
                                                            <p className="text-muted-foreground text-xs">
                                                                {category.parent.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        category.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }
                                                >
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>

                                            {category.description && (
                                                <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
                                                    {category.description}
                                                </p>
                                            )}

                                            <div className="mt-4 flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {category.products_count ?? 0} products
                                                </span>
                                                <span className="text-muted-foreground font-mono text-xs">
                                                    /{category.slug}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={FolderOpen}
                            title="No categories found"
                            description="Create categories to organize your products."
                            action={{ label: 'Create your first category', href: '/pos/categories/create' }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={categories.meta} links={categories.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
