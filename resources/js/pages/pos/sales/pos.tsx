import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Cart } from '@/components/pos/cart';
import { CheckoutPanel } from '@/components/pos/checkout-panel';
import { ProductCard } from '@/components/pos/product-card';
import { FilterBar } from '@/components/filter-bar';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { ResponsiveGrid } from '@/components/responsive-grid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CartItem, Category, Product } from '@/types';

interface Props {
    products: Product[];
    categories: Category[];
}

export default function PosInterface({ products = [], categories = [] }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.sku.toLowerCase().includes(search.toLowerCase()) ||
            product.barcode?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === 'all' || product.category_id?.toString() === selectedCategory;

        return matchesSearch && matchesCategory && product.is_active && product.stock_quantity > 0;
    });

    // Cart operations
    const addToCart = (product: Product) => {
        const existingItem = cart.find((item) => item.product.id === product.id);

        if (existingItem) {
            if (existingItem.quantity < product.stock_quantity) {
                setCart(
                    cart.map((item) =>
                        item.product.id === product.id
                            ? {
                                  ...item,
                                  quantity: item.quantity + 1,
                                  subtotal: (item.quantity + 1) * product.current_price,
                              }
                            : item,
                    ),
                );
            }
        } else {
            setCart([
                ...cart,
                {
                    product,
                    quantity: 1,
                    subtotal: product.current_price,
                },
            ]);
        }
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCart(
            cart.map((item) =>
                item.product.id === productId
                    ? {
                          ...item,
                          quantity,
                          subtotal: quantity * item.product.current_price,
                      }
                    : item,
            ),
        );
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter((item) => item.product.id !== productId));
    };

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax (configurable in real app)
    const discount = 0; // Could be calculated based on promotions
    const total = subtotal + tax - discount;

    // Checkout
    const handleCheckout = (checkoutData: {
        payment_method: string;
        amount_paid: number;
        customer_name?: string;
        customer_email?: string;
        customer_phone?: string;
        notes?: string;
    }) => {
        const saleData = {
            items: cart.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
                unit_price: item.product.current_price,
            })),
            subtotal,
            tax,
            discount,
            total,
            ...checkoutData,
        };

        router.post('/pos/sales', saleData, {
            onSuccess: () => {
                setCart([]);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'POS', href: '/pos' }, { title: 'New Sale', href: '/pos/sales/pos' }]}>
            <Head title="Point of Sale" />

            <PageContainer>
                <PageHeader title="Point of Sale" description="Process new sales and manage your cart" />

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: Product Selection */}
                    <div className="lg:col-span-2 space-y-4">
                        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search products by name, SKU, or barcode...">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FilterBar>

                        <ResponsiveGrid columns={{ default: 1, sm: 2, lg: 3 }}>
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} onClick={addToCart} />
                            ))}
                        </ResponsiveGrid>

                        {filteredProducts.length === 0 && (
                            <div className="rounded-lg border border-dashed p-12 text-center">
                                <p className="text-muted-foreground">No products found</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Cart & Checkout */}
                    <div className="space-y-4">
                        <Cart items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />

                        {cart.length > 0 && (
                            <CheckoutPanel
                                subtotal={subtotal}
                                tax={tax}
                                discount={discount}
                                total={total}
                                onCheckout={handleCheckout}
                            />
                        )}
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
