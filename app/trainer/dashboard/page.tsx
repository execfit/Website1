"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, DollarSign, Clock, TrendingUp, Plus } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { getCurrentTrainerProfile } from "@/lib/auth"

interface DashboardStats {
  totalClients: number
  totalSessions: number
  monthlyRevenue: number
  upcomingSessions: number
  completionRate: number
}

interface UpcomingSession {
  id: string
  client_name: string
  session_date: string
  session_time: string
  duration_minutes: number
  client_apartment: string
}

interface RecentClient {
  id: string
  name: string
  sessions_remaining: number
  last_session: string
  apartment_building: string
}

export default function TrainerDashboard() {
  const [trainer, setTrainer] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalSessions: 0,
    monthlyRevenue: 0,
    upcomingSessions: 0,
    completionRate: 0,
  })
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [recentClients, setRecentClients] = useState<RecentClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Get trainer profile
      const trainerResult = await getCurrentTrainerProfile()
      if (trainerResult.success) {
        setTrainer(trainerResult.data)
      }

      // Load dashboard stats (mock data for now)
      setStats({
        totalClients: 12,
        totalSessions: 156,
        monthlyRevenue: 4680,
        upcomingSessions: 8,
        completionRate: 94,
      })

      // Load upcoming sessions (mock data)
      setUpcomingSessions([
        {
          id: "1",
          client_name: "Sarah Johnson",
          session_date: "2024-05-28",
          session_time: "09:00",
          duration_minutes: 60,
          client_apartment: "The Metropolitan",
        },
        {
          id: "2",
          client_name: "Mike Chen",
          session_date: "2024-05-28",
          session_time: "14:00",
          duration_minutes: 60,
          client_apartment: "Skyline Towers",
        },
        {
          id: "3",
          client_name: "Emma Davis",
          session_date: "2024-05-29",
          session_time: "08:00",
          duration_minutes: 60,
          client_apartment: "Harbor View",
        },
      ])

      // Load recent clients (mock data)
      setRecentClients([
        {
          id: "1",
          name: "Sarah Johnson",
          sessions_remaining: 6,
          last_session: "2024-05-25",
          apartment_building: "The Metropolitan",
        },
        {
          id: "2",
          name: "Mike Chen",
          sessions_remaining: 3,
          last_session: "2024-05-24",
          apartment_building: "Skyline Towers",
        },
        {
          id: "3",
          name: "Emma Davis",
          sessions_remaining: 8,
          last_session: "2024-05-23",
          apartment_building: "Harbor View",
        },
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
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
            <span className="text-white font-raleway">Loading dashboard...</span>
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

        {/* Additional floating squares */}
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/5 backdrop-blur-sm rotate-45 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border border-white/10 rotate-12 animate-pulse delay-300"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Header with ExecFit Branding - Mobile Optimized */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <Image src="/images/icononly.jpg" alt="ExecFit Icon" width={28} height={28} className="rounded-full md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white font-montserrat">
                Welcome back, {trainer?.name || "Trainer"}!
              </h1>
              <p className="text-sm md:text-base text-white/70 mt-1 font-raleway">
                Here's what's happening with your training business today.
              </p>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link href="/trainer/calendar">
              <Button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-white text-black hover:bg-white/90 font-semibold h-12 md:h-auto">
                <Plus className="h-4 w-4" />
                <span>Schedule Session</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          <Card className="bg-black/40 border-white/20 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-white">Total Clients</CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-white/60" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold text-white">{stats.totalClients}</div>
              <p className="text-xs text-white/60">Active clients</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/20 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-white">Sessions</CardTitle>
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-white/60" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold text-white">{stats.totalSessions}</div>
              <p className="text-xs text-white/60">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/20 backdrop-blur-md col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-white">Revenue</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-white/60" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-white/60">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/20 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-white">Upcoming</CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-white/60" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold text-white">{stats.upcomingSessions}</div>
              <p className="text-xs text-white/60">Next 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/20 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-white">Rate</CardTitle>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-white/60" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold text-white">{stats.completionRate}%</div>
              <p className="text-xs text-white/60">Attendance</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Upcoming Sessions */}
          <Card className="bg-black/40 border-white/20 backdrop-blur-md">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center space-x-2 text-white text-lg md:text-xl">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                <span>Upcoming Sessions</span>
              </CardTitle>
              <CardDescription className="text-white/60 text-sm">Your next scheduled training sessions</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3 md:space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border border-white/10 rounded-lg bg-white/5 space-y-2 md:space-y-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm md:text-base">{session.client_name}</h4>
                        <p className="text-xs md:text-sm text-white/60">{session.client_apartment}</p>
                        <div className="flex items-center space-x-2 md:space-x-4 mt-1">
                          <span className="text-xs md:text-sm text-white/50">{formatDate(session.session_date)}</span>
                          <span className="text-xs md:text-sm text-white/50">{formatTime(session.session_time)}</span>
                          <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                            {session.duration_minutes}min
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 w-full md:w-auto mt-2 md:mt-0">
                        View Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-white/60">
                    <Calendar className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-white/30" />
                    <p className="text-sm">No upcoming sessions scheduled</p>
                    <Link href="/trainer/calendar">
                      <Button variant="outline" className="mt-2 border-white/20 text-white hover:bg-white/10 w-full md:w-auto">
                        Schedule a Session
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Clients */}
          <Card className="bg-black/40 border-white/20 backdrop-blur-md">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center space-x-2 text-white text-lg md:text-xl">
                <Users className="h-4 w-4 md:h-5 md:w-5" />
                <span>Recent Clients</span>
              </CardTitle>
              <CardDescription className="text-white/60 text-sm">Your most active training clients</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3 md:space-y-4">
                {recentClients.length > 0 ? (
                  recentClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border border-white/10 rounded-lg bg-white/5 space-y-2 md:space-y-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm md:text-base">{client.name}</h4>
                        <p className="text-xs md:text-sm text-white/60">{client.apartment_building}</p>
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 mt-1">
                          <Badge
                            variant={client.sessions_remaining > 3 ? "default" : "destructive"}
                            className="bg-white/10 text-white border-white/20 text-xs w-fit"
                          >
                            {client.sessions_remaining} sessions left
                          </Badge>
                          <span className="text-xs md:text-sm text-white/50">Last: {formatDate(client.last_session)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 w-full md:w-auto mt-2 md:mt-0">
                        View Profile
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-white/60">
                    <Users className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-white/30" />
                    <p className="text-sm">No clients yet</p>
                    <p className="text-xs md:text-sm">Clients will appear here after purchasing sessions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <Card className="bg-black/40 border-white/20 backdrop-blur-md">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-white text-lg md:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-white/60 text-sm">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Link href="/trainer/calendar">
                <Button
                  variant="outline"
                  className="w-full h-16 md:h-20 flex flex-col items-center justify-center space-y-1 md:space-y-2 border-white/20 text-white hover:bg-white/10"
                >
                  <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-xs md:text-sm">Calendar</span>
                </Button>
              </Link>
              <Link href="/trainer/clients">
                <Button
                  variant="outline"
                  className="w-full h-16 md:h-20 flex flex-col items-center justify-center space-y-1 md:space-y-2 border-white/20 text-white hover:bg-white/10"
                >
                  <Users className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-xs md:text-sm">Clients</span>
                </Button>
              </Link>
              <Link href="/trainer/profile">
                <Button
                  variant="outline"
                  className="w-full h-16 md:h-20 flex flex-col items-center justify-center space-y-1 md:space-y-2 border-white/20 text-white hover:bg-white/10"
                >
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-xs md:text-sm">Profile</span>
                </Button>
              </Link>
              <Link href="/trainer/packages">
                <Button
                  variant="outline"
                  className="w-full h-16 md:h-20 flex flex-col items-center justify-center space-y-1 md:space-y-2 border-white/20 text-white hover:bg-white/10"
                >
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-xs md:text-sm">Packages</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
