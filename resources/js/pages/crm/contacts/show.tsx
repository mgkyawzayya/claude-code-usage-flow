import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { ActivityTimeline } from '@/components/crm/ActivityTimeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Contact } from '@/types/crm';

interface Props {
    contact: Contact;
}

export default function ContactShow({ contact }: Props) {
    if (!contact?.id) {
        return null;
    }

    const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        lead: 'bg-blue-100 text-blue-800',
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this contact?')) {
            router.delete(`/crm/contacts/${contact.id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CRM', href: '/crm' },
                { title: 'Contacts', href: '/crm/contacts' },
                { title: contact.full_name, href: `/crm/contacts/${contact.id}` },
            ]}
        >
            <Head title={contact.full_name} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={contact.full_name}
                        actions={
                            <>
                                <Link href={`/crm/contacts/${contact.id}/edit`}>
                                    <Button variant="outline">Edit</Button>
                                </Link>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </>
                        }
                    >
                        <div className="flex items-center gap-3">
                            <Badge className={statusColors[contact.status]}>{contact.status}</Badge>
                        </div>
                        {contact.job_title && <p className="text-muted-foreground">{contact.job_title}</p>}
                    </PageHeader>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Contact Info */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {contact.email && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Email</p>
                                    <p>{contact.email}</p>
                                </div>
                            )}
                            {contact.phone && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Phone</p>
                                    <p>{contact.phone}</p>
                                </div>
                            )}
                            {contact.companies && contact.companies.length > 0 && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Companies</p>
                                    {contact.companies.map((company) => (
                                        <Link key={company.id} href={`/crm/companies/${company.id}`} className="text-primary hover:underline">
                                            {company.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {contact.notes && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Notes</p>
                                    <p className="whitespace-pre-wrap">{contact.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Deals */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Deals ({contact.deals?.length ?? 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {contact.deals && contact.deals.length > 0 ? (
                                <div className="space-y-2">
                                    {contact.deals.map((deal) => (
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
                            <ActivityTimeline activities={contact.activities ?? []} />
                        </CardContent>
                    </Card>
                </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
