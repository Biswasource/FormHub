"use client"
import { useState } from "react"
import Link from "next/link"
import { 
  RiArrowLeftLine, RiBarChartBoxLine, RiShareForwardLine, RiSettings4Line, RiEyeLine, RiSave3Line,
  RiSearchLine, RiCloseLine, RiAddLine, RiDragMove2Fill, RiDeleteBinLine,
  RiText, RiHashtag, RiAlignLeft, RiTimeLine, RiLinkM, RiMailLine, RiPhoneLine, RiCalendarLine, RiMapPinLine,
  RiListUnordered, RiCheckboxLine, RiStarLine, RiRadioButtonLine, RiEqualizerLine, RiBarChartHorizontalLine,
  RiUploadCloudLine, RiQuillPenLine, RiMessageLine, RiLayoutRowLine, RiAlertLine,
  RiPriceTag3Line, RiCalendarEventLine, RiShareLine, RiMoonLine, RiSunLine
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Field Definitions Data
const fieldCategories = [
  {
    category: "Input Fields",
    items: [
      { type: "text", label: "Text Input", desc: "A single line for short text responses.", icon: RiText },
      { type: "number", label: "Number", desc: "Input for numeric values.", icon: RiHashtag },
      { type: "textarea", label: "Textarea", desc: "A multi-line field for longer text.", icon: RiAlignLeft },
      { type: "time", label: "Time", desc: "Select or enter a time value.", icon: RiTimeLine },
      { type: "url", label: "Link", desc: "Input for a valid website URL.", icon: RiLinkM },
      { type: "email", label: "Email", desc: "Collect a valid email address.", icon: RiMailLine },
      { type: "phone", label: "Phone Number", desc: "Input for phone numbers with validation.", icon: RiPhoneLine },
      { type: "date", label: "Date", desc: "Pick a date from a calendar.", icon: RiCalendarLine },
      { type: "address", label: "Address", desc: "Input for street, city, and other details.", icon: RiMapPinLine },
    ]
  },
  {
    category: "Selection Fields",
    items: [
      { type: "dropdown", label: "Select Dropdown", desc: "Dropdown to choose one option.", icon: RiListUnordered },
      { type: "checkbox", label: "Checkboxes", desc: "Select one or more options.", icon: RiCheckboxLine },
      { type: "rating", label: "Rating", desc: "Collect a star or icon rating.", icon: RiStarLine },
      { type: "radio", label: "Radio Buttons", desc: "Pick a single option from a list.", icon: RiRadioButtonLine },
      { type: "slider", label: "Slider", desc: "Pick a value by sliding a handle.", icon: RiEqualizerLine },
      { type: "poll", label: "Poll", desc: "Let users vote on multiple options.", icon: RiBarChartHorizontalLine },
    ]
  },
  {
    category: "Media Fields",
    items: [
      { type: "file", label: "File Upload", desc: "Upload files with size and type limits.", icon: RiUploadCloudLine },
      { type: "signature", label: "Signature", desc: "Draw or sign with mouse or touch.", icon: RiQuillPenLine },
    ]
  },
  {
    category: "Layout Fields",
    items: [
      { type: "statement", label: "Statement", desc: "Display a heading or description.", icon: RiMessageLine },
      { type: "group", label: "Field Group", desc: "Group fields together in a row.", icon: RiLayoutRowLine },
      { type: "banner", label: "Banner", desc: "Show a highlighted message or warning.", icon: RiAlertLine },
    ]
  },
  {
    category: "Advanced Fields",
    items: [
      { type: "tags", label: "Tag Input", desc: "Enter and manage multiple tags.", icon: RiPriceTag3Line },
      { type: "scheduler", label: "Scheduler", desc: "Embed a scheduling link (e.g. Calendly).", icon: RiCalendarEventLine },
      { type: "social", label: "Social Media", desc: "Add social media profile links.", icon: RiShareLine },
    ]
  }
];

export default function FormBuilder() {
  const [fields, setFields] = useState<any[]>([])
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [title, setTitle] = useState("FORMHUBSDemo Form")
  const [description, setDescription] = useState("Try building a powerful form with our builder!")
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const [isSaving, setIsSaving] = useState(false)
  const [savedFormLink, setSavedFormLink] = useState("")

  const handleSaveForm = async () => {
    if (fields.length === 0) return alert("Please add at least one field before saving!");
    setIsSaving(true);
    try {
        const response = await fetch('/api/forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, fields, theme })
        });
        const data = await response.json();
        if (response.ok) {
            setSavedFormLink(`${window.location.origin}/f/${data.formId}`);
        } else {
            alert(data.error || "Failed to save form");
        }
    } catch (err) {
        alert("An error occurred while saving.");
    } finally {
        setIsSaving(false);
    }
  }

  const addField = (item: any) => {
    let options;
    if (['dropdown', 'checkbox', 'radio', 'poll'].includes(item.type)) {
       options = ['Option 1', 'Option 2', 'Option 3'];
    }
    const newField = {
      id: `field_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: item.type,
      label: item.label,
      description: item.desc,
      placeholder: "Enter value...",
      required: false,
      options,
      sliderMin: item.type === 'slider' ? 0 : undefined,
      sliderMax: item.type === 'slider' ? 100 : undefined,
      iconType: item.type 
    };
    setFields([...fields, newField]);
    setActiveFieldId(newField.id);
  }

  const removeField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFields(fields.filter(f => f.id !== id));
    if (activeFieldId === id) setActiveFieldId(null);
  }

  const updateActiveField = (key: string, value: any) => {
    if (!activeFieldId) return;
    setFields(fields.map(f => f.id === activeFieldId ? { ...f, [key]: value } : f));
  }

  const activeField = fields.find(f => f.id === activeFieldId);

  // Filter categories
  const filteredCategories = fieldCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(i => 
      i.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#0a0a0a] text-white flex flex-col selection:bg-[#ccff00] selection:text-black font-sans">
      {/* Top Navigation Bar */}
      <header className="h-[64px] border-b border-[#1e1e21] flex items-center justify-between px-4 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 bg-[#18181b] hover:bg-[#27272a] text-white px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors">
            <RiArrowLeftLine className="w-[16px] h-[16px]" />
            Go to Dashboard
          </Link>
          <div className="text-[14px] text-[#71717a] font-medium hidden sm:block">{fields.length} fields</div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="ghost" className="h-9 px-3 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] text-[13.5px] gap-1.5 rounded-md hidden md:flex">
            <RiBarChartBoxLine className="w-[16px] h-[16px]" /> Analytics
          </Button>
          <Button variant="ghost" className="h-9 px-3 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] text-[13.5px] gap-1.5 rounded-md hidden md:flex">
            <RiSettings4Line className="w-[16px] h-[16px]" /> Settings
          </Button>
          <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" className="h-9 px-3 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-md hidden md:flex">
            {theme === 'dark' ? <RiSunLine className="w-[16px] h-[16px]" /> : <RiMoonLine className="w-[16px] h-[16px]" />}
          </Button>
          <div className="w-[1px] h-4 bg-[#27272a] mx-1 hidden md:block"></div>
          <Button variant="outline" className="h-9 px-3 bg-[#0a0a0a] border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-md shadow-sm">
            <RiEyeLine className="w-[16px] h-[16px]" />
          </Button>
          <Button onClick={handleSaveForm} disabled={isSaving} className="h-9 px-4 bg-[#ccff00] text-black hover:bg-[#bdeb02] rounded-md font-semibold text-[13.5px] gap-1.5 shadow-sm">
            <RiSave3Line className="w-[16px] h-[16px]" /> {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Components */}
        <aside className="w-[280px] border-r border-[#1e1e21] flex flex-col bg-[#050505] shrink-0 custom-scrollbar">
          <div className="p-4 border-b border-[#1e1e21] shrink-0">
            <h2 className="text-[15px] font-semibold text-white mb-1">Form Fields</h2>
            <p className="text-[13px] text-[#71717a]">Click to add fields to your form</p>
          </div>
          <div className="p-4 border-b border-[#1e1e21] shrink-0">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#71717a]" />
              <Input 
                placeholder="Search fields..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-[#111113] border-[#27272a] rounded-md pl-9 text-[13px] text-white placeholder:text-[#52525b] focus-visible:ring-1 focus-visible:ring-[#ccff00]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {filteredCategories.map((category, idx) => (
              <div key={idx}>
                <div className="text-[11px] font-bold text-[#52525b] uppercase tracking-widest mb-3">{category.category}</div>
                <div className="space-y-2.5">
                  {category.items.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => addField(item)}
                      className="group flex gap-3 p-3 rounded-lg border border-[#27272a] bg-[#111113] hover:border-[#ccff00]/50 hover:bg-[#18181b] cursor-pointer transition-colors relative"
                    >
                      <div className="w-[32px] h-[32px] shrink-0 bg-[#0a0a0a] border border-[#27272a] rounded flex items-center justify-center text-[#a1a1aa] group-hover:text-[#ccff00] transition-colors">
                        <item.icon className="w-[16px] h-[16px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13.5px] font-medium text-white mb-0.5">{item.label}</span>
                        <span className="text-[12px] text-[#71717a] leading-tight">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
               <div className="text-center text-[13px] text-[#71717a] py-6">No fields found matching "{searchQuery}"</div>
            )}
          </div>
        </aside>

        {/* Center Canvas */}
        <section className={`flex-1 overflow-y-auto w-full relative transition-colors ${theme === 'light' ? 'bg-[#f4f4f5]' : 'bg-[#0a0a0a]'}`}>
          <div className="max-w-[700px] mx-auto py-12 px-6">
            <div className="mb-10 group">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="FORMHUBSDemo Form" 
                className={`w-full bg-transparent text-[36px] font-bold mb-2 placeholder:text-[#52525b] border-none outline-none focus:ring-0 p-0 ${theme === 'light' ? 'text-black' : 'text-white'}`}
              />
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Try building a powerful form with our builder!" 
                className={`w-full bg-transparent text-[15px] border-none outline-none focus:ring-0 p-0 ${theme === 'light' ? 'text-[#52525b] placeholder:text-[#a1a1aa]' : 'text-[#a1a1aa] placeholder:text-[#3f3f46]'}`}
              />
            </div>

            <div className="space-y-4">
              {fields.length === 0 ? (
                <div className="w-full p-12 border border-dashed border-[#27272a] bg-[#050505] rounded-xl flex flex-col items-center justify-center text-[#71717a]">
                   <RiAddLine className="w-[32px] h-[32px] mb-3 text-[#52525b]" />
                   <p className="text-[14.5px] font-medium mb-1">Your form is empty</p>
                   <p className="text-[13px]">Click any field on the left sidebar to add it here.</p>
                </div>
              ) : (
                fields.map((field) => (
                  <div 
                    key={field.id}
                    onClick={() => setActiveFieldId(field.id)}
                    className={`relative rounded-xl border-[1.5px] p-5 cursor-pointer transition-shadow group ${
                      theme === 'light' ? 'bg-white shadow-sm hover:border-gray-300' : 'bg-[#111113] hover:border-[#3f3f46]'
                    } ${
                      activeFieldId === field.id 
                        ? 'border-[#ccff00] shadow-[0_0_0_4px_rgba(204,255,0,0.1)]' 
                        : (theme === 'light' ? 'border-gray-200' : 'border-[#27272a]')
                    }`}
                  >
                    <div className={`absolute right-3 top-3 transition-opacity flex items-center gap-1 ${activeFieldId === field.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <button className="w-8 h-8 flex items-center justify-center rounded text-[#71717a] hover:bg-[#27272a] hover:text-white transition-colors cursor-grab">
                        <RiDragMove2Fill className="w-[16px] h-[16px]" />
                      </button>
                      <button 
                        onClick={(e) => removeField(field.id, e)}
                        className="w-8 h-8 flex items-center justify-center rounded text-[#71717a] hover:bg-red-500/20 hover:text-red-500 transition-colors"
                      >
                        <RiDeleteBinLine className="w-[16px] h-[16px]" />
                      </button>
                    </div>

                    <label className={`block text-[14.5px] font-medium mb-2 pointer-events-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                      {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {/* Render visual mock of the input field based on type */}
                    {['text', 'email', 'phone', 'url', 'number', 'time', 'date', 'address'].includes(field.type) && (
                      <div className={`w-full h-11 border rounded-md px-3 flex items-center text-[14px] pointer-events-none ${theme === 'light' ? 'bg-[#fafafa] border-gray-200 text-gray-500' : 'bg-[#050505] border-[#27272a] text-[#71717a]'}`}>
                        {field.placeholder || "Enter value..."}
                      </div>
                    )}
                    {field.type === 'textarea' && (
                      <div className={`w-full h-24 border rounded-md p-3 text-[14px] pointer-events-none ${theme === 'light' ? 'bg-[#fafafa] border-gray-200 text-gray-500' : 'bg-[#050505] border-[#27272a] text-[#71717a]'}`}>
                        {field.placeholder || "Enter text..."}
                      </div>
                    )}
                    {['dropdown', 'poll'].includes(field.type) && (
                      <div className={`w-full h-11 border rounded-md px-3 flex items-center justify-between text-[14px] pointer-events-none ${theme === 'light' ? 'bg-[#fafafa] border-gray-200 text-gray-500' : 'bg-[#050505] border-[#27272a] text-[#71717a]'}`}>
                        {(field.options && field.options.length > 0) ? field.options[0] : "Select an option..."} <RiArrowLeftLine className="w-4 h-4 -rotate-90" />
                      </div>
                    )}
                    {field.type === 'checkbox' && (
                      <div className="flex flex-col gap-2 mt-2 pointer-events-none">
                         {(field.options || []).map((opt: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`w-4 h-4 border rounded shrink-0 ${theme === 'light' ? 'bg-[#fafafa] border-gray-300' : 'border-[#52525b]'}`}></div>
                              <span className={`text-[13.5px] ${theme === 'light' ? 'text-gray-600' : 'text-[#a1a1aa]'}`}>{opt}</span>
                            </div>
                         ))}
                      </div>
                    )}
                    {field.type === 'radio' && (
                      <div className="flex flex-col gap-2 mt-2 pointer-events-none">
                         {(field.options || []).map((opt: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`w-4 h-4 border rounded-full shrink-0 ${theme === 'light' ? 'bg-[#fafafa] border-gray-300' : 'border-[#52525b]'}`}></div>
                              <span className={`text-[13.5px] ${theme === 'light' ? 'text-gray-600' : 'text-[#a1a1aa]'}`}>{opt}</span>
                            </div>
                         ))}
                      </div>
                    )}
                    {field.type === 'slider' && (
                      <div className="w-full mt-4 flex items-center justify-between gap-4 pointer-events-none">
                         <span className="text-[12px] text-gray-500 font-medium">{field.sliderMin || 0}</span>
                         <div className={`flex-1 h-2 rounded-full relative flex items-center justify-center ${theme === 'light' ? 'bg-gray-200' : 'bg-[#27272a]'}`}>
                            <div className={`w-4 h-4 bg-[#ccff00] rounded-full shadow border-2 absolute ${theme === 'light' ? 'border-white' : 'border-black'}`}></div>
                         </div>
                         <span className="text-[12px] text-gray-500 font-medium">{field.sliderMax || 100}</span>
                      </div>
                    )}
                    {field.type === 'rating' && (
                       <div className="flex items-center gap-1.5 mt-2 mb-1 pointer-events-none">
                          {[1,2,3,4,5].map(i => <RiStarLine key={i} className="w-[22px] h-[22px] text-yellow-400" />)}
                       </div>
                    )}
                    {['file', 'signature'].includes(field.type) && (
                      <div className={`w-full p-6 border border-dashed rounded-lg text-center pointer-events-none mt-2 ${theme === 'light' ? 'bg-[#fafafa] border-gray-300' : 'bg-[#050505] border-[#27272a]'}`}>
                        <span className={`text-[13px] ${theme === 'light' ? 'text-gray-500' : 'text-[#71717a]'}`}>{field.type === 'file' ? 'Click to upload files' : 'Click to sign here'}</span>
                      </div>
                    )}
                    {['statement', 'banner'].includes(field.type) && (
                       <div className="p-4 bg-[rgba(204,255,0,0.05)] border border-[rgba(204,255,0,0.2)] rounded-md text-[14px] text-[#ccff00]">
                         This is a displayed text {field.type}. No user input requested.
                       </div>
                    )}
                    {['tags', 'social', 'group', 'scheduler'].includes(field.type) && (
                      <div className={`w-full h-11 border rounded-md px-3 flex items-center text-[14px] pointer-events-none ${theme === 'light' ? 'bg-[#fafafa] border-gray-200 text-gray-500' : 'bg-[#050505] border-[#27272a] text-[#71717a]'}`}>
                        Complex Widget Area: {field.type}
                      </div>
                    )}
                    
                    {field.description && (
                      <p className="text-[12.5px] text-[#52525b] mt-2 pointer-events-none">{field.description}</p>
                    )}
                  </div>
                ))
              )}

              {/* Add Field Dummy Area below form */}
              {fields.length > 0 && (
                <div className="text-center pt-8 pb-12">
                   <p className="text-[13px] text-[#71717a]">Select fields from the left to extend your form.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Sidebar: Settings */}
        <aside className="w-[320px] border-l border-[#1e1e21] flex flex-col bg-[#050505] shrink-0">
          <div className="h-[60px] px-5 border-b border-[#1e1e21] flex items-center justify-between shrink-0">
            <h2 className="text-[15px] font-semibold text-white">Field Settings</h2>
            {activeFieldId && (
              <button onClick={() => setActiveFieldId(null)} className="text-[#71717a] hover:text-white transition-colors">
                <RiCloseLine className="w-[20px] h-[20px]" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {!activeField ? (
               <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[#71717a]">
                  <RiSettings4Line className="w-8 h-8 mb-3 opacity-30" />
                  <p className="text-[13.5px]">Select a field in the canvas to edit its properties.</p>
               </div>
            ) : (
               <div className="p-5 space-y-6">
                 {/* Basic Settings */}
                 <div className="space-y-4">
                   <h3 className="text-[14px] font-semibold text-white border-b border-[#1e1e21] pb-2">Basic Settings</h3>
                   
                   <div className="space-y-2">
                     <label className="text-[13px] font-medium text-[#a1a1aa]">Field Label</label>
                     <Input 
                       value={activeField.label}
                       onChange={(e) => updateActiveField("label", e.target.value)}
                       placeholder="Enter field label"
                       className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                     />
                     <p className="text-[11.5px] text-[#71717a]">The label that appears above the field</p>
                   </div>

                   {!['statement', 'banner', 'radio', 'checkbox', 'slider', 'poll', 'file', 'signature'].includes(activeField.type) && (
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Placeholder</label>
                      <Input 
                        value={activeField.placeholder || ""}
                        onChange={(e) => updateActiveField("placeholder", e.target.value)}
                        placeholder={activeField.type === 'email' ? "Enter email address" : "Enter placeholder"}
                        className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                      />
                      <p className="text-[11.5px] text-[#71717a]">Hint text that appears inside the field</p>
                    </div>
                   )}

                   <div className="space-y-2">
                     <label className="text-[13px] font-medium text-[#a1a1aa]">Description</label>
                     <textarea 
                       value={activeField.description || ""}
                       onChange={(e) => updateActiveField("description", e.target.value)}
                       placeholder="Enter field description (shown below the field)"
                       className="w-full bg-[#111113] border border-[#27272a] rounded-md p-3 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00] min-h-[80px]"
                     />
                     <p className="text-[11.5px] text-[#71717a]">Additional help text shown below the field</p>
                   </div>

                   {!['statement', 'banner'].includes(activeField.type) && (
                     <div className="flex items-center justify-between cursor-pointer pt-2" onClick={() => updateActiveField("required", !activeField.required)}>
                       <div>
                          <label className="text-[13px] font-medium text-[#a1a1aa] cursor-pointer">Required field</label>
                          <p className="text-[11.5px] text-[#71717a] mt-0.5 pointer-events-none">Users must fill this field to submit the form</p>
                       </div>
                       <div className={`w-9 h-5 rounded-full relative transition-colors ${activeField.required ? 'bg-[#ccff00]' : 'bg-[#27272a]'}`}>
                         <div className={`w-4 h-4 bg-black rounded-full absolute top-0.5 transition-all ${activeField.required ? 'right-0.5' : 'left-0.5 bg-[#a1a1aa]'}`}></div>
                       </div>
                     </div>
                   )}
                 </div>

                 {/* Email Validation (Only for email type) */}
                 {activeField.type === 'email' && (
                  <div className="space-y-4 pt-4 border-t border-[#1e1e21]">
                    <h3 className="text-[14px] font-semibold text-white pb-2">Email Validation</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Auto-complete Domain</label>
                      <div className="flex gap-2">
                        <Input 
                          value={activeField.autoDomain || ""}
                          onChange={(e) => updateActiveField("autoDomain", e.target.value)}
                          placeholder="e.g., business.com"
                          className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                        />
                        <Button className="h-9 px-4 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-md text-[13px] shadow-none ring-0 border-0">Set</Button>
                      </div>
                      <p className="text-[11.5px] text-[#71717a]">Users can enter just their username and the domain will be auto-completed</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Allowed Domains</label>
                      <Input 
                        value={activeField.allowedDomains || ""}
                        onChange={(e) => updateActiveField("allowedDomains", e.target.value)}
                        placeholder="e.g., company.com"
                        className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                      />
                      <p className="text-[11.5px] text-[#71717a]">Only emails from these domains will be accepted</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Rejected Domains</label>
                      <Input 
                        value={activeField.rejectedDomains || ""}
                        onChange={(e) => updateActiveField("rejectedDomains", e.target.value)}
                        placeholder="e.g., temp-mail.org"
                        className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                      />
                      <p className="text-[11.5px] text-[#71717a]">Emails from these domains will be rejected (temporary email services are blocked by default)</p>
                    </div>

                     <div className="flex items-center justify-between cursor-pointer pt-2 gap-4" onClick={() => updateActiveField("onlyBusinessDomains", !activeField.onlyBusinessDomains)}>
                       <label className="text-[13px] font-medium text-[#a1a1aa] cursor-pointer">Only allow business domains (blocks Gmail, Yahoo, etc.)</label>
                       <div className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${activeField.onlyBusinessDomains ? 'bg-[#ccff00]' : 'bg-[#27272a]'}`}>
                         <div className={`w-4 h-4 bg-black rounded-full absolute top-0.5 transition-all ${activeField.onlyBusinessDomains ? 'right-0.5' : 'left-0.5 bg-[#a1a1aa]'}`}></div>
                       </div>
                     </div>
                     
                    <div className="space-y-2 pt-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Custom error message for email validation</label>
                      <Input 
                        value={activeField.customErrorMsg || ""}
                        onChange={(e) => updateActiveField("customErrorMsg", e.target.value)}
                        placeholder="Leave empty to use default messages"
                        className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                      />
                    </div>
                  </div>
                 )}

                 {/* Pre-population */}
                 {!['statement', 'banner'].includes(activeField.type) && (
                  <div className="space-y-4 pt-4 border-t border-[#1e1e21]">
                     <div className="flex items-center justify-between cursor-pointer" onClick={() => updateActiveField("prePopulate", !activeField.prePopulate)}>
                       <div>
                          <label className="text-[14px] font-semibold text-white cursor-pointer block mb-1">Pre-population</label>
                          <p className="text-[11.5px] text-[#71717a] pointer-events-none">Automatically fill this field with existing data</p>
                       </div>
                       <div className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${activeField.prePopulate ? 'bg-[#ccff00]' : 'bg-[#27272a]'}`}>
                         <div className={`w-4 h-4 bg-black rounded-full absolute top-0.5 transition-all ${activeField.prePopulate ? 'right-0.5' : 'left-0.5 bg-[#a1a1aa]'}`}></div>
                       </div>
                     </div>
                  </div>
                 )}

                 {/* General Validation */}
                 {['text', 'email', 'textarea', 'url', 'phone', 'number'].includes(activeField.type) && (
                  <div className="space-y-4 pt-4 border-t border-[#1e1e21]">
                    <h3 className="text-[14px] font-semibold text-white pb-2">Validation</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#a1a1aa]">Min characters</label>
                        <Input 
                          type="number"
                          value={activeField.minChars || ""}
                          onChange={(e) => updateActiveField("minChars", e.target.value)}
                          placeholder="0"
                          className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                        />
                        <p className="text-[11px] text-[#71717a] leading-tight">Minimum number of characters required</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#a1a1aa]">Max characters</label>
                        <Input 
                          type="number"
                          value={activeField.maxChars || ""}
                          onChange={(e) => updateActiveField("maxChars", e.target.value)}
                          placeholder="255"
                          className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                        />
                        <p className="text-[11px] text-[#71717a] leading-tight">Maximum number of characters allowed</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Regular expression</label>
                      <Input 
                        value={activeField.regexPattern || ""}
                        onChange={(e) => updateActiveField("regexPattern", e.target.value)}
                        placeholder="^abc.*$"
                        className="bg-[#111113] border-[#27272a] h-9 text-white font-mono text-[12.5px] focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                      />
                      <p className="text-[11.5px] text-[#71717a]">Regular expression pattern for validation</p>
                    </div>
                  </div>
                 )}

                 {/* Options Editor for Selection Fields */}
                 {['dropdown', 'checkbox', 'radio', 'poll'].includes(activeField.type) && (
                  <div className="space-y-4 pt-4 border-t border-[#1e1e21]">
                    <h3 className="text-[14px] font-semibold text-white pb-2">Options</h3>
                    <div className="space-y-2">
                       {(activeField.options || []).map((opt: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                             <Input 
                               value={opt}
                               onChange={(e) => {
                                  const newOptions = [...(activeField.options || [])];
                                  newOptions[idx] = e.target.value;
                                  updateActiveField("options", newOptions);
                               }}
                               placeholder={`Option ${idx + 1}`}
                               className="bg-[#111113] border-[#27272a] h-9 text-[13px] text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                             />
                             <button onClick={() => {
                                const newOptions = [...(activeField.options || [])];
                                newOptions.splice(idx, 1);
                                updateActiveField("options", newOptions);
                             }} className="p-2 shrink-0 text-[#71717a] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                                <RiCloseLine className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                       <Button onClick={() => updateActiveField("options", [...(activeField.options || []), `Option ${(activeField.options?.length || 0) + 1}`])} variant="outline" className="w-full mt-2 h-9 border-[#27272a] text-[#a1a1aa] hover:text-white bg-[#111113] hover:bg-[#18181b]">
                           <RiAddLine className="w-4 h-4 mr-1" /> Add Option
                       </Button>
                    </div>
                  </div>
                 )}

                 {/* Slider Logic */}
                 {activeField.type === 'slider' && (
                  <div className="space-y-4 pt-4 border-t border-[#1e1e21]">
                     <h3 className="text-[14px] font-semibold text-white pb-2">Slider Settings</h3>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[13px] font-medium text-[#a1a1aa]">Minimum Value</label>
                         <Input 
                           type="number"
                           value={activeField.sliderMin !== undefined ? activeField.sliderMin : 0}
                           onChange={(e) => updateActiveField("sliderMin", Number(e.target.value))}
                           className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[13px] font-medium text-[#a1a1aa]">Maximum Value</label>
                         <Input 
                           type="number"
                           value={activeField.sliderMax !== undefined ? activeField.sliderMax : 100}
                           onChange={(e) => updateActiveField("sliderMax", Number(e.target.value))}
                           className="bg-[#111113] border-[#27272a] h-9 text-white focus-visible:ring-1 focus-visible:ring-[#ccff00]"
                         />
                       </div>
                     </div>
                  </div>
                 )}

               </div>
            )}
          </div>
        </aside>

      </main>

      {/* Success Modal Overlay */}
      {savedFormLink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-[#27272a] rounded-xl p-6 shadow-2xl relative">
             <button onClick={() => setSavedFormLink("")} className="absolute right-4 top-4 text-[#71717a] hover:text-white">
                <RiCloseLine className="w-[20px] h-[20px]" />
             </button>
             <div className="w-12 h-12 bg-[#ccff00]/10 text-[#ccff00] rounded-full flex items-center justify-center mb-4">
                <RiSave3Line className="w-[24px] h-[24px]" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Form Published!</h2>
             <p className="text-[#a1a1aa] text-[14px] mb-6">Your form has been securely saved to the database. You can share this link with anyone to start collecting responses.</p>
             
             <div className="flex items-center gap-2 mb-6">
                <Input value={savedFormLink} readOnly className="bg-[#111113] border-[#27272a] text-white focus-visible:ring-1 focus-visible:ring-[#ccff00] h-11" />
                <Button onClick={() => navigator.clipboard.writeText(savedFormLink)} className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 h-11">
                   Copy
                </Button>
             </div>
             
             <Link href={savedFormLink} target="_blank">
                <Button className="w-full bg-[#ccff00] hover:bg-[#bdeb02] text-black font-bold text-[15px] h-12 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                   Preview Public Form
                </Button>
             </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #3f3f46;
        }
      `}</style>
    </div>
  )
}
