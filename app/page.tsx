"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0)
  const [nextCoachIndex, setNextCoachIndex] = useState(1)
  const [touchStart, setTouchStart] = useState(0)
  const [touchCurrent, setTouchCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const coaches = [
    {
      id: "gabriela",
      name: "Gabriela Garcia",
      specialty: "Certified Personal Trainer | NASM Nutrition Coach | Pre-Script Barbell Coach | B.S. in Biology",
      bio: "Hi, I'm Gabriela! Life doesn't slow down for you, but that doesn't mean your goals should wait. I help busy individuals build strength, confidence, and a body they're proud of!",
      image: "/images/coach-gabriela.jpg?v=2", // Add version parameter to force reload
      link: "/coaches/gabriela-garcia",
    },
    {
      id: "maddy",
      name: "Maddy Gold",
      specialty: "Certified Personal Trainer | PN1 Nutrition Coach | B.S. in Exercise Science",
      bio: "Hi, I'm Maddy! I specialize in building amazing bodies, good habits, and strength. Let's build up confidence with a fun, balanced approach to fitness!",
      image: "/images/coach-maddy.jpg?v=2", // Add version parameter to force reload
      link: "/coaches/maddy-gold",
    },
    {
      id: "ali",
      name: "Ali Salah",
      specialty: "Certified Personal Trainer | PN1 Nutrition Coach | ISSA Corrective Exercise",
      bio: "The most valuable thing we have is time, and I am passionate about helping you make that time long-lasting while you become stronger and healthier.",
      image: "/images/coach-ali.jpg?v=2",
      link: "/coaches/ali-salah",
    },
    {
      id: "kimi",
      name: "Kimiya Kim",
      specialty: "Certified Personal Trainer | PN1 Nutrition Coach | Pre & Postnatal | ViPR 1",
      bio: "I blend injury prevention, rehab, strength, and cardio to build confident, resilient bodies safely and effectively. Execute now and move with purpose!",
      image: "/images/coach-kimi.jpg?v=2",
      link: "/coaches/kimiya-kim",
    },
    {
      id: "donatas",
      name: "Donatas Petrus",
      specialty:
        "Certified Personal Trainer | PNL1 Nutrition Coach | M.S. in Medical Science | ISSA Transformation Specialist | ISSA Corrective Exercise",
      bio: "Your schedule is packed, but your goals aren't waiting. Let's transform your mind and body, for good. Exceptional training, better living.",
      image: "/images/coach-donatas.jpg",
      link: "/coaches/donatas-petrus",
    },
  ]

  useEffect(() => {
    // Logo Animation
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight / 2
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    const circles = [
      { x: canvas.width * 0.45, y: canvas.height * 0.55, radius: 120, speed: 0.0005, phase: 0 },
      { x: canvas.width * 0.6, y: canvas.height * 0.4, radius: 180, speed: 0.0004, phase: Math.PI / 3 },
      { x: canvas.width * 0.35, y: canvas.height * 0.45, radius: 150, speed: 0.0006, phase: Math.PI / 1.5 },
    ]

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      circles.forEach((circle) => {
        const pulseScale = 0.7 + 0.6 * Math.sin(timestamp * circle.speed + circle.phase)
        const currentRadius = circle.radius * pulseScale

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + 0.1 * Math.sin(timestamp * circle.speed * 1.5 + circle.phase)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, currentRadius, 0, Math.PI * 2)
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  // Force scroll to top on page load/refresh - Enhanced version
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0)

    // Also set scroll restoration to manual to prevent browser auto-restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }

    // Additional scroll to top after a brief delay to override any browser restoration
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    // Handle page visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        window.scrollTo(0, 0)
      }
    }

    // Handle browser back/forward navigation
    const handlePopState = () => {
      window.scrollTo(0, 0)
    }

    // Handle page focus
    const handleFocus = () => {
      window.scrollTo(0, 0)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("popstate", handlePopState)
    window.addEventListener("focus", handleFocus)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("focus", handleFocus)

      // Restore default scroll restoration when component unmounts
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto"
      }
    }
  }, [])

  // Update next coach index when current changes
  useEffect(() => {
    setNextCoachIndex((currentCoachIndex + 1) % coaches.length)
  }, [currentCoachIndex, coaches.length])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const offset = window.innerWidth <= 768 ? 100 : 150

      window.scrollTo({
        top: scrollTop + rect.top + offset,
        behavior: "smooth",
      })
    }
  }

  // Enhanced swipe handlers with bulletproof touch detection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) {
      e.preventDefault()
      return
    }

    const touch = e.touches[0]
    if (!touch) return

    setTouchStart(touch.clientX)
    setTouchCurrent(touch.clientX)
    setIsDragging(true)
    setSwipeDirection(null)

    // Prevent default to avoid scrolling issues
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning || !isDragging) {
      return
    }

    const touch = e.touches[0]
    if (!touch) return

    setTouchCurrent(touch.clientX)

    // Prevent default to avoid scrolling
    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioning || !isDragging) {
      return
    }

    const distance = touchStart - touchCurrent
    const threshold = 80
    const velocity = Math.abs(distance)

    setIsDragging(false)

    // Check if swipe was significant enough
    if (Math.abs(distance) > threshold || velocity > 100) {
      setIsTransitioning(true)

      if (distance > 0) {
        // Swiped left - show next coach
        setSwipeDirection("left")
        // Update index and reset state atomically after animation
        setTimeout(() => {
          setCurrentCoachIndex((prev) => (prev + 1) % coaches.length)
          // Reset state immediately after index update to prevent duplicate rendering
          setIsTransitioning(false)
          setSwipeDirection(null)
          setTouchStart(0)
          setTouchCurrent(0)
        }, 400)
      } else {
        // Swiped right - show previous coach
        setSwipeDirection("right")
        // Update index and reset state atomically after animation
        setTimeout(() => {
          setCurrentCoachIndex((prev) => (prev - 1 + coaches.length) % coaches.length)
          // Reset state immediately after index update to prevent duplicate rendering
          setIsTransitioning(false)
          setSwipeDirection(null)
          setTouchStart(0)
          setTouchCurrent(0)
        }, 400)
      }
    } else {
      // Snap back to center - no swipe
      resetSwipeState()
    }

    e.preventDefault()
  }

  // Helper function to reset all swipe states
  const resetSwipeState = () => {
    setIsTransitioning(false)
    setSwipeDirection(null)
    setTouchStart(0)
    setTouchCurrent(0)
    setIsDragging(false)
  }

  // Calculate drag offset with bounds
  const getDragOffset = () => {
    if (!isDragging || touchStart === 0) return 0
    const offset = touchCurrent - touchStart
    // Limit drag distance to prevent extreme movements
    return Math.max(-300, Math.min(300, offset))
  }

  const renderCoachCard = (coach: (typeof coaches)[0]) => (
    <div className="w-full h-full bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl flex flex-col">
      {/* Coach Image */}
      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/30 shadow-lg flex-shrink-0">
        <Image
          src={coach.image || "/placeholder.svg"}
          alt={coach.name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Coach Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white text-center mb-3 leading-tight">{coach.name}</h3>

        <p className="text-xs text-white/80 text-center mb-4 leading-relaxed font-medium">{coach.specialty}</p>

        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-white/90 text-center leading-relaxed italic px-2">"{coach.bio}"</p>
        </div>
      </div>
    </div>
  )

  // Calculate z-index for this specific card
  const getCardZIndex = (position: "current" | "next" | "prev" | "hidden") => {
    if (position === "hidden") return 1

    // Set z-index immediately when swipe direction is determined
    if (swipeDirection) {
      if (swipeDirection === "left") {
        if (position === "next") return 10 // Coming in from right
        if (position === "current") return 5 // Going out left
        if (position === "prev") return -1 // Traveling across behind icon - SET IMMEDIATELY
      } else if (swipeDirection === "right") {
        if (position === "prev") return 10 // Coming in from left
        if (position === "current") return 5 // Going out right
        if (position === "next") return -1 // Traveling across behind icon - SET IMMEDIATELY
      }
      return 3
    }

    if (position === "current") return 10
    if (position === "next" || position === "prev") return 5
    return 1
  }

  // Calculate opacity based on actual position rather than logical position
  const getCardOpacity = (position: "current" | "next" | "prev" | "hidden") => {
    // During swipe transitions, handle opacity based on actual positions
    if (swipeDirection && isTransitioning) {
      if (swipeDirection === "left") {
        // When swiping left:
        if (position === "current") return Math.max(0.3, 1 - 0.7) // Current card fading out
        if (position === "next") return 1 // Next card becoming current
        if (position === "prev") return 0 // Card traveling to hidden position - invisible during journey
        return 0 // Cards at hidden position (translateX(500px)) always invisible
      } else if (swipeDirection === "right") {
        // When swiping right:
        if (position === "current") return Math.max(0.3, 1 - 0.7) // Current card fading out
        if (position === "prev") return 1 // Prev card becoming current
        if (position === "next") return 0 // Card traveling to hidden position - invisible during journey
        return 0 // Cards at hidden position (translateX(500px)) always invisible
      }
    }

    // During dragging, hide cards that would be at hidden position
    if (isDragging) {
      if (position === "current") {
        return Math.max(0.8, 1 - Math.abs(getDragOffset()) * 0.001)
      } else if (position === "next" && getDragOffset() < -50) {
        return 0.8
      } else if (position === "prev" && getDragOffset() > 50) {
        return 0.8
      }
      // All other cards (including those at hidden position) invisible during dragging
      return 0
    }

    // Default opacities based on position:
    // Cards at translateX(500px) scale(0.9) [hidden position] = 0 opacity
    // Cards at translateX(350px) scale(0.95) [next position] = 0.7 opacity (after 400ms delay)
    // Cards at translateX(0px) scale(1) [current position] = 1 opacity
    // Cards at translateX(-350px) scale(0.95) [prev position] = 0.7 opacity (after 400ms delay)

    if (position === "current") return 1
    if (position === "next" || position === "prev") return 0.7
    if (position === "hidden") return 0 // Cards at translateX(500px) always invisible
    return 0
  }

  return (
    <div className="execfit-main">
      {/* Header */}
      <Header />

      {/* Background Elements */}
      <div className="bg-container">
        <div className="execfit-bg-animation">
          <div className="bg-space-gradient"></div>
          <div className="bg-grid-lines bg-horizontal"></div>
          <div className="bg-grid-lines bg-vertical"></div>
          <div className="bg-gradient-grid-top"></div>

          {/* Static stars - Desktop only */}
          <div className="static-stars-container desktop-only">
            <div className="bg-star bg-star-1"></div>
            <div className="bg-star bg-star-2"></div>
            <div className="bg-star bg-star-3"></div>
            <div className="bg-star bg-star-4"></div>
            <div className="bg-star bg-star-5"></div>
            <div className="bg-star bg-star-6"></div>
            <div className="bg-star bg-star-7"></div>
            <div className="bg-star bg-star-8"></div>
          </div>

          {/* Mobile particles */}
          <div className="mobile-particles-container mobile-only">
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className={`mobile-particle mp-${i + 1}`}></div>
            ))}
          </div>

          {/* Animated elements */}
          <div className="bg-floating-element bg-circle-1"></div>
          <div className="bg-floating-element bg-circle-2"></div>
          <div className="bg-floating-element bg-square"></div>
          <div className="bg-floating-element bg-circle-3"></div>
          <div className="bg-floating-element bg-square-2"></div>
          <div className="bg-pulse-circle"></div>
          <div className="bg-pulse-circle bg-pulse-circle-2"></div>
          <div className="bg-light-beam"></div>
          <div className="bg-light-beam bg-light-beam-2"></div>
          <div className="bg-scan-lines"></div>
        </div>
      </div>

      {/* Logo and hero section */}
      <div className="logo-hero-section">
        <div className="logo-container">
          <canvas ref={canvasRef} id="logo-canvas"></canvas>
          <div className="logo-inner">
            <div className="logo-circle">
              <Image
                src="/images/icononly.jpg"
                alt="ExecFit Icon"
                width={100}
                height={100}
                className="execfit-logo-img"
              />
            </div>
          </div>
        </div>

        <div className="tagline-container">
          <h2 className="text-3xl font-bold text-white text-center tracking-widest">EXECUTE NOW.</h2>
        </div>
      </div>

      {/* New Hero Content Section */}
      <section className="hero-content-section">
        <div className="execfit-container">
          <div className="hero-content-wrapper">
            {/* Main Headline */}
            <h1 className="hero-main-headline" style={{ fontSize: "2.2rem" }}>
              Elite Concierge Training for Boston's Luxury Residences
            </h1>

            {/* Subheadline */}
            <p className="hero-subheadline execfit-raleway-text execfit-black-glow" style={{ fontSize: "1.1rem" }}>
              Private in-building personal training for high-performing professionals. We help you move better, feel
              stronger, and stay accountable — all without ever leaving home.
            </p>

            {/* CTA */}
            <div className="hero-cta-container">
              <p className="hero-cta-text execfit-raleway-text execfit-black-glow">
                Get 1 FREE consultation and complimentary session
                <br />
                Text <span className="execute-highlight">"EXECUTE"</span> to 617-863-6189
              </p>
            </div>

            {/* Support Bullets */}
            <div className="hero-support-bullets">
              <div className="support-bullet execfit-raleway-text execfit-black-glow">
                <span className="bullet-icon">✓</span>
                Certified, on-brand, and punctual coaches
              </div>
              <div className="support-bullet execfit-raleway-text execfit-black-glow">
                <span className="bullet-icon">✓</span>
                Available in select Back Bay, Seaport & South End buildings
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main homepage content */}
      <div className="main-content">
        <div className="execfit-homepage execfit-transparent-sections">
          {/* Intro Section */}
          <section className="execfit-intro-section pt-0">
            <div className="execfit-container">
              <div className="execfit-intro-content">
                <div className="execfit-buttons execfit-buttons-override-gap">
                  <Link href="/coming-soon" className="execfit-btn-primary">
                    Book Free Consultation
                  </Link>
                  <button onClick={() => scrollToSection("coaches")} className="execfit-btn-secondary">
                    Meet Our Coaches
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="execfit-services-section pt-16">
            <div className="execfit-container">
              <h2 className="execfit-section-title execfit-title-glow">Elite Services</h2>

              <div className="execfit-services-grid">
                <div className="execfit-service-card service-personal-training">
                  <div className="execfit-service-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6.5 6.5 11 11"></path>
                      <path d="m21 21-1-1"></path>
                      <path d="m3 3 1 1"></path>
                      <path d="m18 22 4-4"></path>
                      <path d="m2 6 4-4"></path>
                      <path d="m3 10 7-7"></path>
                      <path d="m14 21 7-7"></path>
                    </svg>
                  </div>
                  <h3>Personal Training</h3>
                  <p>One-on-one sessions with elite trainers who understand the demands of high-performance careers.</p>
                </div>

                <div className="execfit-service-card service-nutrition">
                  <div className="execfit-service-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 21h10"></path>
                      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"></path>
                      <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"></path>
                      <path d="M13 12a2.4 2.4 0 0 1-4-2.4 2.4 2.4 0 0 1 .57-4.38 2.4 2.4 0 0 1 4.1-2 2.4 2.4 0 0 1 4.1 1.47"></path>
                    </svg>
                  </div>
                  <h3>Nutrition Coaching</h3>
                  <p>Custom nutrition plans that fit your schedule, preferences, and performance goals.</p>
                </div>

                <div className="execfit-service-card service-mental">
                  <div className="execfit-service-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"></path>
                      <path d="M16 8V5c0-1.1.9-2 2-2"></path>
                      <path d="M12 13h4"></path>
                      <path d="M12 18h6a2 2 0 0 1 2 2v1"></path>
                      <path d="M12 8h8"></path>
                      <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"></path>
                      <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"></path>
                      <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"></path>
                      <path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"></path>
                    </svg>
                  </div>
                  <h3>Mental Performance</h3>
                  <p>Strategies to optimize focus, manage stress, and enhance recovery for peak performance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="execfit-about-section pt-16">
            <div className="execfit-container">
              <div className="execfit-about-content">
                <div className="execfit-about-text">
                  <h2 className="execfit-section-title execfit-title-glow">The ExecFit Approach</h2>
                  <p className="execfit-about-paragraph execfit-raleway-text execfit-black-glow">
                    We understand the unique challenges faced by high-performing professionals. Our methodology
                    integrates cutting-edge fitness science with practical solutions that fit into your demanding
                    schedule.
                  </p>
                  <p className="execfit-about-paragraph execfit-raleway-text execfit-black-glow">
                    ExecFit delivers results through personalized programming, accountability systems, and data-driven
                    progress tracking—all designed to maximize efficiency and effectiveness.
                  </p>
                  <Link href="/coming-soon" className="execfit-text-link">
                    Schedule your free consultation <span className="execfit-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Meet Our Coaches Section */}
          <section id="coaches" className="execfit-coaches-section pt-16">
            <div className="execfit-container">
              <h2 className="execfit-section-title execfit-title-glow">Meet Our Elite Coaches</h2>

              <p className="execfit-coaches-intro execfit-raleway-text execfit-black-glow">
                At ExecFit, our coaches are more than just fitness experts—they're partners in your journey to peak
                performance.
              </p>

              {/* Desktop coaches grid - Custom layout with 3 in top row, 2 in bottom row */}
              <div className="desktop-only">
                {/* Top row - 3 coaches */}
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="execfit-coach-card">
                    <div className="execfit-coach-image-container">
                      <Image
                        src="/images/coach-gabriela.jpg?v=2"
                        alt="Gabriela Garcia"
                        width={150}
                        height={150}
                        className="execfit-coach-image"
                      />
                    </div>
                    <h3 className="execfit-coach-name">Gabriela Garcia</h3>
                    <p className="execfit-coach-specialty">
                      Certified Personal Trainer | NASM Nutrition Coach | Pre-Script Barbell Coach | B.S. in Biology
                    </p>
                    <p className="execfit-coach-bio">
                      "Hi, I'm Gabriela! Life doesn't slow down for you, but that doesn't mean your goals should wait. I
                      help busy individuals build strength, confidence, and a body they're proud of!"
                    </p>
                  </div>

                  <div className="execfit-coach-card">
                    <div className="execfit-coach-image-container">
                      <Image
                        src="/images/coach-maddy.jpg?v=2"
                        alt="Maddy Gold"
                        width={150}
                        height={150}
                        className="execfit-coach-image"
                      />
                    </div>
                    <h3 className="execfit-coach-name">Maddy Gold</h3>
                    <p className="execfit-coach-specialty">
                      Certified Personal Trainer | PN1 Nutrition Coach | B.S. in Exercise Science
                    </p>
                    <p className="execfit-coach-bio">
                      "Hi, I'm Maddy! I specialize in building amazing bodies, good habits, and strength. Let's build up
                      confidence with a fun, balanced approach to fitness!"
                    </p>
                  </div>

                  <div className="execfit-coach-card">
                    <div className="execfit-coach-image-container">
                      <Image
                        src="/images/coach-ali.jpg?v=2"
                        alt="Ali Salah"
                        width={150}
                        height={150}
                        className="execfit-coach-image"
                      />
                    </div>
                    <h3 className="execfit-coach-name">Ali Salah</h3>
                    <p className="execfit-coach-specialty">
                      Certified Personal Trainer | PN1 Nutrition Coach | ISSA Corrective Exercise
                    </p>
                    <p className="execfit-coach-bio">
                      "The most valuable thing we have is time, and I am passionate about helping you make that time
                      long-lasting while you become stronger and healthier."
                    </p>
                  </div>
                </div>

                {/* Bottom row - 2 coaches with CTA in center */}
                <div className="grid grid-cols-3 gap-8">
                  <div className="flex justify-end">
                    <div className="execfit-coach-card">
                      <div className="execfit-coach-image-container">
                        <Image
                          src="/images/coach-kimi.jpg?v=2"
                          alt="Kimiya Kim"
                          width={150}
                          height={150}
                          className="execfit-coach-image"
                        />
                      </div>
                      <h3 className="execfit-coach-name">Kimiya Kim</h3>
                      <p className="execfit-coach-specialty">
                        Certified Personal Trainer | PN1 Nutrition Coach | Pre & Postnatal | ViPR 1
                      </p>
                      <p className="execfit-coach-bio">
                        "I blend injury prevention, rehab, strength, and cardio to build confident, resilient bodies
                        safely and effectively. Execute now and move with purpose!"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="text-center">
                      <Link href="/coming-soon" className="execfit-btn-primary execfit-btn-large">
                        Schedule Free Consultation
                      </Link>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="execfit-coach-card">
                      <div className="execfit-coach-image-container">
                        <Image
                          src="/images/coach-donatas.jpg"
                          alt="Donatas Petrus"
                          width={150}
                          height={150}
                          className="execfit-coach-image"
                        />
                      </div>
                      <h3 className="execfit-coach-name">Donatas Petrus</h3>
                      <p className="execfit-coach-specialty">
                        Certified Personal Trainer | PNL1 Nutrition Coach | M.S. in Medical Science | ISSA
                        Transformation Specialist | ISSA Corrective Exercise
                      </p>
                      <p className="execfit-coach-bio">
                        "Your schedule is packed, but your goals aren't waiting. Let's transform your mind and body, for
                        good. Exceptional training, better living."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Smooth Swipe Cards */}
              <div className="mobile-only">
                <div className="text-center mb-6">
                  <span className="text-white/60 text-sm">← Swipe to explore coaches →</span>
                </div>

                <div className="relative w-full max-w-xs mx-auto h-96 mb-8">
                  {/* Card Stack Container */}
                  <div
                    className="relative w-full h-full touch-pan-y"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      touchAction: "pan-y",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  >
                    {/* Static Background Card with Icon - Always behind everything */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        zIndex: 2, // Above traveling cards (z-index: -1)
                        transform: "scale(1)", // Changed from scale(0.9) to scale(1) to cover full area
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center">
                        <Image
                          src="/images/icononly.jpg"
                          alt="ExecFit Icon"
                          width={60}
                          height={60}
                          className="opacity-30"
                        />
                      </div>
                    </div>

                    {/* Render each coach as a separate, persistent card */}
                    {coaches.map((coach, index) => {
                      // Determine this card's position relative to current
                      let position: "current" | "next" | "prev" | "hidden"
                      if (index === currentCoachIndex) {
                        position = "current"
                      } else if (index === (currentCoachIndex + 1) % coaches.length) {
                        position = "next"
                      } else if (index === (currentCoachIndex - 1 + coaches.length) % coaches.length) {
                        position = "prev"
                      } else {
                        position = "hidden"
                      }

                      // Calculate transform for this specific card
                      const getCardSpecificTransform = () => {
                        const dragOffset = getDragOffset()

                        if (isTransitioning && swipeDirection) {
                          if (swipeDirection === "left") {
                            if (position === "current") {
                              return "translateX(-400px) rotate(-15deg) scale(0.8)"
                            } else if (position === "next") {
                              return "translateX(0px) rotate(0deg) scale(1)"
                            } else if (position === "prev") {
                              // Previous card travels across screen to right side (hidden)
                              return "translateX(400px) scale(0.95)"
                            }
                          } else if (swipeDirection === "right") {
                            if (position === "current") {
                              return "translateX(400px) rotate(15deg) scale(0.8)"
                            } else if (position === "prev") {
                              return "translateX(0px) rotate(0deg) scale(1)"
                            } else if (position === "next") {
                              // Next card travels across screen to left side (hidden)
                              return "translateX(-400px) scale(0.95)"
                            }
                          }
                        }

                        if (isDragging) {
                          if (position === "current") {
                            const rotation = Math.min(Math.max(dragOffset * 0.1, -15), 15)
                            return `translateX(${dragOffset}px) rotate(${rotation}deg) scale(${Math.max(0.98, 1 - Math.abs(dragOffset) * 0.0003)})`
                          } else if (position === "next" && dragOffset < -50) {
                            const slideAmount = Math.max(350 + dragOffset * 0.8, 20)
                            const scale = Math.min(0.95 + Math.abs(dragOffset) * 0.0008, 1)
                            return `translateX(${slideAmount}px) scale(${scale})`
                          } else if (position === "prev" && dragOffset > 50) {
                            const slideAmount = Math.min(-350 + dragOffset * 0.8, -20)
                            const scale = Math.min(0.95 + Math.abs(dragOffset) * 0.0008, 1)
                            return `translateX(${slideAmount}px) scale(${scale})`
                          }
                        }

                        // Default positions
                        if (position === "current") return "translateX(0px) rotate(0deg) scale(1)"
                        if (position === "next") return "translateX(350px) scale(0.95)"
                        if (position === "prev") return "translateX(-350px) scale(0.95)"
                        return "translateX(500px) scale(0.9)" // Hidden cards far off-screen
                      }

                      return (
                        <div
                          key={`coach-${coach.id}`}
                          className="absolute inset-0"
                          style={{
                            transform: getCardSpecificTransform(),
                            opacity: getCardOpacity(position),
                            zIndex: getCardZIndex(position),
                            transition:
                              position === "hidden" ||
                              (isTransitioning && swipeDirection === "left" && position === "prev") ||
                              (isTransitioning && swipeDirection === "right" && position === "next")
                                ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Transform only, no opacity transition for traveling cards
                                : isTransitioning
                                  ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-out"
                                  : isDragging
                                    ? "none"
                                    : position === "next" || position === "prev"
                                      ? "transform 0.2s ease-out, opacity 0.4s ease-out 0.4s" // 400ms delay for opacity when reaching next/prev position
                                      : "transform 0.2s ease-out, opacity 0.2s ease-out",
                            pointerEvents: position === "current" && !isTransitioning ? "auto" : "none",
                            // Force cards traveling to prev position AND hidden cards to be invisible
                            ...((isTransitioning && swipeDirection === "left" && position === "prev") ||
                            (isTransitioning && swipeDirection === "right" && position === "next") ||
                            position === "hidden"
                              ? { visibility: "hidden" }
                              : {}),
                          }}
                        >
                          {renderCoachCard(coach)}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Enhanced Navigation Dots - Updated for 5 coaches */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-3 bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    {coaches.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!isTransitioning && !isDragging) {
                            setCurrentCoachIndex(index)
                          }
                        }}
                        disabled={isTransitioning || isDragging}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentCoachIndex
                            ? "bg-white scale-125 shadow-lg"
                            : "bg-white/30 hover:bg-white/50 scale-100"
                        }`}
                        style={{
                          boxShadow:
                            index === currentCoachIndex
                              ? "0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6), 0 0 24px rgba(255, 255, 255, 0.4)"
                              : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Swipe Instructions */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-4 text-white/60 text-xs">
                    <span className="mr-2">←</span>
                    <span>Swipe</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}

          {/* Footer */}
          <footer className="execfit-site-footer">
            <div className="execfit-container">
              <div className="execfit-footer-content">
                <div className="execfit-footer-logo">
                  <Image
                    src="/images/icononly.jpg"
                    alt="ExecFit Icon"
                    width={48}
                    height={48}
                    className="execfit-footer-logo-img"
                  />
                </div>
                <div className="execfit-footer-links">
                  <Link href="/" className="execfit-footer-link">
                    Home
                  </Link>
                  <Link href="/program-options" className="execfit-footer-link">
                    Program Options
                  </Link>
                  <button onClick={() => scrollToSection("about")} className="execfit-footer-link">
                    About
                  </button>
                  <Link href="/contact" className="execfit-footer-link">
                    Contact
                  </Link>
                  <Link href="/cookbooks" className="execfit-footer-link">
                    Free Cookbooks
                  </Link>
                </div>
                <div className="execfit-footer-social">
                  <a
                    href="https://instagram.com/execfitnow"
                    className="execfit-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
                <div className="execfit-footer-bottom">
                  <p>© {currentYear} ExecFit. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
