import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Check if a navigation item should be active based on the current URL.
 * Uses intelligent matching to avoid multiple items being active:
 * - Exact match is always active
 * - Prefix match only if followed by `/` (to avoid `/crm` matching `/crm-admin`)
 */
export function isNavItemActive(currentUrl: string, navItemHref: string): boolean {
    const currentPath = currentUrl.split('?')[0]; // Remove query params
    const navPath = navItemHref.split('?')[0];

    // Exact match
    if (currentPath === navPath) {
        return true;
    }

    // Prefix match - must be followed by a forward slash
    // This prevents `/crm` from matching `/crm/contacts`
    if (currentPath.startsWith(navPath + '/')) {
        return true;
    }

    return false;
}
