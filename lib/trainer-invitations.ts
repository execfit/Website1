import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface TrainerInvitationData {
  email: string
  trainer_name: string
  specialty: string
  temporary_password: string
}

export async function createTrainerInvitation(data: TrainerInvitationData) {
  try {
    const { data: invitation, error } = await supabase
      .from("trainer_invitations")
      .insert([
        {
          email: data.email,
          trainer_name: data.trainer_name,
          specialty: data.specialty,
          temporary_password: data.temporary_password,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { success: true, data: invitation }
  } catch (error) {
    console.error("Error creating trainer invitation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getTrainerInvitations() {
  try {
    const { data, error } = await supabase
      .from("trainer_invitations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching trainer invitations:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function validateTrainerInvitation(email: string, temporaryPassword: string) {
  try {
    const { data, error } = await supabase
      .from("trainer_invitations")
      .select("*")
      .eq("email", email)
      .eq("temporary_password", temporaryPassword)
      .eq("is_used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error validating trainer invitation:", error)
    return {
      success: false,
      error: "Invalid or expired invitation",
    }
  }
}

export async function markInvitationAsUsed(invitationId: string) {
  try {
    const { error } = await supabase
      .from("trainer_invitations")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
      })
      .eq("id", invitationId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error marking invitation as used:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
