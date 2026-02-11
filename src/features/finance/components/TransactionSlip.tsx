"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { useFinance } from "../hooks/useFinance"
import { cn } from "@/lib/utils"
import { Toast } from "@/components/shared/UIFeedback" // Import Toast

type TransactionSlipProps = {
  isOpen: boolean
  onClose: () => void
  defaultType: 'income' | 'expense'
  circleId?: string | null
}

const CATEGORIES = ["General", "Food", "Transport", "Shopping", "Work", "Fun", "Health", "Bills"]
const SUGGESTIONS = [10000, 20000, 50000, 100000]

export function TransactionSlip({ isOpen, onClose, defaultType, circleId }: TransactionSlipProps) {
  const { addTransaction } = useFinance(circleId)
  
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("General")
  const [type, setType] = useState<'income' | 'expense'>(defaultType)
  
  // State untuk Toast Validasi
  const [showToast, setShowToast] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return

    addTransaction({
      amount: Number(amount),
      description,
      category,
      type
    }, {
        // Callback Sukses
        onSuccess: () => {
            setShowToast(true) // Munculkan notifikasi
            
            // Reset Form
            setAmount("")
            setDescription("")
            
            // Tutup modal setelah jeda sedikit (agar toast terlihat natural)
            setTimeout(() => {
                setShowToast(false)
                onClose()
            }, 1000)
        }
    })
  }

  return (
    <>
    {/* KOMPONEN MODAL VALIDASI (TOAST) */}
    {showToast && (
        <Toast 
            message="Transaction successfully recorded." 
            type="success" 
            onClose={() => setShowToast(false)} 
        />
    )}

    {/* TAMPILAN ASLI (TIDAK BERUBAH) */}
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#F9F8F4] w-full max-w-md p-8 rounded-sm shadow-2xl border border-white/50 relative animate-in zoom-in-95 duration-200">
        
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/50 rotate-1 shadow-sm backdrop-blur-sm"></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors">
          <X size={20} />
        </button>

        <div className="flex justify-center gap-8 mb-8 pt-2">
            <button 
                type="button" 
                onClick={() => setType('expense')}
                className={cn(
                    "text-sm font-serif uppercase tracking-widest pb-1 border-b-2 transition-all duration-300",
                    type === 'expense' 
                        ? "border-red-500 text-red-700 font-bold" 
                        : "border-transparent text-muted-foreground hover:text-foreground"
                )}
            >
                Expense
            </button>
            <button 
                type="button" 
                onClick={() => setType('income')}
                className={cn(
                    "text-sm font-serif uppercase tracking-widest pb-1 border-b-2 transition-all duration-300",
                    type === 'income' 
                        ? "border-green-500 text-green-700 font-bold" 
                        : "border-transparent text-muted-foreground hover:text-foreground"
                )}
            >
                Income
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <div className="relative">
                    <span className="absolute left-0 bottom-2 font-serif text-lg text-muted-foreground">Rp</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        autoFocus
                        className="w-full bg-transparent border-b-2 border-border focus:border-primary px-8 py-1 text-4xl font-serif text-foreground focus:outline-none placeholder:text-muted-foreground/30 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
                
                <div className="flex justify-end gap-2 flex-wrap">
                    {SUGGESTIONS.map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setAmount(val.toString())}
                            className="text-[10px] font-mono border border-border px-2 py-1 rounded-full text-muted-foreground hover:bg-white hover:text-foreground hover:border-primary transition-colors"
                        >
                            +{val / 1000}k
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this for?"
                    className="w-full bg-transparent border-b border-border focus:border-primary py-2 text-lg font-serif text-foreground focus:outline-none placeholder:text-muted-foreground/50 placeholder:italic"
                />
            </div>

            <div className="space-y-3">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Tag:</span>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={cn(
                                "px-3 py-1 text-xs border rounded-full transition-all duration-200",
                                category === cat 
                                    ? "border-foreground bg-foreground text-[#F9F8F4] font-medium shadow-sm"
                                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground bg-transparent"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                type="submit"
                className="w-full mt-4 bg-primary text-[#F9F8F4] py-3 rounded-sm shadow-md hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Check size={18} /> 
                Record Transaction
            </button>
        </form>
      </div>
    </div>
    </>
  )
}