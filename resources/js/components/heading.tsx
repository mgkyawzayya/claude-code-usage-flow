import { cn } from '@/lib/utils';

interface HeadingProps {
    title: string;
    description?: string;
    /** Size variant */
    size?: 'default' | 'lg';
    className?: string;
}

export default function Heading({
    title,
    description,
    size = 'default',
    className,
}: HeadingProps) {
    return (
        <div className={cn('mb-6 space-y-0.5 md:mb-8', className)}>
            <h2 className={cn(
                'font-semibold tracking-tight',
                size === 'lg'
                    ? 'text-xl md:text-2xl'
                    : 'text-lg md:text-xl'
            )}>
                {title}
            </h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
