import { Head, router } from '@inertiajs/react';
import { Printer, Receipt } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Sale } from '@/types';

interface Props {
    sale: Sale;
}

export default function SaleShow({ sale }: Props) {
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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleVoid = () => {
        if (confirm('Are you sure you want to void this sale? This action cannot be undone.')) {
            router.post(`/pos/sales/${sale.id}/void`);
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        refunded: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'POS', href: '/pos' },
                { title: 'Sales', href: '/pos/sales' },
                { title: sale.invoice_number, href: `/pos/sales/${sale.id}` },
            ]}
        >
            <Head title={`Sale ${sale.invoice_number}`} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={sale.invoice_number}
                        description={formatDate(sale.created_at)}
                        actions={
                            <>
                                <Button variant="outline" onClick={handlePrint}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Receipt
                                </Button>
                                {sale.status === 'completed' && (
                                    <Button variant="destructive" onClick={handleVoid}>
                                        Void Sale
                                    </Button>
                                )}
                            </>
                        }
                    >
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={statusColors[sale.status]}>
                                {sale.status}
                            </Badge>
                            <Badge variant="outline">{sale.payment_method.replace('_', ' ')}</Badge>
                        </div>
                    </PageHeader>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Sale Information */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Receipt className="h-5 w-5" />
                                        Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>SKU</TableHead>
                                                <TableHead className="text-right">Qty</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sale.items?.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.product_name}</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {item.product_sku}
                                                    </TableCell>
                                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(item.unit_price)}
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

                            {/* Customer Information */}
                            {(sale.customer_name || sale.customer_email || sale.customer_phone) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Customer Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {sale.customer_name && (
                                            <div>
                                                <p className="text-muted-foreground text-sm">Name</p>
                                                <p className="font-medium">{sale.customer_name}</p>
                                            </div>
                                        )}
                                        {sale.customer_email && (
                                            <div>
                                                <p className="text-muted-foreground text-sm">Email</p>
                                                <p className="font-medium">{sale.customer_email}</p>
                                            </div>
                                        )}
                                        {sale.customer_phone && (
                                            <div>
                                                <p className="text-muted-foreground text-sm">Phone</p>
                                                <p className="font-medium">{sale.customer_phone}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="space-y-6">
                            {/* Totals */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-semibold">{formatCurrency(sale.subtotal)}</span>
                                    </div>

                                    {sale.tax > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tax:</span>
                                            <span className="font-semibold">{formatCurrency(sale.tax)}</span>
                                        </div>
                                    )}

                                    {sale.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Discount:</span>
                                            <span className="font-semibold text-red-600">
                                                -{formatCurrency(sale.discount)}
                                            </span>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold">Total:</span>
                                        <span className="font-bold">{formatCurrency(sale.total)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Method:</span>
                                        <span className="font-semibold capitalize">
                                            {sale.payment_method.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount Paid:</span>
                                        <span className="font-semibold">{formatCurrency(sale.amount_paid)}</span>
                                    </div>

                                    {sale.change > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Change:</span>
                                            <span className="font-semibold">{formatCurrency(sale.change)}</span>
                                        </div>
                                    )}

                                    {sale.completed_at && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-muted-foreground text-sm">Completed At</p>
                                                <p className="text-sm">{formatDate(sale.completed_at)}</p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            {sale.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{sale.notes}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
