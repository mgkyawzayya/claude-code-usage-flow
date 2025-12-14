import { Link } from '@inertiajs/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Contact } from '@/types/crm';

interface ContactCardProps {
    contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
    if (!contact?.id) {
        return null;
    }

    const initials = `${contact.first_name?.[0] ?? ''}${contact.last_name?.[0] ?? ''}`.toUpperCase();

    const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        lead: 'bg-blue-100 text-blue-800',
    };

    return (
        <Link href={`/crm/contacts/${contact.id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-base">{contact.full_name}</CardTitle>
                        {contact.job_title && <p className="text-muted-foreground text-sm">{contact.job_title}</p>}
                    </div>
                    <Badge className={statusColors[contact.status]}>{contact.status}</Badge>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 text-sm">
                        {contact.email && <p className="text-muted-foreground">{contact.email}</p>}
                        {contact.phone && <p className="text-muted-foreground">{contact.phone}</p>}
                        {contact.companies && contact.companies.length > 0 && (
                            <p className="text-muted-foreground">{contact.companies[0].name}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
