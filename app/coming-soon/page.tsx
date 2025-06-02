"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"

export default function ComingSoon() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-black to-black"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Header />

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

        {/* Static stars for desktop */}
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

        {/* Mobile particles */}
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
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <img src="/images/icononly.jpg" alt="ExecFit Icon" className="w-20 h-20 rounded-full object-contain" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-montserrat">Coming Soon</h1>
            <p className="text-xl md:text-2xl text-white/80 font-raleway">
              We're working on something amazing for you.
            </p>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              Our consultation booking system is being enhanced to provide you with the best possible experience. Stay
              tuned for updates!
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-white/70">In the meantime, follow us on Instagram for daily fitness tips and updates:</p>
            <a
              href="https://instagram.com/execfitnow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Follow @execfitnow</span>
            </a>
          </div>

          {/* Back to Home */}
          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center text-white/60 hover:text-white transition-colors text-sm font-raleway"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to ExecFit Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
