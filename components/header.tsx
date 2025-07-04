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
              href="/program-options"
              className="text-white/80 hover:text-white transition-colors font-medium tracking-wide"
            >
              Program Options
            </Link>
            <Link
              href="/cookbooks"
              className="text-white/80 hover:text-white transition-colors font-medium tracking-wide"
            >
              Free Cookbooks
            </Link>
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
            <a
              href="https://instagram.com/execfitnow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            <Link
              href="/coming-soon"
              className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Book Free Consultation
            </Link>
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
                href="/program-options"
                className="block px-3 py-2 text-white/80 hover:text-white transition-colors font-medium tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Program Options
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
              <a
                href="https://instagram.com/execfitnow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-white/80 hover:text-white transition-colors font-medium tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-2"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                Follow @execfitnow
              </a>
              <Link
                href="/coming-soon"
                className="block mx-3 my-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Free Consultation
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
