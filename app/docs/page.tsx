"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      items: ["Introduction", "Quick Start", "Installation"]
    },
    {
      title: "Core Concepts",
      items: ["Form Capture", "Data Routing", "Integrations", "Webhooks"]
    },
    {
      title: "SDKs & APIs",
      items: ["React SDK", "Next.js Integration", "API Reference"]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ccff00] transition-colors duration-500 relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-[28px] h-[28px] bg-[#ccff00] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H15.5C18.5376 20.5 21 18.0376 21 15C21 11.5 18 8.5 14.5 8.5V7.5C14.5 5.29086 12.7091 3.5 10.5 3.5H12ZM15.5 12.5C16.8807 12.5 18 13.6193 18 15C18 16.3807 16.8807 17.5 15.5 17.5H12C9.23858 17.5 7 15.2614 7 12.5C7 9.73858 9.23858 7.5 12 7.5H13.5V10C13.5 11.3807 14.6193 12.5 15.5 12.5Z" />
                </svg>
            </div>
            <span className="font-bold text-[18px] tracking-tight">FORMHUBS <span className="text-[10px] text-gray-400 font-medium ml-1">DOCS</span></span>
          </Link>
          <div className="hidden md:flex gap-8 text-[14px] font-medium text-gray-400">
            <Link href="/features" className="hover:text-black transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
            <Link href="/login" className="px-4 py-2 rounded-full border border-gray-100 text-black hover:bg-gray-50 transition-all">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto flex pt-[72px]">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[300px] h-[calc(100vh-72px)] sticky top-[72px] border-r border-gray-100 p-8 overflow-y-auto">
          {sections.map((section, i) => (
            <div key={i} className="mb-10">
              <h5 className="text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-4 opacity-50">{section.title}</h5>
              <div className="flex flex-col gap-4">
                {section.items.map((item, j) => (
                  <a key={j} href={`#${item.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}`} className="text-[13px] text-gray-400 hover:text-[#ccff00] transition-colors font-medium">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-16 overflow-y-auto max-h-[calc(100vh-72px)] scroll-smooth">
          <div className="max-w-[800px]">
            {/* Introduction */}
            <section id="introduction" className="mb-24">
              <span className="text-[13px] font-bold text-[#ccff00] uppercase tracking-wider">Introduction</span>
              <h1 className="text-[48px] md:text-[64px] font-bold mt-4 mb-8 tracking-tight">Meet Formhubs.</h1>
              <p className="text-[20px] text-gray-500 leading-relaxed">
                Formhubs provides the backbone for your web forms. Instead of building custom backends for every project, you simply create an endpoint and send your data to us. We handle the data collection, notifications, and storage.
              </p>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="mb-24 pt-12 border-t border-gray-50">
              <h2 className="text-[32px] font-bold mb-6">Quick Start</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-[14px] shrink-0">1</div>
                  <p className="text-gray-500">Create a new form in your <Link href="/dashboard" className="text-black font-bold underline">Dashboard</Link> to get your unique Form ID.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-[14px] shrink-0">2</div>
                  <p className="text-gray-500">Add the endpoint to your form's fetch request or SDK configuration.</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-2xl p-6 font-mono text-[13px] text-gray-300">
                  <span className="text-purple-400">const</span> endpoint = <span className="text-emerald-400">"https://formhubs.com/api/v1/f/YOUR_ID"</span>;
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-24 pt-12 border-t border-gray-50">
              <h2 className="text-[32px] font-bold mb-6">Installation</h2>
              <p className="text-gray-500 mb-6">While you can use raw fetch, our SDKs provide a more streamlined experience with built-in validation and state management.</p>
              <div className="bg-[#0a0a0a] rounded-2xl p-6 font-mono text-[13px] text-gray-300 flex justify-between items-center group">
                <span className="text-[#ccff00]">npm install @formhubs/react</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold text-gray-500 hover:text-white">Copy</button>
              </div>
            </section>

            {/* Core Concepts */}
            <section id="form-capture" className="mb-24 pt-12 border-t border-gray-50">
              <h2 className="text-[32px] font-bold mb-6">Form Capture</h2>
              <p className="text-gray-500 mb-8">Formhubs accepts JSON payloads via POST requests. Ensure your inputs have descriptive names as they will be preserved in your database.</p>
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                </div>
                <pre className="text-[13px] text-gray-600 font-mono leading-relaxed">
{`{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello from my custom UI!"
}`}
                </pre>
              </div>
            </section>

            <section id="data-routing" className="mb-24">
              <h2 className="text-[32px] font-bold mb-4">Data Routing</h2>
              <p className="text-gray-500">Control where your data flows after it hits our servers. Route submissions to multiple emails, team members, or external storage buckets.</p>
            </section>

            <section id="integrations" className="mb-24">
              <h2 className="text-[32px] font-bold mb-4">Integrations</h2>
              <p className="text-gray-500 mb-8">Connect your forms to the tools you already use. Supported integrations include:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Discord', 'Slack', 'Email', 'Google Sheets', 'PostHog', 'Airtable'].map(tool => (
                  <div key={tool} className="py-4 px-6 rounded-2xl border border-gray-100 bg-white text-[14px] font-bold flex items-center justify-center">
                    {tool}
                  </div>
                ))}
              </div>
            </section>

            <section id="webhooks" className="mb-24">
              <h2 className="text-[32px] font-bold mb-4">Webhooks</h2>
              <p className="text-gray-500 mb-6">For total automation, set up incoming webhooks. We'll send a POST request with the submission payload to your server every time a new form is captured.</p>
            </section>

            {/* SDKs & APIs */}
            <section id="react-sdk" className="mb-24 pt-12 border-t border-gray-50">
              <span className="text-[#ccff00] font-bold text-[11px] uppercase tracking-widest">SDK Reference</span>
              <h2 className="text-[32px] font-bold mb-6 mt-2">React SDK</h2>
              <p className="text-gray-500 mb-8">Our React SDK provides the `useForm` hook for handling submission state and validation.</p>
              <div className="bg-[#0a0a0a] rounded-3xl p-8 overflow-hidden">
                <pre className="text-[13px] leading-relaxed">
                  <code className="text-gray-400">
{`import { useForm } from "@formhubs/react";

function Contact() {
  const { state, handleSubmit } = useForm("YOUR_FORM_ID");

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <button disabled={state.submitting}>Submit</button>
    </form>
  );
}`}
                  </code>
                </pre>
              </div>
            </section>

            <section id="next.js-integration" className="mb-24">
              <h2 className="text-[32px] font-bold mb-4">Next.js Integration</h2>
              <p className="text-gray-500">Perfect support for Server Actions and API Routes. Forward data server-side to keep your client-side bundle small.</p>
            </section>

            <section id="api-reference" className="mb-40 pt-12 border-t border-gray-50">
              <h2 className="text-[32px] font-bold mb-8">API Reference</h2>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[11px] font-bold rounded-lg uppercase">Post</span>
                  <code className="text-[14px] font-mono font-bold">/v1/f/:form_id</code>
                  <span className="text-gray-400 text-[13px]">Generic Capture</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[11px] font-bold rounded-lg uppercase">Get</span>
                  <code className="text-[14px] font-mono font-bold">/v1/submissions/:form_id</code>
                  <span className="text-gray-400 text-[13px]">Fetch all submissions</span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer inside content area */}
          <footer className="mt-40 py-12 border-t border-gray-100 flex flex-col items-center gap-4">
             <div className="text-[14px] font-medium text-gray-400">
               Made by <a href="https://biswajit.uivault.in" target="_blank" rel="noopener noreferrer" className="text-black font-bold hover:text-[#ccff00] transition-colors underline decoration-[#ccff00]/30 underline-offset-4">Biswajit Das</a> ❤️
             </div>
             <p className="text-gray-300 text-[11px] tracking-widest uppercase font-bold">&copy; {new Date().getFullYear()} FORMHUBS</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
