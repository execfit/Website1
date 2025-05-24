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
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const coaches = [
    {
      id: "gabriela",
      name: "Gabriela Garcia",
      specialty: "Personal Trainer | Nutrition Coach",
      bio: "Life doesn't slow down for you, but that doesn't mean your goals should wait. I help busy individuals build strength, confidence, and a body they're proud of!",
      image: "/images/coach-gabriela.jpg",
      link: "/coaches/gabriela-garcia",
    },
    {
      id: "maddy",
      name: "Maddy Gold",
      specialty: "Certified Personal Trainer | PN1 Nutrition Coach",
      bio: "I specialize in building amazing bodies, good habits, and strength. Let's build up confidence with a fun, balanced approach to fitness!",
      image: "/images/coach-maddy.jpg",
      link: "/coaches/maddy-gold",
    },
    {
      id: "yosof",
      name: "Yosof Abuhasan",
      specialty: "Physique/Strength Training/Mindset Coaching",
      bio: "I'm a certified trainer focused on helping clients build muscle, burn fat, and develop the mental discipline to sustain long-term results.",
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

  // Simple Tinder-style swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (isTransitioning || !touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe || isRightSwipe) {
      setIsTransitioning(true)

      if (isLeftSwipe) {
        // Swipe left - show next coach
        setSwipeDirection("left")
        setTimeout(() => {
          setCurrentCoachIndex((prev) => (prev + 1) % coaches.length)
          setSwipeDirection(null)
          setIsTransitioning(false)
        }, 300)
      } else if (isRightSwipe) {
        // Swipe right - show previous coach
        setSwipeDirection("right")
        setTimeout(() => {
          setCurrentCoachIndex((prev) => (prev - 1 + coaches.length) % coaches.length)
          setSwipeDirection(null)
          setIsTransitioning(false)
        }, 300)
      }
    }

    setTouchStart(0)
    setTouchEnd(0)
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
          <div className="bg-floating-element bg-circle-4"></div>
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
          <h2 className="elevate-text">ELEVATE YOUR LIFESTYLE</h2>
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
                <div className="execfit-dictionary-definition execfit-dictionary-definition-compact">
                  <div className="execfit-definition-content">
                    <div className="def-flex">
                      <span className="execfit-term">ex·ec·u·tive</span>
                      <span className="execfit-pronunciation">| \ ig-ˈze-kyə-tiv \</span>
                    </div>
                    <div className="execfit-part-of-speech">adjective</div>
                    <div className="def-flex def-flex-align-top">
                      <span className="execfit-definition-text">
                        designed for or relating to execution or carrying into effect
                      </span>
                    </div>
                    <div className="execfit-definition-source">Merriam-Webster</div>
                  </div>
                </div>

                <p className="execfit-tagline execfit-raleway-text execfit-black-glow">
                  Premium fitness and nutrition coaching tailored for high-performing professionals who demand
                  excellence in every aspect of life.
                </p>
                <div className="execfit-buttons">
                  <button onClick={() => scrollToSection("coaches")} className="execfit-btn-primary">
                    Meet Our Coaches
                  </button>
                  <button onClick={() => scrollToSection("about")} className="execfit-btn-secondary">
                    Our Approach
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
                  <button onClick={() => scrollToSection("contact")} className="execfit-text-link">
                    Learn more about our methodology <span className="execfit-arrow">→</span>
                  </button>
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
                    Personal Trainer | Nutrition Coach | B.S. in Biology | Pre-Script Certified
                  </p>
                  <p className="execfit-coach-bio">
                    "Hi, I'm Gabriella! Life doesn't slow down for you, but that doesn't mean your goals should wait. I
                    help busy individuals build strength, confidence, and a body they're proud of!"
                  </p>
                  <Link href="/coaches/gabriela-garcia" className="execfit-coach-link">
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
                  <Link href="/coaches/maddy-gold" className="execfit-coach-link">
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
                    mental discipline to sustain long-term results."
                  </p>
                  <Link href="/coaches/yosof-abuhasan" className="execfit-coach-link">
                    View Profile <span className="execfit-arrow">→</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Tinder-style Swipe Cards */}
              <div className="mobile-only">
                <div className="text-center mb-6">
                  <span className="text-white/60 text-sm">← Swipe to explore coaches →</span>
                </div>

                <div className="relative w-full max-w-xs mx-auto h-96 mb-8 overflow-hidden">
                  {/* Current Card */}
                  <div
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      transform:
                        swipeDirection === "left"
                          ? "translateX(-120%) scale(0.95)"
                          : swipeDirection === "right"
                            ? "translateX(120%) scale(0.95)"
                            : "translateX(0%) scale(1)",
                      opacity: swipeDirection ? 0 : 1,
                      transition: isTransitioning ? "all 300ms cubic-bezier(0.4, 0.0, 0.2, 1)" : "none",
                      willChange: "transform, opacity",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl flex flex-col">
                      {/* Coach Image */}
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/30 shadow-lg flex-shrink-0">
                        <Image
                          src={coaches[currentCoachIndex].image || "/placeholder.svg"}
                          alt={coaches[currentCoachIndex].name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>

                      {/* Coach Info */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white text-center mb-3 leading-tight">
                          {coaches[currentCoachIndex].name}
                        </h3>

                        <p className="text-xs text-white/80 text-center mb-4 leading-relaxed font-medium">
                          {coaches[currentCoachIndex].specialty}
                        </p>

                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-sm text-white/90 text-center leading-relaxed italic px-2">
                            "{coaches[currentCoachIndex].bio}"
                          </p>
                        </div>

                        {/* View Profile Link */}
                        <div className="mt-4 pt-4 border-t border-white/20 flex-shrink-0">
                          <Link
                            href={coaches[currentCoachIndex].link}
                            className="block text-center text-white text-sm font-medium hover:text-white/80 transition-colors"
                          >
                            View Full Profile →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Card Preview (subtle background) */}
                  {!isTransitioning && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        transform: "translateX(5%) scale(0.95)",
                        opacity: 0.3,
                        zIndex: -1,
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
                            <Image
                              src={coaches[(currentCoachIndex + 1) % coaches.length].image || "/placeholder.svg"}
                              alt="Next coach"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    {coaches.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!isTransitioning) {
                            setCurrentCoachIndex(index)
                          }
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentCoachIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Swipe Instructions */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-4 text-white/60 text-xs">
                    <div className="flex items-center space-x-1">
                      <span>←</span>
                      <span>Previous</span>
                    </div>
                    <div className="w-px h-4 bg-white/30"></div>
                    <div className="flex items-center space-x-1">
                      <span>Next</span>
                      <span>→</span>
                    </div>
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
                <Link href="/contact" className="execfit-btn-primary execfit-btn-large">
                  Schedule a Consultation
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
                    href="https://instagram.com/execfitboston"
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
              </div>
              <div className="execfit-footer-bottom">
                <p>© {currentYear} ExecFit. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
