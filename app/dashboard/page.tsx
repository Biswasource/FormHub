import { RiAddLine, RiSearchLine, RiFileList2Line, RiMore2Fill, RiBarChartBoxLine, RiEyeLine, RiShieldKeyholeLine } from "@remixicon/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import { Form } from "@/lib/models/Form"
import { User } from "@/lib/models/User"
import AccountSetupModal from "./AccountSetupModal"

// Prevent static caching for real-time dashboard stats
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

  if (!sessionUserId) {
     redirect('/login');
  }

  await connectToDatabase();
  
  // Fetch forms strictly isolated tracking the currently logged-in user securely
  const rawForms = await Form.find({ userId: sessionUserId }).sort({ createdAt: -1 });
  const forms = JSON.parse(JSON.stringify(rawForms));

  // Compute live aggregates safely tracking the user's workspace
  const totalForms = forms.length;
  const totalResponses = forms.reduce((acc: number, cur: any) => acc + (cur.submissionsCount || 0), 0);
  const totalViews = forms.reduce((acc: number, cur: any) => acc + (cur.views || 0), 0);

  // Authenticate user bounds mapping structurally
  const rawUser = await User.findById(sessionUserId);
  const isSetupRequired = rawUser ? !rawUser.isSetupComplete : false;

  return (
    <>
    <AccountSetupModal required={isSetupRequired} />
    
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto text-black dark:text-white transition-colors">
      {/* Top Header */}
      <header className="min-h-[72px] py-5 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 border-b border-gray-200 dark:border-[#1e1e21]/60 gap-4 sm:gap-0 transition-colors">
        <h1 className="text-[20px] font-semibold tracking-tight m-0">Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-64">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-gray-400 dark:text-[#71717A]" />
            <input 
              type="text" 
              placeholder="Search forms..." 
              className="w-full h-9 bg-white dark:bg-[#111113] border border-gray-200 dark:border-[#27272a] rounded-lg pl-9 pr-4 text-[13.5px] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#ccff00] transition-colors"
            />
          </div>
          <Link href="/builder" className="bg-[#ccff00] text-black hover:bg-[#bdeb02] h-9 rounded-lg font-medium text-[13.5px] px-4 flex items-center justify-center gap-1.5 shadow-none ring-0 border-0 shrink-0">
            <RiAddLine className="w-[18px] h-[18px]" />
            <span>Create New Form</span>
          </Link>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="px-4 sm:px-8 mt-6 sm:mt-8">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#111113] transition-colors rounded-xl flex flex-col justify-between shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 dark:text-[#a1a1aa] text-[13.5px] font-medium">Total Forms</span>
                    <RiFileList2Line className="text-gray-400 dark:text-[#a1a1aa] w-5 h-5" />
                </div>
                <div className="text-3xl font-bold">{totalForms}</div>
            </div>
            <div className="p-5 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#111113] transition-colors rounded-xl flex flex-col justify-between shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 dark:text-[#a1a1aa] text-[13.5px] font-medium">Total Responses</span>
                    <RiBarChartBoxLine className="text-gray-400 dark:text-[#a1a1aa] w-5 h-5" />
                </div>
                <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">{totalResponses.toLocaleString()}</div>
                    {totalResponses > 0 && <span className="text-xs font-semibold text-[#22c55e] mb-1">Active collection</span>}
                </div>
            </div>
            <div className="p-5 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#111113] transition-colors rounded-xl flex flex-col justify-between shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 dark:text-[#a1a1aa] text-[13.5px] font-medium">Form Views</span>
                    <RiEyeLine className="text-gray-400 dark:text-[#a1a1aa] w-5 h-5" />
                </div>
                <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            </div>
         </div>
      </div>

      {/* Forms List Header */}
      <div className="px-4 sm:px-8 mt-8 sm:mt-10">
        <h2 className="text-[16px] font-semibold mb-4">Recent Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
          {forms.map((form: any) => (
            <div key={form._id} className="border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#111113]/50 hover:bg-gray-50 dark:hover:bg-[#18181b] transition-colors rounded-xl p-5 flex flex-col group relative shadow-sm dark:shadow-none">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${form.isPublished ? 'bg-green-100 text-green-700 dark:bg-[#ccff00]/10 dark:text-[#ccff00]' : 'bg-gray-100 text-gray-500 dark:bg-[#27272a] dark:text-[#a1a1aa]'}`}>
                    {form.isPublished ? "Active" : "Draft"}
                  </div>
                  {form.isHeadless && (
                     <div className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                       Headless API
                     </div>
                  )}
                </div>
                {form.isHeadless ? (
                  <Link href="/dashboard/developer" className="text-gray-400 dark:text-[#71717A] hover:text-black dark:hover:text-[#ccff00] transition-colors" title="Manage API Endpoint">
                    <RiShieldKeyholeLine className="w-[18px] h-[18px]" />
                  </Link>
                ) : (
                  <Link href={`/f/${form._id}`} target="_blank" className="text-gray-400 dark:text-[#71717A] hover:text-black dark:hover:text-[#ccff00] transition-colors" title="View Public Form">
                    <RiEyeLine className="w-[18px] h-[18px]" />
                  </Link>
                )}
              </div>
              <h3 className="text-[15px] font-semibold mb-2 truncate pr-2" title={form.title}>{form.title}</h3>
              <p className="text-[13px] text-gray-500 dark:text-[#71717A] mb-8 truncate">{form.description || "No description provided."}</p>
              
              <div className="flex items-center justify-between mt-auto border-t border-gray-100 dark:border-[#27272a] pt-4">
                <div className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-[#a1a1aa]">
                   <RiFileList2Line className="w-[14px] h-[14px]" />
                   <span>{form.submissionsCount || 0} responses</span>
                </div>
                <div className="flex items-center gap-3 text-[13px] text-gray-600 dark:text-[#52525b] font-medium">
                   {form.views || 0} views
                   <Link href={`/dashboard/forms/${form._id}`} className="px-3 py-1.5 bg-[#ccff00]/20 dark:bg-[#ccff00]/10 text-green-800 dark:text-[#ccff00] hover:bg-[#ccff00]/30 dark:hover:bg-[#ccff00]/20 rounded-md text-[12.5px] font-bold transition-colors">
                      View Data
                   </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Block */}
          <Link href="/builder" className="border border-dashed border-gray-300 dark:border-[#3f3f46] bg-transparent hover:bg-gray-50 dark:hover:bg-[#111113] hover:border-black/50 dark:hover:border-[#ccff00]/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white h-[200px]">
            <div className="w-[42px] h-[42px] bg-gray-100 dark:bg-[#18181b] rounded-full flex items-center justify-center mb-3 text-black dark:text-[#ccff00]">
              <RiAddLine className="w-[20px] h-[20px]" />
            </div>
            <span className="text-[14.5px] font-medium">Create New Form</span>
            <span className="text-[12.5px] text-gray-400 dark:text-[#71717A] mt-1 text-center">Start from scratch using the Builder</span>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
