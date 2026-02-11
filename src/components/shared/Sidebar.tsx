"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Wallet, Users, Settings, LogOut, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Props untuk Mobile Control
export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/tasks", icon: CheckSquare, label: "The Plan" },
    { href: "/dashboard/finance", icon: Wallet, label: "Ledger" },
    { href: "/dashboard/team", icon: Users, label: "Circle" },
    { href: "/dashboard/profile", icon: Settings, label: "Profile" }, // Link Baru
  ]

  return (
    <>
      {/* Backdrop untuk Mobile */}
      <div 
        className={cn(
            "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-0 left-0 h-screen w-64 bg-[#F9F8F4] border-r border-border z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl text-primary font-bold tracking-tight">LifeLedger.</h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mt-1">Est. 2026</p>
          </div>
          {/* Tombol Close di Mobile */}
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-primary">
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={onClose} // Tutup menu saat link diklik (mobile)
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-sm transition-all group",
                  isActive 
                    ? "bg-primary text-[#F9F8F4] shadow-md" 
                    : "text-muted-foreground hover:bg-white hover:text-primary hover:shadow-sm"
                )}
              >
                <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("font-serif text-sm tracking-wide", isActive ? "font-medium" : "")}>
                    {link.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-8">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors text-sm font-serif"
            >
                <LogOut size={16} /> Sign Out
            </button>
        </div>
      </aside>
    </>
  )
}