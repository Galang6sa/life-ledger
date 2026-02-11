"use client"

import { Heart, Star, Coins } from "lucide-react"

export function GamificationHeader() {
  // Nanti data ini diambil dari Supabase/Zustand
  // Sekarang kita hardcode dulu untuk visualisasi
  const stats = {
    hp: 80,
    maxHp: 100,
    xp: 450,
    maxXp: 1000,
    level: 5,
    gold: 1250
  }

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Kiri: Sapaan / Context */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Good Morning, Hero!</h2>
        <p className="text-sm text-slate-500">Ready to conquer today?</p>
      </div>

      {/* Kanan: Stats HUD */}
      <div className="flex items-center gap-6">
        
        {/* HP Bar */}
        <div className="flex flex-col w-32">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span className="flex items-center gap-1"><Heart size={12} className="text-red-500 fill-red-500"/> HP</span>
            <span>{stats.hp}/{stats.maxHp}</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full transition-all duration-500" 
              style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div className="flex flex-col w-32">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500"/> Lvl {stats.level}</span>
            <span>{stats.xp}/{stats.maxXp} XP</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${(stats.xp / stats.maxXp) * 100}%` }}
            />
          </div>
        </div>

        {/* Gold Badge */}
        <div className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full font-bold flex items-center gap-2 border border-yellow-200 shadow-sm">
          <Coins size={16} className="fill-yellow-500 text-yellow-600" />
          <span>{stats.gold}</span>
        </div>

        {/* Avatar Circle (Placeholder) */}
        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
            {/* Nanti diganti Image user */}
            <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold">U</div>
        </div>

      </div>
    </header>
  )
}