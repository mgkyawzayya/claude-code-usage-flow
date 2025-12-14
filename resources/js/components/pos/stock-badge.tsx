import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
    stockQuantity: number;
    reorderPoint: number;
    isActive?: boolean;
    className?: string;
}

export function StockBadge({ stockQuantity, reorderPoint, isActive = true, className }: StockBadgeProps) {
    if (!isActive) {
        return (
            <Badge variant="secondary" className={cn('bg-gray-100 text-gray-800', className)}>
                Inactive
            </Badge>
        );
    }

    if (stockQuantity === 0) {
        return (
            <Badge variant="destructive" className={className}>
                Out of Stock
            </Badge>
        );
    }

    if (stockQuantity <= reorderPoint) {
        return (
            <Badge variant="secondary" className={cn('bg-yellow-100 text-yellow-800', className)}>
                Low Stock
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className={cn('bg-green-100 text-green-800', className)}>
            In Stock
        </Badge>
    );
}
