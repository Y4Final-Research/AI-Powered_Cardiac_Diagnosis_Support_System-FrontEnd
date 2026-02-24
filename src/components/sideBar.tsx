
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
import { Heart } from 'lucide-react';

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
   <div className="relative flex h-full flex-col rounded-3xl overflow-hidden shadow-lg">
      <ShadSidebar className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
        {/* Header */}
        <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
          <Link
            href="/"
            className="flex items-center gap-3 transition-all duration-200 hover:opacity-80"
          >
            <div className="p-2.5 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-xl shadow-md">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              CardiAI
            </span>
          </Link>
        </SidebarHeader>

        {/* Navigation Content */}
        <SidebarContent className="flex-1 px-3 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveItem(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          relative rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                              : 'text-sidebar-foreground hover:bg-muted/50 hover:text-sidebar-foreground'
                          }
                        `}
                      >
                        {item.action ? (
                          <button
                            onClick={item.action}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium"
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.title}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.url!}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium"
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-4 py-6">
          <div className="text-center text-xs text-muted-foreground font-medium space-y-2">
            <p>© {currentYear}</p>
            <p className="text-xs">All rights reserved</p>
          </div>
        </div>
      </ShadSidebar>
    </div>
  );
}
