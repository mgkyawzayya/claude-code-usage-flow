import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types';

interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(item.product.current_price);

    const formattedSubtotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(item.subtotal);

    const handleDecrement = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.product.id, item.quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (item.quantity < item.product.stock_quantity) {
            onUpdateQuantity(item.product.id, item.quantity + 1);
        }
    };

    return (
        <div className="flex items-center gap-3 border-b py-3">
            <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-muted-foreground text-sm">
                    {formattedPrice} x {item.quantity}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDecrement}
                    disabled={item.quantity <= 1}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleIncrement}
                    disabled={item.quantity >= item.product.stock_quantity}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
            <div className="w-20 text-right font-semibold">{formattedSubtotal}</div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onRemove(item.product.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
