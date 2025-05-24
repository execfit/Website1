"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/fulllogo_transparent.png"
              alt="ExecFit Logo"
              width={140}
              height={70}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium tracking-wide">
              Home
            </Link>
            <Link
              href="/cookbooks"
              className="text-white/80 hover:text-white transition-colors font-medium tracking-wide"
            >
              Free Cookbooks
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById("services")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="text-white/80 hover:text-white transition-colors font-medium tracking-wide"
            >
              Services
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("coaches")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="text-white/80 hover:text-white transition-colors font-medium tracking-wide"
            >
              Coaches
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("contact")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="text-white/80 hover:text-white transition-colors font-medium tracking-wide"
            >
              Contact
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-md border-t border-white/10">
              <Link
                href="/"
                className="block px-3 py-2 text-white/80 hover:text-white transition-colors font-medium tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/cookbooks"
                className="block px-3 py-2 text-white/80 hover:text-white transition-colors font-medium tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Free Cookbooks
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById("services")
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white transition-colors font-medium tracking-wide"
              >
                Services
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("coaches")
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white transition-colors font-medium tracking-wide"
              >
                Coaches
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("contact")
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white transition-colors font-medium tracking-wide"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
