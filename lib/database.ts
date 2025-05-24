import { sql } from "@vercel/postgres"

export interface EmailSubscriber {
  id?: number
  email: string
  cookbook_id?: string
  cookbook_title?: string
  subscribed_at?: string
  source?: string
  is_active?: boolean
}

export async function saveEmailSubscriber(subscriber: Omit<EmailSubscriber, "id" | "subscribed_at">) {
  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS email_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        cookbook_id VARCHAR(100),
        cookbook_title VARCHAR(255),
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        source VARCHAR(50) DEFAULT 'cookbook-download',
        is_active BOOLEAN DEFAULT true
      );
    `

    // Insert or update subscriber
    const result = await sql`
      INSERT INTO email_subscribers (email, cookbook_id, cookbook_title, source, is_active)
      VALUES (${subscriber.email}, ${subscriber.cookbook_id}, ${subscriber.cookbook_title}, ${subscriber.source || "cookbook-download"}, true)
      ON CONFLICT (email) 
      DO UPDATE SET 
        cookbook_id = EXCLUDED.cookbook_id,
        cookbook_title = EXCLUDED.cookbook_title,
        subscribed_at = NOW()
      RETURNING *;
    `

    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("Error saving email subscriber:", error)
    throw error
  }
}

export async function getEmailSubscribers() {
  try {
    const result = await sql`
      SELECT * FROM email_subscribers 
      WHERE is_active = true 
      ORDER BY subscribed_at DESC;
    `
    return { success: true, data: result.rows }
  } catch (error) {
    console.error("Error fetching email subscribers:", error)
    throw error
  }
}

export async function getSubscriberStats() {
  try {
    const result = await sql`
      SELECT cookbook_id, cookbook_title, COUNT(*) as count
      FROM email_subscribers 
      WHERE is_active = true 
      GROUP BY cookbook_id, cookbook_title;
    `

    const total = await sql`
      SELECT COUNT(*) as total FROM email_subscribers WHERE is_active = true;
    `

    return {
      success: true,
      data: result.rows,
      total: total.rows[0].total,
    }
  } catch (error) {
    console.error("Error fetching subscriber stats:", error)
    throw error
  }
}
