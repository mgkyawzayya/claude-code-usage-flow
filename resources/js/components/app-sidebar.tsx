import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Building, CheckSquare, DollarSign, FileText, Folder, Kanban, LayoutGrid, Users, ShoppingCart, Package, Tags, Truck, ClipboardList, BarChart3, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Blog Posts',
        href: '/blog-posts',
        icon: FileText,
    },
];

const crmNavItems: NavItem[] = [
    {
        title: 'CRM Dashboard',
        href: '/crm',
        icon: LayoutGrid,
    },
    {
        title: 'Contacts',
        href: '/crm/contacts',
        icon: Users,
    },
    {
        title: 'Companies',
        href: '/crm/companies',
        icon: Building,
    },
    {
        title: 'Deals',
        href: '/crm/deals',
        icon: DollarSign,
    },
    {
        title: 'Pipeline',
        href: '/crm/deals/pipeline',
        icon: Kanban,
    },
    {
        title: 'Activities',
        href: '/crm/activities',
        icon: CheckSquare,
    },
];

const posNavItems: NavItem[] = [
    {
        title: 'POS Dashboard',
        href: '/pos',
        icon: LayoutGrid,
    },
    {
        title: 'Point of Sale',
        href: '/pos/sales/pos',
        icon: ShoppingCart,
    },
    {
        title: 'Products',
        href: '/pos/products',
        icon: Package,
    },
    {
        title: 'Categories',
        href: '/pos/categories',
        icon: Tags,
    },
    {
        title: 'Sales History',
        href: '/pos/sales',
        icon: ClipboardList,
    },
    {
        title: 'Inventory',
        href: '/pos/inventory',
        icon: Warehouse,
    },
    {
        title: 'Suppliers',
        href: '/pos/suppliers',
        icon: Truck,
    },
    {
        title: 'Purchase Orders',
        href: '/pos/purchase-orders',
        icon: FileText,
    },
    {
        title: 'Reports',
        href: '/pos/reports/sales',
        icon: BarChart3,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={crmNavItems} label="CRM" />
                <NavMain items={posNavItems} label="POS" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
