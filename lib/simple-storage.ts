import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json")

export interface EmailSubscriber {
  id: string
  email: string
  cookbook_id?: string
  cookbook_title?: string
  subscribed_at: string
  source?: string
  is_active: boolean
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read subscribers from file
function readSubscribers(): EmailSubscriber[] {
  ensureDataDir()
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8")
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error("Error reading subscribers:", error)
    return []
  }
}

// Write subscribers to file
function writeSubscribers(subscribers: EmailSubscriber[]) {
  ensureDataDir()
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2))
  } catch (error) {
    console.error("Error writing subscribers:", error)
    throw error
  }
}

export async function saveEmailSubscriber(subscriber: Omit<EmailSubscriber, "id" | "subscribed_at">) {
  try {
    const subscribers = readSubscribers()

    // Check if email already exists
    const existingIndex = subscribers.findIndex((s) => s.email === subscriber.email)

    const newSubscriber: EmailSubscriber = {
      id: existingIndex >= 0 ? subscribers[existingIndex].id : Date.now().toString(),
      email: subscriber.email,
      cookbook_id: subscriber.cookbook_id,
      cookbook_title: subscriber.cookbook_title,
      subscribed_at: new Date().toISOString(),
      source: subscriber.source || "cookbook-download",
      is_active: true,
    }

    if (existingIndex >= 0) {
      // Update existing subscriber
      subscribers[existingIndex] = newSubscriber
    } else {
      // Add new subscriber
      subscribers.push(newSubscriber)
    }

    writeSubscribers(subscribers)
    return { success: true, data: newSubscriber }
  } catch (error) {
    console.error("Error saving email subscriber:", error)
    throw error
  }
}

export async function getEmailSubscribers() {
  try {
    const subscribers = readSubscribers()
    const activeSubscribers = subscribers
      .filter((s) => s.is_active)
      .sort((a, b) => new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime())

    return { success: true, data: activeSubscribers }
  } catch (error) {
    console.error("Error fetching email subscribers:", error)
    throw error
  }
}

export async function getSubscriberStats() {
  try {
    const subscribers = readSubscribers()
    const activeSubscribers = subscribers.filter((s) => s.is_active)

    const stats = activeSubscribers.reduce((acc: Record<string, number>, subscriber) => {
      const key = subscriber.cookbook_id || "unknown"
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return {
      success: true,
      data: stats,
      total: activeSubscribers.length,
    }
  } catch (error) {
    console.error("Error fetching subscriber stats:", error)
    throw error
  }
}
