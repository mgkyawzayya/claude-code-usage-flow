import { DealCard } from './DealCard';
import type { DealStages, Pipeline } from '@/types/crm';

interface DealPipelineProps {
    pipeline: Pipeline;
    stages: DealStages;
}

export function DealPipeline({ pipeline, stages }: DealPipelineProps) {
    const stageOrder = ['lead', 'qualified', 'proposal', 'negotiation'];

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {stageOrder.map((stageKey) => {
                const stage = pipeline[stageKey];
                if (!stage) return null;

                return (
                    <div key={stageKey} className="bg-muted/30 w-80 flex-shrink-0 rounded-lg p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold">{stage.label}</h3>
                            <span className="text-muted-foreground text-sm">{stage.deals.length} deals</span>
                        </div>
                        <p className="text-muted-foreground mb-4 text-sm">${stage.total_value?.toLocaleString() ?? 0}</p>
                        <div className="space-y-3">
                            {stage.deals.map((deal) => (
                                <DealCard key={deal.id} deal={deal} stages={stages} compact />
                            ))}
                            {stage.deals.length === 0 && (
                                <p className="text-muted-foreground py-4 text-center text-sm">No deals in this stage</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
