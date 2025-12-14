import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    /** Action buttons (right side on desktop, below title on mobile) */
    actions?: ReactNode;
    /** Additional content below title (badges, metadata) */
    children?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    actions,
    children,
    className
}: PageHeaderProps) {
    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                    {children}
                </div>
                {actions && (
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
