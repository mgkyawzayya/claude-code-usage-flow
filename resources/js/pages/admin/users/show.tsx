import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/page-container';
import { PageHeader } from '@/components/page-header';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Props {
    user: User;
}

export default function ShowUser({ user }: Props) {
    return (
        <AdminLayout>
            <Head title={user.name} />

            <PageContainer>
                <div className="space-y-6">
                    <PageHeader
                        title={user.name}
                        actions={
                            <Button asChild variant="outline">
                                <Link href={`/admin/users/${user.id}/edit`}>
                                    Edit User
                                </Link>
                            </Button>
                        }
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Joined{' '}
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.email_verified_at ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Email verified</span>
                                            <Badge variant="default">
                                                Verified
                                            </Badge>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4 text-muted-foreground" />
                                            <span>Email not verified</span>
                                            <Badge variant="secondary">
                                                Unverified
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        User ID
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {user.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Last Updated
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {new Date(
                                            user.updated_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                {user.two_factor_enabled && (
                                    <div>
                                        <p className="text-sm font-medium">
                                            Two-Factor Authentication
                                        </p>
                                        <Badge variant="default">Enabled</Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PageContainer>
        </AdminLayout>
    );
}
