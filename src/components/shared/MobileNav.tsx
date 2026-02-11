"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ListTodo, Wallet, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/tasks", icon: ListTodo, label: "Tasks" },
    { href: "/dashboard/finance", icon: Wallet, label: "Ledger" },
    { href: "/dashboard/team", icon: Users, label: "Circle" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#F9F8F4] border-t border-border flex items-center justify-around px-4 z-50 md:hidden">
      {links.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}