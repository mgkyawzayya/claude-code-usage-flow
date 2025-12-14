import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import AdminLayout from '@/layouts/admin-layout';
import { PaginatedData, Permission } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { useState } from 'react';

interface Props {
    permissions: PaginatedData<Permission>;
    filters: {
        search?: string;
    };
}

export default function PermissionsIndex({ permissions, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/admin/permissions',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout>
            <Head title="Permissions" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Permissions"
                        description="View all system permissions"
                    />

                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search permissions..."
                    />

                    {permissions.data.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Guard</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.data.map((permission) => (
                                        <TableRow key={permission.id}>
                                            <TableCell className="font-medium">
                                                {permission.name}
                                            </TableCell>
                                            <TableCell>
                                                {permission.guard_name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {permission.roles &&
                                                    permission.roles.length >
                                                        0 ? (
                                                        permission.roles.map(
                                                            (role: { id: number; name: string }) => (
                                                                <Badge
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    {role.name}
                                                                </Badge>
                                                            ),
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">
                                                            Not assigned
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    permission.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyState
                            icon={Lock}
                            title="No permissions found"
                            description="Permissions are managed through database seeders."
                        />
                    )}

                    <Pagination
                        meta={permissions.meta}
                        links={permissions.links}
                    />
                </div>
            </PageContainer>
        </AdminLayout>
    );
}
