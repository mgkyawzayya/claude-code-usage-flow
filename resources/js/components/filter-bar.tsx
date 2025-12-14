import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

interface FilterBarProps {
    /** Search input value */
    searchValue?: string;
    /** Search input change handler */
    onSearchChange?: (value: string) => void;
    /** Search placeholder text */
    searchPlaceholder?: string;
    /** Additional filter controls */
    children?: ReactNode;
    className?: string;
}

export function FilterBar({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    children,
    className,
}: FilterBarProps) {
    return (
        <div className={cn(
            'flex flex-col gap-3 sm:flex-row sm:items-center',
            className
        )}>
            {onSearchChange !== undefined && (
                <div className="relative flex-1 sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            )}
            {children && (
                <div className="flex flex-wrap gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}
