"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

export default function TrainerLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Fix hydration issue by ensuring component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // TODO: Replace with actual authentication
      console.log("Login attempt:", { email, password })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check for demo credentials or implement real auth
      if (email === "demo@execfit.com" && password === "demo123") {
        router.push("/trainer/dashboard")
      } else {
        // For now, redirect to dashboard for any credentials
        // In production, this would validate against your auth system
        router.push("/trainer/dashboard")
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Don't render dynamic content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Static Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-black to-black"></div>
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px),
                  repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)
                `,
              }}
            ></div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Image
                    src="/images/icononly-new.png"
                    alt="ExecFit Icon"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-montserrat">Trainer Portal</h1>
                <p className="text-white/70 font-raleway">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Background Animation - Matches Homepage */}
      <div className="absolute inset-0 z-0">
        {/* Space gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-black to-black"></div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)
        `,
            }}
          ></div>
        </div>

        {/* Top gradient grid overlay */}
        <div
          className="absolute top-0 left-0 right-0 h-96 opacity-15"
          style={{
            backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px),
        repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)
      `,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%)",
          }}
        ></div>

        {/* Static stars for desktop - only render after mount */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[25%] w-1 h-1 bg-white rounded-full opacity-70 shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute top-[20%] right-[15%] w-1.5 h-1.5 bg-white rounded-full opacity-60 shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute top-[35%] right-[35%] w-1 h-1 bg-white rounded-full opacity-80 shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute top-[50%] right-[45%] w-0.5 h-0.5 bg-white rounded-full opacity-70 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute top-[65%] right-[10%] w-1.5 h-1.5 bg-white rounded-full opacity-75 shadow-[0_0_12px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute top-[25%] left-[15%] w-1 h-1 bg-white rounded-full opacity-65 shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute top-[45%] left-[25%] w-1 h-1 bg-white rounded-full opacity-70 shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute top-[60%] left-[35%] w-0.5 h-0.5 bg-white rounded-full opacity-60 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]"></div>
        </div>

        {/* Mobile particles - only render after mount */}
        <div className="md:hidden absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-pulse"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Floating geometric elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>

        {/* Additional floating squares */}
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/5 backdrop-blur-sm rotate-45 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border border-white/10 rotate-12 animate-pulse delay-300"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Image
                  src="/images/icononly-new.png"
                  alt="ExecFit Icon"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-2 font-montserrat">Trainer Portal</h1>
              <p className="text-white/70 font-raleway">Sign in to manage your clients and sessions</p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="bg-black/40 border-white/20 backdrop-blur-md shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-white font-montserrat">Welcome Back</CardTitle>
              <CardDescription className="text-white/60">
                Enter your credentials to access your trainer dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 pr-10"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-white/90 font-semibold py-2.5 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Demo credentials info */}
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h4 className="text-blue-200 text-sm font-medium mb-2">Demo Access:</h4>
                <div className="text-blue-200/80 text-xs space-y-1">
                  <p>Email: demo@execfit.com</p>
                  <p>Password: demo123</p>
                </div>
              </div>

              {/* New trainer info */}
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <h4 className="text-white text-sm font-medium mb-2">New to ExecFit?</h4>
                <ul className="text-white/70 text-xs space-y-1">
                  <li>• Use the email and temporary password provided by ExecFit</li>
                  <li>• Complete your profile setup on first login</li>
                  <li>• Start accepting clients once approved</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Back to home link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-white/60 hover:text-white transition-colors text-sm font-raleway"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to ExecFit Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
