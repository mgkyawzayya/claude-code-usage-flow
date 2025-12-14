import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface CheckoutPanelProps {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    onCheckout: (data: {
        payment_method: string;
        amount_paid: number;
        customer_name?: string;
        customer_email?: string;
        customer_phone?: string;
        notes?: string;
    }) => void;
    disabled?: boolean;
}

export function CheckoutPanel({ subtotal, tax, discount, total, onCheckout, disabled }: CheckoutPanelProps) {
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [amountPaid, setAmountPaid] = useState<string>(total.toFixed(2));
    const [customerName, setCustomerName] = useState('');

    // Sync amountPaid when total changes (e.g., items added/removed from cart)
    useEffect(() => {
        setAmountPaid(total.toFixed(2));
    }, [total]);
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const change = parseFloat(amountPaid || '0') - total;

    const handleCheckout = () => {
        onCheckout({
            payment_method: paymentMethod,
            amount_paid: parseFloat(amountPaid),
            customer_name: customerName || undefined,
            customer_email: customerEmail || undefined,
            customer_phone: customerPhone || undefined,
            notes: notes || undefined,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Checkout
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Totals Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {tax > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax:</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                    )}
                    {discount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount:</span>
                            <span className="text-destructive">-{formatCurrency(discount)}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger id="payment_method">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Amount Paid */}
                <div className="space-y-2">
                    <Label htmlFor="amount_paid">Amount Paid</Label>
                    <Input
                        id="amount_paid"
                        type="number"
                        step="0.01"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                    />
                </div>

                {/* Change */}
                {change >= 0 && (
                    <div className="flex justify-between rounded-lg bg-muted p-3">
                        <span className="font-medium">Change:</span>
                        <span className="text-lg font-bold">{formatCurrency(change)}</span>
                    </div>
                )}

                <Separator />

                {/* Customer Details (Optional) */}
                <div className="space-y-3">
                    <Label className="text-muted-foreground text-xs">Customer Details (Optional)</Label>
                    <Input
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                    <Input
                        placeholder="Phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                </div>

                {/* Complete Sale Button */}
                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={disabled || parseFloat(amountPaid || '0') < total}
                >
                    Complete Sale
                </Button>
            </CardContent>
        </Card>
    );
}
