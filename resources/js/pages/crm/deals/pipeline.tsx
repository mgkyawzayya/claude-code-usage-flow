import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DealPipeline } from '@/components/crm/DealPipeline';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import type { DealStages, Pipeline } from '@/types/crm';

interface Props {
    pipeline: Pipeline;
    stages: DealStages;
}

export default function DealsPipeline({ pipeline, stages }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'CRM', href: '/crm' }, { title: 'Deals', href: '/crm/deals' }, { title: 'Pipeline', href: '/crm/deals/pipeline' }]}>
            <Head title="Deal Pipeline" />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title="Deal Pipeline"
                        actions={
                            <>
                                <Button variant="outline" asChild>
                                    <Link href="/crm/deals">List View</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/crm/deals/create">Add Deal</Link>
                                </Button>
                            </>
                        }
                    />

                    {/* Pipeline with horizontal scroll on mobile */}
                    <div className="-mx-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
                        <DealPipeline pipeline={pipeline} stages={stages} />
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
