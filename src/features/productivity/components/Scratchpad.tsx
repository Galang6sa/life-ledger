"use client"
import { useState, useEffect } from "react"

export function Scratchpad() {
  const [note, setNote] = useState("")
  const [status, setStatus] = useState("Saved")

  useEffect(() => {
    const saved = localStorage.getItem('lifeledger_scratchpad')
    if (saved) setNote(saved)
  }, [])

  useEffect(() => {
    setStatus("Saving...")
    const timer = setTimeout(() => {
        localStorage.setItem('lifeledger_scratchpad', note)
        setStatus("Saved")
    }, 1000)
    return () => clearTimeout(timer)
  }, [note])

  return (
    <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E5E0D6] shadow-sm relative h-full min-h-[200px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-lg text-[#1A1A1A]">Scratchpad</h3>
        <span className="text-[9px] text-[#8A8A8A] font-mono uppercase tracking-wider">{status}</span>
      </div>

      <textarea
        className="w-full flex-1 bg-transparent border-none resize-none outline-none font-serif text-[#4A4A4A] text-sm leading-relaxed placeholder:text-[#D1CDC7] placeholder:italic custom-scrollbar"
        placeholder="Type a quick thought..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        spellCheck={false}
      />
      
      <div className="mt-4 pt-3 border-t border-[#F2F0E9]">
         <p className="text-[10px] text-[#A1A1A1] font-serif italic">"Design is intelligence made visible."</p>
      </div>
    </div>
  )
}