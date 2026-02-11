"use client"
import { useState } from "react"
import { ArrowDownToLine, ArrowUpFromLine, Trash2, Pencil } from "lucide-react"
import { useFinance } from "../hooks/useFinance"
import { TransactionSlip } from "./TransactionSlip"
import { Toast, ConfirmModal } from "@/components/shared/UIFeedback"

export function PaperLedger({ circleId }: { circleId?: string | null }) {
  const { transactions, balance, isLoading, deleteTransaction } = useFinance(circleId)
  
  const [toast, setToast] = useState<any>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editData, setEditData] = useState<any>(null) 
  const [defaultType, setDefaultType] = useState<'income' | 'expense'>('expense')

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  const openNew = (type: 'income' | 'expense') => {
    setModalMode('create'); setEditData(null); setDefaultType(type); setIsModalOpen(true)
  }
  const openEdit = (t: any) => {
    setModalMode('edit'); setEditData(t); setDefaultType(t.type); setIsModalOpen(true)
  }
  const handleDelete = () => {
    if(!confirmId) return
    deleteTransaction(confirmId, { onSuccess: () => { setToast({ msg: "Transaction deleted", type: 'success' }); setConfirmId(null) } })
  }

  return (
    <>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <ConfirmModal isOpen={!!confirmId} title="Void Transaction?" message="Balance will be recalculated." onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />

        <TransactionSlip isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultType={defaultType} circleId={circleId} mode={modalMode} initialData={editData} onSuccess={(msg) => setToast({ msg, type: 'success' })} />

        {/* CONTAINER UTAMA: Kertas Cream + Border Stone */}
        <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E5E0D6] shadow-sm relative h-full flex flex-col">
            
            {/* HEADER SALDO */}
            <div className="flex justify-between items-start mb-8 border-b border-[#F2F0E9] pb-4">
                <div>
                    <span className="font-mono text-[9px] text-[#8A8A8A] uppercase tracking-[0.2em]">Current Balance</span>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mt-2 tracking-tight">
                        {isLoading ? "..." : formatRupiah(balance || 0)}
                    </h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => openNew('income')} className="w-8 h-8 rounded-full border border-[#E5E0D6] text-[#2C2C2C] bg-white hover:bg-[#F2F0E9] flex items-center justify-center transition-colors shadow-sm">
                        <ArrowDownToLine size={14}/>
                    </button>
                    <button onClick={() => openNew('expense')} className="w-8 h-8 rounded-full border border-[#E5E0D6] text-[#2C2C2C] bg-white hover:bg-[#F2F0E9] flex items-center justify-center transition-colors shadow-sm">
                        <ArrowUpFromLine size={14}/>
                    </button>
                </div>
            </div>

            {/* LIST TRANSAKSI */}
            <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
                {!isLoading && transactions?.length === 0 && (
                    <div className="text-xs text-[#8A8A8A] italic text-center py-4">No transactions recorded.</div>
                )}

                {transactions?.map((t) => (
                    <div key={t.id} className="flex justify-between items-center group py-3 border-b border-transparent hover:border-[#F2F0E9] hover:bg-[#F5F2EB]/50 px-3 -mx-3 rounded-sm transition-all cursor-default">
                        
                        <div className="flex items-center gap-3 overflow-hidden">
                            {/* Icon Indikator Minimalis */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${t.type === 'income' ? 'border-[#D1CDC7] text-[#2C2C2C] bg-white' : 'border-[#D1CDC7] text-[#2C2C2C] bg-white'}`}>
                                {t.type === 'income' ? <ArrowDownToLine size={10}/> : <ArrowUpFromLine size={10}/>}
                            </div>
                            
                            <div className="overflow-hidden cursor-pointer" onClick={() => openEdit(t)}>
                                <div className="text-sm font-serif text-[#2C2C2C] truncate w-24 md:w-auto">{t.description}</div>
                                <div className="text-[10px] text-[#8A8A8A] font-mono tracking-wide">{t.category}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 shrink-0">
                            {/* Nominal dengan Font Mono */}
                            <span className={`font-mono text-xs tracking-tight ${t.type === 'income' ? 'text-[#1A1A1A]' : 'text-[#8A8A8A]'}`}>
                                {t.type === 'income' ? '+' : '-'} {formatRupiah(t.amount)}
                            </span>
                            
                            {/* Action Buttons (Hidden until hover) */}
                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                <button onClick={() => openEdit(t)} className="p-1 text-[#8A8A8A] hover:text-[#1A1A1A]"><Pencil size={12}/></button>
                                <button onClick={() => setConfirmId(t.id)} className="p-1 text-[#8A8A8A] hover:text-[#EF4444]"><Trash2 size={12}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-2 border-t border-[#F2F0E9] flex justify-between items-center">
                 <span className="text-[9px] text-[#8A8A8A] uppercase tracking-wider">Financial Log</span>
            </div>
        </div>
    </>
  )
}