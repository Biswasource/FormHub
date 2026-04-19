"use client"
import { RiArrowLeftLine, RiLoader4Line } from "@remixicon/react"

export default function Loading() {
  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto p-4 md:p-8 text-black dark:text-white transition-colors relative">
      {/* Top Header Progressive Loading Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gray-100 dark:bg-[#1e1e21] overflow-hidden z-50">
        <div className="h-full bg-[#ccff00] animate-[shimmer_1.5s_infinite] w-[40%]" 
             style={{ 
               boxShadow: '0 0 10px #ccff00',
               animation: 'loading-bar 2s infinite ease-in-out' 
             }} 
        />
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(150%); }
        }
      `}</style>

      {/* Back link skeleton */}
      <div className="flex items-center gap-2 text-gray-300 dark:text-[#27272a] mb-8 w-fit animate-pulse">
        <RiArrowLeftLine className="w-[16px] h-[16px]" /> 
        <div className="h-4 w-24 bg-gray-200 dark:bg-[#18181b] rounded" />
      </div>
       
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="space-y-3 animate-pulse">
           <div className="h-8 w-64 bg-gray-200 dark:bg-[#18181b] rounded-lg" />
           <div className="h-4 w-80 bg-gray-100 dark:bg-[#111113] rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-[#18181b] rounded-lg animate-pulse" />
      </div>
      
      {/* Table Skeleton */}
      <div className="rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] overflow-hidden shadow-sm dark:shadow-none animate-pulse">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#111113]">
                 <th className="p-4"><div className="h-4 w-32 bg-gray-300 dark:bg-[#1e1e21] rounded" /></th>
                 <th className="p-4"><div className="h-4 w-32 bg-gray-300 dark:bg-[#1e1e21] rounded" /></th>
                 <th className="p-4"><div className="h-4 w-32 bg-gray-300 dark:bg-[#1e1e21] rounded" /></th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-[#1e1e21]">
               {[...Array(6)].map((_, i) => (
                  <tr key={i}>
                     <td className="p-4"><div className="h-4 w-40 bg-gray-100 dark:bg-[#111113] rounded" /></td>
                     <td className="p-4"><div className="h-4 w-48 bg-gray-100 dark:bg-[#111113] rounded" /></td>
                     <td className="p-4"><div className="h-4 w-36 bg-gray-100 dark:bg-[#111113] rounded" /></td>
                  </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center py-12">
          <RiLoader4Line className="w-8 h-8 text-[#ccff00] animate-spin opacity-50" />
      </div>
    </div>
  )
}
