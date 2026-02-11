"use client"
import { useState, useEffect } from "react"
import { Check, Plus, X } from "lucide-react"

export function HabitTracker() {
  const [habits, setHabits] = useState<{id: number, name: string, done: boolean}[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newHabit, setNewHabit] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lifeledger_habits')
    if (saved) setHabits(JSON.parse(saved))
    else setHabits([{ id: 1, name: "Drink Water", done: false }])
    setLoaded(true)
  }, [])

  useEffect(() => { if (loaded) localStorage.setItem('lifeledger_habits', JSON.stringify(habits)) }, [habits, loaded])

  const toggleHabit = (id: number) => setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h))
  const addHabit = (e: React.FormEvent) => {
    e.preventDefault(); if (!newHabit.trim()) return
    setHabits([...habits, { id: Date.now(), name: newHabit, done: false }])
    setNewHabit(""); setIsAdding(false)
  }

  if (!loaded) return null

  return (
    <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E5E0D6] shadow-sm h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-lg text-[#1A1A1A]">Rituals</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"><Plus size={14} /></button>
      </div>

      {isAdding && (
        <form onSubmit={addHabit} className="mb-4">
           <input autoFocus className="w-full border-b border-[#2C2C2C] bg-transparent text-sm font-serif outline-none pb-1 placeholder:italic" placeholder="New ritual..." value={newHabit} onChange={(e) => setNewHabit(e.target.value)}/>
        </form>
      )}

      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="group flex items-center justify-between">
            <div onClick={() => toggleHabit(habit.id)} className="flex items-center gap-3 cursor-pointer select-none">
                {/* Custom Checkbox Style */}
                <div className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-all ${habit.done ? 'bg-[#2C2C2C] border-[#2C2C2C] text-[#FDFBF7]' : 'border-[#D1CDC7] bg-transparent'}`}>
                    {habit.done && <Check size={10} strokeWidth={3} />}
                </div>
                <span className={`text-sm font-serif ${habit.done ? 'line-through text-[#8A8A8A]' : 'text-[#2C2C2C]'}`}>{habit.name}</span>
            </div>
            <button onClick={() => setHabits(habits.filter(h => h.id !== habit.id))} className="opacity-0 group-hover:opacity-100 text-[#D1CDC7] hover:text-[#EF4444] transition-opacity"><X size={12}/></button>
          </div>
        ))}
      </div>
    </div>
  )
}