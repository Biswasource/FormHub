"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "Headless Capture",
      desc: "Send data from any frontend using a simple POST request. No client-side library required.",
      icon: "RiSendPlaneFill"
    },
    {
      title: "Custom Field Logic",
      desc: "Define validation rules and conditional logic that run on our edge servers.",
      icon: "RiTerminalBoxLine"
    },
    {
      title: "Auto-forwarding",
      desc: "Instantly sync submissions to Slack, Discord, Google Sheets, or any external Webhook.",
      icon: "RiShareForwardFill"
    },
    {
      title: "Advanced Analytics",
      desc: "Track conversion rates, geo-location, and user agents for every single submission.",
      icon: "RiBarChartFill"
    },
    {
      title: "Anti-Spam Engine",
      desc: "Powerful AI-driven honeypots and validation to keep your inbox clean from bots.",
      icon: "RiShieldCheckFill"
    },
    {
      title: "Export Anywhere",
      desc: "Export your data to CSV, JSON, or connect directly via our API for custom reporting.",
      icon: "RiDownloadCloudFill"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#ccff00] selection:text-black transition-colors duration-500 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-[28px] h-[28px] bg-[#ccff00] rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H15.5C18.5376 20.5 21 18.0376 21 15C21 11.5 18 8.5 14.5 8.5V7.5C14.5 5.29086 12.7091 3.5 10.5 3.5H12ZM15.5 12.5C16.8807 12.5 18 13.6193 18 15C18 16.3807 16.8807 17.5 15.5 17.5H12C9.23858 17.5 7 15.2614 7 12.5C7 9.73858 9.23858 7.5 12 7.5H13.5V10C13.5 11.3807 14.6193 12.5 15.5 12.5Z" />
                </svg>
            </div>
            <span className="font-bold text-[18px] tracking-tight">FORMHUBS</span>
          </Link>
          <div className="hidden md:flex gap-8 text-[14px] font-medium text-gray-500">
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/login" className="px-5 py-2 rounded-full bg-[#ccff00] text-black font-bold hover:bg-[#bdeb02] transition-all">Go to App</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-[800px] mx-auto"
        >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-[#ccff00] uppercase tracking-[0.2em] mb-6">
                Capabilities
            </span>
            <h1 className="text-[36px] md:text-[64px] font-bold tracking-tight leading-[1.1] mb-6">
                Beyond just <span className="text-gray-600">input & submit.</span>
            </h1>
            <p className="text-[16px] md:text-[19px] text-gray-400 max-w-[600px] mx-auto leading-relaxed">
                A robust infrastructure built to handle high-volume data collection, validation, and automated external syncs.
            </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#ccff00]/40 transition-colors group cursor-default"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center mb-6">
                        <div className="w-4 h-4 bg-[#ccff00] rounded-full" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-[14px]">
                        {feature.desc}
                    </p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-[800px] mx-auto p-12 md:p-16 rounded-[48px] bg-[#ccff00] text-black">
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight mb-6">Ready to automate your forms?</h2>
            <Link href="/signup" className="inline-block px-8 py-4 rounded-full bg-black text-white font-bold text-[16px] hover:scale-105 transition-transform">
                Create Free Account
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black flex flex-col items-center gap-6">
         <div className="flex items-center gap-2.5 opacity-50">
            <div className="w-[24px] h-[24px] bg-[#ccff00] rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-[12px] h-[12px] fill-black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H15.5C18.5376 20.5 21 18.0376 21 15C21 11.5 18 8.5 14.5 8.5V7.5C14.5 5.29086 12.7091 3.5 10.5 3.5H12ZM15.5 12.5C16.8807 12.5 18 13.6193 18 15C18 16.3807 16.8807 17.5 15.5 17.5H12C9.23858 17.5 7 15.2614 7 12.5C7 9.73858 9.23858 7.5 12 7.5H13.5V10C13.5 11.3807 14.6193 12.5 15.5 12.5Z" />
                </svg>
            </div>
            <span className="font-bold text-[16px] tracking-tight text-white">FORMHUBS</span>
        </div>
        <div className="text-[14px] font-medium text-gray-500">
          Made by <a href="https://biswajit.uivault.in" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[#ccff00] transition-colors underline decoration-[#ccff00]/30 underline-offset-4">Biswajit Das</a> ❤️
        </div>
        <p className="text-gray-600 text-[11px] tracking-[0.2em] uppercase font-bold">&copy; {new Date().getFullYear()} FORMHUBS Labs</p>
      </footer>
    </div>
  );
}
