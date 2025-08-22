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
  Settings as SettingsIcon,
  HelpCircle,
  FileText,
  Bot,
  DollarSign,
  Mail,
  MessageCircle,
  MessagesSquare,
  Inbox,
  FolderKanban,
  UserCircle,
  ChevronsLeft,
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
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Separator } from "@/components/ui/separator"

// Sidebar navigation structure with sub-routes
const navItems: Array<{
  href: string
  label: string
  icon: any
  subItems?: { href: string; label: string; icon: any }[]
  section?: string
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Core" },
  {
    href: "/inbox",
    label: "Inbox",
    icon: Inbox,
    section: "Messaging",
    subItems: [
      { href: "/inbox/email", label: "Email", icon: Mail },
      { href: "/inbox/sms", label: "SMS", icon: MessageCircle },
      { href: "/inbox/whatsapp", label: "WhatsApp", icon: MessagesSquare },
    ],
  },
    {
    href: "/compose",
    label: "Compose",
    icon: MessageSquare,
    section: "Messaging",
    subItems: [
      { href: "/compose/email", label: "Email", icon: Mail },
      { href: "/compose/sms", label: "SMS", icon: MessageCircle },
      { href: "/compose/whatsapp", label: "WhatsApp", icon: MessagesSquare },
    ],
  },
  { href: "/contacts", label: "Contacts", icon: Users, section: "Core" },
  { href: "/sales", label: "Sales", icon: DollarSign, section: "Core" },
  { href: "/projects", label: "Projects", icon: FolderKanban, section: "Core" },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone, section: "Growth" },
  {
    href: "/templates",
    label: "Templates",
    icon: FileText,
    section: "Messaging",
    subItems: [
      { href: "/templates/email", label: "Email", icon: Mail },
      { href: "/templates/sms", label: "SMS", icon: MessageCircle },
      { href: "/templates/whatsapp", label: "WhatsApp", icon: MessagesSquare },
    ],
  },
  { href: "/analytics", label: "Analytics", icon: BarChart2, section: "Growth" },
  { href: "/chatbot", label: "Chatbot", icon: Bot, section: "Automation" },
  { href: "/integrations", label: "Integrations", icon: LinkIcon, section: "Automation" },
  { href: "/settings", label: "Settings", icon: SettingsIcon, section: "System" },
  { href: "/account", label: "Account", icon: UserCircle, section: "System" },
  { href: "/help", label: "Help", icon: HelpCircle, section: "Support" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { toggleSidebar } = useSidebar()

  if (!user) return null

  // Organize items by section preserving original order
  const sections = navItems.reduce<Record<string, typeof navItems>>( (acc, item) => {
    const key = item.section || 'General'
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 flex-shrink-0 border-r border-border bg-white dark:bg-gray-900 shadow-lg"
    >
      <SidebarHeader className="flex items-center justify-between p-4 pb-2 group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-md hover:shadow-xl transition-shadow">
            H
          </div>
          <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">Heavy CRM</span>
        </div>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="group inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronsLeft className="h-4 w-4 group-data-[collapsible=icon]:rotate-180 transition-transform" />
        </button>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="mb-4 last:mb-0">
            <p className="text-caption text-muted-foreground px-3 mb-2 group-data-[collapsible=icon]:hidden">
              {section}
            </p>
            <SidebarMenu>
              {items.map((item) => {
                const isActiveParent = pathname === item.href || (item.subItems && pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.href}>
                    {item.subItems ? (
                      <>
                        <SidebarMenuButton
                          className="flex items-center mb-1 rounded-lg hover-lift transition-all"
                          isActive={isActiveParent}
                        >
                          <item.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                          {item.subItems.map((sub) => (
                            <SidebarMenuSubItem key={sub.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === sub.href}
                                className="rounded-md"
                              >
                                <Link href={sub.href} className="flex items-center">
                                  <sub.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{sub.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={isActiveParent}
                        className="flex items-center rounded-lg hover-lift transition-all"
                      >
                        <Link href={item.href} className="flex items-center">
                          <item.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>
      <Separator className="mx-4 group-data-[collapsible=icon]:hidden" />
      <SidebarFooter className="p-4 pt-2 gap-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <div className="flex items-center justify-between gap-2 w-full group-data-[collapsible=icon]:hidden">
          <ThemeToggle />
          <UserNav />
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex flex-col gap-2 items-center w-full">
          <ThemeToggle />
          <UserNav />
        </div>
        <p className="text-[10px] text-muted-foreground tracking-wide group-data-[collapsible=icon]:hidden">v1.0.0</p>
      </SidebarFooter>
    </Sidebar>
  )
}