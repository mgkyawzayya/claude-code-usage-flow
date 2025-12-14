import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ResponsiveGridProps {
    children: ReactNode;
    /** Number of columns at each breakpoint */
    columns?: {
        default?: 1 | 2 | 3 | 4;
        sm?: 1 | 2 | 3 | 4;
        md?: 1 | 2 | 3 | 4;
        lg?: 1 | 2 | 3 | 4;
        xl?: 1 | 2 | 3 | 4;
    };
    /** Gap size */
    gap?: 2 | 3 | 4 | 6 | 8;
    className?: string;
}

export function ResponsiveGrid({
    children,
    columns = { default: 1, md: 2, lg: 3 },
    gap = 4,
    className,
}: ResponsiveGridProps) {
    const colClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };

    const gapClasses = {
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
    };

    const gridClasses = [
        'grid',
        gapClasses[gap],
        columns.default && colClasses[columns.default],
        columns.sm && `sm:${colClasses[columns.sm]}`,
        columns.md && `md:${colClasses[columns.md]}`,
        columns.lg && `lg:${colClasses[columns.lg]}`,
        columns.xl && `xl:${colClasses[columns.xl]}`,
    ].filter(Boolean);

    return (
        <div className={cn(gridClasses, className)}>
            {children}
        </div>
    );
}
