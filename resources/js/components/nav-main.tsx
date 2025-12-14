import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { isNavItemActive, resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[]; label?: string }) {
    const page = usePage();

    // Find the most specific matching nav item (longest matching path)
    const activeItemHref = useMemo(() => {
        const matchingItems = items.filter(item =>
            isNavItemActive(page.url, resolveUrl(item.href))
        );

        if (matchingItems.length === 0) return null;

        // Return the item with the longest href (most specific)
        return matchingItems.reduce((prev, current) => {
            const prevHref = resolveUrl(prev.href);
            const currentHref = resolveUrl(current.href);
            return currentHref.length > prevHref.length ? current : prev;
        }).href;
    }, [page.url, items]);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={activeItemHref !== null && resolveUrl(item.href) === resolveUrl(activeItemHref)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
