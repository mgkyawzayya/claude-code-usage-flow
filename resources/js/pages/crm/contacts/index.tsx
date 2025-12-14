import { Head, Link, router } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ContactCard } from '@/components/crm/ContactCard';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { ResponsiveGrid } from '@/components/responsive-grid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Contact, PaginatedData } from '@/types/crm';

interface Props {
    contacts: PaginatedData<Contact>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ContactsIndex({ contacts, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/crm/contacts',
            { search: value, status: filters.status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            '/crm/contacts',
            { search, status: status === 'all' ? undefined : status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'CRM', href: '/crm' }, { title: 'Contacts', href: '/crm/contacts' }]}>
            <Head title="Contacts" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Contacts"
                        actions={
                            <Button asChild>
                                <Link href="/crm/contacts/create">Add Contact</Link>
                            </Button>
                        }
                    />

                    {/* Filters */}
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search contacts..."
                    >
                        <Select value={filters.status ?? 'all'} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="lead">Lead</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterBar>

                    {/* Contact Grid */}
                    {contacts.data.length > 0 ? (
                        <ResponsiveGrid columns={{ default: 1, md: 2, lg: 3 }}>
                            {contacts.data.map((contact) => (
                                <ContactCard key={contact.id} contact={contact} />
                            ))}
                        </ResponsiveGrid>
                    ) : (
                        <EmptyState
                            icon={Users}
                            title="No contacts found"
                            description="Get started by creating your first contact."
                            action={{ label: "Create your first contact", href: "/crm/contacts/create" }}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination meta={contacts.meta} links={contacts.links} />
                </div>
            </PageContainer>
        </AppLayout>
    );
}
