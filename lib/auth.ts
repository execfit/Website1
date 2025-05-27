import { createClient } from "@supabase/supabase-js"
import { validateTrainerInvitation, markInvitationAsUsed } from "./trainer-invitations"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface TrainerProfile {
  id: string
  name: string
  email: string
  specialty: string
  bio: string
  session_rate: number
  profile_image: string
  is_trainer_account: boolean
  user_id: string
  certifications: string[]
  years_experience: number
  is_profile_complete: boolean
  requires_password_change: boolean
}

// Sign up a new trainer using invitation
export async function signUpTrainerWithInvitation(email: string, temporaryPassword: string, newPassword: string) {
  try {
    // First validate the invitation
    const invitationResult = await validateTrainerInvitation(email, temporaryPassword)
    if (!invitationResult.success) {
      return { success: false, error: invitationResult.error }
    }

    const invitation = invitationResult.data

    // Create auth user with new password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: newPassword,
      options: {
        data: {
          role: "trainer",
          name: invitation.trainer_name,
        },
      },
    })

    if (authError) throw authError

    if (authData.user) {
      // Create trainer profile
      const trainerId = invitation.trainer_name.toLowerCase().replace(/\s+/g, "-")

      const { data: trainerProfile, error: profileError } = await supabase
        .from("coaches")
        .insert([
          {
            id: trainerId,
            user_id: authData.user.id,
            name: invitation.trainer_name,
            email: email,
            specialty: invitation.specialty,
            bio: "",
            session_rate: 100, // Default rate
            is_trainer_account: true,
            is_active: true,
            is_profile_complete: false,
            requires_password_change: false,
            certifications: [],
            years_experience: 0,
          },
        ])
        .select()
        .single()

      if (profileError) throw profileError

      // Mark invitation as used
      await markInvitationAsUsed(invitation.id)

      return { success: true, data: { user: authData.user, profile: trainerProfile } }
    }

    return { success: false, error: "Failed to create user" }
  } catch (error) {
    console.error("Error signing up trainer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Sign in trainer (updated to handle temporary passwords)
export async function signInTrainer(email: string, password: string) {
  try {
    // First check if this is a temporary password login
    const invitationResult = await validateTrainerInvitation(email, password)

    if (invitationResult.success) {
      // This is a first-time login with temporary password
      return {
        success: true,
        requiresSetup: true,
        invitation: invitationResult.data,
      }
    }

    // Regular login attempt
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get trainer profile
    const { data: trainerProfile, error: profileError } = await supabase
      .from("coaches")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("is_trainer_account", true)
      .single()

    if (profileError) {
      throw new Error("Trainer profile not found")
    }

    return {
      success: true,
      data: { user: data.user, profile: trainerProfile },
      requiresPasswordChange: trainerProfile.requires_password_change,
      requiresProfileSetup: !trainerProfile.is_profile_complete,
    }
  } catch (error) {
    console.error("Error signing in trainer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Change password
export async function changeTrainerPassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    // Update trainer profile to mark password as changed
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("coaches").update({ requires_password_change: false }).eq("user_id", user.id)
    }

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Get current trainer profile
export async function getCurrentTrainerProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Not authenticated" }

    const { data: trainerProfile, error } = await supabase
      .from("coaches")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_trainer_account", true)
      .single()

    if (error) throw error

    return { success: true, data: trainerProfile }
  } catch (error) {
    console.error("Error getting trainer profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { success: !error, error: error?.message }
}

// Update trainer profile
export async function updateTrainerProfile(updates: Partial<TrainerProfile>) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("coaches")
      .update(updates)
      .eq("user_id", user.id)
      .eq("is_trainer_account", true)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error updating trainer profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Complete profile setup
export async function completeProfileSetup(profileData: {
  bio: string
  session_rate: number
  certifications: string[]
  years_experience: number
}) {
  try {
    const result = await updateTrainerProfile({
      ...profileData,
      is_profile_complete: true,
    })

    return result
  } catch (error) {
    console.error("Error completing profile setup:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
