"use client"
import { useAnalytics } from "../hooks/useAnalytics"

export function WeeklyAnalytics({ circleId }: { circleId?: string | null }) {
  const { weeklyData } = useAnalytics(circleId)
  const maxCount = Math.max(...(weeklyData?.map(d => d.count) || [0]), 3)

  return (
    <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E5E0D6] shadow-sm h-fit">
      <div className="flex justify-between items-end mb-6">
      <h3 className="font-serif text-lg italic text-primary">Weekly Momentum</h3>
         <span className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-wider">Last 7 Days</span>
      </div>
      
      <div className="flex items-end justify-between h-24 gap-2 px-1">
        {weeklyData?.map((item, i) => {
          const heightPercent = Math.min((item.count / maxCount) * 100, 100)
          const isToday = i === weeklyData.length - 1
          return (
            <div key={item.day} className="flex flex-col items-center gap-2 w-full group">
               <div className="w-full relative h-24 flex items-end bg-[#F2F0E9] rounded-[2px] overflow-hidden">
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className={`w-full transition-all duration-1000 ${isToday ? 'bg-[#2C2C2C]' : 'bg-[#D1CDC7] group-hover:bg-[#8A8A8A]'}`}
                  ></div>
               </div>
               <span className={`text-[9px] font-mono tracking-wider ${isToday ? 'text-[#1A1A1A] font-bold' : 'text-[#A1A1A1]'}`}>{item.day}</span>
            </div>
          )
        })}
        {!weeklyData && <div className="text-xs text-[#8A8A8A] w-full text-center font-serif italic">Loading...</div>}
      </div>
    </div>
  )
}