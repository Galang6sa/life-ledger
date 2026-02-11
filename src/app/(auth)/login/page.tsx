"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage("Registration successful! Please check your email to verify.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push("/dashboard") // Redirect ke jurnal
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F9F8F4] p-8 md:p-12 rounded-sm shadow-2xl border border-white relative overflow-hidden">
      
      {/* Hiasan: Garis Merah Vertikal (Khas Kertas) */}
      <div className="absolute top-0 left-8 bottom-0 w-[1px] bg-red-200"></div>
      
      {/* Header: Brand */}
      <div className="pl-8 mb-10 relative z-10">
        <h1 className="font-serif text-3xl font-bold text-primary italic">LifeLedger.</h1>
        <p className="font-mono text-xs text-muted-foreground tracking-widest mt-1 uppercase">Identification Card</p>
      </div>

      {/* Toggle: Sign In / Sign Up */}
      <div className="pl-8 flex gap-6 mb-8 border-b border-dashed border-border pb-4">
        <button
            onClick={() => { setMode('signin'); setError(null); setMessage(null); }}
            className={cn(
                "font-serif text-lg transition-all duration-300 decoration-2 underline-offset-8",
                mode === 'signin' 
                    ? "text-primary font-bold underline decoration-primary" 
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            Access Journal
        </button>
        <button
            onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
            className={cn(
                "font-serif text-lg transition-all duration-300 decoration-2 underline-offset-8",
                mode === 'signup' 
                    ? "text-primary font-bold underline decoration-primary" 
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            New Member
        </button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="pl-8 mb-6 text-xs text-red-600 font-mono bg-red-50 p-2 border border-red-100 rounded">
          ⚠ {error}
        </div>
      )}
      {message && (
        <div className="pl-8 mb-6 text-xs text-green-600 font-mono bg-green-50 p-2 border border-green-100 rounded">
          ✓ {message}
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleAuth} className="pl-8 space-y-6 relative z-10">
        
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Identity (Email)</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-border focus:border-primary py-2 font-serif text-lg text-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/30"
            placeholder="user@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Secret Key (Password)</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-border focus:border-primary py-2 font-serif text-lg text-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/30"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="group w-full bg-primary text-[#F9F8F4] py-3 rounded-sm shadow-md hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <Loader2 size={18} className="animate-spin"/>
            ) : (
                <>
                  {mode === 'signin' ? 'Open Journal' : 'Create Identity'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </>
            )}
          </button>
        </div>
      </form>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-4 right-6 opacity-10">
        <div className="w-16 h-16 border-4 border-primary rounded-full flex items-center justify-center rotate-[-15deg]">
            <span className="font-mono text-[8px] font-bold text-primary uppercase">Official</span>
        </div>
      </div>

    </div>
  )
}