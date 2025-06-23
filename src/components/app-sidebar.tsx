'use client';

import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  StethoscopeIcon,
  UsersRoundIcon,
} from 'lucide-react';

import logoFullIcon from '@/assets/icons/logo-full.svg';
import logoIcon from '@/assets/icons/logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SignOutButton from '@/components/sign-out-button';
// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Agendamentos',
    url: '/appointments',
    icon: CalendarDaysIcon,
  },
  {
    title: 'Médicos',
    url: '/doctors',
    icon: StethoscopeIcon,
  },
  {
    title: 'Pacientes',
    url: '/patients',
    icon: UsersRoundIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {open ? (
          <Image src={logoFullIcon} alt="Dr. Agenda logo" height={24} />
        ) : (
          <Image src={logoIcon} alt="Dr. Agenda logo" height={24} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Clínica</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
