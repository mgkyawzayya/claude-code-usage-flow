import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/admin';
import admins from '@/routes/admin/admins';
import roles from '@/routes/admin/roles';
import permissions from '@/routes/admin/permissions';
import users from '@/routes/admin/users';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, ShieldCheck, Shield, Lock, Users } from 'lucide-react';
import { NavAdmin } from './nav-admin';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Admins',
        href: admins.index(),
        icon: ShieldCheck,
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: Shield,
    },
    {
        title: 'Permissions',
        href: permissions.index(),
        icon: Lock,
    },
    {
        title: 'Users',
        href: users.index(),
        icon: Users,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Admin Panel
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Overview" />
                <NavMain items={adminNavItems} label="Management" />
            </SidebarContent>

            <SidebarFooter>
                <NavAdmin />
            </SidebarFooter>
        </Sidebar>
    );
}
