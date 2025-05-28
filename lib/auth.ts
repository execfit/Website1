import { createClient } from "@supabase/supabase-js"

// Check for environment variables and provide fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Only create Supabase client if we have the required environment variables
let supabase: any = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

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

export interface TrainerLoginResult {
  success: boolean
  data?: {
    id: string
    email: string
    name: string
    isSetupComplete: boolean
    isTemporaryPassword: boolean
  }
  error?: string
  requiresSetup?: boolean
  requiresPasswordChange?: boolean
  requiresProfileSetup?: boolean
  invitation?: any
}

// Mock trainer invitations functions for when Supabase is not available
async function mockValidateTrainerInvitation(email: string, password: string) {
  // Demo invitation data
  if (email === "demo@execfit.com" && password === "temp123") {
    return {
      success: true,
      data: {
        id: "demo-invitation",
        trainer_name: "Demo Trainer",
        specialty: "Personal Training",
        email: email,
      },
    }
  }
  return { success: false, error: "Invalid invitation" }
}

async function mockMarkInvitationAsUsed(invitationId: string) {
  console.log("Mock: Marking invitation as used:", invitationId)
  return { success: true }
}

// Sign up a new trainer using invitation
export async function signUpTrainerWithInvitation(email: string, temporaryPassword: string, newPassword: string) {
  try {
    if (!supabase) {
      // Mock implementation for development
      console.log("Mock: Creating trainer account for", email)
      return {
        success: true,
        data: {
          user: { id: "mock-user", email },
          profile: {
            id: "mock-trainer",
            name: "Mock Trainer",
            email,
            specialty: "Personal Training",
            is_profile_complete: false,
            requires_password_change: false,
          },
        },
      }
    }

    // First validate the invitation
    const invitationResult = await mockValidateTrainerInvitation(email, temporaryPassword)
    if (!invitationResult.success || !invitationResult.data) {
      return { success: false, error: invitationResult.error || "Invalid invitation" }
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
      await mockMarkInvitationAsUsed(invitation.id)

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

// Updated loginTrainer function to match the expected interface
export async function loginTrainer(email: string, password: string): Promise<TrainerLoginResult> {
  try {
    console.log("Attempting trainer login:", { email })

    // Demo credentials for testing - TEMPORARY PASSWORD
    if (email === "demo@execfit.com" && password === "temp123") {
      console.log("Demo temporary password detected - redirecting to change password")
      return {
        success: true,
        data: {
          id: "demo-trainer",
          email: email,
          name: "Demo Trainer",
          isSetupComplete: false,
          isTemporaryPassword: true,
        },
        requiresSetup: false,
        requiresPasswordChange: true,
      }
    }

    // Demo credentials for testing - REGULAR PASSWORD
    if (email === "demo@execfit.com" && password === "demo123") {
      console.log("Demo regular login - going to dashboard")
      return {
        success: true,
        data: {
          id: "demo-trainer",
          email: email,
          name: "Demo Trainer",
          isSetupComplete: true,
          isTemporaryPassword: false,
        },
        requiresPasswordChange: false,
        requiresProfileSetup: false,
      }
    }

    if (!supabase) {
      // Mock implementation when Supabase is not configured
      console.log("Supabase not configured, using mock authentication")
      return {
        success: false,
        error:
          "Please configure Supabase environment variables or use demo credentials (demo@execfit.com / temp123 or demo123)",
      }
    }

    // Try to validate as invitation first
    try {
      const invitationResult = await mockValidateTrainerInvitation(email, password)
      if (invitationResult.success && invitationResult.data) {
        console.log("Temporary password detected, requires setup")
        return {
          success: true,
          data: {
            id: "temp-" + Date.now(),
            email: email,
            name: invitationResult.data.trainer_name || "New Trainer",
            isSetupComplete: false,
            isTemporaryPassword: true,
          },
          requiresSetup: true,
          invitation: invitationResult.data,
        }
      }
    } catch (invitationError) {
      console.log("Invitation validation failed, trying regular login")
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

    console.log("Regular login successful, checking password change requirement")

    return {
      success: true,
      data: {
        id: trainerProfile.id,
        email: trainerProfile.email,
        name: trainerProfile.name,
        isSetupComplete: trainerProfile.is_profile_complete,
        isTemporaryPassword: trainerProfile.requires_password_change,
      },
      requiresPasswordChange: trainerProfile.requires_password_change,
      requiresProfileSetup: !trainerProfile.is_profile_complete,
    }
  } catch (error) {
    console.error("Error signing in trainer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
    }
  }
}

// Keep the original signInTrainer for backward compatibility
export async function signInTrainer(email: string, password: string) {
  try {
    // Demo credentials
    if (email === "demo@execfit.com" && password === "temp123") {
      return {
        success: true,
        requiresPasswordChange: true,
        data: {
          user: { id: "demo-user", email },
          profile: {
            id: "demo-trainer",
            name: "Demo Trainer",
            email,
            requires_password_change: true,
            is_profile_complete: false,
          },
        },
      }
    }

    if (email === "demo@execfit.com" && password === "demo123") {
      return {
        success: true,
        requiresPasswordChange: false,
        data: {
          user: { id: "demo-user", email },
          profile: {
            id: "demo-trainer",
            name: "Demo Trainer",
            email,
            requires_password_change: false,
            is_profile_complete: true,
          },
        },
      }
    }

    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured. Use demo credentials: demo@execfit.com / temp123 or demo123",
      }
    }

    // Try invitation validation first
    try {
      const invitationResult = await mockValidateTrainerInvitation(email, password)
      if (invitationResult.success && invitationResult.data) {
        return {
          success: true,
          requiresSetup: true,
          invitation: invitationResult.data,
        }
      }
    } catch (invitationError) {
      console.log("Invitation validation failed, trying regular login")
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

// Updated change password function to handle mock scenario
export async function changeTrainerPassword(
  trainerId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Changing password for trainer:", trainerId)

    // Check if this is a demo/mock scenario
    const trainerEmail = sessionStorage.getItem("trainer_email")
    if (trainerEmail === "demo@execfit.com" && currentPassword === "temp123") {
      console.log("Mock: Demo password change successful")
      // Simulate successful password change for demo
      return { success: true }
    }

    if (!supabase) {
      // Mock implementation for non-demo scenarios
      console.log("Mock: Password changed successfully")
      return { success: true }
    }

    // Check if we have an active session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.log("No active session, attempting to sign in first")

      // Try to sign in with current credentials to establish a session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trainerEmail || "demo@execfit.com",
        password: currentPassword,
      })

      if (signInError) {
        console.error("Failed to establish session:", signInError)
        return {
          success: false,
          error: "Unable to verify current password. Please try logging in again.",
        }
      }
    }

    // Update password in Supabase Auth
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
      error: error instanceof Error ? error.message : "Failed to change password. Please try again.",
    }
  }
}

// Original change password function for backward compatibility
export async function changePassword(newPassword: string) {
  try {
    if (!supabase) {
      console.log("Mock: Password changed successfully")
      return { success: true }
    }

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
    if (!supabase) {
      // Mock implementation
      return {
        success: true,
        data: {
          id: "demo-trainer",
          name: "Demo Trainer",
          email: "demo@execfit.com",
          specialty: "Personal Training",
          bio: "Experienced personal trainer specializing in executive fitness.",
          session_rate: 150,
          years_experience: 5,
          certifications: ["NASM-CPT", "Nutrition Specialist"],
          is_profile_complete: true,
          requires_password_change: false,
        },
      }
    }

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
  if (!supabase) {
    console.log("Mock: Signed out successfully")
    return { success: true }
  }

  const { error } = await supabase.auth.signOut()
  return { success: !error, error: error?.message }
}

// Update trainer profile
export async function updateTrainerProfile(updates: Partial<TrainerProfile>) {
  try {
    if (!supabase) {
      console.log("Mock: Profile updated successfully")
      return { success: true, data: { ...updates, id: "demo-trainer" } }
    }

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
