"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Download, Eye, Search } from "lucide-react"

export default function AdminPanel() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("pending")

  // Mock data - in a real app, this would come from your database
  const mockRequests = [
    {
      id: "req1",
      timestamp: "2023-05-22 14:30",
      instagramHandle: "@user123",
      cookbook: "Execute Physique Cookbook",
      status: "pending",
      verificationMethod: "screenshot",
      proofUrl: "/placeholder.svg?height=100&width=100&query=instagram follow screenshot",
    },
    {
      id: "req2",
      timestamp: "2023-05-22 13:15",
      instagramHandle: "@foodlover",
      cookbook: "Ultimate Comfort Food",
      status: "approved",
      verificationMethod: "dm",
      proofText: "COOKBOOK-ULTI",
    },
    {
      id: "req3",
      timestamp: "2023-05-22 12:45",
      instagramHandle: "@sweetooth",
      cookbook: "Dessert Delights",
      status: "rejected",
      verificationMethod: "honor",
      notes: "Suspicious account",
    },
    {
      id: "req4",
      timestamp: "2023-05-22 11:30",
      instagramHandle: "@healthyeater",
      cookbook: "Execute Physique Cookbook",
      status: "pending",
      verificationMethod: "dm",
      proofText: "COOKBOOK-HEAL",
    },
  ]

  const filteredRequests = mockRequests.filter(
    (req) =>
      (selectedTab === "all" || req.status === selectedTab) &&
      (searchTerm === "" || req.instagramHandle.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleLogin = () => {
    // In a real app, you would validate the password against a stored hash
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid password")
    }
  }

  const handleApprove = (id: string) => {
    // In a real app, you would update the database
    alert(`Request ${id} approved`)
  }

  const handleReject = (id: string) => {
    // In a real app, you would update the database
    alert(`Request ${id} rejected`)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your password to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cookbook Distribution Admin</h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by Instagram handle..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="pending" onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">
                Pending <Badge className="ml-1 bg-yellow-100 text-yellow-800">2</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cookbook Requests</CardTitle>
            <CardDescription>Manage and verify user requests for cookbook downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Instagram</TableHead>
                  <TableHead>Cookbook</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-sm">{request.timestamp}</TableCell>
                    <TableCell>{request.instagramHandle}</TableCell>
                    <TableCell>{request.cookbook}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          request.verificationMethod === "screenshot"
                            ? "bg-blue-50 text-blue-700"
                            : request.verificationMethod === "dm"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-gray-50 text-gray-700"
                        }
                      >
                        {request.verificationMethod}
                      </Badge>
                      {request.verificationMethod === "screenshot" && request.proofUrl && (
                        <Button variant="ghost" size="sm" className="ml-2" onClick={() => alert("Viewing proof")}>
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      {request.verificationMethod === "dm" && request.proofText && (
                        <span className="ml-2 text-xs font-mono bg-gray-100 px-1 py-0.5 rounded">
                          {request.proofText}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          request.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : request.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download Log
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
