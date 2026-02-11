export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      {/* Background Texture (Sama seperti dashboard) */}
      <div className="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")` }}>
      </div>
      
      {/* Konten (Kartu Login) */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}