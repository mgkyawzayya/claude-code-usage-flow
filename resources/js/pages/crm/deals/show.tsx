import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { ActivityTimeline } from '@/components/crm/ActivityTimeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Deal, DealStages } from '@/types/crm';

interface Props {
    deal: Deal;
    stages: DealStages;
}

export default function DealShow({ deal, stages }: Props) {
    if (!deal?.id) {
        return null;
    }

    const stageColors: Record<string, string> = {
        lead: 'bg-gray-100 text-gray-800',
        qualified: 'bg-blue-100 text-blue-800',
        proposal: 'bg-yellow-100 text-yellow-800',
        negotiation: 'bg-purple-100 text-purple-800',
        closed_won: 'bg-green-100 text-green-800',
        closed_lost: 'bg-red-100 text-red-800',
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this deal?')) {
            router.delete(`/crm/deals/${deal.id}`);
        }
    };

    const handleCloseWon = () => {
        if (confirm('Mark this deal as won?')) {
            router.post(`/crm/deals/${deal.id}/close-won`);
        }
    };

    const handleCloseLost = () => {
        const reason = prompt('Reason for losing the deal (optional):');
        router.post(`/crm/deals/${deal.id}/close-lost`, { reason });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CRM', href: '/crm' },
                { title: 'Deals', href: '/crm/deals' },
                { title: deal.title, href: `/crm/deals/${deal.id}` },
            ]}
        >
            <Head title={deal.title} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={deal.title}
                        actions={
                            <>
                                {deal.is_open && (
                                    <>
                                        <Button variant="outline" onClick={handleCloseWon}>
                                            Close Won
                                        </Button>
                                        <Button variant="outline" onClick={handleCloseLost}>
                                            Close Lost
                                        </Button>
                                    </>
                                )}
                                <Link href={`/crm/deals/${deal.id}/edit`}>
                                    <Button variant="outline">Edit</Button>
                                </Link>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </>
                        }
                    >
                        <div className="flex items-center gap-3">
                            <Badge className={stageColors[deal.stage]}>{stages[deal.stage]}</Badge>
                        </div>
                        {deal.value_formatted && <p className="text-muted-foreground text-lg">{deal.value_formatted}</p>}
                    </PageHeader>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Deal Info */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Deal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground text-sm">Probability</p>
                                <p>{deal.probability}%</p>
                            </div>
                            {deal.expected_close_date && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Expected Close Date</p>
                                    <p>{new Date(deal.expected_close_date).toLocaleDateString()}</p>
                                </div>
                            )}
                            {deal.actual_close_date && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Actual Close Date</p>
                                    <p>{new Date(deal.actual_close_date).toLocaleDateString()}</p>
                                </div>
                            )}
                            {deal.contact && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Contact</p>
                                    <Link href={`/crm/contacts/${deal.contact.id}`} className="text-primary hover:underline">
                                        {deal.contact.full_name}
                                    </Link>
                                </div>
                            )}
                            {deal.company && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Company</p>
                                    <Link href={`/crm/companies/${deal.company.id}`} className="text-primary hover:underline">
                                        {deal.company.name}
                                    </Link>
                                </div>
                            )}
                            {deal.description && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Description</p>
                                    <p className="whitespace-pre-wrap">{deal.description}</p>
                                </div>
                            )}
                            {deal.notes && (
                                <div>
                                    <p className="text-muted-foreground text-sm">Notes</p>
                                    <p className="whitespace-pre-wrap">{deal.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stage Progress */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Stage Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                {Object.entries(stages).map(([key, label]) => {
                                    const isActive = key === deal.stage;
                                    const isPast =
                                        Object.keys(stages).indexOf(key) < Object.keys(stages).indexOf(deal.stage);
                                    return (
                                        <div
                                            key={key}
                                            className={`flex-1 rounded-lg p-3 text-center text-sm ${
                                                isActive
                                                    ? stageColors[key]
                                                    : isPast
                                                      ? 'bg-green-50 text-green-700'
                                                      : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {label}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activities */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityTimeline activities={deal.activities ?? []} />
                        </CardContent>
                    </Card>
                </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
