import { Link } from '@inertiajs/react';
import { Building } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Company } from '@/types/crm';

interface CompanyCardProps {
    company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
    if (!company?.id) {
        return null;
    }

    return (
        <Link href={`/crm/companies/${company.id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                        <AvatarFallback>
                            <Building className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-base">{company.name}</CardTitle>
                        {company.industry && <p className="text-muted-foreground text-sm">{company.industry}</p>}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 text-sm">
                        {company.email && <p className="text-muted-foreground">{company.email}</p>}
                        {company.phone && <p className="text-muted-foreground">{company.phone}</p>}
                        {company.website && <p className="text-muted-foreground">{company.website}</p>}
                        {company.contacts_count !== undefined && (
                            <p className="text-muted-foreground">
                                {company.contacts_count} contact{company.contacts_count !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
