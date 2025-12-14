import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import AdminLayout from '@/layouts/admin-layout';
import { PaginatedData, Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { MoreHorizontal, Pencil, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    roles: PaginatedData<Role & { permissions_count: number }>;
    filters: {
        search?: string;
    };
}

export default function RolesIndex({ roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/admin/roles',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (roleId: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/admin/roles/${roleId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Roles" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Roles"
                        description="Manage admin roles and permissions"
                        actions={
                            <Button asChild>
                                <Link href="/admin/roles/create">
                                    Create Role
                                </Link>
                            </Button>
                        }
                    />

                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search roles..."
                    />

                    {roles.data.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Guard</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="font-medium">
                                                {role.name}
                                            </TableCell>
                                            <TableCell>
                                                {role.guard_name}
                                            </TableCell>
                                            <TableCell>
                                                {role.permissions_count}{' '}
                                                permission
                                                {role.permissions_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    role.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/roles/${role.id}/edit`}
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyState
                            icon={Shield}
                            title="No roles found"
                            description="Get started by creating your first role."
                            action={{
                                label: 'Create your first role',
                                href: '/admin/roles/create',
                            }}
                        />
                    )}

                    <Pagination meta={roles.meta} links={roles.links} />
                </div>
            </PageContainer>
        </AdminLayout>
    );
}
