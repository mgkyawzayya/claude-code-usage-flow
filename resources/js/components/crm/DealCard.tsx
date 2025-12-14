import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Deal, DealStages } from '@/types/crm';

interface DealCardProps {
    deal: Deal;
    stages: DealStages;
    compact?: boolean;
}

export function DealCard({ deal, stages, compact = false }: DealCardProps) {
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

    return (
        <Link href={`/crm/deals/${deal.id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className={compact ? 'pb-2' : ''}>
                    <div className="flex items-center justify-between">
                        <CardTitle className={compact ? 'text-sm' : 'text-base'}>{deal.title}</CardTitle>
                        <Badge className={stageColors[deal.stage]}>{stages[deal.stage]}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {deal.value_formatted && <p className="text-lg font-semibold">{deal.value_formatted}</p>}
                        {!compact && (
                            <>
                                {deal.contact && <p className="text-muted-foreground text-sm">{deal.contact.full_name}</p>}
                                {deal.company && <p className="text-muted-foreground text-sm">{deal.company.name}</p>}
                                {deal.expected_close_date && (
                                    <p className="text-muted-foreground text-sm">
                                        Expected: {new Date(deal.expected_close_date).toLocaleDateString()}
                                    </p>
                                )}
                            </>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Probability:</span>
                            <span>{deal.probability}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
