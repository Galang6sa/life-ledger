"use client"

import { useState } from "react"
import { ChevronDown, User, Users } from "lucide-react"
import { PaperTaskList } from "@/features/productivity/components/PaperTaskList"
import { PaperLedger } from "@/features/finance/components/PaperLedger"
import { UpcomingTimeline } from "@/features/productivity/components/UpcomingTimeline"
import { WeeklyAnalytics } from "@/features/productivity/components/WeeklyAnalytics"
import { HabitTracker } from "@/features/productivity/components/HabitTracker"
import { Scratchpad } from "@/features/productivity/components/Scratchpad"
import { useCircles } from "@/features/circles/hooks/useCircles"

export default function DashboardPage() {
  const { myCircles } = useCircles()
  const [activeContext, setActiveContext] = useState<{id: string | null, name: string}>({
    id: null, 
    name: "Personal Journal"
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    // UBAH BACKGROUND JADI CREAM (#F5F2EB) BIAR KESAN KERTAS
    <div className="p-4 md:p-8 lg:p-12 min-h-screen max-w-[1600px] mx-auto bg-[#F5F2EB] text-[#2C2C2C]">
      
      {/* HEADER */}
      <div className="mb-10 relative z-50">
        <span className="font-mono text-[10px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-3 block pl-1">
            {activeContext.id ? "Shared Workspace" : "Private Sanctuary"}
        </span>
        
        <div className="relative inline-block">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="group flex items-center gap-4 text-4xl md:text-5xl font-serif text-[#1A1A1A] hover:opacity-70 transition-all duration-300"
            >
                {activeContext.name}
                <div className={`w-6 h-6 rounded-full border border-[#D1CDC7] flex items-center justify-center transition-transform duration-300 ${isMenuOpen ? 'rotate-180 bg-[#E5E0D6]' : 'bg-transparent'}`}>
                    <ChevronDown size={14} className="text-[#5C5C5C]"/>
                </div>
            </button>

            {isMenuOpen && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute top-full left-0 mt-4 w-72 bg-[#FDFBF7] border border-[#E5E0D6] shadow-xl rounded-sm z-50 animate-in fade-in slide-in-from-top-2">
                    <button 
                        onClick={() => { setActiveContext({ id: null, name: "Personal Journal" }); setIsMenuOpen(false) }}
                        className="w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-[#F5F2EB] transition-colors border-b border-[#E5E0D6]"
                    >
                        <User size={16} className="text-[#8A8A8A]"/>
                        <span className="font-serif text-sm text-[#2C2C2C]">Personal Journal</span>
                    </button>

                    {myCircles?.map(circle => (
                        <button 
                            key={circle.id}
                            onClick={() => { setActiveContext({ id: circle.id, name: circle.name }); setIsMenuOpen(false) }}
                            className="w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-[#F5F2EB] transition-colors border-b border-[#E5E0D6] last:border-0"
                        >
                            <Users size={16} className="text-[#8A8A8A]"/>
                            <span className="font-serif text-sm text-[#2C2C2C]">{circle.name}</span>
                        </button>
                    ))}
                </div>
                </>
            )}
        </div>
      </div>
      
      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* KIRI */}
          <div className="lg:col-span-3 flex flex-col gap-6">
             <WeeklyAnalytics circleId={activeContext.id} />
             <HabitTracker />
          </div>

          {/* TENGAH */}
          <div className="lg:col-span-6">
             <PaperTaskList key={`tasks-${activeContext.id}`} circleId={activeContext.id} />
          </div>

          {/* KANAN */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full">
              <PaperLedger key={`ledger-${activeContext.id}`} circleId={activeContext.id} />
              <UpcomingTimeline key={`plan-${activeContext.id}`} circleId={activeContext.id} />
              <div className="flex-1">
                <Scratchpad />
              </div>
          </div>
      </div>
    </div>
  )
}