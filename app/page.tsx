"use client"
import { useState } from 'react'
import Link from 'next/link'
import { RiMenu3Line, RiCloseLine } from '@remixicon/react'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="flex items-center justify-between mx-auto max-w-[1300px] h-[72px] px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-[32px] h-[32px] bg-[#ccff00] rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-black" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H15.5C18.5376 20.5 21 18.0376 21 15C21 11.5 18 8.5 14.5 8.5V7.5C14.5 5.29086 12.7091 3.5 10.5 3.5H12ZM15.5 12.5C16.8807 12.5 18 13.6193 18 15C18 16.3807 16.8807 17.5 15.5 17.5H12C9.23858 17.5 7 15.2614 7 12.5C7 9.73858 9.23858 7.5 12 7.5H13.5V10C13.5 11.3807 14.6193 12.5 15.5 12.5Z" />
              </svg>
            </div>
            <span className="font-bold text-[19px] tracking-tight text-[#0a0a0a]">FORMHUBS</span>
          </Link>

          {/* Right Action */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="text-[#111111] text-[14px] font-semibold px-3 sm:px-4 py-2 hover:text-[#ccff00] transition-colors">
              Login
            </Link>
            <Link href="/signup" className="hidden sm:flex bg-[#0a0a0a] text-white text-[13.5px] font-bold px-[20px] py-[10px] rounded-full hover:bg-[#222] transition-all shadow-sm">
              Sign Up Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center text-center mt-[80px] md:mt-[120px] px-6">
        <h1 className="text-[42px] md:text-[72px] leading-[1.1] md:leading-[1.05] tracking-[-0.04em] font-bold max-w-[1000px] text-[#0f0f0f]">
         Forms That Do More <br className="hidden md:block"/> Than Just Collect.
        </h1>
        
        <p className="mt-6 md:mt-[28px] text-[17px] md:text-[20px] leading-[1.6] text-[#636366] max-w-[820px] font-normal">
        A developer-first platform to generate form UIs, capture data through unique endpoints, and process responses at scale.
        </p>

        <div className="mt-10 md:mt-11 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-6 sm:px-0">
          <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center bg-[#ccff00] text-[#0a0a0a] font-bold text-[15.5px] px-[32px] py-[15px] rounded-[14px] hover:bg-[#bdeb02] transition-all shadow-sm">
            Get Started Now
          </Link>
          <button className="w-full sm:w-auto bg-[#f7f7f8] text-[#0a0a0a] font-bold text-[15.5px] px-[32px] py-[15px] rounded-[14px] hover:bg-[#efeff0] transition-all shadow-sm">
            Book a Demo
          </button>
        </div>
      </main>
    </div>
  )
}
