"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem("userRole")

    if (userRole) {
      // If logged in, redirect to dashboard
      router.push("/dashboard")
    } else {
      // If not logged in, redirect to login
      router.push("/login")
    }
  }, [router])

  return null
}
