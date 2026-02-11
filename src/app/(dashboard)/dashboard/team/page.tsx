"use client"

import { useState } from "react"
import { useCircles } from "@/features/circles/hooks/useCircles"
import { Users, Plus, LogIn, Copy, Check } from "lucide-react"

export default function TeamPage() {
  const { myCircles, isLoading, createCircle, joinCircle } = useCircles()
  const [view, setView] = useState<'menu' | 'create' | 'join'>('menu')
  const [circleName, setCircleName] = useState("")
  const [circleCode, setCircleCode] = useState("")
  const [copied, setCopied] = useState(false)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) return <div className="p-12 text-muted-foreground">Checking membership...</div>

  // STATE 1: SUDAH PUNYA GRUP (Tampilan Kartu Membership)
  if (myCircles && myCircles.length > 0) {
    const activeCircle = myCircles[0] 

    return (
        <div className="p-4 md:ml-64 md:p-12 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-xl bg-[#F9F8F4] p-8 md:p-12 rounded-sm shadow-xl border-2 border-primary/20 relative">
                
                {/* Hiasan Sudut */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

                <div className="text-center mb-8">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Official Membership</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-primary mt-4 mb-2">{activeCircle.name}</h1>
                    <div className="h-1 w-24 bg-primary/10 mx-auto rounded-full"></div>
                </div>

                <div className="bg-white p-6 rounded border border-dashed border-gray-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
                    
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">Secret Invite Code</p>
                    
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-3xl font-mono font-bold tracking-widest text-foreground select-all bg-gray-50 px-4 py-2 rounded">
                            {activeCircle.code}
                        </span>
                        
                        <button 
                            onClick={() => copyCode(activeCircle.code)} 
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            {copied ? <Check size={14}/> : <Copy size={14}/>} 
                            {copied ? "Copied to Clipboard" : "Copy Code"}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm font-serif italic text-muted-foreground">
                        Great things in business are never done by one person. Theyre done by a team of people.
                    </p>
                </div>
            </div>
        </div>
    )
  }

  // STATE 2: BELUM PUNYA GRUP (Responsive Layout)
  return (
    <div className="p-4 md:ml-64 md:p-12 min-h-screen flex flex-col justify-center items-center text-center max-w-3xl mx-auto">
        <div className="mb-8">
            <h1 className="text-4xl font-serif text-primary mb-2">Join a Circle</h1>
            <p className="text-muted-foreground">Collaborate on tasks and finances with your team or partner.</p>
        </div>

        {view === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
                <button 
                    onClick={() => setView('create')}
                    className="p-8 bg-white border border-border shadow-paper hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
                >
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Create New</h3>
                        <p className="text-xs text-muted-foreground mt-1">Start a new shared journal.</p>
                    </div>
                </button>

                <button 
                    onClick={() => setView('join')}
                    className="p-8 bg-white border border-border shadow-paper hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LogIn size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Join Existing</h3>
                        <p className="text-xs text-muted-foreground mt-1">Enter a code from a friend.</p>
                    </div>
                </button>
            </div>
        )}

        {/* Create / Join Forms (sama seperti sebelumnya, hanya styling container) */}
        {view === 'create' && (
            <div className="bg-white p-8 border border-border shadow-paper w-full max-w-md animate-in zoom-in-95">
                <h3 className="font-serif text-xl mb-6">Create a Circle</h3>
                {/* ... Form Inputs (sama seperti sebelumnya) ... */}
                <div className="space-y-4 text-left">
                    <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground">Circle Name</label>
                        <input type="text" placeholder="e.g. Project Alpha" className="w-full border-b border-border py-2 focus:outline-none focus:border-primary font-serif text-lg" value={circleName} onChange={(e) => setCircleName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground">Unique Code</label>
                        <input type="text" placeholder="e.g. ALPHA-2026" className="w-full border-b border-border py-2 focus:outline-none focus:border-primary font-mono text-lg uppercase" value={circleCode} onChange={(e) => setCircleCode(e.target.value.toUpperCase())} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => setView('menu')} className="flex-1 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                        <button onClick={() => createCircle({ name: circleName, code: circleCode })} className="flex-1 py-2 bg-primary text-white text-sm font-bold shadow-md hover:shadow-none">Create</button>
                    </div>
                </div>
            </div>
        )}

        {view === 'join' && (
             <div className="bg-white p-8 border border-border shadow-paper w-full max-w-md animate-in zoom-in-95">
                <h3 className="font-serif text-xl mb-6">Enter Access Code</h3>
                <div className="space-y-4 text-left">
                    <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground">Code</label>
                        <input type="text" placeholder="e.g. TIM-A" className="w-full border-b border-border py-2 focus:outline-none focus:border-primary font-mono text-lg uppercase text-center tracking-widest" value={circleCode} onChange={(e) => setCircleCode(e.target.value.toUpperCase())} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => setView('menu')} className="flex-1 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                        <button onClick={() => joinCircle(circleCode)} className="flex-1 py-2 bg-primary text-white text-sm font-bold shadow-md hover:shadow-none">Join</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}