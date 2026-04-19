"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiDashboardLine, RiCodeBoxLine, RiSettings4Line, RiLogoutBoxRLine, RiMenuLine, RiCloseLine } from "@remixicon/react"
import ThemeToggle from "./ThemeToggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: RiDashboardLine },
    { name: "Developer", href: "/dashboard/developer", icon: RiCodeBoxLine },
    { name: "Settings", href: "/dashboard/settings", icon: RiSettings4Line },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f4f4f5] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between h-[60px] px-4 border-b border-gray-200 dark:border-[#1e1e21] bg-white dark:bg-[#050505] sticky top-0 z-30 transition-colors">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-[24px] h-[24px] bg-transparent rounded-full flex items-center justify-center shrink-0">
             <img src="/logo.png" alt="FormHubs Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-[16px] tracking-tight">FormHubs</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white transition-colors">
          <RiMenuLine className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[260px] flex-shrink-0 border-r border-gray-200 dark:border-[#1e1e21] flex flex-col bg-white dark:bg-[#050505] fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-gray-200 dark:border-[#1e1e21]/60">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-[28px] h-[28px] bg-transparent rounded-full flex items-center justify-center shrink-0">
               <img src="/logo.png" alt="FormHubs Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-[17px] tracking-tight">FormHubs</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white">
             <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 dark:text-[#6a6a70] uppercase tracking-wider mb-3 px-3">Menu</div>
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14.5px] font-medium transition-colors ${
                  isActive 
                    ? "bg-gray-100 dark:bg-[#18181b] text-black dark:text-white" 
                    : "text-gray-500 dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-[#18181b]/50 hover:text-black dark:hover:text-white"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {link.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#1e1e21]/60 flex flex-col gap-1">
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14.5px] font-medium text-gray-500 dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-[#18181b] hover:text-black dark:hover:text-white transition-colors w-full text-left"
          >
            <RiLogoutBoxRLine className="w-[18px] h-[18px]" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[260px] min-h-[calc(100vh-60px)] md:min-h-screen bg-[#f4f4f5] dark:bg-[#0a0a0a] w-full overflow-x-hidden transition-colors">
        {children}
      </main>
    </div>
  )
}
