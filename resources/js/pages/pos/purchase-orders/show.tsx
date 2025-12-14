import { Head, Link, router } from '@inertiajs/react';
import { Edit, FileText, Printer, Send, Truck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PurchaseOrder } from '@/types';

interface Props {
    purchaseOrder: PurchaseOrder;
}

export default function PurchaseOrderShow({ purchaseOrder }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSend = () => {
        if (confirm('Mark this purchase order as sent to supplier?')) {
            router.post(`/pos/purchase-orders/${purchaseOrder.id}/send`);
        }
    };

    const handleReceive = () => {
        if (confirm('Mark this purchase order as received? This will update your inventory.')) {
            router.post(`/pos/purchase-orders/${purchaseOrder.id}/receive`);
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this purchase order? This action cannot be undone.')) {
            router.delete(`/pos/purchase-orders/${purchaseOrder.id}`);
        }
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        received: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Purchase Orders', href: '/pos/purchase-orders' },
                { title: purchaseOrder.po_number, href: `/pos/purchase-orders/${purchaseOrder.id}` },
            ]}
        >
            <Head title={`Purchase Order ${purchaseOrder.po_number}`} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={purchaseOrder.po_number}
                        description={`Order Date: ${formatDate(purchaseOrder.order_date)}`}
                        actions={
                            <>
                                <Button variant="outline" onClick={handlePrint}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print
                                </Button>
                                {purchaseOrder.status === 'draft' && (
                                    <>
                                        <Button variant="outline" asChild>
                                            <Link href={`/pos/purchase-orders/${purchaseOrder.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button onClick={handleSend}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send to Supplier
                                        </Button>
                                    </>
                                )}
                                {purchaseOrder.status === 'sent' && (
                                    <Button onClick={handleReceive}>
                                        <Truck className="mr-2 h-4 w-4" />
                                        Mark as Received
                                    </Button>
                                )}
                                {purchaseOrder.status === 'draft' && (
                                    <Button variant="destructive" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                )}
                            </>
                        }
                    >
                        <Badge variant="secondary" className={statusColors[purchaseOrder.status]}>
                            {purchaseOrder.status}
                        </Badge>
                    </PageHeader>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Purchase Order Details */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Order Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead className="text-right">Qty Ordered</TableHead>
                                                <TableHead className="text-right">Qty Received</TableHead>
                                                <TableHead className="text-right">Unit Cost</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {purchaseOrder.items?.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{item.product?.name}</p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {item.product?.sku}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {item.product?.category?.name ?? '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">{item.quantity_ordered}</TableCell>
                                                    <TableCell className="text-right">
                                                        <span
                                                            className={
                                                                item.quantity_received < item.quantity_ordered
                                                                    ? 'text-yellow-600'
                                                                    : 'text-green-600'
                                                            }
                                                        >
                                                            {item.quantity_received}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(item.unit_cost)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {formatCurrency(item.total)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            {purchaseOrder.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm whitespace-pre-wrap">{purchaseOrder.notes}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Items:</span>
                                        <span className="font-semibold">{purchaseOrder.items?.length ?? 0}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold">Total:</span>
                                        <span className="font-bold">{formatCurrency(purchaseOrder.total)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Supplier Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Supplier</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {purchaseOrder.supplier ? (
                                        <>
                                            <div>
                                                <p className="font-medium">{purchaseOrder.supplier.name}</p>
                                            </div>
                                            {purchaseOrder.supplier.contact_person && (
                                                <div>
                                                    <p className="text-muted-foreground text-sm">Contact Person</p>
                                                    <p className="text-sm">{purchaseOrder.supplier.contact_person}</p>
                                                </div>
                                            )}
                                            {purchaseOrder.supplier.email && (
                                                <div>
                                                    <p className="text-muted-foreground text-sm">Email</p>
                                                    <p className="text-sm">{purchaseOrder.supplier.email}</p>
                                                </div>
                                            )}
                                            {purchaseOrder.supplier.phone && (
                                                <div>
                                                    <p className="text-muted-foreground text-sm">Phone</p>
                                                    <p className="text-sm">{purchaseOrder.supplier.phone}</p>
                                                </div>
                                            )}
                                            {purchaseOrder.supplier.address && (
                                                <div>
                                                    <p className="text-muted-foreground text-sm">Address</p>
                                                    <p className="text-sm whitespace-pre-wrap">
                                                        {purchaseOrder.supplier.address}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No supplier information</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Dates */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dates</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Order Date</p>
                                        <p className="font-medium">{formatDate(purchaseOrder.order_date)}</p>
                                    </div>

                                    {purchaseOrder.expected_date && (
                                        <div>
                                            <p className="text-muted-foreground text-sm">Expected Delivery</p>
                                            <p className="font-medium">{formatDate(purchaseOrder.expected_date)}</p>
                                        </div>
                                    )}

                                    {purchaseOrder.received_date && (
                                        <div>
                                            <p className="text-muted-foreground text-sm">Received Date</p>
                                            <p className="font-medium text-green-600">
                                                {formatDate(purchaseOrder.received_date)}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
