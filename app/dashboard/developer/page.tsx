import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { RiCodeBoxLine, RiFlashlightLine, RiShieldKeyholeLine } from "@remixicon/react"
import { connectToDatabase } from "@/lib/mongodb"
import { Form } from "@/lib/models/Form"
import DeveloperClientDocs from "./DeveloperClientDocs"

export const dynamic = 'force-dynamic';

export default async function DeveloperApiPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

  if (!sessionUserId) {
     redirect('/login');
  }

  await connectToDatabase();
  const rawForms = await Form.find({ userId: sessionUserId, isHeadless: true }).sort({ createdAt: -1 });
  const headlessForms = JSON.parse(JSON.stringify(rawForms));

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto text-black dark:text-white transition-colors overflow-y-auto">
      {/* Top Header */}
      <header className="min-h-[72px] py-5 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 border-b border-gray-200 dark:border-[#1e1e21]/60 gap-4 sm:gap-0 transition-colors shrink-0">
        <div>
          <div className="flex items-center gap-2">
             <RiCodeBoxLine className="w-5 h-5 text-black dark:text-[#ccff00]" />
             <h1 className="text-[20px] font-bold tracking-tight">Developer API</h1>
          </div>
          <p className="text-[13px] text-gray-500 dark:text-[#a1a1aa] mt-0.5">Build custom frontends and effortlessly pipe data to your securely configured FORMHUBSemail.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1.5 rounded-md bg-green-100 dark:bg-[#ccff00]/10 text-green-700 dark:text-[#ccff00] text-[12.5px] font-bold border border-green-200 dark:border-[#ccff00]/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-[#ccff00] animate-pulse"></span>
              API Status: Operational
           </div>
        </div>
      </header>
      
      {/* Documentation Canvas */}
      <div className="p-4 sm:p-8 flex-1">
         <div className="max-w-4xl mx-auto space-y-8">
            
            {/* API Endpoint Section */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#111113] border border-gray-200 dark:border-[#27272a] flex items-center justify-center shrink-0">
                      <RiShieldKeyholeLine className="w-6 h-6 text-gray-500 dark:text-[#a1a1aa]" />
                   </div>
                   <div className="flex-1 w-full overflow-hidden">
                      <h2 className="text-[16px] font-bold mb-1">Your Capture Endpoints</h2>
                      <p className="text-[13.5px] text-gray-500 dark:text-[#71717a] mb-4">Create headless API endpoints below. Send any HTTP POST request directly to a secured URL, and we dynamically format the payload and dispatch it instantly to your account emails.</p>
                      
                      <DeveloperClientDocs forms={headlessForms} />
                   </div>
                </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] rounded-xl p-6 shadow-sm">
                    <RiFlashlightLine className="w-6 h-6 text-black dark:text-[#ccff00] mb-3" />
                    <h3 className="text-[15px] font-bold mb-2">Zero Configuration</h3>
                    <p className="text-[13.5px] text-gray-500 dark:text-[#71717a] leading-relaxed">
                        Say goodbye to configuring SMTP relays, battling Mailgun configs, or wiring up NextAuth. Just copy your endpoint url, hook it up to your React \`fetch\` pipeline, and you immediately have enterprise routing.
                    </p>
                </div>
                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] rounded-xl p-6 shadow-sm">
                    <RiCodeBoxLine className="w-6 h-6 text-black dark:text-[#ccff00] mb-3" />
                    <h3 className="text-[15px] font-bold mb-2">Agnostic Integration</h3>
                    <p className="text-[13.5px] text-gray-500 dark:text-[#71717a] leading-relaxed">
                        We natively map \`application/json\`, \`multipart/form-data\`, and \`application/x-www-form-urlencoded\`. Use raw Javascript, Python, Next.js, or plain HTML forms organically. Everything resolves dynamically.
                    </p>
                </div>
            </div>

         </div>
      </div>
    </div>
  )
}
