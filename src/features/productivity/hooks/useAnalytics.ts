import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format, subDays } from "date-fns"

export function useAnalytics(circleId?: string | null) {
  const { data: weeklyData } = useQuery({
    queryKey: ['momentum', circleId || 'personal'],
    queryFn: async () => {
      const today = new Date()
      const last7Days = subDays(today, 6)
      
      let query = supabase
        .from('quests')
        .select('created_at, status')
        .gte('created_at', last7Days.toISOString()) 
      
      if (circleId) query = query.eq('circle_id', circleId)
      else query = query.is('circle_id', null)

      const { data, error } = await query
      if (error) throw error

      // Inisialisasi map 7 hari terakhir
      const daysMap = new Map<string, number>()
      for (let i = 0; i < 7; i++) {
        const d = subDays(today, 6 - i)
        daysMap.set(format(d, 'EEE'), 0)
      }

      // Hitung task completed
      data?.forEach((quest) => {
        if (quest.status === 'completed') {
            const dayName = format(new Date(quest.created_at), 'EEE')
            if (daysMap.has(dayName)) {
                daysMap.set(dayName, (daysMap.get(dayName) || 0) + 1)
            }
        }
      })

      return Array.from(daysMap.entries()).map(([day, count]) => ({ day, count }))
    }
  })

  return { weeklyData }
}