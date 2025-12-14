import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { Lock, Shield, ShieldCheck, Users } from 'lucide-react';

interface DashboardProps {
    stats: {
        admins_count: number;
        users_count: number;
        roles_count: number;
        permissions_count: number;
    };
}

export default function AdminDashboard({ stats }: DashboardProps) {
    const cards = [
        {
            title: 'Total Admins',
            value: stats.admins_count,
            icon: ShieldCheck,
            description: 'System administrators',
        },
        {
            title: 'Total Users',
            value: stats.users_count,
            icon: Users,
            description: 'Registered users',
        },
        {
            title: 'Roles',
            value: stats.roles_count,
            icon: Shield,
            description: 'Admin roles',
        },
        {
            title: 'Permissions',
            value: stats.permissions_count,
            icon: Lock,
            description: 'System permissions',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome to the admin panel
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card key={card.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {card.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {card.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
