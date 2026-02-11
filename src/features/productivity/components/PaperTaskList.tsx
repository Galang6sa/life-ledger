"use client"

import { useState } from "react"
import { Plus, Loader2, Trash2, Check, X } from "lucide-react"
import { useQuests } from "../hooks/useQuests"
import { Toast, ConfirmModal } from "@/components/shared/UIFeedback"

export function PaperTaskList({ circleId }: { circleId?: string | null }) {
  const { dailyQuests: quests, isLoading, addQuest, toggleQuest, deleteQuest, updateQuest } = useQuests(circleId)
  
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  
  const [inputValue, setInputValue] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleAdd = () => {
    if(!inputValue.trim()) return
    addQuest({ title: inputValue }, {
        onSuccess: () => { setToast({ msg: "Task added", type: 'success' }); setInputValue("") }
    })
  }

  const handleUpdate = (id: string) => {
    if(!editValue.trim()) return
    updateQuest({ id, title: editValue }, {
        onSuccess: () => { setEditingId(null); setToast({ msg: "Task updated", type: 'success' }) }
    })
  }

  const handleDelete = () => {
    if(!confirmDeleteId) return
    deleteQuest(confirmDeleteId, {
        onSuccess: () => { setToast({ msg: "Task deleted", type: 'success' }); setConfirmDeleteId(null) }
    })
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal isOpen={!!confirmDeleteId} title="Remove Task?" message="Action cannot be undone." onCancel={() => setConfirmDeleteId(null)} onConfirm={handleDelete} />

      {/* KERTAS JURNAL UTAMA */}
      <div className="bg-[#FDFBF7] p-8 md:p-10 rounded-sm border border-[#E5E0D6] shadow-sm relative min-h-[600px] flex flex-col">
        
        {/* Hiasan: Garis Margin Merah Tipis Khas Buku Tulis */}
        <div className="absolute top-0 left-10 bottom-0 w-[1px] bg-[#E5E0D6] md:bg-[#FCA5A5]/40"></div>

        <div className="flex justify-between items-baseline mb-10 pl-8 md:pl-10 relative z-10">
          <h2 className="text-4xl text-[#1A1A1A] font-serif tracking-tight">Daily Tasks</h2>
          <span className="font-mono text-[10px] text-[#8A8A8A] uppercase tracking-[0.2em]">
            {quests?.filter(q => q.status === 'active').length || 0} Remaining
          </span>
        </div>

        <div className="space-y-6 pl-8 md:pl-10 relative z-10 flex-1">
          {isLoading && <Loader2 className="animate-spin text-[#8A8A8A]" size={16}/>}
          {!isLoading && quests?.length === 0 && (
            <p className="text-[#D1CDC7] font-serif italic text-lg opacity-60">The page is blank. Start writing...</p>
          )}

          {quests?.map((quest) => (
            <div key={quest.id} className="group relative flex items-start gap-4 min-h-[32px] hover:bg-[#F5F2EB]/50 -mx-3 px-3 py-2 rounded transition-colors">
              
              {/* CHECKBOX CUSTOM STOIC STYLE */}
              <button 
                  onClick={() => toggleQuest({ id: quest.id, status: quest.status })}
                  className={`mt-1.5 shrink-0 w-5 h-5 border rounded-[2px] flex items-center justify-center transition-all duration-300 ${quest.status === 'completed' ? 'bg-[#2C2C2C] border-[#2C2C2C]' : 'border-[#1A1A1A] bg-transparent hover:border-[#5C5C5C]'}`}
              >
                {quest.status === 'completed' && <Check size={12} className="text-[#FDFBF7]" strokeWidth={3}/>}
              </button>
              
              {/* MODE EDIT */}
              {editingId === quest.id ? (
                  <div className="flex-1 flex items-center gap-2 animate-in fade-in">
                      <input 
                        autoFocus 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)} 
                        className="w-full bg-white border-b border-[#1A1A1A] px-2 py-1 font-serif text-xl text-[#1A1A1A] outline-none" 
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(quest.id)}
                      />
                      <button onClick={() => handleUpdate(quest.id)} className="p-1 text-[#2C2C2C] hover:bg-[#E5E0D6] rounded"><Check size={16}/></button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-[#8A8A8A] hover:text-[#EF4444] hover:bg-[#E5E0D6] rounded"><X size={16}/></button>
                  </div>
              ) : (
                  /* MODE BACA */
                  <div className="flex-1 flex justify-between items-start w-full group/item">
                      <span 
                        onDoubleClick={() => { setEditingId(quest.id); setEditValue(quest.title) }} 
                        title="Double click to edit" 
                        className={`text-xl font-serif leading-tight cursor-text select-none transition-all duration-300 ${quest.status === 'completed' ? 'line-through text-[#D1CDC7]' : 'text-[#2C2C2C]'}`}
                      >
                          {quest.title}
                      </span>
                      
                      {/* DELETE BUTTON (Slide in) */}
                      <button 
                        onClick={() => setConfirmDeleteId(quest.id)} 
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 text-[#D1CDC7] hover:text-[#EF4444]" 
                        title="Delete"
                      >
                        <Trash2 size={16}/>
                      </button>
                  </div>
              )}
            </div>
          ))}

          {/* INPUT BARU */}
          <div className="flex items-center gap-4 mt-12 pt-6 border-t border-dashed border-[#E5E0D6]">
              <Plus size={24} className="text-[#D1CDC7] shrink-0"/>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
                placeholder="Write a new task..." 
                className="w-full bg-transparent border-none text-xl font-serif text-[#1A1A1A] placeholder:text-[#D1CDC7] placeholder:italic focus:ring-0 p-0 focus:outline-none"
              />
          </div>
        </div>
      </div>
    </>
  )
}