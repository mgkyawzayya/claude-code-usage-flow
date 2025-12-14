import { Head, Link, router } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { CompanyCard } from '@/components/crm/CompanyCard';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { ResponsiveGrid } from '@/components/responsive-grid';
import { Button } from '@/components/ui/button';
import type { Company, PaginatedData } from '@/types/crm';

interface Props {
    companies: PaginatedData<Company>;
    filters: {
        search?: string;
    };
}

export default function CompaniesIndex({ companies, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/crm/companies',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'CRM', href: '/crm' }, { title: 'Companies', href: '/crm/companies' }]}>
            <Head title="Companies" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Companies"
                        actions={
                            <Button asChild>
                                <Link href="/crm/companies/create">Add Company</Link>
                            </Button>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search companies..."
                    />

                    {/* Company Grid */}
                    {companies.data.length > 0 ? (
                        <ResponsiveGrid columns={{ default: 1, md: 2, lg: 3 }}>
                            {companies.data.map((company) => (
                                <CompanyCard key={company.id} company={company} />
                            ))}
                        </ResponsiveGrid>
                    ) : (
                        <EmptyState
                            icon={Building2}
                            title="No companies found"
                            description="Get started by creating your first company."
                            action={{ label: "Create your first company", href: "/crm/companies/create" }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={companies.meta} links={companies.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
