import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { ActivityTimeline } from '@/components/crm/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Company } from '@/types/crm';

interface Props {
    company: Company;
}

export default function CompanyShow({ company }: Props) {
    if (!company?.id) {
        return null;
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this company?')) {
            router.delete(`/crm/companies/${company.id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CRM', href: '/crm' },
                { title: 'Companies', href: '/crm/companies' },
                { title: company.name, href: `/crm/companies/${company.id}` },
            ]}
        >
            <Head title={company.name} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={company.name}
                        actions={
                            <>
                                <Link href={`/crm/companies/${company.id}/edit`}>
                                    <Button variant="outline">Edit</Button>
                                </Link>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </>
                        }
                    >
                        {company.industry && <p className="text-muted-foreground">{company.industry}</p>}
                    </PageHeader>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Company Info */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {company.email && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Email</p>
                                    <p>{company.email}</p>
                                </div>
                            )}
                            {company.phone && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Phone</p>
                                    <p>{company.phone}</p>
                                </div>
                            )}
                            {company.website && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Website</p>
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {company.website}
                                    </a>
                                </div>
                            )}
                            {company.address && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Address</p>
                                    <p className="whitespace-pre-wrap">{company.address}</p>
                                </div>
                            )}
                            {company.notes && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Notes</p>
                                    <p className="whitespace-pre-wrap">{company.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contacts */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contacts ({company.contacts?.length ?? 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {company.contacts && company.contacts.length > 0 ? (
                                <div className="space-y-2">
                                    {company.contacts.map((contact) => (
                                        <Link
                                            key={contact.id}
                                            href={`/crm/contacts/${contact.id}`}
                                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">{contact.full_name}</p>
                                                <p className="text-muted-foreground text-sm">{contact.job_title ?? contact.email}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No contacts yet</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Deals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Deals ({company.deals?.length ?? 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {company.deals && company.deals.length > 0 ? (
                                <div className="space-y-2">
                                    {company.deals.map((deal) => (
                                        <Link
                                            key={deal.id}
                                            href={`/crm/deals/${deal.id}`}
                                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">{deal.title}</p>
                                                <p className="text-muted-foreground text-sm">{deal.stage_label}</p>
                                            </div>
                                            {deal.value_formatted && <p className="font-semibold">{deal.value_formatted}</p>}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No deals yet</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Activities */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityTimeline activities={company.activities ?? []} />
                        </CardContent>
                    </Card>
                </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
