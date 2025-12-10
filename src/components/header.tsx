import Link from "next/link"
import { cn } from "@/lib/utils"

export const Header = ()=>{
    return <header className="">
        <nav className="border-b flex items-center gap-6 px-4 h-10 text-sm font-medium">
            <Link href="/summarize" className="text-slate-900 hover:text-blue-700 transition-colors">
                New Summary
            </Link>
            <Link href="/history" className="text-slate-900 hover:text-blue-700 transition-colors">
                History
            </Link>
        </nav>
    </header>
}