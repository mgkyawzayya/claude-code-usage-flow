import AlertError from '@/components/alert-error';
import { FormActions } from '@/components/form-actions';
import InputError from '@/components/input-error';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { Permission, Role } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    role: Role;
    permissions: Permission[];
}

export default function EditRole({ role, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions?.map((p) => p.name) ?? [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`);
    };

    const handlePermissionToggle = (
        permissionName: string,
        checked: boolean,
    ) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permissionName),
            );
        }
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${role.name}`} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader title={`Edit ${role.name}`} />

                    {Object.keys(errors).length > 0 && (
                        <AlertError errors={Object.values(errors).flat()} />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Role Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Permissions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {permissions.length > 0 ? (
                                    permissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={data.permissions.includes(
                                                    permission.name,
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handlePermissionToggle(
                                                        permission.name,
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`permission-${permission.id}`}
                                                className="font-normal"
                                            >
                                                {permission.name}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        No permissions available.
                                    </p>
                                )}
                                <InputError message={errors.permissions} />
                            </CardContent>
                        </Card>

                        <FormActions>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Update Role
                            </Button>
                        </FormActions>
                    </form>
                </div>
            </PageContainer>
        </AdminLayout>
    );
}
