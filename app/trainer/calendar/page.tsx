"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock, Users, MapPin } from 'lucide-react'
import Image from "next/image"
import { getCurrentTrainerProfile } from "@/lib/auth"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core"

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  type: "session" | "blocked" | "consultation"
  client_name?: string
  client_apartment?: string
  status: "scheduled" | "completed" | "cancelled"
  backgroundColor?: string
  borderColor?: string
  textColor?: string
}

export default function TrainerCalendar() {
  const [trainer, setTrainer] = useState<any>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const calendarRef = useRef<FullCalendar>(null)

  useEffect(() => {
    loadCalendarData()
  }, [])

  const loadCalendarData = async () => {
    try {
      // Get trainer profile
      const trainerResult = await getCurrentTrainerProfile()
      if (trainerResult.success) {
        setTrainer(trainerResult.data)
      }

      // Load calendar events with ExecFit styling
      setEvents([
        {
          id: "1",
          title: "Training Session - Sarah Johnson",
          start: "2024-05-28T09:00:00",
          end: "2024-05-28T10:00:00",
          type: "session",
          client_name: "Sarah Johnson",
          client_apartment: "The Metropolitan",
          status: "scheduled",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderColor: "rgba(255, 255, 255, 1)",
          textColor: "#000000",
        },
        {
          id: "2",
          title: "Training Session - Mike Chen",
          start: "2024-05-28T14:00:00",
          end: "2024-05-28T15:00:00",
          type: "session",
          client_name: "Mike Chen",
          client_apartment: "Skyline Towers",
          status: "scheduled",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderColor: "rgba(255, 255, 255, 1)",
          textColor: "#000000",
        },
        {
          id: "3",
          title: "Blocked Time",
          start: "2024-05-29T12:00:00",
          end: "2024-05-29T13:00:00",
          type: "blocked",
          status: "scheduled",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.8)",
          textColor: "#000000",
        },
        {
          id: "4",
          title: "Consultation - Emma Davis",
          start: "2024-05-30T10:00:00",
          end: "2024-05-30T10:30:00",
          type: "consultation",
          client_name: "Emma Davis",
          client_apartment: "Harbor View",
          status: "scheduled",
          backgroundColor: "rgba(200, 200, 255, 0.9)",
          borderColor: "rgba(200, 200, 255, 1)",
          textColor: "#000000",
        },
      ])
    } catch (error) {
      console.error("Error loading calendar data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTodaysEvents = () => {
    const today = new Date().toISOString().split("T")[0]
    return events.filter((event) => event.start.startsWith(today))
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate >= today && eventDate <= nextWeek
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find((e) => e.id === clickInfo.event.id)
    if (event) {
      setSelectedEvent(event)
    }
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Enter event title:")
    if (title) {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        type: "session",
        status: "scheduled",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(255, 255, 255, 1)",
        textColor: "#000000",
      }
      setEvents([...events, newEvent])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Animation */}
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

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-white font-raleway">Loading calendar...</span>
          </div>
        </div>
      </div>
    )
  }

  const todaysEvents = getTodaysEvents()
  const upcomingEvents = getUpcomingEvents()

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
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-pulse`}
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
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Header with ExecFit Branding - Mobile Optimized */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <Image
                src="/images/icononly.jpg"
                alt="ExecFit Icon"
                width={28}
                height={28}
                className="rounded-full md:w-8 md:h-8"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white font-montserrat">Calendar</h1>
              <p className="text-sm md:text-base text-white/70 mt-1 font-raleway">Manage your training sessions and availability</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 border-white/20 text-white hover:bg-white/10 h-12 md:h-auto"
            >
              <Clock className="h-4 w-4" />
              <span>Block Time</span>
            </Button>
            <Button className="flex items-center justify-center space-x-2 bg-white text-black hover:bg-white/90 font-semibold h-12 md:h-auto">
              <Plus className="h-4 w-4" />
              <span>Schedule Session</span>
            </Button>
          </div>
        </div>

        {/* Calendar Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Calendar Area */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="bg-black/40 border-white/20 backdrop-blur-md">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center space-x-2 text-white text-lg md:text-xl">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Calendar View</span>
                </CardTitle>
                <CardDescription className="text-white/60 text-sm">Your training schedule and blocked times</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="fullcalendar-container">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: "prev,next",
                      center: "title",
                      right: "today",
                    }}
                    events={events}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={2}
                    weekends={true}
                    eventClick={handleEventClick}
                    select={handleDateSelect}
                    height="auto"
                    eventDisplay="block"
                    eventClassNames="execfit-calendar-event"
                    aspectRatio={1.2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Mobile Optimized */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            {/* Today's Schedule */}
            <Card className="bg-black/40 border-white/20 backdrop-blur-md">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg text-white">Today's Schedule</CardTitle>
                <CardDescription className="text-white/60 text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3">
                  {todaysEvents.length > 0 ? (
                    todaysEvents.map((event) => (
                      <div key={event.id} className="p-3 border border-white/10 rounded-lg bg-white/5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 space-y-1 md:space-y-0">
                          <Badge
                            variant={event.type === "session" ? "default" : "secondary"}
                            className="bg-white/10 text-white border-white/20 text-xs w-fit"
                          >
                            {event.type === "session"
                              ? "Session"
                              : event.type === "blocked"
                                ? "Blocked"
                                : "Consultation"}
                          </Badge>
                          <span className="text-xs md:text-sm text-white/50">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm text-white">{event.title}</h4>
                        {event.client_apartment && (
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3 text-white/40" />
                            <span className="text-xs text-white/50">{event.client_apartment}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 md:py-6 text-white/60">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-white/30" />
                      <p className="text-sm">No sessions today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="bg-black/40 border-white/20 backdrop-blur-md">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg text-white">Upcoming Sessions</CardTitle>
                <CardDescription className="text-white/60 text-sm">Next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="p-3 border border-white/10 rounded-lg bg-white/5">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{event.client_name || "Blocked Time"}</span>
                            <Badge variant="outline" className="text-xs border-white/20 text-white/80">
                              {formatDate(event.start)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </span>
                            {event.client_apartment && (
                              <span className="text-xs text-white/50">{event.client_apartment}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 md:py-6 text-white/60">
                      <Users className="h-8 w-8 mx-auto mb-2 text-white/30" />
                      <p className="text-sm">No upcoming sessions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-black/40 border-white/20 backdrop-blur-md">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg text-white">This Week</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Total Sessions</span>
                    <span className="font-medium text-white">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Hours Scheduled</span>
                    <span className="font-medium text-white">14.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Revenue</span>
                    <span className="font-medium text-white">$1,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom CSS for FullCalendar - Mobile Optimized */}
      <style jsx global>{`
        .fullcalendar-container .fc {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 0.5rem;
          backdrop-filter: blur(10px);
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc {
            padding: 1rem;
          }
        }

        .fullcalendar-container .fc-theme-standard .fc-scrollgrid {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .fullcalendar-container .fc-theme-standard td,
        .fullcalendar-container .fc-theme-standard th {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .fullcalendar-container .fc-col-header-cell {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 0.5rem 0.25rem;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-col-header-cell {
            font-size: 0.875rem;
            padding: 0.75rem 0.5rem;
          }
        }

        .fullcalendar-container .fc-daygrid-day {
          background: rgba(0, 0, 0, 0.2);
        }

        .fullcalendar-container .fc-daygrid-day:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .fullcalendar-container .fc-day-today {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .fullcalendar-container .fc-daygrid-day-number {
          color: white;
          font-weight: 500;
          font-size: 0.75rem;
          padding: 0.25rem;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-daygrid-day-number {
            font-size: 0.875rem;
            padding: 0.5rem;
          }
        }

        .fullcalendar-container .fc-toolbar {
          margin-bottom: 0.5rem;
          flex-direction: column;
          gap: 0.5rem;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-toolbar {
            margin-bottom: 1rem;
            flex-direction: row;
            gap: 0;
          }
        }

        .fullcalendar-container .fc-toolbar-title {
          color: white;
          font-size: 1.125rem;
          font-weight: 700;
          order: 1;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-toolbar-title {
            font-size: 1.5rem;
            order: 0;
          }
        }

        .fullcalendar-container .fc-toolbar-chunk {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fullcalendar-container .fc-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-weight: 500;
          font-size: 0.75rem;
          padding: 0.375rem 0.75rem;
          min-height: 2.5rem;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-button {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
            min-height: auto;
          }
        }

        .fullcalendar-container .fc-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .fullcalendar-container .fc-button:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }

        .fullcalendar-container .fc-button-active {
          background: white !important;
          color: black !important;
          border-color: white !important;
        }

        .fullcalendar-container .fc-event {
          border-radius: 4px;
          font-size: 0.625rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 1px;
          padding: 1px 2px;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-event {
            font-size: 0.75rem;
            margin: 2px;
            padding: 2px 4px;
          }
        }

        .fullcalendar-container .fc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .fullcalendar-container .fc-more-link {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.625rem;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-more-link {
            font-size: 0.75rem;
          }
        }

        .fullcalendar-container .fc-more-link:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .fullcalendar-container .fc-timegrid-slot {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .fullcalendar-container .fc-timegrid-axis {
          color: white;
        }

        .fullcalendar-container .fc-timegrid-slot-label {
          color: white;
        }

        .fullcalendar-container .fc-daygrid-day-frame {
          min-height: 2rem;
        }

        @media (min-width: 768px) {
          .fullcalendar-container .fc-daygrid-day-frame {
            min-height: 3rem;
          }
        }
      `}</style>
    </div>
  )
}
