import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ActivityTimeline } from '@/components/crm/ActivityTimeline';
import { DealPipeline } from '@/components/crm/DealPipeline';
import { StatsCard } from '@/components/crm/StatsCard';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { ResponsiveGrid } from '@/components/responsive-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Activity, CrmStatistics, DealStages, Pipeline } from '@/types/crm';

interface Props {
    statistics: CrmStatistics;
    pipeline: Pipeline;
    upcomingActivities: { data: Activity[] };
    overdueActivities: { data: Activity[] };
    recentActivities: { data: Activity[] };
}

const stages: DealStages = {
    lead: 'Lead',
    qualified: 'Qualified',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
};

export default function CrmDashboard({ statistics, pipeline, upcomingActivities = { data: [] }, overdueActivities = { data: [] }, recentActivities = { data: [] } }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'CRM', href: '/crm' }]}>
            <Head title="CRM Dashboard" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader title="CRM Dashboard" />

                    {/* Statistics Cards */}
                    <ResponsiveGrid columns={{ default: 1, sm: 2, lg: 4 }}>
                        <StatsCard title="Total Leads" value={statistics.total_leads} />
                        <StatsCard title="Open Deals" value={statistics.open_deals} />
                        <StatsCard title="Pipeline Value" value={`$${statistics.pipeline_value?.toLocaleString() ?? 0}`} />
                        <StatsCard title="Won This Month" value={`$${statistics.won_this_month?.toLocaleString() ?? 0}`} />
                    </ResponsiveGrid>

                    {/* Pipeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Deal Pipeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DealPipeline pipeline={pipeline} stages={stages} />
                        </CardContent>
                    </Card>

                    {/* Activities */}
                    <ResponsiveGrid columns={{ default: 1, lg: 2 }} gap={6}>
                        {(overdueActivities?.data?.length ?? 0) > 0 && (
                            <Card className="border-red-200">
                                <CardHeader>
                                    <CardTitle className="text-red-600">Overdue Activities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ActivityTimeline activities={overdueActivities?.data ?? []} />
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Activities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityTimeline activities={upcomingActivities?.data ?? []} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityTimeline activities={recentActivities?.data ?? []} />
                            </CardContent>
                        </Card>
                    </ResponsiveGrid>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
