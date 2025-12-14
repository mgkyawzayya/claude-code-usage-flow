import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItemRow } from './cart-item';
import type { CartItem } from '@/types';

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

export function Cart({ items, onUpdateQuantity, onRemove }: CartProps) {
    if (items.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Cart
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <ShoppingCart className="text-muted-foreground mb-4 h-12 w-12" />
                        <p className="text-muted-foreground text-sm">Your cart is empty</p>
                        <p className="text-muted-foreground text-xs">Add products to get started</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart ({items.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-1">
                    {items.map((item) => (
                        <CartItemRow
                            key={item.product.id}
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
