"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { searchClients, bookSession, sendBookingConfirmation } from "../lib/booking"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: string
  selectedTime?: string
  onBookingComplete: (booking: any) => void
}

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string
  apartment_building: string
  apartment_number: string
  sessions_remaining: number
  phone?: string
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onBookingComplete,
}: BookingModalProps) {
  const [step, setStep] = useState(1) // 1: Search Client, 2: Session Details, 3: Confirmation
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [sessionDetails, setSessionDetails] = useState({
    date: selectedDate || "",
    time: selectedTime || "",
    duration: "60",
    type: "personal_training",
    notes: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (selectedDate) setSessionDetails((prev) => ({ ...prev, date: selectedDate }))
    if (selectedTime) setSessionDetails((prev) => ({ ...prev, time: selectedTime }))
  }, [selectedDate, selectedTime])

  const handleClientSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const results = await searchClients(searchQuery)
      setSearchResults(results)
    } catch (error) {
      setError("Failed to search clients")
    } finally {
      setLoading(false)
    }
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setSessionDetails((prev) => ({
      ...prev,
      location: client.apartment_building,
    }))
    setStep(2)
  }

  const handleBookSession = async () => {
    if (!selectedClient) return

    setLoading(true)
    setError("")

    try {
      // Check if client has sessions remaining
      if (selectedClient.sessions_remaining <= 0) {
        setError("Client has no sessions remaining. Please have them purchase more sessions.")
        return
      }

      // Book the session
      const booking = await bookSession({
        client_id: selectedClient.id,
        trainer_id: "current-trainer", // TODO: Get from auth context
        session_date: sessionDetails.date,
        session_time: sessionDetails.time,
        duration_minutes: Number.parseInt(sessionDetails.duration),
        session_type: sessionDetails.type,
        location: sessionDetails.location,
        notes: sessionDetails.notes,
      })

      // Send confirmation email
      await sendBookingConfirmation({
        client_email: selectedClient.email,
        client_name: `${selectedClient.first_name} ${selectedClient.last_name}`,
        session_date: sessionDetails.date,
        session_time: sessionDetails.time,
        duration: sessionDetails.duration,
        location: sessionDetails.location,
        trainer_name: "Current Trainer", // TODO: Get from auth context
      })

      setSuccess(true)
      onBookingComplete(booking)

      setTimeout(() => {
        onClose()
        resetModal()
      }, 2000)
    } catch (error) {
      setError("Failed to book session. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setSearchQuery("")
    setSearchResults([])
    setSelectedClient(null)
    setSessionDetails({
      date: "",
      time: "",
      duration: "60",
      type: "personal_training",
      notes: "",
      location: "",
    })
    setError("")
    setSuccess(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black/90 border-white/20 text-white max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center backdrop-blur-sm mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Session Booked Successfully!</h3>
            <p className="text-white/70 mb-4">Confirmation email sent to {selectedClient?.email}</p>
            <div className="space-y-2 text-sm text-white/60">
              <p>
                {selectedClient?.first_name} {selectedClient?.last_name}
              </p>
              <p>
                {formatDate(sessionDetails.date)} at {formatTime(sessionDetails.time)}
              </p>
              <p>{sessionDetails.location}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {step === 1 ? "Find Client" : step === 2 ? "Session Details" : "Confirm Booking"}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {step === 1
              ? "Search for a client by name or email"
              : step === 2
                ? "Set up the training session"
                : "Review and confirm the booking"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Client Search */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyPress={(e) => e.key === "Enter" && handleClientSearch()}
              />
              <Button onClick={handleClientSearch} disabled={loading} className="bg-white text-black hover:bg-white/90">
                Search
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 border border-white/10 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleClientSelect(client)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">
                          {client.first_name} {client.last_name}
                        </h4>
                        <p className="text-sm text-white/60 flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{client.email}</span>
                        </p>
                        <p className="text-sm text-white/60 flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {client.apartment_building} - Unit {client.apartment_number}
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant={client.sessions_remaining > 0 ? "default" : "destructive"}
                        className="bg-white/10 text-white border-white/20"
                      >
                        {client.sessions_remaining} sessions
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Session Details */}
        {step === 2 && selectedClient && (
          <div className="space-y-4">
            {/* Client Info */}
            <div className="p-4 border border-white/10 rounded-lg bg-white/5">
              <h4 className="font-medium text-white mb-2">
                Client: {selectedClient.first_name} {selectedClient.last_name}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                <div>Email: {selectedClient.email}</div>
                <div>Sessions: {selectedClient.sessions_remaining}</div>
                <div>Building: {selectedClient.apartment_building}</div>
                <div>Unit: {selectedClient.apartment_number}</div>
              </div>
            </div>

            {/* Session Details Form */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Date</Label>
                <Input
                  type="date"
                  value={sessionDetails.date}
                  onChange={(e) => setSessionDetails((prev) => ({ ...prev, date: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Time</Label>
                <Input
                  type="time"
                  value={sessionDetails.time}
                  onChange={(e) => setSessionDetails((prev) => ({ ...prev, time: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Duration (minutes)</Label>
                <Select
                  value={sessionDetails.duration}
                  onValueChange={(value) => setSessionDetails((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Session Type</Label>
                <Select
                  value={sessionDetails.type}
                  onValueChange={(value) => setSessionDetails((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="personal_training">Personal Training</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="assessment">Fitness Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-white">Location</Label>
              <Input
                value={sessionDetails.location}
                onChange={(e) => setSessionDetails((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Training location"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label className="text-white">Notes (Optional)</Label>
              <Textarea
                value={sessionDetails.notes}
                onChange={(e) => setSessionDetails((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special notes for this session..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
              <Button
                onClick={handleBookSession}
                disabled={loading || !sessionDetails.date || !sessionDetails.time}
                className="bg-white text-black hover:bg-white/90"
              >
                {loading ? "Booking..." : "Book Session"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
