"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Megaphone,
  BarChart2,
  LinkIcon,
  Settings,
  HelpCircle,
  FileText,
  UserCircle,
  Bot,
  DollarSign,
  Mail,
  MessageCircle,
  MessagesSquare,
  Inbox,
  FolderKanban,
} from "lucide-react"
import { useAuth } from "./auth-provider"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/compose", label: "Compose", icon: MessageSquare },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/sales", label: "Sales", icon: DollarSign },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
  { href: "/integrations", label: "Integrations", icon: LinkIcon },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
    >
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            H
          </div>
          <span className="text-lg font-bold text-primary group-data-[collapsible=icon]:hidden">Heavy CRM</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.subItems ? (
                <>
                  <SidebarMenuButton className="flex items-center mb-2 ml-2">
                    <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    <span className="text-base text-gray-700 dark:text-gray-300">{item.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                          <Link href={subItem.href} className="flex items-center">
                            <subItem.icon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{subItem.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </>
              ) : (
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} className="flex items-center mb-2 ml-2">
                    <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    <span className="text-base text-gray-700 dark:text-gray-300">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}