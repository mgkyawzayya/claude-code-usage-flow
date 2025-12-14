import { Head, router } from '@inertiajs/react';
import { CalendarCheck2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ActivityTimeline } from '@/components/crm/ActivityTimeline';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Activity, ActivityTypes, PaginatedData } from '@/types/crm';

interface Props {
    activities: PaginatedData<Activity>;
    types: ActivityTypes;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
}

export default function ActivitiesIndex({ activities, types, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/crm/activities',
            { search: value, type: filters.type, status: filters.status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleTypeFilter = (type: string) => {
        router.get(
            '/crm/activities',
            { search, type: type === 'all' ? undefined : type, status: filters.status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            '/crm/activities',
            { search, type: filters.type, status: status === 'all' ? undefined : status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleComplete = (id: number) => {
        router.post(`/crm/activities/${id}/complete`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'CRM', href: '/crm' }, { title: 'Activities', href: '/crm/activities' }]}>
            <Head title="Activities" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader title="Activities" />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search activities..."
                    >
                        <Select value={filters.type ?? 'all'} onValueChange={handleTypeFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {Object.entries(types).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filters.status ?? 'all'} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterBar>

                    {/* Activities */}
                    {activities.data.length > 0 ? (
                        <ActivityTimeline activities={activities.data} onComplete={handleComplete} />
                    ) : (
                        <EmptyState
                            icon={CalendarCheck2}
                            title="No activities found"
                            description="Activities will appear here as they are created."
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={activities.meta} links={activities.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
