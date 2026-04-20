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
import { Reorder, AnimatePresence } from "framer-motion"
import FormTypeModal from "@/components/builder/FormTypeModal"
import ClientForm from "@/app/f/[id]/ClientForm"

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
  const [activeTab, setActiveTab] = useState<'fields' | 'canvas' | 'settings'>('canvas')
  const [searchQuery, setSearchQuery] = useState("")

  const [title, setTitle] = useState("FORMHUBS Demo Form")
  const [description, setDescription] = useState("Try building a powerful form with our builder!")
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const [isSaving, setIsSaving] = useState(false)
  const [savedFormLink, setSavedFormLink] = useState("")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(true)
  const [formType, setFormType] = useState<'single' | 'multi'>('single')

  // Step Management State
  const [steps, setSteps] = useState<any[]>([
    { id: 'step_1', label: 'Step 1: Introduction' }
  ])
  const [activeStepId, setActiveStepId] = useState<string>('step_1')

  const handleModalClose = (config: { type: 'single' | 'multi', title: string, description: string }) => {
    setFormType(config.type)
    setTitle(config.title || "Untitled Form")
    setDescription(config.description || "")
    setIsTypeModalOpen(false)
  }

  const addStep = () => {
    const newStep = {
      id: `step_${Date.now()}`,
      label: `Step ${steps.length + 1}: New Step`
    }
    setSteps([...steps, newStep])
    setActiveStepId(newStep.id)
  }

  const removeStep = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (steps.length === 1) return alert("Forms must have at least one step.")
    const newSteps = steps.filter(s => s.id !== id)
    setSteps(newSteps)
    setFields(fields.filter(f => f.stepId !== id))
    if (activeStepId === id) setActiveStepId(newSteps[0].id)
  }

  const handleSaveForm = async () => {
    if (fields.length === 0) return alert("Please add at least one field before saving!");
    setIsSaving(true);
    try {
        const response = await fetch('/api/forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, fields, theme, formType, steps })
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
      iconType: item.type,
      stepId: formType === 'multi' ? activeStepId : 'default'
    };
    setFields([...fields, newField]);
    setActiveFieldId(newField.id);
  }

  // Filter fields based on active step for multi-step
  const visibleFields = formType === 'multi' 
    ? fields.filter(f => f.stepId === activeStepId) 
    : fields;

  const removeField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFields(fields.filter(f => f.id !== id));
    if (activeFieldId === id) setActiveFieldId(null);
  }

  const updateActiveField = (key: string, value: any) => {
    if (!activeFieldId) return;
    setFields(fields.map(f => f.id === activeFieldId ? { ...f, [key]: value } : f));
  }

  const updateStepLabel = (id: string, label: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, label } : s))
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
    <div className={`h-[100dvh] w-full overflow-hidden flex flex-col selection:bg-[#ccff00] selection:text-black font-sans transition-colors duration-200 ${theme === 'light' ? 'bg-[#f4f4f5] text-black' : 'bg-[#0a0a0a] text-white'}`}>
      <FormTypeModal 
        isOpen={isTypeModalOpen} 
        onClose={handleModalClose} 
      />
      {/* Top Navigation Bar */}
      <header className={`h-[64px] border-b flex items-center justify-between px-4 shrink-0 z-50 transition-colors ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a0a] border-[#1e1e21]'}`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] sm:text-[13.5px] font-medium transition-colors ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-black' : 'bg-[#18181b] hover:bg-[#27272a] text-white'}`}>
            <RiArrowLeftLine className="w-[16px] h-[16px]" />
            <span className="hidden min-[420px]:inline">Back</span>
            <span className="hidden sm:inline">to Dashboard</span>
          </Link>
          <div className="text-[13px] sm:text-[14px] text-[#71717a] font-medium hidden min-[380px]:block">{fields.length} fields</div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Button variant="ghost" className={`h-9 px-2 sm:px-3 text-[13.5px] gap-1.5 rounded-md hidden md:flex ${theme === 'light' ? 'text-gray-600 hover:text-black hover:bg-gray-100' : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'}`}>
            <RiBarChartBoxLine className="w-[16px] h-[16px]" /> Analytics
          </Button>
          <Button variant="ghost" className={`h-9 px-2 sm:px-3 text-[13.5px] gap-1.5 rounded-md hidden lg:flex ${theme === 'light' ? 'text-gray-600 hover:text-black hover:bg-gray-100' : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'}`}>
            <RiSettings4Line className="w-[16px] h-[16px]" /> Settings
          </Button>
          <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" className={`h-9 px-2 sm:px-3 rounded-md hidden md:flex ${theme === 'light' ? 'text-gray-600 hover:text-black hover:bg-gray-100' : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'}`}>
            {theme === 'dark' ? <RiSunLine className="w-[16px] h-[16px]" /> : <RiMoonLine className="w-[16px] h-[16px]" />}
          </Button>
          <div className={`w-[1px] h-4 mx-1 hidden md:block ${theme === 'light' ? 'bg-gray-200' : 'bg-[#27272a]'}`}></div>
          <Button 
            onClick={() => setIsPreviewOpen(true)}
            variant="outline" 
            className={`h-9 w-9 sm:w-auto sm:px-3 rounded-md shadow-sm flex items-center justify-center p-0 sm:p-auto ${theme === 'light' ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black' : 'bg-[#0a0a0a] border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'}`}
          >
            <RiEyeLine className="w-[16px] h-[16px]" />
            <span className="hidden sm:ml-1.5 sm:inline">Preview</span>
          </Button>
          <Button onClick={handleSaveForm} disabled={isSaving} className="h-9 px-3 sm:px-4 bg-[#ccff00] text-black hover:bg-[#bdeb02] rounded-md font-semibold text-[13px] sm:text-[13.5px] gap-1.5 shadow-sm">
            <RiSave3Line className="w-[16px] h-[16px]" /> <span>{isSaving ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Components */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] border-r flex flex-col shrink-0 custom-scrollbar transition-all duration-300 lg:relative lg:translate-x-0 ${activeTab === 'fields' ? 'translate-x-0' : '-translate-x-full'} ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#050505] border-[#1e1e21]'}`}>
          <div className={`p-4 border-b shrink-0 flex items-center justify-between ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
            <div>
              <h2 className={`text-[15px] font-semibold mb-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Form Fields</h2>
              <p className="text-[13px] text-[#71717a]">Click to add fields to your form</p>
            </div>
            <button onClick={() => setActiveTab('canvas')} className="lg:hidden text-[#71717a] hover:text-white p-1">
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>
          <div className={`p-4 border-b shrink-0 ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
            {formType === 'multi' && (
              <div className="mb-6">
                <div className="text-[11px] font-bold text-[#52525b] uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Step Management</span>
                  <button onClick={addStep} className="text-[#ccff00] hover:underline text-[10px] flex items-center gap-1">
                    <RiAddLine className="w-3 h-3" /> Add Step
                  </button>
                </div>
                <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-2">
                  <AnimatePresence initial={false}>
                    {steps.map((step) => {
                      const stepFields = fields.filter(f => f.stepId === step.id);
                      return (
                        <Reorder.Item 
                          key={step.id} 
                          value={step}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => setActiveStepId(step.id)}
                          className={`group p-2 rounded-lg border cursor-pointer transition-all ${
                            activeStepId === step.id 
                              ? (theme === 'light' ? 'bg-[#ccff00]/10 border-[#ccff00] shadow-sm' : 'bg-[#ccff00]/5 border-[#ccff00]/40 shadow-sm')
                              : (theme === 'light' ? 'bg-white border-gray-200 hover:border-gray-300' : 'bg-[#111113] border-[#27272a] hover:border-[#3f3f46]')
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <RiDragMove2Fill className="w-3.5 h-3.5 text-gray-500 cursor-grab" />
                                <input 
                                  value={step.label}
                                  onChange={(e) => updateStepLabel(step.id, e.target.value)}
                                  className="bg-transparent border-none outline-none text-[12px] font-bold text-white w-full p-0 focus:ring-0"
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-black/40 text-gray-400">
                                  {stepFields.length}
                                </span>
                                {steps.length > 1 && (
                                  <button 
                                    onClick={(e) => removeStep(step.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                                  >
                                    <RiDeleteBinLine className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Nested Fields List */}
                            {activeStepId === step.id && stepFields.length > 0 && (
                              <div className="pl-5 space-y-1 mt-1 border-l border-white/5 mx-1">
                                {stepFields.map((field) => (
                                  <div 
                                    key={field.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveFieldId(field.id);
                                    }}
                                    className={`flex items-center gap-2 p-1.5 rounded-md text-[11px] transition-colors ${
                                      activeFieldId === field.id 
                                        ? 'bg-[#ccff00]/20 text-[#ccff00] font-bold' 
                                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                                    <span className="truncate">{field.label || "Untitled Field"}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Reorder.Item>
                      )
                    })}
                  </AnimatePresence>
                </Reorder.Group>
              </div>
            )}
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#71717a]" />
              <Input 
                placeholder="Search fields..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-9 rounded-md pl-9 text-[13px] placeholder:text-[#52525b] focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
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
                      className={`group flex gap-3 p-3 rounded-lg border cursor-pointer transition-colors relative ${theme === 'light' ? 'bg-white border-gray-200 hover:border-[#ccff00] hover:bg-gray-50' : 'bg-[#111113] border-[#27272a] hover:border-[#ccff00]/50 hover:bg-[#18181b]'}`}
                    >
                      <div className={`w-[32px] h-[32px] shrink-0 border rounded flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-500 group-hover:text-[#ccff00]' : 'bg-[#0a0a0a] border-[#27272a] text-[#a1a1aa] group-hover:text-[#ccff00]'}`}>
                        <item.icon className="w-[16px] h-[16px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[13.5px] font-medium mb-0.5 ${theme === 'light' ? 'text-black' : 'text-white'}`}>{item.label}</span>
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
        <section className={`flex-1 overflow-y-auto w-full relative transition-colors pb-20 lg:pb-0 ${theme === 'light' ? 'bg-[#f4f4f5]' : 'bg-[#0a0a0a]'} ${activeTab !== 'canvas' ? 'hidden lg:block' : 'block'}`}>
          <div className="max-w-[700px] mx-auto py-8 sm:py-12 px-4 sm:px-6">
            <div className="mb-8 sm:mb-10 group">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${theme === 'light' ? 'bg-black text-white' : 'bg-[#ccff00] text-black'}`}>
                  {formType === 'single' ? 'Single Page' : 'Multi-Step Form'}
                </span>
              </div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="FORMHUBSDemo Form" 
                className={`w-full bg-transparent text-[28px] sm:text-[36px] font-bold mb-2 placeholder:text-[#52525b] border-none outline-none focus:ring-0 p-0 ${theme === 'light' ? 'text-black' : 'text-white'}`}
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
              {visibleFields.length === 0 ? (
                <div className={`w-full p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-[#71717a] ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-[#050505] border-[#27272a]'}`}>
                   <RiAddLine className="w-[32px] h-[32px] mb-3 text-[#52525b]" />
                   <p className={`text-[14.5px] font-medium mb-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}>This step is empty</p>
                   <p className="text-[13px]">Add some fields to this step from the left sidebar.</p>
                </div>
              ) : (
                visibleFields.map((field) => (
                  <div 
                    key={field.id}
                    onClick={() => {
                      setActiveFieldId(field.id);
                      if (window.innerWidth < 1024) setActiveTab('settings');
                    }}
                    className={`relative rounded-xl border-[1.5px] p-4 sm:p-5 cursor-pointer transition-shadow group ${
                      theme === 'light' ? 'bg-white shadow-sm hover:border-gray-300' : 'bg-[#111113] hover:border-[#3f3f46]'
                    } ${
                      activeFieldId === field.id 
                        ? 'border-[#ccff00] shadow-[0_0_0_4px_rgba(204,255,0,0.15)]' 
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
        <aside className={`fixed inset-y-0 right-0 z-40 w-full sm:w-[320px] border-l flex flex-col shrink-0 transition-all duration-300 lg:relative lg:translate-x-0 ${activeTab === 'settings' ? 'translate-x-0' : 'translate-x-full'} ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#050505] border-[#1e1e21]'}`}>
          <div className={`h-[60px] px-5 border-b flex items-center justify-between shrink-0 ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
            <h2 className={`text-[15px] font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>Field Settings</h2>
            <div className="flex items-center gap-1">
              {activeFieldId && (
                <button onClick={() => setActiveFieldId(null)} className="text-[#71717a] hover:text-white p-1 transition-colors">
                  <RiCloseLine className="w-[18px] h-[18px]" />
                </button>
              )}
              <button onClick={() => setActiveTab('canvas')} className="lg:hidden text-[#71717a] hover:text-white p-1">
                <RiCloseLine className="w-5 h-5 ml-1" />
              </button>
            </div>
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
                   <h3 className={`text-[14px] font-semibold border-b pb-2 ${theme === 'light' ? 'text-black border-gray-100' : 'text-white border-[#1e1e21]'}`}>Basic Settings</h3>
                   
                   <div className="space-y-2">
                     <label className="text-[13px] font-medium text-[#a1a1aa]">Field Label</label>
                     <Input 
                       value={activeField.label}
                       onChange={(e) => updateActiveField("label", e.target.value)}
                       placeholder="Enter field label"
                       className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
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
                        className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
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
                       className={`w-full rounded-md p-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#ccff00] min-h-[80px] ${theme === 'light' ? 'bg-gray-50 border border-gray-200 text-black' : 'bg-[#111113] border border-[#27272a] text-white'}`}
                     />
                     <p className="text-[11.5px] text-[#71717a]">Additional help text shown below the field</p>
                   </div>

                   {!['statement', 'banner'].includes(activeField.type) && (
                     <div className="flex items-center justify-between cursor-pointer pt-2" onClick={() => updateActiveField("required", !activeField.required)}>
                       <div>
                          <label className={`text-[13px] font-medium cursor-pointer ${theme === 'light' ? 'text-black' : 'text-[#a1a1aa]'}`}>Required field</label>
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
                  <div className={`space-y-4 pt-4 border-t ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
                    <h3 className={`text-[14px] font-semibold pb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Email Validation</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Auto-complete Domain</label>
                      <div className="flex gap-2">
                        <Input 
                          value={activeField.autoDomain || ""}
                          onChange={(e) => updateActiveField("autoDomain", e.target.value)}
                          placeholder="e.g., business.com"
                          className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
                        />
                        <Button className={`h-9 px-4 rounded-md text-[13px] shadow-none ring-0 border-0 transition-colors ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-black' : 'bg-[#27272a] hover:bg-[#3f3f46] text-white'}`}>Set</Button>
                      </div>
                      <p className="text-[11.5px] text-[#71717a]">Users can enter just their username and the domain will be auto-completed</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Allowed Domains</label>
                      <Input 
                        value={activeField.allowedDomains || ""}
                        onChange={(e) => updateActiveField("allowedDomains", e.target.value)}
                        placeholder="e.g., company.com"
                        className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
                      />
                      <p className="text-[11.5px] text-[#71717a]">Only emails from these domains will be accepted</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#a1a1aa]">Rejected Domains</label>
                      <Input 
                        value={activeField.rejectedDomains || ""}
                        onChange={(e) => updateActiveField("rejectedDomains", e.target.value)}
                        placeholder="e.g., temp-mail.org"
                        className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
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
                        className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
                      />
                    </div>
                  </div>
                 )}

                 {/* Pre-population */}
                  {!['statement', 'banner'].includes(activeField.type) && (
                  <div className={`space-y-4 pt-4 border-t ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
                     <div className="flex items-center justify-between cursor-pointer" onClick={() => updateActiveField("prePopulate", !activeField.prePopulate)}>
                       <div>
                          <label className={`text-[14px] font-semibold cursor-pointer block mb-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Pre-population</label>
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
                  <div className={`space-y-4 pt-4 border-t ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
                    <h3 className={`text-[14px] font-semibold pb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Validation</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#a1a1aa]">Min characters</label>
                        <Input 
                          type="number"
                          value={activeField.minChars || ""}
                          onChange={(e) => updateActiveField("minChars", e.target.value)}
                          placeholder="0"
                          className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
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
                          className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
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
                        className={`h-9 font-mono text-[12.5px] focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
                      />
                      <p className="text-[11.5px] text-[#71717a]">Regular expression pattern for validation</p>
                    </div>
                  </div>
                 )}

                  {/* Options Editor for Selection Fields */}
                  {['dropdown', 'checkbox', 'radio', 'poll'].includes(activeField.type) && (
                  <div className={`space-y-4 pt-4 border-t ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
                    <h3 className={`text-[14px] font-semibold pb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Options</h3>
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
                               className={`h-9 text-[13px] focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
                             />
                             <button onClick={() => {
                                const newOptions = [...(activeField.options || [])];
                                newOptions.splice(idx, 1);
                                updateActiveField("options", newOptions);
                             }} className={`p-2 shrink-0 rounded-md transition-colors ${theme === 'light' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-[#71717a] hover:text-red-500 hover:bg-red-500/10'}`}>
                                <RiCloseLine className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                       <Button onClick={() => updateActiveField("options", [...(activeField.options || []), `Option ${(activeField.options?.length || 0) + 1}`])} variant="outline" className={`w-full mt-2 h-9 transition-colors ${theme === 'light' ? 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-black' : 'border-[#27272a] text-[#a1a1aa] hover:text-white bg-[#111113] hover:bg-[#18181b]'}`}>
                           <RiAddLine className="w-4 h-4 mr-1" /> Add Option
                       </Button>
                    </div>
                  </div>
                 )}

                 {/* Slider Logic */}
                 {activeField.type === 'slider' && (
                  <div className={`space-y-4 pt-4 border-t ${theme === 'light' ? 'border-gray-100' : 'border-[#1e1e21]'}`}>
                     <h3 className={`text-[14px] font-semibold pb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Slider Settings</h3>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[13px] font-medium text-[#a1a1aa]">Minimum Value</label>
                         <Input 
                           type="number"
                           value={activeField.sliderMin !== undefined ? activeField.sliderMin : 0}
                           onChange={(e) => updateActiveField("sliderMin", Number(e.target.value))}
                           className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[13px] font-medium text-[#a1a1aa]">Maximum Value</label>
                         <Input 
                           type="number"
                           value={activeField.sliderMax !== undefined ? activeField.sliderMax : 100}
                           onChange={(e) => updateActiveField("sliderMax", Number(e.target.value))}
                           className={`h-9 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`}
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

      {/* Mobile Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 h-16 backdrop-blur-md border-t flex items-center justify-around px-4 lg:hidden z-30 transition-colors ${theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-[#0a0a0a]/80 border-[#1e1e21]'}`}>
        <button 
          onClick={() => setActiveTab('fields')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'fields' ? 'text-[#ccff00]' : 'text-[#71717a]'}`}
        >
          <RiAddLine className="w-6 h-6" />
          <span className="text-[11px] font-medium">Fields</span>
        </button>
        <button 
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'canvas' ? 'text-[#ccff00]' : 'text-[#71717a]'}`}
        >
          <RiLayoutRowLine className="w-6 h-6" />
          <span className="text-[11px] font-medium">Editor</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-[#ccff00]' : 'text-[#71717a]'}`}
        >
          <RiSettings4Line className="w-6 h-6" />
          <span className="text-[11px] font-medium">Config</span>
        </button>
      </nav>

      {/* Success Modal Overlay */}
      {savedFormLink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-xl p-6 shadow-2xl relative transition-colors ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a0a] border-[#27272a]'}`}>
             <button onClick={() => setSavedFormLink("")} className="absolute right-4 top-4 text-[#71717a] hover:text-white transition-colors">
                <RiCloseLine className="w-[20px] h-[20px]" />
             </button>
             <div className="w-12 h-12 bg-[#ccff00]/10 text-[#ccff00] rounded-full flex items-center justify-center mb-4">
                <RiSave3Line className="w-[24px] h-[24px]" />
             </div>
             <h2 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Form Published!</h2>
             <p className="text-[#a1a1aa] text-[14px] mb-6">Your form has been securely saved to the database. You can share this link with anyone to start collecting responses.</p>
             
             <div className="flex items-center gap-2 mb-6">
                <Input value={savedFormLink} readOnly className={`h-11 focus-visible:ring-1 focus-visible:ring-[#ccff00] ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-[#111113] border-[#27272a] text-white'}`} />
                <Button onClick={() => navigator.clipboard.writeText(savedFormLink)} className={`px-4 h-11 transition-colors ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-black' : 'bg-[#27272a] hover:bg-[#3f3f46] text-white'}`}>
                   Copy
                </Button>
             </div>
             
             <Link href={savedFormLink} target="_blank" className="w-full block">
                <Button className="w-full bg-[#ccff00] hover:bg-[#bdeb02] text-black font-bold text-[15px] h-12 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                   Preview Public Form
                </Button>
             </Link>
          </div>
        </div>
      )}

      {/* Preview Modal Overlay */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex flex-col overflow-y-auto custom-scrollbar">
           <div className="h-[64px] border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-[110]">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[#ccff00] flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                    LIVE
                 </div>
                 <h2 className="text-white font-bold tracking-tight uppercase text-sm">Form Preview</h2>
              </div>
              <Button 
                onClick={() => setIsPreviewOpen(false)}
                variant="ghost" 
                className="h-10 px-4 text-white hover:bg-white/10 gap-2 font-bold uppercase text-xs tracking-widest"
              >
                <RiCloseLine className="w-4 h-4" /> Close Preview
              </Button>
           </div>
           
           <div className="flex-1 w-full flex items-center justify-center p-4 py-12">
              <div className="w-full max-w-[700px]">
                 <ClientForm 
                    form={{
                       title,
                       description,
                       fields,
                       theme,
                       formType,
                       steps
                    }}
                 />
              </div>
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
