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
      specialty: "Certified Personal Trainer | Certified Nutrition Coach | B.S. in Biology",
      bio: "Life doesn't slow down for you, but that doesn't mean your goals should wait. I help busy individuals build strength, confidence, and a body they're proud of!",
      image: "/images/coach-gabriela.jpg",
      link: "/coaches/gabriela-garcia",
    },
    {
      id: "maddy",
      name: "Maddy Gold",
      specialty: "Certified Personal Trainer | PN1 Nutrition Coach | B.S. in Exercise Science",
      bio: "I specialize in building amazing bodies, good habits, and strength. Let's build up confidence with a fun, balanced approach to fitness!",
      image: "/images/coach-maddy.jpg",
      link: "/coaches/maddy-gold",
    },
    {
      id: "yosof",
      name: "Yosof Abuhasan",
      specialty: "Physique/Strength Training/Mindset Coaching",
      bio: "I'm Yosof, a certified trainer focused on helping clients build muscle, burn fat, and develop the mental discipline to sustain long-term results through proven methods.",
      bioMobile:
        "I'm focused on helping clients build muscle, burn fat, and develop mental discipline to sustain long-term results.",
      image: "/images/coach-yosof.jpg",
      link: "/coaches/yosof-abuhasan",
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
          <p className="text-sm text-white/90 text-center leading-relaxed italic px-2">
            "{coach.bioMobile || coach.bio}"
          </p>
        </div>

        {/* View Profile Link */}
        <div className="mt-4 pt-4 border-t border-white/20 flex-shrink-0">
          <Link
            href={coach.link}
            className="block text-center text-white text-sm font-medium hover:text-white/80 transition-colors"
          >
            View Full Profile →
          </Link>
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

  // Calculate opacity for this specific card
  const getCardOpacity = (position: "current" | "next" | "prev" | "hidden") => {
    if (position === "hidden") return 0

    // Set opacity to 0 immediately when swipe direction is determined for traveling cards
    if (swipeDirection) {
      if (swipeDirection === "left") {
        if (position === "current") return Math.max(0.3, 1 - 0.7) // Fade out as it leaves
        if (position === "next") return 1 // Fade in as it becomes current
        if (position === "prev") return 0 // Hide previous card immediately during cross-screen travel
      } else if (swipeDirection === "right") {
        if (position === "current") return Math.max(0.3, 1 - 0.7) // Fade out as it leaves
        if (position === "prev") return 1 // Fade in as it becomes current
        if (position === "next") return 0 // Hide next card immediately during cross-screen travel
      }
    }

    if (isDragging) {
      if (position === "current") {
        return Math.max(0.8, 1 - Math.abs(getDragOffset()) * 0.001)
      } else if (position === "next" && getDragOffset() < -50) {
        return 0.8
      } else if (position === "prev" && getDragOffset() > 50) {
        return 0.8
      }
    }

    // Default opacities
    if (position === "current") return 1
    if (position === "next" || position === "prev") return 0.7
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
          <h2 className="elevate-text" data-text="EXECUTE NOW.">
            EXECUTE NOW.
          </h2>
        </div>
      </div>

      {/* Main homepage content */}
      <div className="main-content">
        <div className="execfit-homepage execfit-transparent-sections">
          {/* Intro Section */}
          <section className="execfit-intro-section pt-0">
            <div className="execfit-container">
              <div className="execfit-intro-content">
                {/* Dictionary Definition */}
                <div
                  className="execfit-dictionary-definition execfit-dictionary-definition-compact"
                  style={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)" }}
                >
                  <div className="execfit-definition-content text-center">
                    <div className="def-flex justify-center">
                      <span className="execfit-term">SPECIAL OFFER</span>
                    </div>
                    <div className="def-flex def-flex-align-top justify-center">
                      <span className="execfit-definition-text font-bold">
                        Your first personal training session is completely FREE
                      </span>
                    </div>
                    <div className="execfit-definition-source text-center">No commitment required</div>
                  </div>
                </div>

                <p className="execfit-tagline execfit-raleway-text execfit-black-glow">
                  We bring highly skilled coaches to luxury apartment buildings.
                </p>
                <div className="execfit-buttons">
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

              {/* Desktop coaches grid */}
              <div className="execfit-coaches-grid desktop-only">
                <div className="execfit-coach-card">
                  <div className="execfit-coach-image-container">
                    <Image
                      src="/images/coach-gabriela.jpg"
                      alt="Gabriela Garcia"
                      width={150}
                      height={150}
                      className="execfit-coach-image"
                    />
                  </div>
                  <h3 className="execfit-coach-name">Gabriela Garcia</h3>
                  <p className="execfit-coach-specialty">
                    Certified Personal Trainer | NASM Nutrition Coach | Pre-Script Certified Barbell Coach | B.S. in Biology
                  </p>
                  <p className="execfit-coach-bio">
                    "Hi, I'm Gabriella! Life doesn't slow down for you, but that doesn't mean your goals should wait. I
                    help busy individuals build strength, confidence, and a body they're proud of!"
                  </p>
                  <Link href="/coming-soon" className="execfit-coach-link">
                    View Profile <span className="execfit-arrow">→</span>
                  </Link>
                </div>

                <div className="execfit-coach-card">
                  <div className="execfit-coach-image-container">
                    <Image
                      src="/images/coach-maddy.jpg"
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
                  <Link href="/coming-soon" className="execfit-coach-link">
                    View Profile <span className="execfit-arrow">→</span>
                  </Link>
                </div>

                <div className="execfit-coach-card">
                  <div className="execfit-coach-image-container">
                    <Image
                      src="/images/coach-yosof.jpg"
                      alt="Yosof Abuhasan"
                      width={150}
                      height={150}
                      className="execfit-coach-image"
                    />
                  </div>
                  <h3 className="execfit-coach-name">Yosof Abuhasan</h3>
                  <p className="execfit-coach-specialty">Physique/Strength Training/Mindset Coaching</p>
                  <p className="execfit-coach-bio">
                    "I'm Yosof, a certified trainer focused on helping clients build muscle, burn fat, and develop the
                    mental discipline to sustain long-term results through proven methods."
                  </p>
                  <Link href="/coming-soon" className="execfit-coach-link">
                    View Profile <span className="execfit-arrow">→</span>
                  </Link>
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

                      // Calculate opacity for this specific card
                      const getCardOpacity = () => {
                        if (position === "hidden") return 0

                        // Set opacity to 0 immediately when swipe direction is determined for traveling cards
                        if (swipeDirection) {
                          if (swipeDirection === "left") {
                            if (position === "current") return Math.max(0.3, 1 - 0.7) // Fade out as it leaves
                            if (position === "next") return 1 // Fade in as it becomes current
                            if (position === "prev") return 0 // Hide previous card immediately during cross-screen travel
                          } else if (swipeDirection === "right") {
                            if (position === "current") return Math.max(0.3, 1 - 0.7) // Fade out as it leaves
                            if (position === "prev") return 1 // Fade in as it becomes current
                            if (position === "next") return 0 // Hide next card immediately during cross-screen travel
                          }
                        }

                        if (isDragging) {
                          if (position === "current") {
                            return Math.max(0.8, 1 - Math.abs(getDragOffset()) * 0.001)
                          } else if (position === "next" && getDragOffset() < -50) {
                            return 0.8
                          } else if (position === "prev" && getDragOffset() > 50) {
                            return 0.8
                          }
                        }

                        // Default opacities
                        if (position === "current") return 1
                        if (position === "next" || position === "prev") return 0.7
                        return 0
                      }

                      return (
                        <div
                          key={`coach-${coach.id}`} // Stable key based on coach ID
                          className="absolute inset-0"
                          style={{
                            transform: getCardSpecificTransform(),
                            opacity: getCardOpacity(),
                            zIndex: getCardZIndex(position),
                            transition: isTransitioning
                              ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-out" // Removed z-index from transition
                              : isDragging
                                ? "none"
                                : "transform 0.2s ease-out, opacity 0.2s ease-out", // Removed z-index from transition
                            pointerEvents: position === "current" && !isTransitioning ? "auto" : "none",
                          }}
                        >
                          {renderCoachCard(coach)}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Enhanced Navigation Dots */}
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

              <div className="execfit-coaches-cta">
                <Link href="/coaches" className="execfit-btn-secondary">
                  View All Coaches
                </Link>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="contact" className="execfit-cta-section pt-16">
            <div className="execfit-container">
              <div className="execfit-cta-content">
                <h2 className="execfit-cta-title execfit-title-glow">Ready to Transform Your Fitness?</h2>
                <p className="execfit-cta-text">
                  Join the elite professionals who have elevated their performance both in and out of the gym.
                </p>
                <Link href="/coming-soon" className="execfit-btn-primary execfit-btn-large">
                  Schedule a Free Consultation
                </Link>
              </div>
            </div>
          </section>

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
                  <button onClick={() => scrollToSection("services")} className="execfit-footer-link">
                    Services
                  </button>
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
