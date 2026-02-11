"use client"
import { useState } from "react"
import { Calendar, Trash2, Plus } from "lucide-react"
import { useQuests } from "../hooks/useQuests"
import { format } from "date-fns"
import { Toast, ConfirmModal } from "@/components/shared/UIFeedback"

export function UpcomingTimeline({ circleId }: { circleId?: string | null }) {
  const { upcomingEvents, addQuest, deleteQuest, isLoading } = useQuests(circleId)
  const [isAdding, setIsAdding] = useState(false)
  const [newEvent, setNewEvent] = useState("")
  const [newDate, setNewDate] = useState("") 
  const [toast, setToast] = useState<any>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const handleAdd = () => {
    if (!newEvent.trim() || !newDate) return
    addQuest({ title: newEvent, dueDate: new Date(newDate).toISOString() }, {
        onSuccess: () => { setToast({ msg: "Plan saved", type: 'success' }); setNewEvent(""); setIsAdding(false) }
    })
  }
  const handleDelete = () => {
      if(!confirmId) return
      deleteQuest(confirmId, { onSuccess: () => { setToast({msg: "Plan removed", type:'success'}); setConfirmId(null) } })
  }

  return (
    <>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <ConfirmModal isOpen={!!confirmId} title="Cancel Plan?" message="Item will be removed." onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />

        <div className="p-6 border border-border rounded-sm bg-white relative min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg flex items-center gap-2"><Calendar size={16} className="text-primary"/> Forward Plan</h3>
                <button onClick={() => setIsAdding(!isAdding)} className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">{isAdding ? "Cancel" : "+ New Plan"}</button>
            </div>

            {isAdding && (
                <div className="mb-6 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-sm animate-in slide-in-from-top-2">
                    <input autoFocus type="text" value={newEvent} onChange={(e) => setNewEvent(e.target.value)} placeholder="Event name..." className="w-full bg-transparent border-b border-gray-300 focus:border-primary text-sm p-1 mb-3 outline-none"/>
                    <div className="flex gap-2 items-center">
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="text-xs p-1 border rounded bg-white"/>
                        <button onClick={handleAdd} className="text-xs bg-primary text-white px-3 py-1.5 rounded ml-auto flex items-center gap-1"><Plus size={12}/> Save</button>
                    </div>
                </div>
            )}

            <div className="space-y-6 border-l border-border ml-2 pl-6 relative">
                {upcomingEvents.map((event) => (
                    <div key={event.id} className="relative group">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-white border-2 border-primary rounded-full z-10"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-mono text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wide">{format(new Date(event.due_date!), "EEE, MMM d, yyyy")}</div>
                                <div className="font-medium text-foreground text-sm font-serif">{event.title}</div>
                            </div>
                            <button onClick={() => setConfirmId(event.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"><Trash2 size={12}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}