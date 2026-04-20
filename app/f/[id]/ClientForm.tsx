"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { RiCheckLine, RiStarLine, RiArrowRightSLine, RiArrowLeftSLine, RiInformationLine, RiCalendarLine, RiTimeLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

export default function ClientForm({ form }: { form: any }) {
  const isLight = form.theme === 'light';
  const isMultiStep = form.formType === 'multi' && form.steps?.length > 0;
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State for complex inputs (Date)
  const [dates, setDates] = useState<Record<string, Date | undefined>>({});

  const steps = isMultiStep ? form.steps : [{ id: 'default', label: form.title }];
  const currentStep = steps[currentStepIndex];
  
  const visibleFields = isMultiStep 
    ? form.fields.filter((f: any) => f.stepId === currentStep.id)
    : form.fields;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isMultiStep && currentStepIndex < steps.length - 1) {
       setCurrentStepIndex(currentStepIndex + 1);
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const answers: Record<string, any> = {};
      form.fields.forEach((field: any) => {
         if (['statement', 'banner', 'file', 'signature'].includes(field.type)) return;
         if (field.type === 'checkbox') {
             const allChecked = formData.getAll(field.id);
             answers[field.id] = allChecked.length > 0 ? allChecked.join(', ') : "";
         } else if (field.type === 'date') {
             answers[field.id] = dates[field.id] ? format(dates[field.id]!, "PPP") : "";
         } else {
             answers[field.id] = formData.get(field.id);
         }
      });

      const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formId: form._id, answers })
      });
      if (res.ok) setIsSuccess(true);
      else alert("Something went wrong");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500",
        isLight ? "bg-[#f8f9fa] text-black" : "bg-[#050505] text-white"
      )}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className={cn(
            "w-full max-w-[450px] p-8 text-center flex flex-col items-center gap-6 rounded-[24px]",
            isLight ? "bg-white" : "bg-[#0a0a0a]"
          )}>
             <div className="w-16 h-16 rounded-full bg-[#ccff00] text-black flex items-center justify-center">
                <RiCheckLine className="w-8 h-8" />
             </div>
             <div className="space-y-1">
               <h2 className="text-2xl font-bold">Successfully Submitted</h2>
               <p className={cn("text-[14.5px] opacity-60", isLight ? "shadow-none" : "")}>Your response has been securely recorded.</p>
             </div>
             <Button onClick={() => window.location.reload()} className="bg-[#ccff00] text-black hover:bg-[#bdeb02] w-full h-11 rounded-xl font-bold">
               Submit Another
             </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center p-4 py-5 pt-10 font-sans selection:bg-[#ccff00] transition-colors duration-500 border-none",
      isLight ? "bg-[#f4f4f7] text-black" : "dark bg-[#050505] text-white"
    )}>
      
      <div className="w-full max-w-[550px] space-y-3 relative z-[10] border-none">
        
        {/* Compact Progress Indicator */}
        {isMultiStep && (
          <div className="space-y-2.5 px-1">
             <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccff00]">Step {currentStepIndex + 1} / {steps.length}</span>
                <span className="text-[11px] font-medium opacity-40">{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
             </div>
             <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  className="h-full bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.3)]"
                />
             </div>
          </div>
        )}

        <Card className={cn(
          "w-full border-none shadow-none overflow-hidden",
          isLight ? "bg-white text-black" : "bg-transparent text-white"
        )}>
          <CardHeader className={cn(
            "p-3 sm:p-4 pb-0",
            isLight ? "bg-white" : ""
          )}>
            <motion.div 
              key={currentStepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <CardTitle className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight",
                isLight ? "text-black" : "text-white"
              )}>
                {isMultiStep ? currentStep.label : form.title}
              </CardTitle>
              {(form.description && (currentStepIndex === 0 || !isMultiStep)) && (
                <CardDescription className={cn(
                  "text-[14.5px] leading-relaxed",
                  isLight ? "text-gray-500" : "text-[#a1a1aa]"
                )}>
                  {form.description}
                </CardDescription>
              )}
            </motion.div>
          </CardHeader>

          <CardContent className={cn(
            "p-3 sm:p-3",
            isLight ? "bg-white" : "bg-[#050505]"
          )}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {visibleFields.map((field: any) => (
                    <div key={field.id} className="space-y-2">
                      {field.type === 'statement' ? (
                        <div className="py-2">
                          <h3 className="text-lg font-bold text-white">{field.label || 'Statement'}</h3>
                          {field.description && <p className="text-[13.5px] mt-1 opacity-60 text-white">{field.description}</p>}
                        </div>
                      ) : field.type === 'banner' ? (
                        <div className={cn(
                          "p-4 rounded-xl text-[14px] flex items-start gap-3",
                          isLight ? "bg-[rgba(204,255,0,0.15)] border border-[rgba(204,255,0,0.3)] text-black" : "bg-[rgba(204,255,0,0.1)] border border-[rgba(204,255,0,0.2)] text-[#ccff00]"
                        )}>
                          <RiInformationLine className="w-5 h-5 shrink-0 mt-0.5" />
                          <p className="font-medium">{field.label}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-[14px] font-semibold text-gray-400 dark:text-[#52525b] uppercase tracking-wider">
                            {field.label} {field.required && <span className="text-red-500 ml-0.5">*</span>}
                          </Label>

                          {/* Standard Text/Number Inputs */}
                          {['text', 'email', 'phone', 'url', 'number', 'address'].includes(field.type) && (
                            <Input
                              name={field.id}
                              type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                              placeholder={field.placeholder || "Your answer..."}
                              required={field.required}
                              className={cn(
                                "h-11 rounded-xl border focus-visible:ring-2 transition-all",
                                isLight ? "bg-white border-gray-200 text-black" : "bg-[#111113] border-[#1e1e21] text-white"
                              )}
                            />
                          )}

                          {/* Date Picker (Shadcn UI) */}
                          {field.type === 'date' && (
                             <Popover>
                               <PopoverTrigger asChild>
                                 <Button
                                   variant={"outline"}
                                   className={cn(
                                     "h-11 w-full justify-start text-left font-normal rounded-xl border-2 transition-all",
                                     !dates[field.id] && "text-muted-foreground",
                                     isLight ? "bg-white border-gray-100 text-black hover:bg-gray-50" : "bg-[#111113] border-[#1e1e21] text-white hover:bg-[#1a1a1c]"
                                   )}
                                 >
                                   <RiCalendarLine className="mr-2 h-4 w-4 opacity-50" />
                                   {dates[field.id] ? format(dates[field.id]!, "PPP") : <span>{field.placeholder || "Pick a date"}</span>}
                                 </Button>
                               </PopoverTrigger>
                               <PopoverContent className={cn(
                                 "w-auto p-0 border shadow-2xl rounded-2xl z-[150]",
                                 isLight ? "bg-white border-gray-100" : "bg-[#0a0a0a] border-[#1e1e21]"
                               )} align="start">
                                 <Calendar
                                   mode="single"
                                   selected={dates[field.id]}
                                   onSelect={(date) => setDates({ ...dates, [field.id]: date })}
                                   initialFocus
                                   className={cn(
                                      "rounded-2xl transition-colors",
                                      isLight ? "bg-white text-black" : "bg-[#0a0a0a] text-white"
                                   )}
                                 />
                               </PopoverContent>
                             </Popover>
                          )}

                          {/* Time Picker (Shadcn Styled) */}
                          {field.type === 'time' && (
                             <div className="relative group">
                               <RiTimeLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 z-10 pointer-events-none group-focus-within:text-[#ccff00] transition-colors" />
                               <Input
                                 name={field.id}
                                 type="time"
                                 placeholder={field.placeholder || "Select time"}
                                 required={field.required}
                                 className={cn(
                                   "h-11 pl-10 rounded-xl border focus-visible:ring-2 transition-all appearance-none cursor-pointer",
                                   isLight ? "bg-white border-gray-200 text-black" : "bg-[#111113] border-[#1e1e21] text-white"
                                 )}
                               />
                             </div>
                          )}

                          {field.type === 'textarea' && (
                            <textarea
                              name={field.id}
                              placeholder={field.placeholder || "Type here..."}
                              required={field.required}
                              className={cn(
                                "w-full rounded-xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#ccff00] transition-all border min-h-[120px]",
                                isLight ? "bg-white border-gray-200 text-black" : "bg-[#111113] border-[#1e1e21] text-white"
                              )}
                            />
                          )}

                          {['checkbox', 'radio'].includes(field.type) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                               {(field.options || ['Option 1']).map((opt: string, i: number) => (
                                 <label key={i} className={cn(
                                   "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all hover:bg-[#ccff00]/5",
                                   isLight ? "bg-white border-gray-100 text-black" : "bg-[#111113] border-[#1e1e21] text-white"
                                 )}>
                                    <input type={field.type} name={field.id} value={opt} className="w-4 h-4 accent-[#ccff00]" required={field.type === 'radio' ? field.required : false} />
                                    <span className="text-[14.5px] font-medium">{opt}</span>
                                 </label>
                               ))}
                            </div>
                          )}

                          {['dropdown', 'poll'].includes(field.type) && (
                            <select name={field.id} required={field.required} className={cn(
                              "w-full rounded-xl p-3 h-12 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#ccff00] border appearance-none transition-all",
                              isLight ? "bg-white border-gray-200 text-black" : "bg-[#111113] border-[#1e1e21] text-white"
                            )}>
                               <option value="" disabled selected className={isLight ? "text-black" : "text-white bg-[#0a0a0a]"}>Select an option</option>
                               {(field.options || ['Option 1']).map((opt: string, i: number) => (
                                   <option key={i} value={opt} className={isLight ? "text-black" : "text-white bg-[#0a0a0a]"}>{opt}</option>
                               ))}
                            </select>
                          )}

                          {field.type === 'slider' && (
                             <div className="space-y-4 pt-2">
                               <input type="range" name={field.id} min={field.sliderMin || 0} max={field.sliderMax || 100} className="w-full accent-[#ccff00] h-2 bg-gray-200 dark:bg-white/5 rounded-full cursor-pointer" required={field.required} />
                               <div className="flex justify-between text-[11px] font-bold opacity-30 uppercase tracking-widest text-white">
                                 <span>{field.sliderMin || 0}</span>
                                 <span>{field.sliderMax || 100}</span>
                               </div>
                             </div>
                          )}

                          {field.type === 'rating' && (
                             <div className="flex items-center gap-2 mt-2 text-white">
                                 <input type="hidden" name={field.id} id={`rating_${field.id}`} value="" />
                                 {[1,2,3,4,5].map(i => (
                                   <RiStarLine 
                                     key={i} 
                                     onClick={(e) => {
                                        const el = document.getElementById(`rating_${field.id}`) as HTMLInputElement;
                                        if(el) el.value = String(i);
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) {
                                            Array.from(parent.children).forEach((child, index) => {
                                                if(index > 0 && index <= i) child.classList.add('text-[#ccff00]');
                                                else if(index > 0) child.classList.remove('text-[#ccff00]');
                                            });
                                        }
                                     }} 
                                     className="w-10 h-10 text-gray-300 dark:text-gray-800 cursor-pointer transition-colors hover:text-[#ccff00]" 
                                   />
                                 ))}
                             </div>
                          )}

                           {['file', 'signature'].includes(field.type) && (
                            <div className={cn(
                              "w-full p-8 border-2 border-dashed rounded-[20px] transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                              isLight ? "bg-white hover:bg-gray-50 border-gray-200 text-gray-400" : "bg-[#111113] hover:bg-[#151518] border-[#1e1e21] text-[#71717a]"
                            )}>
                              <span className="text-[14px] font-bold uppercase tracking-wide">{field.type === 'file' ? 'Upload Files' : 'Sign Securely'}</span>
                              <input type="hidden" name={field.id} value="media_placeholder" />
                            </div>
                          )}

                          {field.description && (
                            <p className="text-[12.5px] opacity-40 font-medium ml-1 text-white">{field.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="pt-2 flex items-center gap-4">
                {isMultiStep && currentStepIndex > 0 && (
                   <Button 
                    type="button" 
                    onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                    variant="ghost" 
                    className="h-12 px-6 rounded-xl font-bold flex items-center gap-2 opacity-100 hover:opacity-100 transition-all text-white"
                   >
                     <RiArrowLeftSLine className="w-5 h-5" /> Back
                   </Button>
                )}
                
                <Button 
                  disabled={isSubmitting} 
                  type="submit" 
                  className="flex-1 h-11 rounded-xl bg-[#ccff00] text-black hover:bg-[#bdeb02] font-black uppercase text-[14px] tracking-widest shadow-xl shadow-[#ccff00]/10 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : isMultiStep ? (
                    currentStepIndex === steps.length - 1 ? "Submit Form" : "Next Step"
                  ) : (
                    "Submit Form"
                  )}
                  {(isMultiStep && currentStepIndex < steps.length - 1) && <RiArrowRightSLine className="w-5 h-5 ml-1" />}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className={cn(
            "p-4 flex justify-center border-t",
            isLight ? "border-gray-100 bg-black" : "border-[#1e1e21] bg-black"
          )}>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isLight ? "text-gray-300" : "text-white")}>
              Powered by <span className="text-[#ccff00]">FormHubs</span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
