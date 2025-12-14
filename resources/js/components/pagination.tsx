import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
    current_page: number;
    last_page: number;
}

interface PaginationLinks {
    prev: string | null;
    next: string | null;
}

interface PaginationProps {
    meta?: PaginationMeta;
    links?: PaginationLinks;
    className?: string;
}

export function Pagination({ meta, links, className }: PaginationProps) {
    if (!meta || !links || meta.last_page <= 1) return null;

    return (
        <div className={cn(
            'flex items-center justify-between gap-2',
            className
        )}>
            {links.prev ? (
                <Button variant="outline" size="sm" asChild>
                    <Link href={links.prev}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
                    </Link>
                </Button>
            ) : (
                <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
                </Button>
            )}

            <span className="text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.last_page}
            </span>

            {links.next ? (
                <Button variant="outline" size="sm" asChild>
                    <Link href={links.next}>
                        <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            ) : (
                <Button variant="outline" size="sm" disabled>
                    <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
