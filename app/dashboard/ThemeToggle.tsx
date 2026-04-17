"use client"
import { useTheme } from "next-themes"
import { RiMoonLine, RiSunLine } from "@remixicon/react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    
    // Prevent hydration mismatch by blocking render until mount
    if (!mounted) return <div className="h-[42px] w-full" />

    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    return (
        <button 
           onClick={() => setTheme(isDark ? 'light' : 'dark')}
           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14.5px] font-medium text-gray-500 dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-[#18181b] hover:text-black dark:hover:text-white transition-colors w-full"
        >
           {isDark ? <RiSunLine className="w-[18px] h-[18px]" /> : <RiMoonLine className="w-[18px] h-[18px]" />}
           {isDark ? "Light Mode" : "Dark Mode"}
        </button>
    )
}
