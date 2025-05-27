export interface Client {
  id: string
  first_name: string
  last_name: string
  email: string
  apartment_building: string
  apartment_number: string
  sessions_remaining: number
  phone?: string
}

export interface BookingData {
  client_id: string
  trainer_id: string
  session_date: string
  session_time: string
  duration_minutes: number
  session_type: string
  location: string
  notes?: string
}

export interface BookingConfirmation {
  client_email: string
  client_name: string
  session_date: string
  session_time: string
  duration: string
  location: string
  trainer_name: string
  notes?: string
}

// Mock client data - replace with actual database calls
const mockClients: Client[] = [
  {
    id: "1",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@email.com",
    apartment_building: "The Metropolitan",
    apartment_number: "1205",
    sessions_remaining: 8,
    phone: "(555) 123-4567",
  },
  {
    id: "2",
    first_name: "Mike",
    last_name: "Chen",
    email: "mike.chen@email.com",
    apartment_building: "Skyline Towers",
    apartment_number: "2301",
    sessions_remaining: 5,
    phone: "(555) 234-5678",
  },
  {
    id: "3",
    first_name: "Emma",
    last_name: "Davis",
    email: "emma.davis@email.com",
    apartment_building: "Harbor View",
    apartment_number: "1502",
    sessions_remaining: 12,
    phone: "(555) 345-6789",
  },
  {
    id: "4",
    first_name: "James",
    last_name: "Wilson",
    email: "james.wilson@email.com",
    apartment_building: "The Metropolitan",
    apartment_number: "3401",
    sessions_remaining: 0,
    phone: "(555) 456-7890",
  },
]

export async function searchClients(query: string): Promise<Client[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const lowercaseQuery = query.toLowerCase()
  return mockClients.filter(
    (client) =>
      client.first_name.toLowerCase().includes(lowercaseQuery) ||
      client.last_name.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      `${client.first_name} ${client.last_name}`.toLowerCase().includes(lowercaseQuery),
  )
}

export async function bookSession(bookingData: BookingData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // TODO: Implement actual booking logic with database
  console.log("Booking session:", bookingData)

  // Return booking confirmation
  return {
    id: Date.now().toString(),
    ...bookingData,
    status: "confirmed",
    created_at: new Date().toISOString(),
  }
}

export async function sendBookingConfirmation(confirmation: BookingConfirmation) {
  const { sendBookingConfirmation: sendEmail } = await import("./email")

  return await sendEmail({
    to: confirmation.client_email,
    clientName: confirmation.client_name,
    trainerName: confirmation.trainer_name,
    sessionDate: confirmation.session_date,
    sessionTime: confirmation.session_time,
    duration: confirmation.duration,
    location: confirmation.location,
    sessionType: "personal_training", // or map from confirmation data
    notes: confirmation.notes,
  })
}

export async function cancelSession(sessionId: string, reason?: string, chargeClient = false) {
  // TODO: Implement session cancellation logic
  console.log("Canceling session:", { sessionId, reason, chargeClient })

  // If not charging client, restore session to their bank
  if (!chargeClient) {
    // TODO: Increment client's session count
    console.log("Session restored to client's bank")
  }

  return {
    success: true,
    message: chargeClient ? "Session canceled and charged" : "Session canceled, no charge to client",
  }
}

export async function processCompletedSession(sessionId: string) {
  // TODO: Automatically deduct session from client's bank when session time passes
  console.log("Processing completed session:", sessionId)

  return {
    success: true,
    message: "Session completed and deducted from client's bank",
  }
}
