"use client"

import { useState } from "react"
import { RiEditLine, RiLayoutRowLine, RiCheckLine, RiArrowRightSLine, RiArrowLeftSLine, RiCloseLine, RiStackFill } from "@remixicon/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormTypeModalProps {
  isOpen: boolean
  onClose: (config: { type: 'single' | 'multi', title: string, description: string }) => void
}

export default function FormTypeModal({ isOpen, onClose }: FormTypeModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formType, setFormType] = useState<'single' | 'multi'>('single')
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const steps = [
    { id: 1, label: "Choose Type", desc: "Select form type", icon: RiLayoutRowLine },
    { id: 2, label: "Configure", desc: "Set up form details", icon: RiEditLine },
    { id: 3, label: "Review", desc: "Review and create", icon: RiCheckLine },
  ]

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
    else onClose({ type: formType, title, description })
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[750px] translate-x-[-50%] translate-y-[-50%] gap-0 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] p-0 shadow-2xl duration-200 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col h-auto max-h-[90dvh]">
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          {/* Header */}
          <DialogHeader className="mb-4 sm:mb-6 text-left">
            <DialogTitle className="text-xl sm:text-2xl font-bold dark:text-white">Create a New Form</DialogTitle>
            <DialogDescription className="text-[12px] sm:text-[14px] text-gray-500">
              Initialize your new form project in seconds.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 overflow-x-auto pb-2 no-scrollbar">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center group shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={cn(
                    "w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 text-[11px] sm:text-[13px]",
                    currentStep === step.id 
                      ? "bg-black text-white border-black dark:bg-[#ccff00] dark:text-black dark:border-[#ccff00]" 
                      : currentStep > step.id 
                        ? "bg-[#ccff00] border-[#ccff00] text-black" 
                        : "bg-transparent border-gray-200 dark:border-[#27272a] text-gray-400"
                  )}>
                    {currentStep > step.id ? <RiCheckLine className="w-4 h-4 sm:w-5 sm:h-5 text-[16px]" /> : <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[16px]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-[11px] sm:text-[13px] font-bold whitespace-nowrap",
                      currentStep === step.id ? "text-black dark:text-white" : "text-gray-400"
                    )}>{step.label}</span>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-4 sm:w-8 md:w-12 h-[1px] bg-gray-200 dark:bg-[#27272a] mx-2 sm:mx-4" />
                )}
              </div>
            ))}
          </div>

          <div className="px-0.5">
            {/* Step 1: Choose Type */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setFormType('single')}
                  className={cn(
                    "relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-3 group hover:shadow-md",
                    formType === 'single' 
                      ? "border-black dark:border-[#ccff00] bg-gray-50 dark:bg-[#ccff00]/5 shadow-sm" 
                      : "border-gray-100 dark:border-[#1e1e21] bg-white dark:bg-[#0a0a0a] hover:border-gray-300 dark:hover:border-[#3f3f46]"
                  )}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-black dark:text-white group-hover:scale-105 transition-transform">
                     <RiLayoutRowLine className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] sm:text-base font-bold mb-0.5 dark:text-white">Single Page Form</h3>
                    <p className="text-[11px] sm:text-[13px] text-gray-500 mb-3 leading-relaxed">Traditional form with all fields on one page</p>
                    
                    <div className="space-y-1.5">
                      {["Visible all at once", "Fast conversion", "Linear scrolling"].map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-gray-600 dark:text-gray-400">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {formType === 'single' && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 bg-black dark:bg-[#ccff00] text-white dark:text-black rounded-full flex items-center justify-center shadow-md">
                      <RiCheckLine className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div 
                  onClick={() => setFormType('multi')}
                  className={cn(
                    "relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-3 group hover:shadow-md",
                    formType === 'multi' 
                      ? "border-black dark:border-[#ccff00] bg-gray-50 dark:bg-[#ccff00]/5 shadow-sm" 
                      : "border-gray-100 dark:border-[#1e1e21] bg-white dark:bg-[#0a0a0a] hover:border-gray-300 dark:hover:border-[#3f3f46]"
                  )}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-black dark:text-white group-hover:scale-105 transition-transform">
                     <RiStackFill className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] sm:text-base font-bold mb-0.5 dark:text-white">Multi-Step Form</h3>
                    <p className="text-[11px] sm:text-[13px] text-gray-500 mb-3 leading-relaxed">Guided experience with steps</p>
                    
                    <div className="space-y-1.5">
                      {["Reduced load", "Higher completion", "Progress tracking"].map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-gray-600 dark:text-gray-400">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {formType === 'multi' && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 bg-black dark:bg-[#ccff00] text-white dark:text-black rounded-full flex items-center justify-center shadow-md">
                      <RiCheckLine className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Configure */}
            {currentStep === 2 && (
              <div className="max-w-xl mx-auto py-2 sm:py-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="form-title" className="text-[11px] sm:text-[13px] font-bold dark:text-white uppercase tracking-wider text-gray-400">Form Title</Label>
                    <Input 
                      id="form-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. User Feedback Survey"
                      className="h-10 dark:bg-[#111113] border-gray-200 dark:border-[#27272a]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="form-desc" className="text-[11px] sm:text-[13px] font-bold dark:text-white uppercase tracking-wider text-gray-400">Description</Label>
                    <Textarea 
                      id="form-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe the purpose"
                      className="min-h-[90px] dark:bg-[#111113] border-gray-200 dark:border-[#27272a]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="max-w-xl mx-auto py-4 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ccff00]/10 text-[#ccff00] rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiCheckLine className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xl font-bold mb-1.5 dark:text-white">Ready to create?</h3>
                <p className="text-[13px] text-gray-500 mb-6">Confirm your settings below to initialize the builder.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-gray-50 dark:bg-[#111113] rounded-xl border border-gray-100 dark:border-[#27272a]">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Type</span>
                    <p className="text-[14px] font-bold mt-0.5 dark:text-white capitalize">{formType} Flow</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-[#111113] rounded-xl border border-gray-100 dark:border-[#27272a]">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Title</span>
                    <p className="text-[14px] font-bold mt-0.5 dark:text-white truncate">{title || 'Untitled'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-4 py-4 sm:px-8 sm:py-6 border-t border-gray-100 dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] flex items-center justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={currentStep === 1 ? () => {} : handleBack}
            className={cn(
              "h-10 px-4 sm:px-6 rounded-xl font-bold flex items-center gap-2",
              currentStep === 1 ? "invisible" : "hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            <RiArrowLeftSLine className="w-4 h-4" /> Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentStep === 2 && !title}
            className="h-10 px-6 sm:px-10 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-[#ccff00] dark:text-black dark:hover:bg-[#bdeb02] font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            {currentStep === 3 ? "Launch Builder" : "Next"} 
            {currentStep < 3 && <RiArrowRightSLine className="w-4 h-4" />}
          </Button>
        </div>
      </DialogContent>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Dialog>
  )
}
