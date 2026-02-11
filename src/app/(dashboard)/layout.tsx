"use client"
import { useState } from "react"
import { Sidebar } from "@/components/shared/Sidebar"
import { Menu } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      
      {/* Sidebar (Responsive) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 relative transition-all duration-300">
         {/* Tombol Hamburger (Hanya Mobile) */}
         <div className="md:hidden p-4 sticky top-0 z-30 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border">
            <span className="font-serif text-lg font-bold text-primary">LifeLedger.</span>
            <button onClick={() => setIsSidebarOpen(true)} className="text-primary p-2 hover:bg-gray-100 rounded">
                <Menu size={24} />
            </button>
         </div>

         {/* Konten */}
         <div className="relative z-10">
            {children}
         </div>
      </main>
    </div>
  )
}