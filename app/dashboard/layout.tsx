"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Box,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  Tag,
  Truck,
  User,
  X,
  MapPin,
  Bell,
  CreditCard,
  Receipt,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationCenter } from "@/components/notification-center"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href?: string
  icon: React.ReactNode
  roles: string[] // Which roles can see this item
  children?: Omit<NavItem, "children">[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    roles: ["admin", "management", "user"],
  },
  {
    title: "Asset Management",
    icon: <Package className="h-5 w-5" />,
    roles: ["admin", "management"],
    children: [
      {
        title: "Assets",
        href: "/dashboard/assets",
        icon: <Package className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: <Tag className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
      {
        title: "Locations",
        href: "/dashboard/locations",
        icon: <MapPin className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
      {
        title: "Loans",
        href: "/dashboard/loans",
        icon: <ClipboardList className="h-5 w-5" />,
        roles: ["admin", "management", "user"],
      },
      {
        title: "Transfers",
        href: "/dashboard/transfers",
        icon: <Truck className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
      {
        title: "Returns",
        href: "/dashboard/returns",
        icon: <Box className="h-5 w-5" />,
        roles: ["admin", "management", "user"],
      },
      {
        title: "Approvals",
        href: "/dashboard/approvals",
        icon: <Bell className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
      {
        title: "Reports",
        href: "/dashboard/reports",
        icon: <BarChart3 className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
    ],
  },
  {
    title: "POS",
    icon: <CreditCard className="h-5 w-5" />,
    roles: ["admin", "management"],
    children: [
      {
        title: "Point of Sale",
        href: "/dashboard/pos",
        icon: <CreditCard className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: <Receipt className="h-5 w-5" />,
        roles: ["admin", "management"],
      },
    ],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: <User className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin"],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      setIsMounted(true)

      // Get user role from localStorage
      const role = localStorage.getItem("userRole")
      const name = localStorage.getItem("userName")

      // If no role is found, redirect to login
      if (!role) {
        router.push("/login")
        return
      }

      setUserRole(role)
      setUserName(name)
      initialized.current = true
    }
  }, [router])

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")

    // Redirect to login page
    router.push("/login")
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => userRole && item.roles.includes(userRole))

  // Add state for expanded menu sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Toggle section expansion
  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  if (!isMounted || !userRole) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b px-2 py-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Package className="h-6 w-6" />
                  <span>Asset Management</span>
                </Link>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="grid gap-2 p-4">
                {filteredNavItems.map((item) => (
                  <div key={item.title}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleSection(item.title)}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            {item.title}
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedSections[item.title] ? "rotate-180" : "",
                            )}
                          />
                        </button>
                        {item.children && expandedSections[item.title] && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.children
                              .filter((child) => userRole && child.roles.includes(userRole))
                              .map((child) => (
                                <Link
                                  key={child.title}
                                  href={child.href || "#"}
                                  onClick={() => setIsMobileOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    pathname === child.href ? "bg-accent text-accent-foreground" : "transparent",
                                  )}
                                >
                                  {child.icon}
                                  {child.title}
                                </Link>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Asset Management</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <NotificationCenter />
          <ThemeToggle />
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>{userName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 h-screen sticky top-0 flex-col border-r bg-background md:flex">
          <div className="flex h-16 items-center gap-2 border-b px-4 py-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>Asset Management</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto p-4">
            <div className="grid gap-2">
              {filteredNavItems.map((item) => (
                <div key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleSection(item.title)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {item.title}
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedSections[item.title] ? "rotate-180" : "",
                          )}
                        />
                      </button>
                      {item.children && expandedSections[item.title] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children
                            .filter((child) => userRole && child.roles.includes(userRole))
                            .map((child) => (
                              <Link
                                key={child.title}
                                href={child.href || "#"}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                  pathname === child.href ? "bg-accent text-accent-foreground" : "transparent",
                                )}
                              >
                                {child.icon}
                                {child.title}
                              </Link>
                            ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>{userName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">{userName || "User"}</span>
                <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
              </div>
              <ThemeToggle />
              <NotificationCenter />
            </div>
            <Button variant="outline" className="mt-4 w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
