import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    className?: string;
    /** Maximum width constraint */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageContainer({
    children,
    className,
    maxWidth = 'full'
}: PageContainerProps) {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: '',
    };

    return (
        <div className={cn(
            'px-4 py-6 md:px-6',
            maxWidthClasses[maxWidth],
            maxWidth !== 'full' && 'mx-auto',
            className
        )}>
            {children}
        </div>
    );
}
