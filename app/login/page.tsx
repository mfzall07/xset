"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Demo accounts
const demoAccounts = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "manager@example.com", password: "manager123", role: "management" },
  { email: "user@example.com", password: "user123", role: "user" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isClicked, setIsClicked] = useState("")

  useEffect(() => {
    // Clear any existing user data when visiting login page
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
  }, [])

  // Perbaikan untuk memastikan login berfungsi dengan benar
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if credentials match any demo account
    const account = demoAccounts.find((account) => account.email === email && account.password === password)

    if (account) {
      // Clear any existing notifications before login
      localStorage.removeItem("notifications")

      // Store user role in localStorage for role-based access control
      localStorage.setItem("userRole", account.role)
      localStorage.setItem("userName", email.split("@")[0])

      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Asset Management System</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Demo Accounts</CardTitle>
                <CardDescription>Use these accounts to test different roles in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Admin Account</h3>
                  <p className="text-sm text-muted-foreground">Full access to all features</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Email: <span className="font-mono">admin@example.com</span>
                    </div>
                    <div>
                      Password: <span className="font-mono">admin123</span>
                    </div>
                  </div>
                  <Button
                    className={`mt-2 w-full px-4 py-2 rounded ${isClicked === "admin" ? "bg-blue-700 text-white" : "bg-white border text-black"}`}
                    onClick={() => {
                      setEmail("admin@example.com")
                      setPassword("admin123")
                      setIsClicked("admin")
                    }}
                  >
                    Use Admin Account
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Manager Account</h3>
                  <p className="text-sm text-muted-foreground">Access to most features except Users and Settings</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Email: <span className="font-mono">manager@example.com</span>
                    </div>
                    <div>
                      Password: <span className="font-mono">manager123</span>
                    </div>
                  </div>
                  <Button
                    className={`mt-2 w-full px-4 py-2 rounded ${isClicked === "manager" ? "bg-blue-700 text-white" : "bg-white border text-black"}`}
                    onClick={() => {
                      setEmail("manager@example.com")
                      setPassword("manager123")
                      setIsClicked("manager")
                    }}
                  >
                    Use Manager Account
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium">User Account</h3>
                  <p className="text-sm text-muted-foreground">Limited access to borrowing and returning assets</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Email: <span className="font-mono">user@example.com</span>
                    </div>
                    <div>
                      Password: <span className="font-mono">user123</span>
                    </div>
                  </div>
                  <Button
                    className={`mt-2 w-full px-4 py-2 rounded ${isClicked === "user" ? "bg-blue-700 text-white" : "bg-white border text-black"}`}
                    onClick={() => {
                      setEmail("user@example.com")
                      setPassword("user123")
                      setIsClicked("user")
                    }}
                  >
                    Use User Account
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" onClick={handleLogin}>
                  Sign In with Selected Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
