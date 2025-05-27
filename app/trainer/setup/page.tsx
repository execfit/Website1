"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, AlertCircle, CheckCircle, Plus, X } from "lucide-react"
import { signUpTrainerWithInvitation } from "@/lib/auth"

export default function TrainerSetup() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Step 1: Password Setup
  const [passwordData, setPasswordData] = useState({
    email: "",
    temporaryPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    temporary: false,
    new: false,
    confirm: false,
  })

  // Step 2: Profile Setup
  const [profileData, setProfileData] = useState({
    bio: "",
    session_rate: 100,
    years_experience: 1,
    certifications: [] as string[],
  })
  const [newCertification, setNewCertification] = useState("")

  useEffect(() => {
    // Pre-fill email if provided in URL
    const email = searchParams.get("email")
    if (email) {
      setPasswordData((prev) => ({ ...prev, email }))
    }
  }, [searchParams])

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match")
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      const result = await signUpTrainerWithInvitation(
        passwordData.email,
        passwordData.temporaryPassword,
        passwordData.newPassword,
      )

      if (result.success) {
        setSuccess("Account created successfully!")
        setStep(2)
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }

    setLoading(false)
  }

  const addCertification = () => {
    if (newCertification.trim() && !profileData.certifications.includes(newCertification.trim())) {
      setProfileData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }))
      setNewCertification("")
    }
  }

  const removeCertification = (cert: string) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }))
  }

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Profile completion will be handled after login
      setSuccess("Profile setup complete! Redirecting to dashboard...")
      setTimeout(() => {
        router.push("/trainer/dashboard")
      }, 2000)
    } catch (error) {
      setError("An unexpected error occurred")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to ExecFit</h2>
          <p className="mt-2 text-sm text-gray-600">Complete your trainer account setup</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
            </div>
            <span className="text-sm font-medium">Password Setup</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <span className="text-sm font-medium">Profile Setup</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Set Your Password</CardTitle>
              <CardDescription>
                Use your temporary password to create a secure new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSetup} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={passwordData.email}
                    onChange={(e) => setPasswordData({ ...passwordData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temporaryPassword">Temporary Password</Label>
                  <div className="relative">
                    <Input
                      id="temporaryPassword"
                      type={showPasswords.temporary ? "text" : "password"}
                      value={passwordData.temporaryPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, temporaryPassword: e.target.value })}
                      placeholder="Enter the temporary password provided"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, temporary: !showPasswords.temporary })}
                    >
                      {showPasswords.temporary ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Create a secure password (min 8 characters)"
                      required
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm your new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account & Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>Tell clients about yourself and set your session pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSetup} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell clients about your training philosophy, experience, and what makes you unique..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionRate">Session Rate ($)</Label>
                    <Input
                      id="sessionRate"
                      type="number"
                      value={profileData.session_rate}
                      onChange={(e) =>
                        setProfileData({ ...profileData, session_rate: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="100"
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profileData.years_experience}
                      onChange={(e) =>
                        setProfileData({ ...profileData, years_experience: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="5"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Certifications & Achievements</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="e.g., NASM-CPT, ACSM, Nutrition Specialist"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                    />
                    <Button type="button" onClick={addCertification} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{cert}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeCertification(cert)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Completing Setup..." : "Complete Profile & Enter Dashboard"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
