"use client"
import { useState } from "react"
import { RiSave3Line, RiUserLine, RiMailLine, RiMailSendLine, RiCheckLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsProps {
    user: {
        _id: string;
        name: string;
        email: string;
        forwardingEmail?: string;
    }
}

export default function SettingsClient({ user }: SettingsProps) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [forwardingEmail, setForwardingEmail] = useState(user.forwardingEmail || "");
    
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");
        setSuccessMessage("");

        try {
            const res = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, forwardingEmail })
            });

            const data = await res.json();
            
            if (res.ok) {
                setSuccessMessage("Profile perfectly synchronized.");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setError(data.error || "Failed to update profile configurations.");
            }
        } catch (err) {
            setError("Server connection lost while syncing.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] rounded-xl p-6 md:p-8 shadow-sm">
           
           {error && <div className="mb-6 text-[13px] text-red-600 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
           {successMessage && <div className="mb-6 text-[13px] text-green-700 dark:text-[#ccff00] bg-green-500/10 dark:bg-[#ccff00]/10 p-3 rounded-lg border border-green-500/20 dark:border-[#ccff00]/20 flex items-center gap-2"><RiCheckLine className="w-4 h-4"/> {successMessage}</div>}

           <div className="space-y-6">
              
              <div className="space-y-2">
                 <Label className="text-[13px] font-medium text-gray-700 dark:text-[#a1a1aa] flex items-center gap-2">
                    <RiUserLine className="w-4 h-4" /> Full Name
                 </Label>
                 <Input 
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                     className="h-11 bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-[#27272a] text-black dark:text-white focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-[#ccff00]"
                 />
                 <p className="text-[12px] text-gray-400 dark:text-[#71717a]">This name primarily appears on outgoing emails.</p>
              </div>

              <div className="space-y-2">
                 <Label className="text-[13px] font-medium text-gray-700 dark:text-[#a1a1aa] flex items-center gap-2">
                    <RiMailLine className="w-4 h-4" /> Account Login Email
                 </Label>
                 <Input 
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="h-11 bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-[#27272a] text-black dark:text-white focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-[#ccff00]"
                 />
                 <p className="text-[12px] text-gray-400 dark:text-[#71717a]">Your primary identity. You use this to receive verification OTPs.</p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-[#1e1e21] space-y-2">
                 <Label className="text-[13px] font-medium text-gray-700 dark:text-[#a1a1aa] flex items-center gap-2">
                    <RiMailSendLine className="w-4 h-4 text-black dark:text-[#ccff00]" /> Form Forwarding Email
                 </Label>
                 <Input 
                     type="email"
                     value={forwardingEmail}
                     onChange={(e) => setForwardingEmail(e.target.value)}
                     placeholder="e.g. analysis@company.com"
                     className="h-11 bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-[#27272a] text-black dark:text-white focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-[#ccff00]"
                 />
                 <p className="text-[12.5px] text-gray-500 dark:text-[#71717a] leading-relaxed mt-1">
                    If specified, all new submissions generated by your Visual and Headless forms will be immediately redirected to this secure address instead of your Account Login Email.
                 </p>
              </div>

           </div>

           <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#1e1e21] flex justify-end">
              <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="h-11 px-6 bg-black text-white hover:bg-gray-800 dark:bg-[#ccff00] dark:text-black dark:hover:bg-[#bdeb02] font-bold text-[14px] shadow-sm flex items-center gap-2 transition-colors"
              >
                  {isSaving ? "Synchronizing..." : <>Save Configuration <RiSave3Line className="w-[18px] h-[18px]" /></>}
              </Button>
           </div>
        </form>
    )
}
