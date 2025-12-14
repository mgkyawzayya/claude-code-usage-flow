import AlertError from '@/components/alert-error';
import { FormActions } from '@/components/form-actions';
import InputError from '@/components/input-error';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    user: User;
}

export default function EditUser({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email_verified_at: user.email_verified_at ?? null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const toggleEmailVerified = (checked: boolean) => {
        setData(
            'email_verified_at',
            checked ? new Date().toISOString() : null,
        );
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${user.name}`} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader title={`Edit ${user.name}`} />

                    {Object.keys(errors).length > 0 && (
                        <AlertError errors={Object.values(errors).flat()} />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
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

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        value={user.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-muted-foreground text-sm">
                                        Email cannot be changed
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="email_verified"
                                        checked={data.email_verified_at !== null}
                                        onCheckedChange={toggleEmailVerified}
                                    />
                                    <Label
                                        htmlFor="email_verified"
                                        className="font-normal"
                                    >
                                        Email verified
                                    </Label>
                                </div>
                                <InputError
                                    message={errors.email_verified_at}
                                />
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
                                Update User
                            </Button>
                        </FormActions>
                    </form>
                </div>
            </PageContainer>
        </AdminLayout>
    );
}
