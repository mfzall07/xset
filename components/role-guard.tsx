"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and has the required role
    const userRole = localStorage.getItem("userRole")

    // If no role is found, redirect to login
    if (!userRole) {
      router.push("/login")
      return
    }

    // Check if user has permission to access this page
    const hasAccess = allowedRoles.includes(userRole)

    if (!hasAccess) {
      // Redirect to dashboard if not authorized
      router.push("/dashboard")
    } else {
      setAuthorized(true)
    }

    setLoading(false)
  }, [router, pathname, allowedRoles])

  // Show nothing while checking authorization
  if (loading) {
    return null
  }

  // Show children only if authorized
  return authorized ? <>{children}</> : null
}
