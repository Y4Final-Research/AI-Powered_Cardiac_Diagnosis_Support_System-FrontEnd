
'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar as ShadSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { RiHome2Line, RiHistoryLine, RiSettings3Line, RiLogoutBoxRLine } from '@remixicon/react';
import Image from 'next/image';
import Link from 'next/link';

type SidebarItem = {
  readonly title: string;
  readonly icon: any;
  readonly url?: string;
  readonly action?: () => void;
  readonly children?: ReadonlyArray<{
    readonly title: string;
    readonly url: string;
    readonly icon?: any;
  }>;
};

export function Sidebar() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  // Example static menu items; replace with dynamic if needed
  const items: SidebarItem[] = useMemo(
    () => [
      {
        title: 'AI Diagnostic',
        icon: RiHome2Line,
        url: '/lab-reports',
      },
      {
        title: 'Patient History',
        icon: RiHistoryLine,
        url: '/patient-history',
      },
      {
        title: 'Settings',
        icon: RiSettings3Line,
        url: '/settings',
      },
      {
        title: 'Logout',
        icon: RiLogoutBoxRLine,
        action: () => {
          // Add logout logic here
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_type');
            localStorage.removeItem('user_id');
            localStorage.removeItem('role');
            localStorage.removeItem('name');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        },
      },
    ],
    [],
  );

  const isActiveItem = (url?: string) => {
    if (!url) return false;
    if (!pathname) return false;
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex h-full flex-col rounded-3xl">
      <ShadSidebar className="flex h-full flex-col w-56 bg-gray-50 border-r border-gray-200">
        <SidebarHeader>
          <div className="mt-4 flex justify-center">
            <Link href="/lab-reports" passHref>
              <Image
                src="/images/brand-logo.png"
                alt="logo"
                width={48}
                height={48}
                className="mb-4"
                priority
                loading="eager"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2 mb-6">
                {items.map((item) => {
                  const Icon = item.icon;
                  const exactActive = isActiveItem(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={exactActive}
                        variant={exactActive ? 'default' : 'outline'}
                      >
                        {item.action ? (
                          <button
                            onClick={item.action}
                            className="flex w-full cursor-pointer items-center gap-2 text-left"
                          >
                            <Icon className="h-5 w-5" />
                            {item.title}
                          </button>
                        ) : (
                          <Link
                            href={item.url!}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Icon className="h-5 w-5" />
                            {item.title}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="text-secondary-muted absolute bottom-8 w-full text-center text-sm font-normal">
            © {currentYear}
            <Image
              src="/images/macrolabs.png"
              alt="logo"
              width={90}
              height={24}
              className="mx-1 inline-block align-middle"
            />{' '}
            <br />
            All rights reserved.
          </div>
        </SidebarContent>
      </ShadSidebar>
    </div>
  );
}
