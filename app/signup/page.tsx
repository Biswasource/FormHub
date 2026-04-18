"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Info, 2: OTP
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }
      setStep(2)
      setSuccess("OTP sent successfully! Check your email.")
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, otp })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }
      setSuccess("Account created successfully! Welcome aboard...")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex lg:grid lg:grid-cols-2 selection:bg-[#ccff00] selection:text-black">
      {/* Left side Form */}
      <div className="flex flex-col items-center justify-center w-full px-4 sm:px-12 lg:px-20 py-12 lg:py-0">
        <Card className="w-full max-w-[420px] bg-transparent border-none shadow-none ring-0">
          <CardHeader className="flex items-center flex-col pb-2">
            <div className="w-[48px] h-[48px] bg-[#ccff00] rounded-full flex items-center justify-center shrink-0 mb-2">
              <svg viewBox="0 0 24 24" className="w-[28px] h-[28px] fill-black" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H15.5C18.5376 20.5 21 18.0376 21 15C21 11.5 18 8.5 14.5 8.5V7.5C14.5 5.29086 12.7091 3.5 10.5 3.5H12ZM15.5 12.5C16.8807 12.5 18 13.6193 18 15C18 16.3807 16.8807 17.5 15.5 17.5H12C9.23858 17.5 7 15.2614 7 12.5C7 9.73858 9.23858 7.5 12 7.5H13.5V10C13.5 11.3807 14.6193 12.5 15.5 12.5Z" />
                <circle cx="10" cy="10" r="1.5" fill="#ccff00" />
              </svg>
            </div>
            <CardTitle className="text-[28px] font-bold tracking-tight text-white m-0">Create an account</CardTitle>
            <br/>
            <CardDescription className="text-[15.5px] text-[#A1A1AA] m-0 text-center">
              Sign up to continue to FORMHUBS Account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 mt-6">
            {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">{error}</div>}
            {success && <div className="p-3 text-sm text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-md text-center">{success}</div>}
            
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[13px] text-[#A1A1AA] font-normal">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#0f0f11] border-[#27272a] text-white placeholder:text-[#52525b] h-10 rounded-md focus-visible:ring-1 focus-visible:ring-[#ccff00] focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px] text-[#A1A1AA] font-normal">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#0f0f11] border-[#27272a] text-white placeholder:text-[#52525b] h-10 rounded-md focus-visible:ring-1 focus-visible:ring-[#ccff00] focus-visible:ring-offset-0"
                  />
                </div>
                <Button disabled={isLoading} type="submit" className="w-full bg-[#ccff00] text-black hover:bg-[#bdeb02] h-10 rounded-md font-semibold text-[15px] mt-4">
                  {isLoading ? "Sending OTP..." : "Continue with Email"}
                </Button>
              </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-2">
                    <div className="text-sm text-gray-400 text-center mb-4">
                        We sent a 6-digit code to <span className="text-white font-medium">{email}</span>.
                    </div>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[13px] text-[#A1A1AA] font-normal">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-[#0f0f11] border-[#27272a] text-white placeholder:text-[#52525b] h-10 rounded-md focus-visible:ring-1 focus-visible:ring-[#ccff00] focus-visible:ring-offset-0 tracking-widest text-center text-lg"
                    maxLength={6}
                  />
                </div>
                <Button disabled={isLoading} type="submit" className="w-full bg-[#ccff00] text-black hover:bg-[#bdeb02] h-10 rounded-md font-semibold text-[15px] mt-4">
                  {isLoading ? "Verifying..." : "Verify & Sign Up"}
                </Button>
                <div className="text-center mt-2">
                  <button type="button" onClick={() => setStep(1)} className="text-[13px] text-[#A1A1AA] hover:text-white underline-offset-4 hover:underline">
                     Change Email
                  </button>
                </div>
              </form>
            )}

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#27272a]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-3 text-[#71717A] text-[13px] normal-case">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const { auth, googleProvider } = await import('@/lib/firebase');
                    const { signInWithPopup } = await import('firebase/auth');
                    
                    const result = await signInWithPopup(auth, googleProvider);
                    const user = result.user;

                    // Sync with our backend (This handles BOTH Login and Sign Up)
                    const res = await fetch("/api/auth/firebase-sync", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: user.email,
                        name: user.displayName
                      })
                    });

                    if (res.ok) {
                      setSuccess("Connected with Google! Welcome abroad...");
                      setTimeout(() => router.push("/dashboard"), 1000);
                    } else {
                      throw new Error("Failed to sync account");
                    }
                  } catch (err: any) {
                    setError(err.message || "Something went wrong with Google Signup");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                type="button" 
                variant="outline" 
                className="w-full bg-[#0a0a0a] border-[#27272a] text-[#d4d4d8] hover:bg-[#18181b] hover:text-white h-10 rounded-md font-medium text-[14px] flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {isLoading ? "Connecting..." : "Sign up with Google"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center mt-2 pb-0 pt-2 bg-transparent border-none">
            <p className="text-[13.5px] text-[#A1A1AA]">
              Already have an account? <Link href="/login" className="text-white hover:underline font-medium">Log in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>  

      {/* Right side Image block */}
      <div className="hidden lg:block relative p-4 pl-0 xl:p-6 xl:pl-0 h-screen overflow-hidden">
        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <Image 
            src="/login-bg.png" 
            alt="FORMHUBSLandscape" 
            fill 
            className="object-cover relative z-10"
            priority
          />
        </div>
      </div>
    </div>
  )
}
