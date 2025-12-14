import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { FormActions } from '@/components/form-actions';
import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Company } from '@/types/crm';

interface Props {
    company: Company;
}

export default function CompanyEdit({ company }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: company?.name ?? '',
        email: company?.email ?? '',
        phone: company?.phone ?? '',
        website: company?.website ?? '',
        industry: company?.industry ?? '',
        address: company?.address ?? '',
        notes: company?.notes ?? '',
    });

    if (!company?.id) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/crm/companies/${company.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CRM', href: '/crm' },
                { title: 'Companies', href: '/crm/companies' },
                { title: company.name, href: `/crm/companies/${company.id}` },
                { title: 'Edit', href: `/crm/companies/${company.id}/edit` },
            ]}
        >
            <Head title={`Edit ${company.name}`} />

            <PageContainer>
                <Card>
                <CardHeader>
                    <CardTitle>Edit Company</CardTitle>
                </CardHeader>
                <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Company Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://"
                                    />
                                    <InputError message={errors.website} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        value={data.industry}
                                        onChange={(e) => setData('industry', e.target.value)}
                                    />
                                    <InputError message={errors.industry} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)}
                                    rows={2}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('notes', e.target.value)}
                                    rows={4}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <FormActions>
                                <Link href={`/crm/companies/${company.id}`}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </FormActions>
                        </form>
                    </CardContent>
                    </Card>
            </PageContainer>
        </AppLayout>
    );
}
