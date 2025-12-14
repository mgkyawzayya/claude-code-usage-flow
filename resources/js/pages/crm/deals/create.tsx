import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { FormActions } from '@/components/form-actions';
import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Company, Contact, DealStages } from '@/types/crm';

interface Props {
    contacts: { data: Contact[] };
    companies: { data: Company[] };
    stages: DealStages;
}

export default function DealCreate({ contacts, companies, stages }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        value: '',
        stage: 'lead',
        probability: '',
        expected_close_date: '',
        contact_id: '',
        company_id: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/crm/deals');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CRM', href: '/crm' },
                { title: 'Deals', href: '/crm/deals' },
                { title: 'Create', href: '/crm/deals/create' },
            ]}
        >
            <Head title="Create Deal" />

            <PageContainer>
                <Card>
                <CardHeader>
                    <CardTitle>Create Deal</CardTitle>
                </CardHeader>
                <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Deal Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="value">Value</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.value}
                                        onChange={(e) => setData('value', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.value} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stage">Stage</Label>
                                    <Select value={data.stage} onValueChange={(value) => setData('stage', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(stages).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.stage} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="probability">Probability (%)</Label>
                                    <Input
                                        id="probability"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.probability}
                                        onChange={(e) => setData('probability', e.target.value)}
                                    />
                                    <InputError message={errors.probability} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expected_close_date">Expected Close Date</Label>
                                    <Input
                                        id="expected_close_date"
                                        type="date"
                                        value={data.expected_close_date}
                                        onChange={(e) => setData('expected_close_date', e.target.value)}
                                    />
                                    <InputError message={errors.expected_close_date} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_id">Contact</Label>
                                    <Select value={data.contact_id} onValueChange={(value) => setData('contact_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contacts.data.map((contact) => (
                                                <SelectItem key={contact.id} value={contact.id.toString()}>
                                                    {contact.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.contact_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_id">Company</Label>
                                    <Select value={data.company_id} onValueChange={(value) => setData('company_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.data.map((company) => (
                                                <SelectItem key={company.id} value={company.id.toString()}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.company_id} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                <InputError message={errors.description} />
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
                                <Link href="/crm/deals">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Deal'}
                                </Button>
                            </FormActions>
                        </form>
                    </CardContent>
                    </Card>
            </PageContainer>
        </AppLayout>
    );
}
