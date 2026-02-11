import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

type Transaction = {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  created_at: string
  circle_id: string | null
}

export function useFinance(circleId?: string | null) {
  const queryClient = useQueryClient()
  const queryKey = ['transactions', circleId || 'personal']
  const balanceKey = ['balance', circleId || 'personal']

  // 1. Get Data
  const { data: transactions, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5)
      if (circleId) query = query.eq('circle_id', circleId)
      else query = query.is('circle_id', null)
      
      const { data, error } = await query
      if (error) throw error
      return data as Transaction[]
    }
  })

  // 2. Get Balance
  const { data: balance } = useQuery({
    queryKey: balanceKey,
    queryFn: async () => {
      let query = supabase.from('transactions').select('amount, type')
      if (circleId) query = query.eq('circle_id', circleId)
      else query = query.is('circle_id', null)
      
      const { data, error } = await query
      if (error) throw error
      
      return data.reduce((acc, curr) => curr.type === 'income' ? acc + Number(curr.amount) : acc - Number(curr.amount), 0)
    }
  })

  // 3. Add
  const { mutate: addTransaction } = useMutation({
    mutationFn: async (newTx: Omit<Transaction, 'id' | 'created_at' | 'circle_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Login required")
      const { error } = await supabase.from('transactions').insert([{ ...newTx, user_id: user.id, circle_id: circleId || null }])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: balanceKey })
    }
  })

  // 4. Update (NEW)
  const { mutate: updateTransaction } = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Transaction> }) => {
      const { error } = await supabase.from('transactions').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: balanceKey })
    }
  })

  // 5. Delete
  const { mutate: deleteTransaction } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: balanceKey })
    }
  })

  return { transactions, balance, isLoading, addTransaction, deleteTransaction, updateTransaction }
}