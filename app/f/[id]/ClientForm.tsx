"use client"
import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RiCheckLine, RiStarLine } from "@remixicon/react"

export default function ClientForm({ form }: { form: any }) {
  const isLight = form.theme === 'light';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const answers: Record<string, any> = {};
      
      form.fields.forEach((field: any) => {
         if (['statement', 'banner', 'file', 'signature'].includes(field.type)) return;
         if (field.type === 'checkbox') {
             const allChecked = formData.getAll(field.id);
             answers[field.id] = allChecked.length > 0 ? allChecked.join(', ') : "";
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
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans selection:bg-[#ccff00] ${isLight ? 'bg-[#f4f4f5] text-black' : 'bg-[#050505] text-white selection:text-black'}`}>
        <Card className={`w-full max-w-[600px] shadow-2xl py-12 text-center flex flex-col items-center gap-4 ${isLight ? 'bg-white border-gray-200' : 'bg-[#0a0a0a] border-[#27272a]'}`}>
           <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isLight ? 'bg-green-100 text-green-600' : 'bg-[#ccff00]/10 text-[#ccff00]'}`}>
              <RiCheckLine className="w-8 h-8" />
           </div>
           <h2 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>Thanks for your response</h2>
           <p className={`text-[15px] max-w-sm ${isLight ? 'text-gray-500' : 'text-[#a1a1aa]'}`}>Your submission has been securely documented.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans selection:bg-[#ccff00] ${isLight ? 'bg-[#f4f4f5] text-black' : 'bg-[#050505] text-white selection:text-black'}`}>
      <div className="w-full max-w-[600px] mb-8 text-center sm:text-left hidden">
        {/* Placeholder for branding if needed */}
      </div>

      <Card className={`w-full max-w-[600px] shadow-2xl ${isLight ? 'bg-white border-gray-200' : 'bg-[#0a0a0a] border-[#27272a]'}`}>
        <CardHeader className={`border-b pb-6 rounded-t-xl ${isLight ? 'bg-white border-gray-100' : 'bg-[#0a0a0a] border-[#1e1e21]'}`}>
          <CardTitle className={`text-[28px] font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>{form.title}</CardTitle>
          {form.description && (
            <CardDescription className={`text-[15.5px] mt-2 leading-relaxed ${isLight ? 'text-gray-500' : 'text-[#a1a1aa]'}`}>
              {form.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={`pt-8 space-y-8 ${isLight ? 'bg-[#fafafa]' : 'bg-[#050505]'}`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {form.fields.map((field: any) => (
              <div key={field.id} className="space-y-2">
                
                {/* Specific Layout handling */}
                {field.type === 'statement' ? (
                  <h3 className={`text-lg font-semibold mb-2 ${isLight ? 'text-black' : 'text-white'}`}>{field.label || 'Statement'}</h3>
                ) : field.type === 'banner' ? (
                  <div className={`p-4 rounded-lg text-[14.5px] ${isLight ? 'bg-[rgba(204,255,0,0.15)] border border-[rgba(204,255,0,0.3)] text-black' : 'bg-[rgba(204,255,0,0.1)] border border-[rgba(204,255,0,0.2)] text-[#ccff00]'}`}>
                    {field.label || 'Notice'}
                  </div>
                ) : (
                  <>
                    <Label className={`text-[14px] font-medium mb-1.5 block ${isLight ? 'text-black' : 'text-white'}`}>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>

                    {/* Simple Input Handling */}
                    {['text', 'email', 'phone', 'url', 'number', 'time', 'date', 'address'].includes(field.type) && (
                      <Input
                        name={field.id}
                        type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'time' ? 'time' : field.type === 'date' ? 'date' : 'text'}
                        placeholder={field.placeholder || "Enter value..."}
                        required={field.required}
                        className={`h-11 rounded-lg focus-visible:ring-1 focus-visible:ring-[#ccff00] focus-visible:border-[#ccff00] transition-colors ${isLight ? 'bg-white border-gray-200 text-black placeholder:text-gray-400' : 'bg-[#111113] border-[#27272a] text-white placeholder:text-[#52525b]'}`}
                      />
                    )}

                    {/* Textarea Handling */}
                    {field.type === 'textarea' && (
                      <textarea
                        name={field.id}
                        placeholder={field.placeholder || "Enter your text here..."}
                        required={field.required}
                        className={`w-full rounded-lg p-3 text-[14.5px] focus:outline-none focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] transition-colors min-h-[100px] ${isLight ? 'bg-white border text-black border-gray-200 placeholder:text-gray-400' : 'bg-[#111113] border border-[#27272a] text-white placeholder:text-[#52525b]'}`}
                      />
                    )}

                    {/* Checkbox Handling */}
                    {field.type === 'checkbox' && (
                      <div className="flex flex-col gap-3 mt-2">
                         {(field.options || ['Option 1']).map((opt: string, i: number) => (
                           <div key={i} className="flex items-center gap-3">
                              <input type="checkbox" name={field.id} value={opt} className={`w-4 h-4 accent-[#ccff00] rounded ${isLight ? 'bg-white border border-gray-300' : 'bg-[#111113] border-[#27272a]'}`} />
                              <span className={`text-[14.5px] ${isLight ? 'text-black' : 'text-white'}`}>{opt}</span>
                           </div>
                         ))}
                      </div>
                    )}

                    {/* Radio Handling */}
                    {field.type === 'radio' && (
                      <div className="flex flex-col gap-3 mt-2">
                         {(field.options || ['Option 1']).map((opt: string, i: number) => (
                           <div key={i} className="flex items-center gap-3">
                              <input type="radio" name={field.id} value={opt} className={`w-4 h-4 accent-[#ccff00] rounded-full ${isLight ? 'bg-white border border-gray-300' : 'bg-[#111113] border-[#27272a]'}`} required={field.required} />
                              <span className={`text-[14.5px] ${isLight ? 'text-black' : 'text-white'}`}>{opt}</span>
                           </div>
                         ))}
                      </div>
                    )}

                     {/* Dropdown/Poll Handling */}
                     {['dropdown', 'poll'].includes(field.type) && (
                      <select name={field.id} required={field.required} className={`w-full rounded-lg p-3 h-11 text-[14.5px] focus:outline-none focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] transition-colors appearance-none ${isLight ? 'bg-white border border-gray-200 text-black' : 'bg-[#111113] border border-[#27272a] text-white'}`}>
                         <option value="" disabled selected>Select an option...</option>
                         {(field.options || ['Option 1']).map((opt: string, i: number) => (
                             <option key={i} value={opt}>{opt}</option>
                         ))}
                      </select>
                    )}

                    {/* Slider Handling */}
                    {field.type === 'slider' && (
                       <div className="flex items-center gap-4 mt-3">
                         <span className={`text-[13px] font-medium ${isLight ? 'text-gray-500' : 'text-[#71717a]'}`}>{field.sliderMin !== undefined ? field.sliderMin : 0}</span>
                         <input type="range" name={field.id} min={field.sliderMin !== undefined ? field.sliderMin : 0} max={field.sliderMax !== undefined ? field.sliderMax : 100} className="w-full accent-[#ccff00] flex-1" required={field.required} />
                         <span className={`text-[13px] font-medium ${isLight ? 'text-gray-500' : 'text-[#71717a]'}`}>{field.sliderMax !== undefined ? field.sliderMax : 100}</span>
                       </div>
                    )}
                    
                    {/* Rating Handling */}
                    {field.type === 'rating' && (
                       <div className="flex items-center gap-2 mt-2">
                           <input type="hidden" name={field.id} id={`rating_${field.id}`} value="5" />
                           {[1,2,3,4,5].map(i => <RiStarLine key={i} onClick={(e) => {
                               const el = document.getElementById(`rating_${field.id}`) as HTMLInputElement;
                               if(el) el.value = String(i);
                               const parent = e.currentTarget.parentElement;
                               if (parent) {
                                   Array.from(parent.children).forEach((child, index) => {
                                       if(index > 0 && index <= i) child.classList.add('text-yellow-400');
                                       else if(index > 0) child.classList.remove('text-yellow-400');
                                   });
                               }
                           }} className="w-[32px] h-[32px] text-yellow-400 cursor-pointer transition-colors" />)}
                       </div>
                    )}

                     {/* File/Signature Handling */}
                     {['file', 'signature'].includes(field.type) && (
                      <div className={`w-full p-8 border border-dashed hover:border-[#ccff00]/50 transition-colors cursor-pointer rounded-xl flex items-center justify-center ${isLight ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-500' : 'bg-[#111113] hover:bg-[#18181b] border-[#27272a] text-[#71717a]'}`}>
                        <span className="text-[14px] font-medium">{field.type === 'file' ? 'Click or drag files to upload' : 'Click securely to sign document'}</span>
                        <input type="hidden" name={field.id} value="placeholder_media_string" />
                      </div>
                    )}

                    {/* Complex Elements Placeholder */}
                    {['tags', 'social', 'group', 'scheduler'].includes(field.type) && (
                      <div className={`w-full h-11 border rounded-lg px-3 flex items-center text-[14.5px] ${isLight ? 'bg-white border-gray-200 text-gray-500' : 'bg-[#111113] border-[#27272a] text-[#71717a]'}`}>
                        Interactive Widget Placeholder
                        <input type="hidden" name={field.id} value="complex_widget_data" />
                      </div>
                    )}

                  </>
                )}
                
                {field.description && field.type !== 'statement' && field.type !== 'banner' && (
                  <p className={`text-[13px] mt-1.5 ${isLight ? 'text-gray-500' : 'text-[#71717a]'}`}>{field.description}</p>
                )}
              </div>
            ))}
            
            {form.fields.length > 0 && (
              <div className="pt-6">
                <Button disabled={isSubmitting} type="submit" className="w-full bg-[#ccff00] text-black hover:bg-[#bdeb02] h-12 rounded-lg font-bold text-[15.5px] shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                  {isSubmitting ? "Submitting securely..." : "Submit Form"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className={`rounded-b-xl border-t p-4 flex justify-center ${isLight ? 'bg-[#fafafa] border-gray-100' : 'bg-[#050505] border-[#1e1e21]'}`}>
            <p className={`text-[12px] font-medium flex items-center gap-1.5 uppercase tracking-widest ${isLight ? 'text-gray-400' : 'text-[#52525b]'}`}>
              Powered by <span className="text-[#ccff00]">FORMHUBS</span>
            </p>
        </CardFooter>
      </Card>
    </div>
  )
}
