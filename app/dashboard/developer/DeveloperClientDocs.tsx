"use client"
import { useState, useEffect } from "react"
import { RiFileCopyLine, RiCheckLine, RiHtml5Line, RiReactjsLine, RiJavascriptLine, RiAddLine, RiFlashlightFill } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DocsProps {
    forms: any[];
}

export default function DeveloperClientDocs({ forms: initialForms }: DocsProps) {
    const [forms, setForms] = useState(initialForms);
    const [selectedFormId, setSelectedFormId] = useState<string>(forms.length > 0 ? forms[0]._id : "");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'html' | 'react' | 'js'>('react');
    
    // Create new Headless API Logic
    const [isCreating, setIsCreating] = useState(false);
    const [newApiName, setNewApiName] = useState("");

    const [origin, setOrigin] = useState("https://FORMHUBS.com");

    useEffect(() => {
        if (typeof window !== "undefined") {
           setOrigin(window.location.origin);
        }
    }, []);

    const handleCreateApi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newApiName.trim()) return;

        setIsCreating(true);
        try {
            const res = await fetch("/api/forms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newApiName,
                    isHeadless: true,
                    fields: [] // Empty fields naturally designates Headless bypass
                })
            });
            if (res.ok) {
                // Hard reload to sync Dashboard mappings safely
                window.location.reload();
            } else {
                alert("Failed to generate Endpoint API.");
                setIsCreating(false);
            }
        } catch (err) {
            console.error(err);
            setIsCreating(false);
        }
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const endpointUrl = selectedFormId ? `${origin}/api/v1/capture/${selectedFormId}` : `${origin}/api/v1/capture/[YOUR_ENDPOINT_ID]`;

    const codeSnippets = {
        html: `<form action="${endpointUrl}" method="POST">
  <!-- Fields represent your data map cleanly -->
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message"></textarea>

  <button type="submit">Send Message</button>
</form>`,
        react: `const submitForm = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData);

  const res = await fetch("${endpointUrl}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
  });
  
  if (res.ok) alert("Data successfully captured!");
};`,
        js: `fetch("${endpointUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
      source: "Landing Page",
      customerEmail: "user@example.com",
      pricingTier: "Pro"
  })
})
.then(res => res.json())
.then(data => console.log(data));`
    };

    return (
        <div className="w-full space-y-6">
            
            {/* API Endpoint Creation & Selection */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="flex-1 w-full space-y-2">
                    <Label className="text-[13px] text-gray-500 dark:text-[#a1a1aa] font-medium">Select Active Endpoint</Label>
                    <select 
                        value={selectedFormId} 
                        onChange={(e) => setSelectedFormId(e.target.value)}
                        disabled={forms.length === 0}
                        className="w-full h-11 px-3 rounded-md bg-white dark:bg-[#111113] border border-gray-200 dark:border-[#27272a] text-[14px] text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-[#ccff00] disabled:opacity-50"
                    >
                        {forms.length === 0 ? (
                            <option value="">No integrations created yet...</option>
                        ) : (
                            forms.map((f) => (
                                <option key={f._id} value={f._id}>{f.title} ({f.submissionsCount} submissions)</option>
                            ))
                        )}
                    </select>
                </div>
                
                <form onSubmit={handleCreateApi} className="flex-1 w-full space-y-2 relative">
                    <Label className="text-[13px] text-gray-500 dark:text-[#a1a1aa] font-medium">Create New Endpoint</Label>
                    <div className="flex gap-2">
                        <Input 
                           value={newApiName}
                           onChange={(e) => setNewApiName(e.target.value)}
                           placeholder="e.g. Website Contact Form"
                           required
                           className="h-11 bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-[#27272a] text-black dark:text-white focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-[#ccff00]"
                        />
                         <Button disabled={isCreating} type="submit" className="h-11 px-4 shrink-0 bg-black text-white hover:bg-gray-800 dark:bg-[#ccff00] dark:text-black dark:hover:bg-[#bdeb02]">
                            {isCreating ? "Generating..." : <><RiAddLine className="w-4 h-4 mr-1" /> Create API</>}
                         </Button>
                    </div>
                </form>
            </div>

            {forms.length > 0 && (
                <>
                {/* Direct Endpoint URL */}
                <div className="flex items-center w-full relative">
                  <div className="bg-gray-100 dark:bg-[#111113] border border-gray-200 dark:border-[#27272a] rounded-md h-11 flex-1 px-4 flex items-center overflow-x-auto whitespace-nowrap text-[13.5px] font-mono text-gray-600 dark:text-[#a1a1aa] custom-scrollbar focus-visible:outline-none pr-12">
                     POST <span className="mx-2 text-gray-300 dark:text-[#3f3f46]">|</span> <span className="text-black dark:text-[#ccff00] font-bold tracking-tight">{endpointUrl}</span>
                  </div>
                  <button 
                     onClick={() => handleCopy(endpointUrl, 'url')}
                     className="absolute right-0 h-11 w-11 bg-black dark:bg-[#27272a] hover:bg-gray-800 dark:hover:bg-[#3f3f46] text-white flex items-center justify-center rounded-r-md transition-colors"
                  >
                      {copiedKey === 'url' ? <RiCheckLine className="w-4 h-4 text-green-400 dark:text-[#ccff00]" /> : <RiFileCopyLine className="w-4 h-4 text-white dark:text-[#a1a1aa]" />}
                  </button>
                </div>

                {/* Code Snippets Section */}
                <div className="border border-gray-200 dark:border-[#27272a] rounded-xl overflow-hidden bg-gray-50 dark:bg-[#050505]">
                   {/* Tabs */}
                   <div className="flex items-center border-b border-gray-200 dark:border-[#27272a] bg-gray-100 dark:bg-[#111113] px-2 h-12">
                       <button 
                           onClick={() => setActiveTab('react')}
                           className={`h-full px-4 text-[13px] font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'react' ? 'text-black dark:text-white border-black dark:border-[#ccff00]' : 'text-gray-500 dark:text-[#71717a] border-transparent hover:text-black dark:hover:text-[#a1a1aa]'}`}
                       >
                           <RiReactjsLine className="w-[18px] h-[18px]" /> React / Next.js
                       </button>
                       <button 
                           onClick={() => setActiveTab('html')}
                           className={`h-full px-4 text-[13px] font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'html' ? 'text-black dark:text-white border-black dark:border-[#ccff00]' : 'text-gray-500 dark:text-[#71717a] border-transparent hover:text-black dark:hover:text-[#a1a1aa]'}`}
                       >
                           <RiHtml5Line className="w-[18px] h-[18px]" /> HTML Form
                       </button>
                       <button 
                           onClick={() => setActiveTab('js')}
                           className={`h-full px-4 text-[13px] font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'js' ? 'text-black dark:text-white border-black dark:border-[#ccff00]' : 'text-gray-500 dark:text-[#71717a] border-transparent hover:text-black dark:hover:text-[#a1a1aa]'}`}
                       >
                           <RiJavascriptLine className="w-[18px] h-[18px]" /> Raw Fetch
                       </button>
                   </div>
                   
                   {/* Code Block */}
                   <div className="relative group">
                       <pre className="p-5 overflow-x-auto text-[13px] font-mono leading-relaxed text-gray-800 dark:text-[#a1a1aa] custom-scrollbar">
                           <code>{codeSnippets[activeTab]}</code>
                       </pre>
                       <button 
                           onClick={() => handleCopy(codeSnippets[activeTab], 'code')}
                           className={`absolute top-4 right-4 p-2 rounded-md bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] shadow-sm transition-all ${copiedKey === 'code' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                       >
                           {copiedKey === 'code' ? <RiCheckLine className="w-4 h-4 text-green-500 dark:text-[#ccff00]" /> : <RiFileCopyLine className="w-4 h-4 text-gray-500 dark:text-[#71717a] hover:text-black dark:hover:text-white" />}
                       </button>
                   </div>
                </div>
                </>
            )}

            {forms.length === 0 && (
                <div className="w-full text-center py-12 border border-dashed border-gray-300 dark:border-[#27272a] rounded-xl text-gray-500 dark:text-[#71717a]">
                   <RiFlashlightFill className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-[#3f3f46]" />
                   <div className="text-[14px]">You haven't generated any Headless Endpoints yet.</div>
                   <div className="text-[13px] mt-1">Start by typing an API Name above and hitting Create API.</div>
                </div>
            )}
            
        </div>
    )
}
