import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

type Quest = {
  id: string
  title: string
  status: 'active' | 'completed'
  due_date: string | null
  created_at: string
  circle_id: string | null
}

export function useQuests(circleId?: string | null) {
  const queryClient = useQueryClient()
  const queryKey = ['quests', circleId || 'personal']

  // 1. Ambil Data
  const { data: allQuests, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase.from('quests').select('*').order('created_at', { ascending: false })
      
      if (circleId) {
        query = query.eq('circle_id', circleId)
      } else {
        query = query.is('circle_id', null)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data as Quest[]
    }
  })

  // Filter Frontend
  const dailyQuests = allQuests?.filter(q => !q.due_date) || []
  const upcomingEvents = allQuests?.filter(q => q.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()) || []

  // 2. Add Quest
  const { mutate: addQuest } = useMutation({
    mutationFn: async ({ title, dueDate }: { title: string, dueDate?: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Login required")

      const { error } = await supabase.from('quests').insert([{ 
            title, 
            status: 'active',
            due_date: dueDate || null, 
            user_id: user.id,
            circle_id: circleId || null 
        }])
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  // 3. Toggle Status
  const { mutate: toggleQuest } = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'active' | 'completed' }) => {
      const newStatus = status === 'active' ? 'completed' : 'active'
      const { error } = await supabase.from('quests').update({ status: newStatus }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  // 4. Update Title (BARU)
  const { mutate: updateQuest } = useMutation({
    mutationFn: async ({ id, title }: { id: string, title: string }) => {
      const { error } = await supabase.from('quests').update({ title }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  // 5. Delete Quest
  const { mutate: deleteQuest } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quests').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  return { dailyQuests, upcomingEvents, isLoading, addQuest, toggleQuest, updateQuest, deleteQuest }
}