import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
      <h1 className="text-4xl font-bold">LifeLedger</h1>
      <p className="text-slate-400">Your gamified productivity journey starts here.</p>
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 font-bold transition"
      >
        Enter Dashboard
      </Link>
    </div>
  );
}