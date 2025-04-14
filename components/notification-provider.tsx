"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useRef } from "react"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter((n) => !n.read).length

  // Load notifications from localStorage on mount
  const notificationsLoaded = useRef(false)

  // Replace the first useEffect with this version
  useEffect(() => {
    if (!notificationsLoaded.current) {
      const savedNotifications = localStorage.getItem("notifications")
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications)
          // Convert string timestamps back to Date objects
          const withDates = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
          setNotifications(withDates)
        } catch (error) {
          console.error("Failed to parse notifications from localStorage", error)
        }
      }
      notificationsLoaded.current = true
    }
  }, [])

  // For the second useEffect that saves notifications
  // Add a ref to track the previous notifications state
  const previousNotifications = useRef<string>("")

  // Replace the second useEffect with this version
  useEffect(() => {
    const notificationsJson = JSON.stringify(notifications)
    // Only update localStorage if notifications have actually changed
    if (previousNotifications.current !== notificationsJson) {
      localStorage.setItem("notifications", notificationsJson)
      previousNotifications.current = notificationsJson
    }
  }, [notifications])

  const addNotification = (notification: Omit<Notification, "id" | "read" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
