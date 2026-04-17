import { connectToDatabase } from "@/lib/mongodb"
import { Form } from "@/lib/models/Form"
import { Submission } from "@/lib/models/Submission"
import Link from "next/link"
import { RiArrowLeftLine, RiExternalLinkLine } from "@remixicon/react"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import ExportCsvButton from "./ExportCsvButton"

export const dynamic = 'force-dynamic';

export default async function FormResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('FORMHUBS_session')?.value;

  if (!sessionUserId) {
     redirect('/login');
  }

  const resolvedParams = await params;
  await connectToDatabase();
  
  const rawForm = await Form.findById(resolvedParams.id);
  if (!rawForm || rawForm.userId !== sessionUserId) return notFound();
  
  const form = JSON.parse(JSON.stringify(rawForm));
  
  const rawSubmissions = await Submission.find({ formId: resolvedParams.id }).sort({ submittedAt: -1 });
  const submissions = JSON.parse(JSON.stringify(rawSubmissions));

  let dataFields: any[] = [];
  
  if (form.isHeadless || !form.fields || form.fields.length === 0) {
      // Scrape Headless arbitrary payload keys structurally
      const keySet = new Set<string>();
      submissions.forEach((sub: any) => {
          if(sub.answers) Object.keys(sub.answers).forEach(k => keySet.add(k));
      });
      dataFields = Array.from(keySet).map(key => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/[_]/g, ' '),
          type: 'text'
      }));
  } else {
      // Skip statement and banner types which have no data
      dataFields = form.fields.filter((f: any) => !['statement', 'banner'].includes(f.type));
  }

  // Compute arrays uniquely for Client Side Blob injection
  const csvHeaders = ["Submitted Date", ...dataFields.map((f: any) => f.label || f.type.toUpperCase())];
  const csvRows = submissions.map((sub: any) => {
     const row = [new Date(sub.submittedAt).toLocaleString()];
     dataFields.forEach((field: any) => {
        let val = sub.answers[field.id];
        if (val === true || val === 'checked') val = "Yes";
        if (val === false) val = "No";
        row.push(val !== undefined && val !== null ? String(val) : "");
     });
     return row;
  });

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto p-4 md:p-8 text-black dark:text-white transition-colors">
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white mb-8 text-[13.5px] font-medium w-fit transition-colors">
        <RiArrowLeftLine className="w-[16px] h-[16px]" /> Back to Dashboard
      </Link>
       
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
           <h1 className="text-[24px] font-bold tracking-tight mb-2 flex items-center gap-3">
              {form.title}
              <Link href={`/f/${form._id}`} target="_blank" className="text-gray-400 dark:text-[#a1a1aa] hover:text-black dark:hover:text-[#ccff00] transition-colors" title="View Public Form">
                  <RiExternalLinkLine className="w-[20px] h-[20px]" />
              </Link>
           </h1>
           <p className="text-[14px] text-gray-500 dark:text-[#71717a]">
             {form.isHeadless && <span className="font-bold text-black dark:text-[#ccff00] mr-2">HEADLESS API</span>}
             Analyzing {submissions.length} total responses across {dataFields.length} distinct fields.
           </p>
        </div>
        <div className="flex gap-3">
           <ExportCsvButton 
              filename={form.title} 
              headers={csvHeaders} 
              rows={csvRows} 
              disabled={submissions.length === 0} 
           />
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-gray-300 dark:border-[#27272a] bg-white dark:bg-[#111113]/50 text-gray-500 dark:text-[#71717a]">
            <p className="text-[14px] font-medium mb-1 text-black dark:text-white">No responses yet</p>
            <p className="text-[13px]">Share your public form link to start collecting data.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-[13.5px]">
               <thead>
                 <tr className="border-b border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#111113]">
                   <th className="p-4 font-semibold whitespace-nowrap min-w-[200px]">Submitted Date</th>
                   {dataFields.map((field: any) => (
                      <th key={field.id} className="p-4 font-semibold whitespace-nowrap min-w-[200px]">
                        {field.label || field.type.toUpperCase()}
                      </th>
                   ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-[#1e1e21]">
                 {submissions.map((sub: any) => (
                    <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-[#18181b]/50 transition-colors group">
                       <td className="p-4 text-gray-500 dark:text-[#a1a1aa] whitespace-nowrap">
                           {new Date(sub.submittedAt).toLocaleString(undefined, {
                             month: 'short', day: 'numeric', year: 'numeric',
                             hour: 'numeric', minute: '2-digit'
                           })}
                       </td>
                       {dataFields.map((field: any) => {
                          let val = sub.answers[field.id];
                          if (val === true || val === 'checked') val = "Yes";
                          if (val === false) val = "No";
                          
                          return (
                            <td key={field.id} className="p-4 whitespace-pre-wrap max-w-[300px] truncate group-hover:text-green-700 dark:group-hover:text-[#ccff00] transition-colors">
                               {val !== undefined && val !== null && val !== "" ? String(val) : <span className="text-gray-400 dark:text-[#52525b] italic">Empty</span>}
                            </td>
                          )
                       })}
                    </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
