import { Head, Link, router } from '@inertiajs/react';
import { Building2, Edit, Mail, MapPin, Phone, Trash2, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product, PurchaseOrder, Supplier } from '@/types';

interface Props {
    supplier: Supplier;
    products: Product[];
    purchaseOrders: PurchaseOrder[];
}

export default function SupplierShow({ supplier, products = [], purchaseOrders = [] }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            router.delete(`/pos/suppliers/${supplier.id}`);
        }
    };

    const statusColorClasses: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        received: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Suppliers', href: '/pos/suppliers' },
                { title: supplier.name, href: `/pos/suppliers/${supplier.id}` },
            ]}
        >
            <Head title={supplier.name} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={supplier.name}
                        description="Supplier Information"
                        actions={
                            <>
                                <Button variant="outline" asChild>
                                    <Link href={`/pos/suppliers/${supplier.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </>
                        }
                    >
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant="secondary"
                                className={
                                    supplier.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }
                            >
                                {supplier.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </PageHeader>

                    {/* Supplier Details */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Supplier Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Name</p>
                                    <p className="mt-1 font-semibold">{supplier.name}</p>
                                </div>

                                {supplier.contact_person && (
                                    <>
                                        <Separator />
                                        <div className="flex items-start gap-3">
                                            <User className="text-muted-foreground mt-1 h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs font-medium">Contact Person</p>
                                                <p className="mt-1">{supplier.contact_person}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {supplier.email && (
                                    <>
                                        <Separator />
                                        <div className="flex items-start gap-3">
                                            <Mail className="text-muted-foreground mt-1 h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs font-medium">Email</p>
                                                <a href={`mailto:${supplier.email}`} className="mt-1 text-primary hover:underline">
                                                    {supplier.email}
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {supplier.phone && (
                                    <>
                                        <Separator />
                                        <div className="flex items-start gap-3">
                                            <Phone className="text-muted-foreground mt-1 h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs font-medium">Phone</p>
                                                <a href={`tel:${supplier.phone}`} className="mt-1 text-primary hover:underline">
                                                    {supplier.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {supplier.address && (
                                    <>
                                        <Separator />
                                        <div className="flex items-start gap-3">
                                            <MapPin className="text-muted-foreground mt-1 h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs font-medium">Address</p>
                                                <p className="mt-1 text-sm">{supplier.address}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {supplier.notes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Notes</p>
                                            <p className="text-muted-foreground mt-1 text-sm">{supplier.notes}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Linked Products:</span>
                                    <span className="font-semibold">{products.length}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Purchase Orders:</span>
                                    <span className="font-semibold">{purchaseOrders.length}</span>
                                </div>
                                <Separator />
                                <div className="text-sm">
                                    <p className="text-muted-foreground font-medium">Created</p>
                                    <p className="mt-1">{formatDate(supplier.created_at)}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-muted-foreground font-medium">Last Updated</p>
                                    <p className="mt-1">{formatDate(supplier.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Linked Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Linked Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {products.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Cost Price</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Link
                                                        href={`/pos/products/${product.id}`}
                                                        className="hover:underline font-medium text-primary"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-sm">
                                                    {product.sku}
                                                </TableCell>
                                                <TableCell>{formatCurrency(product.cost_price)}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={
                                                            product.stock_quantity <= product.reorder_point
                                                                ? 'text-orange-600 font-semibold'
                                                                : ''
                                                        }
                                                    >
                                                        {product.stock_quantity} {product.unit}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={
                                                            product.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-muted-foreground py-8 text-center">
                                    <p>No products linked to this supplier</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Purchase Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase Order History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {purchaseOrders.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>PO Number</TableHead>
                                            <TableHead>Order Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Expected Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    <Link
                                                        href={`/pos/purchase-orders/${order.id}`}
                                                        className="hover:underline font-medium text-primary"
                                                    >
                                                        {order.po_number}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{formatDate(order.order_date)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={statusColorClasses[order.status]}
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {order.expected_date ? formatDate(order.expected_date) : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-muted-foreground py-8 text-center">
                                    <p>No purchase orders found for this supplier</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
