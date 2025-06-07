"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"

export default function ProgramOptionsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Force scroll to top on page load/refresh
    window.scrollTo(0, 0)

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }

    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto"
      }
    }
  }, [])

  useEffect(() => {
    // Logo Animation
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight / 3
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

  const packages = [
    {
      name: "EXECUTIVE TIER",
      sessions: 48,
      cadence: "4x/week",
      description:
        "An immersive transformation plan focused on performance, body composition, and long-term habit change—you will be guided step-by-step by your coach throughout the week.",
    },
    {
      name: "PERFORMANCE BUILDER",
      sessions: 36,
      cadence: "3x/week",
      description:
        "Designed to build strength, alter body composition, and embed life changing habits—the Performance Builder package balances structure with flexibility for your lifestyle.",
    },
    {
      name: "FOUNDATION PACKAGE",
      sessions: 24,
      cadence: "2x/week",
      description:
        "A foundational plan for improving strength, fitness, and daily routines—with time to build sustainable change.",
    },
    {
      name: "JUMPSTART",
      sessions: 12,
      cadence: "2x/week",
      description:
        "The perfect starting point for anyone ready to reset habits, build confidence, and get expert guidance in a short burst.",
    },
    {
      name: "MAINTENANCE COACHING",
      sessions: 6,
      cadence: "1x/week",
      description: "Designed for lighter seasons—keep up the momentum with strategic guidance and accountability.",
    },
  ]

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

        <div className="tagline-container" style={{ marginTop: "2rem" }}>
          <h2 className="elevate-text" data-text="PRIVATE TRAINING PROGRAMS">
            PRIVATE TRAINING PROGRAMS
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content" style={{ marginTop: "-3rem" }}>
        <div className="execfit-homepage">
          {/* Packages Section */}
          <section className="execfit-services-section pt-0">
            <div className="execfit-container">
              {/* Intro Text */}
              <div className="text-center mb-8">
                <p
                  className="execfit-raleway-text execfit-black-glow"
                  style={{
                    fontSize: "1.2rem",
                    lineHeight: "1.7",
                    maxWidth: "900px",
                    margin: "0 auto",
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  Our convenient concierge-style coaching programs are designed for residents of Boston's premier
                  apartment buildings. Each program includes private in-building training sessions, personalized workout
                  programming, ongoing nutrition guidance, habit tracking, and full access to the ExecFit App.
                </p>
              </div>

              {/* Desktop Table */}
              <div className="desktop-only">
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    overflow: "hidden",
                    boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {/* Table Header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.5fr 0.8fr 1.2fr 2.5fr",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
                      padding: "18px 20px",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      color: "white",
                      alignItems: "center",
                    }}
                  >
                    <div>PROGRAM</div>
                    <div style={{ textAlign: "center" }}>SESSIONS</div>
                    <div style={{ textAlign: "center" }}>RECOMMENDED CADENCE</div>
                    <div>WHAT TO EXPECT</div>
                  </div>

                  {/* Table Rows */}
                  {packages.map((pkg, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 0.8fr 1.2fr 2.5fr",
                        padding: "18px 20px",
                        borderBottom: index === packages.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "background-color 0.3s ease",
                        alignItems: "center",
                        minHeight: "60px",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontWeight: "600",
                            fontSize: "1rem",
                            color: "white",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {pkg.name}
                        </span>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontWeight: "500",
                            fontSize: "1.1rem",
                            color: "white",
                          }}
                        >
                          {pkg.sessions}
                        </span>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontWeight: "500",
                            fontSize: "0.95rem",
                            color: "white",
                          }}
                        >
                          {pkg.cadence}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: "0.9rem",
                            lineHeight: "1.6",
                            color: "white",
                            textShadow:
                              "1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.8), 1px -1px 2px rgba(0, 0, 0, 0.8), -1px 1px 2px rgba(0, 0, 0, 0.8)",
                            fontWeight: "500",
                          }}
                        >
                          {pkg.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-only">
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {packages.map((pkg, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)",
                        padding: "24px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                    >
                      <div style={{ marginBottom: "16px" }}>
                        <h3
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontWeight: "600",
                            fontSize: "1.2rem",
                            color: "white",
                            marginBottom: "8px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {pkg.name}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-montserrat), sans-serif",
                              fontWeight: "500",
                              fontSize: "0.9rem",
                              color: "rgba(255, 255, 255, 0.8)",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {pkg.sessions} Sessions
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-montserrat), sans-serif",
                              fontWeight: "500",
                              fontSize: "0.9rem",
                              color: "rgba(255, 255, 255, 0.8)",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            Recommended Cadence: {pkg.cadence}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: "0.9rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                            margin: "0",
                          }}
                        >
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footnote */}
              <div style={{ marginTop: "40px", textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    maxWidth: "800px",
                    margin: "0 auto",
                    lineHeight: "1.5",
                    fontStyle: "italic",
                  }}
                >
                  We understand that schedules vary. While each program is designed for consistent weekly coaching, we
                  work with you to adjust plans around business travel or vacation.
                </p>
              </div>

              {/* CTA */}
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <Link href="/coming-soon" className="execfit-btn-primary execfit-btn-large">
                  Schedule Free Consultation
                </Link>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "1rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginTop: "15px",
                  }}
                >
                  Let's discuss which program fits your goals and lifestyle
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
