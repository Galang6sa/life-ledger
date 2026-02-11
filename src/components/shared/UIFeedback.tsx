"use client"

import { Check, AlertCircle, Loader2 } from "lucide-react"
import { useEffect } from "react"

// 1. TOAST NOTIFICATION
export function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'loading', onClose: () => void }) {
  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [type, onClose])

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded shadow-2xl border ${
        type === 'success' ? 'bg-[#F9F8F4] border-green-500 text-green-800' :
        type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        'bg-white border-primary text-primary'
      }`}>
        {type === 'success' && <Check size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        {type === 'loading' && <Loader2 size={18} className="animate-spin" />}
        <span className="font-serif font-medium text-sm">{message}</span>
      </div>
    </div>
  )
}

// 2. CONFIRMATION MODAL
export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white p-6 rounded-sm shadow-2xl max-w-sm w-full border border-gray-200 scale-100 animate-in zoom-in-95">
        <h3 className="font-serif text-lg font-bold mb-2 text-red-600">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 rounded shadow-md">Yes, Delete</button>
        </div>
      </div>
    </div>
  )
}