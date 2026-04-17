import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { RiSettings4Line } from "@remixicon/react"
import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import SettingsClient from "./SettingsClient"

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

  if (!sessionUserId) {
     redirect('/login');
  }

  await connectToDatabase();
  const rawUser = await User.findById(sessionUserId);
  if (!rawUser) {
      redirect('/login');
  }
  
  const user = JSON.parse(JSON.stringify(rawUser));

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto text-black dark:text-white transition-colors overflow-y-auto">
      {/* Top Header */}
      <header className="min-h-[72px] py-5 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 border-b border-gray-200 dark:border-[#1e1e21]/60 gap-4 sm:gap-0 transition-colors shrink-0">
        <div>
          <div className="flex items-center gap-2">
             <RiSettings4Line className="w-5 h-5 text-black dark:text-[#ccff00]" />
             <h1 className="text-[20px] font-bold tracking-tight">Account Settings</h1>
          </div>
          <p className="text-[13px] text-gray-500 dark:text-[#a1a1aa] mt-0.5">Manage your personal profile and data forwarding bindings.</p>
        </div>
      </header>
      
      {/* Settings Form Canvas */}
      <div className="p-4 sm:p-8 flex-1">
         <div className="max-w-2xl mx-auto space-y-8">
            <SettingsClient user={user} />
         </div>
      </div>
    </div>
  )
}
