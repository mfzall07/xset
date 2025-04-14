"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/components/notification-provider"

export default function DashboardPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const { addNotification } = useNotifications()
  const initialized = useRef(false)

  useEffect(() => {
    // Only run once
    if (!initialized.current) {
      // Get user role from localStorage
      const role = localStorage.getItem("userRole")

      if (role) {
        setUserRole(role)

        // Redirect to role-specific dashboard
        if (role === "admin") {
          router.push("/dashboard/admin")
        } else if (role === "management") {
          router.push("/dashboard/management")
        } else if (role === "user") {
          router.push("/dashboard/user")
        }

        // Welcome notification
        addNotification({
          title: "Welcome",
          message: `You are logged in as ${role}`,
          type: "info",
        })
      } else {
        // If no role is found, redirect to login
        router.push("/login")
      }

      initialized.current = true
    }
  }, [router, addNotification])

  return null
}
