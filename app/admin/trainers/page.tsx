"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Copy, Check, Send } from "lucide-react"
import { createTrainerInvitation, getTrainerInvitations } from "@/lib/trainer-invitations"

interface TrainerInvitation {
  id: string
  email: string
  temporary_password: string
  trainer_name: string
  specialty: string
  is_used: boolean
  expires_at: string
  created_at: string
}

export default function TrainerManagement() {
  const [invitations, setInvitations] = useState<TrainerInvitation[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    trainer_name: "",
    specialty: "",
    sendEmail: false,
  })

  // Load invitations on component mount
  useEffect(() => {
    loadInvitations()
  }, [])

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const temporaryPassword = generatePassword()

    try {
      const result = await createTrainerInvitation({
        email: formData.email,
        trainer_name: formData.trainer_name,
        specialty: formData.specialty,
        temporary_password: temporaryPassword,
      })

      if (result.success) {
        // Show credentials in alert
        alert(
          `Trainer invitation created!\n\nEmail: ${formData.email}\nTemporary Password: ${temporaryPassword}\n\n${
            formData.sendEmail
              ? "Email will be sent automatically."
              : "Please share these credentials securely with the trainer."
          }`,
        )

        // Send email if requested
        if (formData.sendEmail) {
          try {
            const emailResponse = await fetch("/api/send-trainer-invitation-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: formData.email,
                trainer_name: formData.trainer_name,
                temporary_password: temporaryPassword,
                specialty: formData.specialty,
              }),
            })

            const emailResult = await emailResponse.json()
            if (emailResult.success) {
              alert("✅ Invitation email sent successfully!")
            } else {
              alert(`⚠️ Invitation created but email failed: ${emailResult.error}`)
            }
          } catch (emailError) {
            alert("⚠️ Invitation created but email failed to send")
          }
        }

        setFormData({ email: "", trainer_name: "", specialty: "", sendEmail: false })
        setShowCreateForm(false)
        loadInvitations()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert("Failed to create invitation")
      console.error("Error creating invitation:", error)
    }

    setLoading(false)
  }

  const sendInvitationEmail = async (invitation: TrainerInvitation) => {
    setSendingEmail(invitation.id)

    try {
      const response = await fetch("/api/send-trainer-invitation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: invitation.email,
          trainer_name: invitation.trainer_name,
          temporary_password: invitation.temporary_password,
          specialty: invitation.specialty,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("✅ Invitation email sent successfully!")
      } else {
        alert(`❌ Failed to send email: ${result.error}`)
      }
    } catch (error) {
      alert("❌ Failed to send email")
      console.error("Error sending email:", error)
    }

    setSendingEmail(null)
  }

  const loadInvitations = async () => {
    try {
      const result = await getTrainerInvitations()
      if (result.success && result.data) {
        setInvitations(result.data as TrainerInvitation[])
      } else {
        console.error("Failed to load invitations:", result.error)
        setInvitations([])
      }
    } catch (error) {
      console.error("Error loading invitations:", error)
      setInvitations([])
    }
  }

  const copyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedPassword(password)
      setTimeout(() => setCopiedPassword(null), 2000)
    } catch (error) {
      console.error("Failed to copy password:", error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid date"
    }
  }

  const isExpired = (expiresAt: string) => {
    try {
      return new Date(expiresAt) < new Date()
    } catch {
      return true
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trainer Management</h1>
          <p className="text-gray-600">Create and manage trainer invitations</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Invite Trainer</span>
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Trainer Invitation</CardTitle>
            <CardDescription>Generate a secure invitation for a new trainer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateInvitation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainer_name">Trainer Name</Label>
                  <Input
                    id="trainer_name"
                    value={formData.trainer_name}
                    onChange={(e) => setFormData({ ...formData, trainer_name: e.target.value })}
                    placeholder="e.g., Sarah Johnson"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="trainer@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="e.g., Strength Training, Weight Loss, Physique Development"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendEmail"
                  checked={formData.sendEmail}
                  onCheckedChange={(checked) => setFormData({ ...formData, sendEmail: checked as boolean })}
                />
                <Label htmlFor="sendEmail" className="text-sm">
                  Send invitation email automatically (credentials will still be shown here)
                </Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Invitation"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Trainer Invitations</CardTitle>
          <CardDescription>Manage pending and used trainer invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadInvitations} variant="outline" className="mb-4">
            Refresh List
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Temporary Password</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">{invitation.trainer_name}</TableCell>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>{invitation.specialty}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {invitation.temporary_password}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyPassword(invitation.temporary_password)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedPassword === invitation.temporary_password ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        invitation.is_used
                          ? "bg-green-100 text-green-700"
                          : isExpired(invitation.expires_at)
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {invitation.is_used ? "Used" : isExpired(invitation.expires_at) ? "Expired" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(invitation.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-1"
                      onClick={() => sendInvitationEmail(invitation)}
                      disabled={sendingEmail === invitation.id}
                    >
                      {sendingEmail === invitation.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <Send className="h-3 w-3" />
                      )}
                      <span>{sendingEmail === invitation.id ? "Sending..." : "Send Email"}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {invitations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No trainer invitations found. Click "Invite Trainer" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
