import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

// Definisi Tipe Data
type Circle = {
  id: string
  name: string
  code: string
}

// Definisi Tipe Respons Database (Untuk menghindari 'any')
type CircleMemberResponse = {
  circles: Circle | null
}

export function useCircles() {
  const queryClient = useQueryClient()

  // 1. Cek User tergabung di Circle mana
  const { data: myCircles, isLoading } = useQuery({
    queryKey: ['myCircles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('circle_members')
        .select('circles(id, name, code)') // Ambil relasi circles
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // PERBAIKAN TypeScript & Null Check:
      // Kita casting data ke tipe yang benar, lalu filter data kosong
      const safeData = data as unknown as CircleMemberResponse[]

      return safeData
        .map((item) => item.circles)             // Ambil object circles
        .filter((circle): circle is Circle => circle !== null) // Buang yang null
    }
  })

  // 2. Buat Circle Baru
  const { mutate: createCircle } = useMutation({
    mutationFn: async ({ name, code }: { name: string, code: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Login required")

      // A. Bikin Grup
      const { data: circle, error: errCircle } = await supabase
        .from('circles')
        .insert([{ name, code, created_by: user.id }])
        .select()
        .single()
      
      if (errCircle) throw errCircle

      // B. Masukkan Pembuat sebagai Anggota
      const { error: errMember } = await supabase
        .from('circle_members')
        .insert([{ circle_id: circle.id, user_id: user.id }])
      
      if (errMember) throw errMember
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCircles'] })
    }
  })

  // 3. Join Circle via Kode
  const { mutate: joinCircle } = useMutation({
    mutationFn: async (code: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Login required")

      // A. Cari Grup
      const { data: circle, error: errSearch } = await supabase
        .from('circles')
        .select('id')
        .eq('code', code)
        .single()
      
      if (errSearch || !circle) throw new Error("Circle not found!")

      // B. Join
      const { error: errJoin } = await supabase
        .from('circle_members')
        .insert([{ circle_id: circle.id, user_id: user.id }])

      if (errJoin) throw errJoin
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCircles'] })
    }
  })

  return { myCircles, isLoading, createCircle, joinCircle }
}