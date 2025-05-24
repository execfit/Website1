"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Instagram, BookOpen, Mail, ChefHat, Utensils, Salad, Download } from "lucide-react"
import Header from "@/components/header"

export default function CookbookDistribution() {
  const [selectedCookbook, setSelectedCookbook] = useState<string | null>(null)
  const [hasVisitedInstagram, setHasVisitedInstagram] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cookbooks = [
    {
      id: "executive-physique",
      title: "Execute Physique Cookbook",
      description: "Premium nutrition for peak performance with high-protein recipes designed for busy executives",
      pages: 17,
      color: "bg-black/40 border-white/10 hover:border-white/20",
      image: "/images/execute-physique-cookbook-cover.png",
      highlights: ["Power Protein Pancakes", "Mediterranean Protein Bowl", "Recovery Salmon Bowl", "Performance Pasta"],
    },
    {
      id: "lo-carb-hi-results",
      title: "Lo-Carb / Hi-Results Cookbook",
      description: "Low-carb, high-protein nutrition for optimal body composition and sustained energy",
      pages: 18,
      color: "bg-black/40 border-white/10 hover:border-white/20",
      image: "/images/lo-carb-hi-results-cookbook-cover.png",
      highlights: [
        "Chicken Stuffed Peppers",
        "Shrimp Protein Stir-Fry",
        "Turkey Protein Burger",
        "Low-Carb Protein Pancakes",
      ],
    },
    {
      id: "vegan-exec",
      title: "The Vegan Exec Cookbook",
      description: "High-protein vegan nutrition for peak performance with plant-based executive meals",
      pages: 18,
      color: "bg-black/40 border-white/10 hover:border-white/20",
      image: "/images/vegan-exec-cookbook-cover.png",
      highlights: [
        "Protein Power Smoothie Bowl",
        "Tofu Scramble Supreme",
        "Super Protein Quinoa Bowl",
        "High-Protein Lentil Bowl",
      ],
    },
  ]

  const handleCookbookSelect = (cookbookId: string) => {
    setSelectedCookbook(cookbookId)
    setHasVisitedInstagram(false)
    setIsSubmitted(false)
    setEmailSent(false)
    setEmail("")
    setError(null)
  }

  const handleInstagramVisit = () => {
    window.open("https://instagram.com/execfitboston", "_blank")
    // Unlock the Get Cookbook button after visiting Instagram
    setHasVisitedInstagram(true)
  }

  const handleEmailSubmit = async () => {
    console.log("=== FRONTEND: Starting email submit ===")
    console.log("Email:", email)
    console.log("Cookbook ID:", selectedCookbook)
    console.log("Cookbook Title:", cookbooks.find((c) => c.id === selectedCookbook)?.title)

    setIsSubmitted(true)
    setError(null)

    try {
      const requestData = {
        email: email,
        cookbookId: selectedCookbook,
        cookbookTitle: cookbooks.find((c) => c.id === selectedCookbook)?.title,
      }

      console.log("=== FRONTEND: Sending request ===")
      console.log("Request data:", requestData)

      const response = await fetch("/api/send-cookbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("=== FRONTEND: Response received ===")
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      const result = await response.json()
      console.log("=== FRONTEND: Response data ===")
      console.log("Result:", result)

      if (response.ok && result.success) {
        console.log("=== FRONTEND: Success! ===")
        // Show success immediately, don't redirect
        setEmailSent(true)
        setIsSubmitted(false) // Reset loading state
      } else {
        console.error("=== FRONTEND: API Error ===")
        console.error("Error:", result.message || result.error)
        setError(result.message || result.error || "Failed to send email")
        setIsSubmitted(false)
      }
    } catch (error) {
      console.error("=== FRONTEND: Network Error ===")
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Network error occurred")
      setIsSubmitted(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Header />

      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,transparent_40px,rgba(255,255,255,0.05)_40px,rgba(255,255,255,0.05)_41px)] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,transparent_40px,rgba(255,255,255,0.05)_40px,rgba(255,255,255,0.05)_41px)] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.9)_60%,rgba(0,0,0,1)_100%)]"></div>

        {/* Animated elements */}
        <div className="absolute w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle_at_center,#333_0%,#111_100%)] top-[20%] left-[20%] opacity-30 blur-sm animate-float-slow"></div>
        <div className="absolute w-[160px] h-[160px] rounded-full border border-white/30 top-[30%] left-[50%] opacity-30 animate-float-medium"></div>
        <div className="absolute w-[100px] h-[100px] bg-white/5 backdrop-blur-sm top-[10%] right-[30%] opacity-30 animate-rotate-slow"></div>

        {/* Stars */}
        <div className="absolute w-[4px] h-[4px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] opacity-70 top-[5%] right-[25%]"></div>
        <div className="absolute w-[6px] h-[6px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] opacity-70 top-[15%] right-[15%]"></div>
        <div className="absolute w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] opacity-70 top-[40%] right-[35%]"></div>

        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.1)_1px,transparent_1px,transparent_2px)] bg-[size:100%_2px] opacity-5"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 px-4 py-12 pt-32">
        {/* Header Text Only */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h1 className="text-3xl font-bold tracking-wider text-center text-white mb-2 uppercase">
            <span className="text-shadow-glow">Premium Cookbooks</span>
          </h1>
          <p className="text-lg text-white/90 text-center font-light tracking-wide max-w-xl">
            Nutrition resources designed for high-performing professionals who demand excellence in every aspect of
            life.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-center">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-400 hover:text-red-300 text-sm underline block mx-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Cookbook Selection */}
        {!selectedCookbook && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {cookbooks.map((cookbook) => (
              <Card
                key={cookbook.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${cookbook.color} bg-black/40 backdrop-blur-md border-white/10 flex flex-col h-full`}
                onClick={() => handleCookbookSelect(cookbook.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-lg"></div>
                    <img
                      src={cookbook.image || "/placeholder.svg"}
                      alt={cookbook.title}
                      className="w-32 h-40 object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <CardTitle className="text-lg text-white h-[52px] flex items-center justify-center">
                    {cookbook.title}
                  </CardTitle>
                  <CardDescription className="text-white/80">{cookbook.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-1 flex flex-col">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-white/70" />
                    <span className="text-sm font-medium text-white/70">{cookbook.pages} pages</span>
                  </div>
                  <div className="mb-4 flex-1">
                    <p className="text-xs text-white/60 mb-2">Featured Recipes:</p>
                    <div className="text-xs text-white/80 space-y-1 min-h-[80px]">
                      {cookbook.highlights.map((recipe, index) => (
                        <div key={index}>• {recipe}</div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-white hover:bg-white/90 text-black mt-auto">Select This Cookbook</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Follow Instagram Step */}
        {selectedCookbook && !hasVisitedInstagram && !emailSent && (
          <Card className="max-w-md mx-auto bg-black/40 backdrop-blur-md border-white/10 text-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-lg"></div>
                <img
                  src={cookbooks.find((c) => c.id === selectedCookbook)?.image || "/placeholder.svg"}
                  alt="Selected cookbook"
                  className="w-24 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
              <CardTitle className="text-white">{cookbooks.find((c) => c.id === selectedCookbook)?.title}</CardTitle>
              <CardDescription className="text-white/80">
                Follow @execfitboston on Instagram to unlock your free cookbook!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={handleInstagramVisit}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow @execfitboston
                </Button>
                <p className="text-xs text-white/60 mt-2">Click the button above to visit our Instagram page</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Collection Step */}
        {selectedCookbook && hasVisitedInstagram && !isSubmitted && !emailSent && (
          <Card className="max-w-md mx-auto bg-black/40 backdrop-blur-md border-white/10 text-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-lg"></div>
                <img
                  src={cookbooks.find((c) => c.id === selectedCookbook)?.image || "/placeholder.svg"}
                  alt="Selected cookbook"
                  className="w-24 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
              <CardTitle className="text-white">Get Your Free Cookbook!</CardTitle>
              <CardDescription className="text-white/80">
                Enter your email to receive {cookbooks.find((c) => c.id === selectedCookbook)?.title} instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address:
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/30 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="text-center p-3 bg-black/20 rounded-lg border border-white/10">
                <Mail className="w-5 h-5 mx-auto mb-2 text-white/60" />
                <p className="text-xs text-white/70">
                  We'll send you a download link and add you to our nutrition tips newsletter.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleEmailSubmit}
                disabled={!email || !email.includes("@")}
                className="w-full bg-white hover:bg-white/90 text-black"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Me The Cookbook
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Processing Email */}
        {isSubmitted && !emailSent && (
          <Card className="max-w-md mx-auto bg-black/40 backdrop-blur-md border-white/10 text-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
              </div>
              <CardTitle className="text-white">Sending Your Download Link...</CardTitle>
              <CardDescription className="text-white/80">
                We're preparing your cookbook download and sending it to your email address.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Email Sent Confirmation */}
        {emailSent && (
          <Card className="max-w-md mx-auto bg-black/40 backdrop-blur-md border-white/10 text-white">
            <CardHeader className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-white">Download Link Sent! 📧</CardTitle>
              <CardDescription className="text-white/80">
                Check your email for the download link to {cookbooks.find((c) => c.id === selectedCookbook)?.title}.
                <br />
                <strong>Don't forget to check your spam/promotions folder!</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Download className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 font-medium">Email sent to: {email}</p>
                  <p className="text-green-400/80 text-sm mt-1">
                    Click the download button in your email to get your cookbook
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCookbook(null)
                      setHasVisitedInstagram(false)
                      setIsSubmitted(false)
                      setEmailSent(false)
                      setEmail("")
                      setError(null)
                    }}
                    className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                  >
                    Get Another Cookbook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Section */}
        {!selectedCookbook && (
          <div className="mt-16 mb-12">
            <h2 className="text-2xl font-semibold text-center mb-10 text-white text-shadow-glow">
              ELEVATE YOUR NUTRITION
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center mb-4">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">Executive-Grade Recipes</h3>
                <p className="text-white/80 text-sm">
                  High-protein meals designed for busy professionals who demand peak performance.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center mb-4">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">Low-Carb Options</h3>
                <p className="text-white/80 text-sm">
                  Strategic carbohydrate choices that support performance without compromising body composition.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center mb-4">
                  <Salad className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">Complete Nutrition</h3>
                <p className="text-white/80 text-sm">
                  Detailed macronutrient information and chef tips for optimal meal preparation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
