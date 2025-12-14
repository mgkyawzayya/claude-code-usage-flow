import { Head, Link, router } from '@inertiajs/react';
import { Handshake } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { DealCard } from '@/components/crm/DealCard';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { ResponsiveGrid } from '@/components/responsive-grid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Deal, DealStages, PaginatedData } from '@/types/crm';

interface Props {
    deals: PaginatedData<Deal>;
    stages: DealStages;
    filters: {
        search?: string;
        stage?: string;
    };
}

export default function DealsIndex({ deals, stages, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/crm/deals',
            { search: value, stage: filters.stage },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStageFilter = (stage: string) => {
        router.get(
            '/crm/deals',
            { search, stage: stage === 'all' ? undefined : stage },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'CRM', href: '/crm' }, { title: 'Deals', href: '/crm/deals' }]}>
            <Head title="Deals" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Deals"
                        actions={
                            <>
                                <Button variant="outline" asChild>
                                    <Link href="/crm/deals/pipeline">Pipeline View</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/crm/deals/create">Add Deal</Link>
                                </Button>
                            </>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search deals..."
                    >
                        <Select value={filters.stage ?? 'all'} onValueChange={handleStageFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Stage" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stages</SelectItem>
                                {Object.entries(stages).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FilterBar>

                    {/* Deals Grid */}
                    {deals.data.length > 0 ? (
                        <ResponsiveGrid columns={{ default: 1, md: 2, lg: 3 }}>
                            {deals.data.map((deal) => (
                                <DealCard key={deal.id} deal={deal} stages={stages} />
                            ))}
                        </ResponsiveGrid>
                    ) : (
                        <EmptyState
                            icon={Handshake}
                            title="No deals found"
                            description="Get started by creating your first deal."
                            action={{ label: "Create your first deal", href: "/crm/deals/create" }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={deals.meta} links={deals.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
