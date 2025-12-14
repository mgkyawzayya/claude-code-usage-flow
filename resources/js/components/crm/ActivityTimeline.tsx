import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Activity } from '@/types/crm';

interface ActivityTimelineProps {
    activities: Activity[];
    onComplete?: (id: number) => void;
}

function formatDistanceToNow(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

export function ActivityTimeline({ activities, onComplete }: ActivityTimelineProps) {
    const typeIcons: Record<string, string> = {
        call: '\uD83D\uDCDE',
        email: '\u2709\uFE0F',
        meeting: '\uD83D\uDC65',
        task: '\u2713',
        note: '\uD83D\uDCDD',
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800',
    };

    if (activities.length === 0) {
        return <p className="text-muted-foreground py-4 text-center text-sm">No activities yet</p>;
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className={cn('flex gap-3 rounded-lg border p-3', activity.is_overdue && 'border-red-200 bg-red-50')}
                >
                    <span className="text-xl">{typeIcons[activity.type]}</span>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{activity.subject}</span>
                            <Badge className={statusColors[activity.status]} variant="secondary">
                                {activity.status}
                            </Badge>
                            {activity.is_overdue && <Badge variant="destructive">Overdue</Badge>}
                        </div>
                        {activity.description && (
                            <p className="text-muted-foreground mt-1 truncate text-sm">{activity.description}</p>
                        )}
                        <p className="text-muted-foreground mt-1 text-xs">
                            {activity.scheduled_at
                                ? `Scheduled ${formatDistanceToNow(new Date(activity.scheduled_at))}`
                                : `Created ${formatDistanceToNow(new Date(activity.created_at))}`}
                        </p>
                    </div>
                    {activity.status === 'pending' && onComplete && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onComplete(activity.id);
                            }}
                            className="text-primary text-sm hover:underline"
                        >
                            Complete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
