"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock } from "lucide-react"
import Image from "next/image"
import { changeTrainerPassword } from "@/lib/auth"

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [trainerEmail, setTrainerEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Get the trainer email from session storage
    const email = sessionStorage.getItem("trainer_email")
    if (email) {
      setTrainerEmail(email)
    }
  }, [])

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    }
  }

  const passwordValidation = validatePassword(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match")
        setLoading(false)
        return
      }

      // Validate password strength
      if (!passwordValidation.isValid) {
        setError("Password does not meet security requirements")
        setLoading(false)
        return
      }

      console.log("Changing password:", { currentPassword, newPassword })

      // Call the changeTrainerPassword function from auth.ts
      const result = await changeTrainerPassword("current-trainer-id", currentPassword, newPassword)

      if (result.success) {
        console.log("Password changed successfully")
        setSuccess(true)
        // Clear the temporary email from session storage
        sessionStorage.removeItem("trainer_email")

        setTimeout(() => {
          router.push("/trainer/dashboard")
        }, 2000)
      } else {
        setError(result.error || "Failed to change password. Please try again.")
      }
    } catch (error) {
      console.error("Password change error:", error)
      setError("Failed to change password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
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

        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
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

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center backdrop-blur-sm mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Password Changed Successfully!</h1>
          <p className="text-white/70">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Image
                  src="/images/icononly-new.png"
                  alt="ExecFit Icon"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 font-montserrat">Change Password</h1>
              <p className="text-white/70 font-raleway">
                {trainerEmail ? `For: ${trainerEmail}` : "Please update your temporary password to secure your account"}
              </p>
            </div>
          </div>

          {/* Password Change Card */}
          <Card className="bg-black/40 border-white/20 backdrop-blur-md shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-white font-montserrat">Security Update Required</CardTitle>
              <CardDescription className="text-white/60">
                For your security, please change your temporary password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white font-medium">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your temporary password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 pr-10"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={loading}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 pr-10"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={loading}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Password Requirements */}
                {newPassword && (
                  <div className="space-y-2">
                    <p className="text-sm text-white/70">Password requirements:</p>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div
                        className={`flex items-center space-x-2 ${passwordValidation.minLength ? "text-green-400" : "text-white/50"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? "bg-green-400" : "bg-white/30"}`}
                        ></div>
                        <span>At least 8 characters</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${passwordValidation.hasUpper ? "text-green-400" : "text-white/50"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${passwordValidation.hasUpper ? "bg-green-400" : "bg-white/30"}`}
                        ></div>
                        <span>One uppercase letter</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${passwordValidation.hasLower ? "text-green-400" : "text-white/50"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${passwordValidation.hasLower ? "bg-green-400" : "bg-white/30"}`}
                        ></div>
                        <span>One lowercase letter</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? "text-green-400" : "text-white/50"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? "bg-green-400" : "bg-white/30"}`}
                        ></div>
                        <span>One number</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${passwordValidation.hasSpecial ? "text-green-400" : "text-white/50"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecial ? "bg-green-400" : "bg-white/30"}`}
                        ></div>
                        <span>One special character</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-medium">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 pr-10"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-xs">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-white/90 font-semibold py-2.5 transition-all duration-200"
                  disabled={loading || !passwordValidation.isValid || newPassword !== confirmPassword}
                >
                  {loading ? (
                    <>
                      <Lock className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
