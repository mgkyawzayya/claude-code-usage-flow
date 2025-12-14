import { Link } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockBadge } from './stock-badge';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
    onClick?: (product: Product) => void;
    href?: string;
}

export function ProductCard({ product, onClick, href }: ProductCardProps) {
    if (!product?.id) {
        return null;
    }

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(product.current_price ?? 0);

    const CardWrapper = ({ children }: { children: React.ReactNode }) => {
        if (href) {
            return (
                <Link href={href}>
                    <Card className="cursor-pointer transition-shadow hover:shadow-md">{children}</Card>
                </Link>
            );
        }

        if (onClick) {
            return (
                <Card
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => onClick(product)}
                >
                    {children}
                </Card>
            );
        }

        return <Card>{children}</Card>;
    };

    return (
        <CardWrapper>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                            <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                    <div className="flex-1">
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <p className="text-muted-foreground text-xs">{product.sku}</p>
                    </div>
                </div>
                <StockBadge
                    stockQuantity={product.stock_quantity}
                    reorderPoint={product.reorder_point}
                    isActive={product.is_active}
                />
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold">{formattedPrice}</p>
                        {product.sale_price && product.regular_price && product.sale_price < product.regular_price && (
                            <p className="text-muted-foreground text-sm line-through">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(product.regular_price)}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground text-sm">Stock</p>
                        <p className="font-semibold">
                            {product.stock_quantity} {product.unit}
                        </p>
                    </div>
                </div>
                {product.category && (
                    <p className="text-muted-foreground mt-2 text-xs">{product.category.name}</p>
                )}
            </CardContent>
        </CardWrapper>
    );
}
