"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

interface LandingContentProps {
  session: any;
  loginHref: string;
  startHref: string;
}

export default function LandingContent({ session, loginHref, startHref }: LandingContentProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.21, 1.11, 0.81, 0.99] // Now correctly typed via Variants
      } 
    },
  };

  const splitText = (text: string) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
        <motion.span
          variants={item}
          className="inline-block"
        >
          {word}
        </motion.span>
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ccff00] selection:text-black overflow-x-hidden relative">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      >
        <nav className="flex items-center justify-between mx-auto max-w-[1300px] h-[72px] px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="w-[32px] h-[32px] bg-transparent rounded-full flex items-center justify-center shrink-0"
            >
              <img src="/logo.png" alt="FormHubs Logo" className="w-full h-full object-contain" />
            </motion.div>
            <span className="font-bold text-[19px] tracking-tight text-[#0a0a0a]">FormHubs</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/features" className="hidden md:block text-[14px] font-semibold text-gray-500 hover:text-black transition-colors">Features</Link>
            <Link href="/docs" className="hidden md:block text-[14px] font-semibold text-gray-400 hover:text-black transition-colors">Docs</Link>
            <Link href={loginHref} className="text-[#111111] text-[14px] font-semibold px-3 sm:px-4 py-2 hover:text-[#ccff00] transition-colors relative group">
              {session ? "Dashboard" : "Login"}
              <span className="absolute bottom-1.5 left-3 right-3 h-[1px] bg-[#ccff00] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            {!session && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/signup" className="hidden sm:flex bg-[#0a0a0a] text-white text-[13.5px] font-bold px-[20px] py-[10px] rounded-full hover:bg-[#222] transition-all shadow-sm">
                  Sign Up Free
                </Link>
              </motion.div>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Hero */}
      <main className="flex flex-col items-center text-center mt-[80px] md:mt-[120px] px-6 relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center z-10"
        >
          <h1 className="text-[44px] md:text-[80px] leading-[1.05] md:leading-[1] tracking-[-0.05em] font-bold max-w-[1000px] text-[#0f0f0f] md:mt-10">
            {splitText("Forms That Do More")}
            <br className="hidden md:block"/>
            <span className="text-[#a1a1aa]">
              {"Than Just Collect.".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.05,
                    delay: 1.5 + (i * 0.05),
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="inline-block w-[3px] h-[0.8em] bg-[#ccff00] ml-1 align-middle"
              />
            </span>
          </h1>
          
          <motion.p 
            variants={item}
            className="mt-8 md:mt-[32px] text-[18px] md:text-[22px] leading-[1.6] text-[#636366] max-w-[780px] font-medium"
          >
            A developer-first platform to generate form UIs, capture data through unique endpoints, and process responses at scale.
          </motion.p>

          <motion.div 
            variants={item}
            className="mt-12 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto px-6 sm:px-0"
          >
            <Link href={startHref} className="w-full sm:w-auto flex items-center justify-center bg-[#ccff00] text-[#0a0a0a] font-bold text-[16px] px-[36px] py-[18px] rounded-[16px] hover:bg-[#bdeb02] transition-all shadow-xl shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 hover:-translate-y-0.5 active:translate-y-0">
              {session ? "Go to Dashboard" : "Get Started Now"}
            </Link>
            <Link href="/docs">
            <button className="w-full sm:w-auto bg-[#f4f4f5] text-[#0a0a0a] font-bold text-[16px] px-[36px] py-[18px] rounded-[16px] hover:bg-[#e4e4e7] transition-all hover:-translate-y-0.5 active:translate-y-0">
              Documentation
            </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-[1000px] h-[400px]"
        >
            <div className="absolute top-0 left-1/4 w-[50%] h-[100%] bg-gradient-to-b from-[#ccff00]/10 to-transparent blur-[120px] rounded-full opacity-50" />
        </motion.div>
      </main>

      {/* Bento Grid Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-40 mb-16 text-center px-6"
      >
        <span className="text-[12px] font-bold text-[#ccff00] uppercase tracking-[0.2em]">Platform Features</span>
        <h2 className="text-[32px] md:text-[48px] font-bold mt-4 tracking-tight">Built for modern workflows.</h2>
      </motion.div>

      {/* Bento Grid */}
      <section className="px-6 max-w-[1300px] mx-auto pb-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px]">
          
          {/* Truly Unlimited */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-4 md:row-span-1 bg-[#f9f9fb] border border-gray-100 rounded-[32px] p-8 flex flex-col overflow-hidden relative"
          >
             <span className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-tight">Unlimited everything</span>
             <h3 className="text-[18px] font-bold mb-4 leading-tight">Truly unlimited forms and responses.</h3>
             <div className="mt-auto flex justify-center pb-4">
                <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ccff00]/20 stroke-[#ccff00] stroke-[1.5px]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 12c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm10-3c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm-7-2c-2.761 0-5 2.239-5 5s2.239 5 5 5c1.11 0 2.126-.363 2.943-.974l.974.974 1.414-1.414-.974-.974c.611-.817.974-1.833.974-2.943 0-2.761-2.239-5-5-5zm7 0c-2.761 0-5 2.239-5 5 0 1.11.363 2.126.974 2.943l-.974.974 1.414 1.414.974-.974c.817.611 1.833.974 2.943.974 2.761 0 5-2.239 5-5s-2.239-5-5-5z" />
                </svg>
             </div>
          </motion.div>

          {/* AI Analytics */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 md:row-span-1 bg-[#f9f9fb] border border-gray-100 rounded-[32px] p-8 flex flex-col overflow-hidden relative"
          >
             <span className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-tight">AI Analytics</span>
             <h3 className="text-[18px] font-bold mb-4 leading-tight">Clear, actionable <span className="text-[#ccff00] underline underline-offset-4 decoration-2">insights.</span></h3>
             <div className="mt-auto h-[100px] flex items-end gap-1 px-4">
                {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
                    <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + (i * 0.05), duration: 0.8 }}
                        className="flex-1 bg-white border border-gray-100 rounded-t-sm"
                    />
                ))}
             </div>
          </motion.div>

          {/* Signatures */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 bg-[#f9f9fb] border border-gray-100 rounded-[32px] p-8 flex flex-col overflow-hidden relative"
          >
             <span className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-tight">Form Signatures</span>
             <h3 className="text-[18px] font-bold leading-tight">Collect <span className="text-[#ccff00]">e-signatures</span> in any form.</h3>
             <div className="mt-auto border-t border-dashed border-gray-200 pt-8 flex items-center justify-center">
                <div className="w-full max-w-[160px] h-[60px] relative">
                    <svg viewBox="0 0 160 60" className="w-full h-full fill-none stroke-black stroke-2 overflow-visible">
                        <motion.path 
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ delay: 1, duration: 2 }}
                            d="M10,40 C30,45 50,20 70,35 C90,50 110,15 130,30 C150,45 155,40 155,40" 
                        />
                    </svg>
                    <div className="absolute bottom-0 left-0 text-[8px] text-gray-400 uppercase font-mono">Sign here</div>
                </div>
             </div>
          </motion.div>

          {/* Smart Notifications */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-7 md:row-span-1 bg-[#f9f9fb] border border-gray-100 rounded-[32px] p-8 flex flex-col overflow-hidden relative group"
          >
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-400 group-hover:fill-[#ccff00] transition-colors" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                </div>
                <span className="text-[13px] font-bold text-gray-400">Smart Notifications</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 h-full items-start">
              <div className="flex-1">
                <h3 className="text-[20px] font-bold mb-2">Never miss a lead—<span className="text-gray-400">get instant alerts.</span></h3>
                <p className="text-[13px] text-gray-500">Forward data to Discord, Slack, or Email instantly.</p>
              </div>

              {/* Email Animation */}
              <div className="relative w-full md:w-[240px] h-[110px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                  className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-2"
                >
                  <div className="w-6 h-6 bg-[#ccff00] rounded-full flex items-center justify-center text-[10px] font-bold">E</div>
                  <div className="flex-1 truncate text-[10px] font-bold">New Form Lead</div>
                </motion.div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-gray-50 rounded" />
                  <div className="h-1.5 w-2/3 bg-gray-50 rounded" />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1, repeatDelay: 1 }}
                    className="h-1.5 w-1/3 bg-[#ccff00]/40 rounded mt-1" 
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Typewriting Code Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-12 lg:col-span-5 md:row-span-1 bg-[#0a0a0a] border border-gray-800 rounded-[32px] p-8 flex flex-col overflow-hidden relative min-h-[300px]"
          >
             <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  {['Javascript', 'cURL', 'Python'].map((tab, i) => (
                    <motion.span 
                      key={tab}
                      initial={false}
                      className={`text-[11px] font-bold cursor-pointer transition-colors ${i === 0 ? 'text-[#ccff00]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {tab}
                    </motion.span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400/40" />
                  <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400/40" />
                </div>
             </div>

             <div className="relative flex-1 font-mono text-[10px] leading-[1.6]">
               {/* Javascript Snippet (Main) */}
               <div className="flex flex-col">
                  {[
                    { text: "const submitForm = async (e) => {", color: "text-purple-400" },
                    { text: "  e.preventDefault();", color: "text-blue-400" },
                    { text: "  const formData = new FormData(e.target);", color: "text-blue-400" },
                    { text: "  const payload = Object.fromEntries(formData);", color: "text-blue-400" },
                    { text: " ", color: "text-white" },
                    { text: '  await fetch("https://api/capture/...", {', color: "text-purple-400" },
                    { text: '      method: "POST",', color: "text-gray-400" },
                    { text: '      body: JSON.stringify(payload)', color: "text-gray-400" },
                    { text: "  });", color: "text-purple-400" },
                    { text: "};", color: "text-purple-400" }
                  ].map((line, lid) => (
                    <div key={lid} className="flex h-[16px] items-center">
                      <span className="text-gray-700 mr-3 w-4 text-right text-[8px] select-none">{lid + 1}</span>
                      <motion.span 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.5 + lid * 0.1, 
                          ease: "linear",
                          repeat: Infinity,
                          repeatType: "reverse",
                          repeatDelay: 4 
                        }}
                        className={`${line.color} whitespace-nowrap overflow-hidden inline-block border-r-2 border-[#ccff00]/0 animate-pulse`}
                      >
                        {line.text}
                      </motion.span>
                    </div>
                  ))}
               </div>

               {/* Background Floating Code Bits */}
               <motion.div 
                 animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.1, 0.2, 0.1]
                 }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute bottom-0 right-0 text-[40px] font-bold text-[#ccff00]/5 pointer-events-none select-none"
               >
                 JS
               </motion.div>
             </div>

             <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                  <code className="text-[9px] text-gray-500 uppercase tracking-widest">Live Capture Active</code>
                </div>
                <button className="text-[10px] text-gray-400 hover:text-[#ccff00] transition-colors flex items-center gap-1">
                  <span>Copy Snippet</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
             </div>
          </motion.div>

          {/* Visual Logic - Wide Bottom Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-12 md:row-span-1 bg-[#f9f9fb] border border-gray-100 rounded-[32px] p-8 flex flex-col overflow-hidden relative"
          >
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="max-w-[400px]">
                    <span className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-tight">Visual Logic Editor</span>
                    <h3 className="text-[22px] font-bold leading-tight">Personalize every journey—<span className="text-gray-400">show or hide questions based on answers.</span></h3>
                </div>
                <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[12px] font-bold">User Response</div>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-200" xmlns="http://www.w3.org/2000/svg"><path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z"/></svg>
                    <div className="px-4 py-2 rounded-xl bg-[#ccff00] text-[12px] font-bold">Next Question</div>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-200" xmlns="http://www.w3.org/2000/svg"><path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z"/></svg>
                    <div className="px-4 py-2 rounded-xl bg-black text-white text-[12px] font-bold uppercase tracking-widest">End</div>
                </div>
             </div>
          </motion.div>

        </div>
      </section>
      {/* FAQ Section */}
      <section className="px-6 max-w-[1000px] mx-auto pb-40">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Left side: Heading */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/3"
            >
                <span className="text-[12px] font-bold text-[#ccff00] uppercase tracking-[0.2em]">Support</span>
                <h2 className="text-[40px] md:text-[56px] font-bold mt-4 leading-[1.1] tracking-tight">Frequently Asked Questions</h2>
                <p className="mt-6 text-gray-500 leading-relaxed max-w-[320px]">
                    Everything you need to know about FormHubs and how it helps you scale.
                </p>
            </motion.div>

            {/* Right side: Accordions */}
            <div className="lg:w-2/3 flex flex-col border-t border-gray-100">
                {[
                    { q: "What is FormHubs?", a: "FormHubs is a developer-first form infrastructure platform that lets you create custom form UIs and send data to our secure endpoints without writing backend code." },
                    { q: "Is there a free trial?", a: "Yes! We have a generous free tier that includes up to 250 submissions per month and basic integrations. No credit card required." },
                    { q: "Why use FormHubs instead of Google Forms?", a: "Unlike Google Forms, FormHubs gives you total control over the UI, follows your brand's design system, and provides advanced data routing and API access for developers." },
                    { q: "What types of forms can I create?", a: "From simple contact forms to complex multi-step surveys, payment forms, and internal data collection tools—if you can build it in HTML/React, we can power it." },
                    { q: "How is my data protected?", a: "We use enterprise-grade encryption for all data at rest and in transit. Your data is stored in secure, SOC2 compliant data centers." },
                    { q: "Can I customize my forms?", a: "Absolutely. FormHubs is headless, meaning you have 100% control over the CSS and React components used to render your forms." }
                ].map((faq, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="border-b border-gray-100 group"
                    >
                        <details className="py-6 cursor-pointer select-none">
                            <summary className="flex items-center justify-between font-bold text-[18px] md:text-[20px] list-none">
                                <span>{faq.q}</span>
                                <span className="bg-gray-50 group-open:bg-[#ccff00] group-open:rotate-45 transition-all p-2 rounded-full">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 1V11M1 6H11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </summary>
                            <div className="mt-4 text-gray-500 leading-relaxed max-w-[90%] overflow-hidden transition-all">
                                {faq.a}
                            </div>
                        </details>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-20 px-6">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2.5">
                <div className="w-[28px] h-[28px] bg-transparent rounded-full flex items-center justify-center shrink-0">
                    <img src="/logo.png" alt="FormHubs Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-[17px] tracking-tight">FormHubs</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="text-[14px] font-medium text-gray-400">
                Made by <a href="https://biswajit.uivault.in" target="_blank" rel="noopener noreferrer" className="text-black font-bold hover:text-[#ccff00] transition-colors underline decoration-[#ccff00]/30 underline-offset-4">Biswajit Das</a> ❤️
              </div>
              <div className="text-[12px] text-gray-300 uppercase tracking-widest font-bold">
                &copy; {new Date().getFullYear()} FormHubs. All rights reserved.
              </div>
            </div>

            <div className="flex gap-8 text-[14px] font-medium text-gray-400">
                <Link href="/docs" className="hover:text-black transition-colors">Documentation</Link>
                <Link href="/features" className="hover:text-black transition-colors">Features</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
