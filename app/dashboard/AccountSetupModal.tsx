"use client"
import { useState } from "react"
import { RiMailSendLine, RiCheckDoubleLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AccountSetupModalProps {
    required: boolean;
}

export default function AccountSetupModal({ required }: AccountSetupModalProps) {
    const [isOpen, setIsOpen] = useState(required);
    const [email, setEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const res = await fetch("/api/auth/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ forwardingEmail: email })
            });

            const data = await res.json();
            
            if (res.ok) {
                setIsOpen(false);
                // Hard refresh to clear the server component blockade
                window.location.reload();
            } else {
                setError(data.error || "Failed to sync account setup");
            }
        } catch (err) {
            setError("System error connecting to backend.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] rounded-2xl shadow-2xl p-8 relative flex flex-col items-center text-center">
               
               <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-[#ccff00]/10 dark:text-[#ccff00] flex items-center justify-center mb-6">
                   <RiMailSendLine className="w-8 h-8" />
               </div>

               <h2 className="text-[22px] font-bold text-black dark:text-white tracking-tight mb-2">Welcome to FORMHUBS</h2>
               <p className="text-[14.5px] text-gray-500 dark:text-[#a1a1aa] leading-relaxed mb-8">
                   Before you start building powerful forms, we need to know exactly where you want us to securely forward your form submissions.
               </p>

               <form onSubmit={handleSave} className="w-full space-y-4">
                  {error && <div className="text-[13px] text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                  
                  <div className="space-y-2 text-left">
                     <label className="text-[13px] font-medium text-gray-600 dark:text-[#a1a1aa]">Data Forwarding Email</label>
                     <Input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. analysis@yourcompany.com"
                        required
                        className="h-11 bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-[#27272a] text-black dark:text-white focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-[#ccff00]"
                     />
                  </div>

                  <Button 
                     type="submit" 
                     disabled={isSaving}
                     className="w-full h-11 bg-black text-white hover:bg-gray-800 dark:bg-[#ccff00] dark:text-black dark:hover:bg-[#bdeb02] font-bold text-[15px] shadow-sm flex items-center gap-2 mt-4"
                  >
                     {isSaving ? "Securing System..." : <>Complete Setup <RiCheckDoubleLine className="w-[18px] h-[18px]" /></>}
                  </Button>
               </form>

           </div>
        </div>
    )
}
