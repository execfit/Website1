"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/header"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function InviteAccessToBookPage() {
  const [expandedCoach, setExpandedCoach] = useState<string | null>(null)

  // Force scroll to top on page load/refresh - Enhanced version for Safari
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

    // Safari-specific: Additional delay for Safari's scroll restoration
    const safariTimeoutId = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)

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

    // Handle page show event (Safari specific)
    const handlePageShow = () => {
      window.scrollTo(0, 0)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("popstate", handlePopState)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("pageshow", handlePageShow)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(safariTimeoutId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("pageshow", handlePageShow)

      // Restore default scroll restoration when component unmounts
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto"
      }
    }
  }, [])

  // Coaches list with Chris White first
  const coaches = [
    {
      id: "chris-white",
      name: "Chris White",
      title: "Founder | ExecFit",
      specialty: "ACE Certified Personal Trainer | PN1 Nutrition Coach",
      image: "/images/chris-headshot.jpg",
      embedUrl:
        "https://start.execfitnow.com/a/booking/?serviceId=22790&staffId=2240915&embedded=true&iframe=true&web_embed=true",
    },
    {
      id: "ali",
      name: "Ali Salah",
      title: "Certified Personal Trainer",
      specialty: "PN1 Nutrition Coach | ISSA Corrective Exercise",
      image: "/images/ali-headshot.jpg",
      embedUrl:
        "https://start.execfitnow.com/a/booking/?serviceId=22790&staffId=2293435&embedded=true&iframe=true&web_embed=true",
    },    
    {
      id: "maddy",
      name: "Maddy Gold",
      title: "Certified Personal Trainer",
      specialty: "PN1 Nutrition Coach | B.S. in Exercise Science",
      image: "/images/maddy-headshot.jpg",
      embedUrl:
        "https://start.execfitnow.com/a/booking/?serviceId=22790&staffId=2290067&embedded=true&iframe=true&web_embed=true",
    },
    {
      id: "donatas",
      name: "Donatas Petrus",
      title: "Certified Personal Trainer",
      specialty:
        "PN1 Nutrition Coach | M.S. in Medical Science | ISSA Transformation Specialist | ISSA Corrective Exercise",
      image: "/images/donatas-headshot.jpg",
      embedUrl:
        "https://start.execfitnow.com/a/booking/?serviceId=22790&staffId=2289084&embedded=true&iframe=true&web_embed=true",
    },
    {
      id: "kimi",
      name: "Kimiya Kim",
      title: "Certified Personal Trainer",
      specialty: "PN1 Nutrition Coach | Pre & Postnatal | ViPR 1",
      image: "/images/kimi-headshot.jpg",
      embedUrl:
        "https://start.execfitnow.com/a/booking/?serviceId=22790&staffId=2275183&embedded=true&iframe=true&web_embed=true",
    },
  ]

  const toggleCoach = (coachId: string) => {
    setExpandedCoach(expandedCoach === coachId ? null : coachId)
  }

  return (
    <div className="execfit-main">
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

      {/* Main Content */}
      <div className="main-content">
        <div className="execfit-homepage">
          <section className="py-8 md:py-20">
            <div className="execfit-container">
              {/* Page Header */}
              <div className="text-center mb-8 md:mb-16">
                <h1 className="execfit-section-title execfit-title-glow text-4xl md:text-5xl mb-6">
                  Book Your Free Consultation
                </h1>
                <p className="execfit-raleway-text execfit-black-glow text-lg md:text-xl max-w-3xl mx-auto">
                  Choose your preferred coach and schedule your complimentary consultation session. Click on any coach
                  below to access their calendar.
                </p>
              </div>

              {/* Coaches List */}
              <div className="max-w-4xl mx-auto space-y-6">
                {coaches.map((coach, index) => (
                  <div key={coach.id} className="relative">
                    {/* Coach Card */}
                    <div
                      className={`
  relative bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md 
  border border-white/20 rounded-xl p-4 md:p-6 cursor-pointer 
  transition-all duration-300 hover:border-white/40 hover:shadow-2xl
  min-h-[120px] md:min-h-[140px]
  ${expandedCoach === coach.id ? "border-white/40 shadow-2xl" : ""}
`}
                      onClick={() => toggleCoach(coach.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 md:space-x-6 w-full">
                          {/* Coach Image */}
                          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
                            <Image
                              src={coach.image || "/placeholder.svg"}
                              alt={coach.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                              priority={index === 0}
                            />
                          </div>

                          {/* Coach Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1 md:mb-2">
                              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white truncate">
                                {coach.name}
                              </h3>
                            </div>
                            <p className="text-white/90 font-medium mb-1 text-sm md:text-base">{coach.title}</p>
                            <p className="text-white/70 text-xs md:text-sm leading-tight">
                              {/* Mobile-specific text for Donatas - remove ISSA Transformation Specialist */}
                              {coach.id === "donatas" ? (
                                <>
                                  <span className="md:hidden">
                                    PN1 Nutrition Coach | M.S. in Medical Science | ISSA Corrective Exercise
                                  </span>
                                  <span className="hidden md:inline">{coach.specialty}</span>
                                </>
                              ) : (
                                coach.specialty
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div className="flex-shrink-0 ml-2 md:ml-4">
                          {expandedCoach === coach.id ? (
                            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
                          ) : (
                            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Embedded Booking Calendar */}
                    {expandedCoach === coach.id && (
                      <div className="mt-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                          <h4 className="text-white font-medium text-center">Schedule with {coach.name}</h4>
                        </div>
                        <div className="relative">
                          {coach.embedUrl.includes("PLACEHOLDER") ? (
                            <div className="h-96 flex items-center justify-center bg-black/40">
                              <div className="text-center">
                                <p className="text-white/60 mb-2">Booking calendar coming soon</p>
                                <p className="text-white/40 text-sm">
                                  Contact us directly to schedule with {coach.name}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <iframe
                              src={coach.embedUrl}
                              width="100%"
                              height="600"
                              frameBorder="0"
                              scrolling="yes"
                              className="w-full"
                              title={`Book consultation with ${coach.name}`}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer Information Section */}
              <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8">
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 execfit-title-glow">What to Expect</h3>
                    <p className="execfit-raleway-text execfit-black-glow text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                      Your coach will meet you in the lobby of your building to discuss your goals, exercise history,
                      prior injuries, and provide some actionable steps you can execute right now.
                    </p>
                  </div>
                </div>
              </div>              
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
