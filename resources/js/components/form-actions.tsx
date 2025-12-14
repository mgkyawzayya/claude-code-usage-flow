import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface FormActionsProps {
    children: ReactNode;
    className?: string;
    /** Align buttons: 'start', 'end', 'center', 'between' */
    align?: 'start' | 'end' | 'center' | 'between';
}

export function FormActions({
    children,
    className,
    align = 'end'
}: FormActionsProps) {
    const alignClasses = {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
    };

    return (
        <div className={cn(
            'flex flex-col-reverse gap-2 pt-4 sm:flex-row',
            alignClasses[align],
            className
        )}>
            {children}
        </div>
    );
}
