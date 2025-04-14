"use client"

import type React from "react"

import { useState } from "react"
import { Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications, type NotificationType } from "./notification-provider"
import { cn } from "@/lib/utils"

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications()

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case "warning":
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />
      case "error":
        return <div className="h-2 w-2 rounded-full bg-red-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <NotificationList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onRemove={removeNotification}
              getIcon={getNotificationIcon}
            />
          </TabsContent>
          <TabsContent value="unread" className="p-0">
            <NotificationList
              notifications={notifications.filter((n) => !n.read)}
              onMarkAsRead={handleMarkAsRead}
              onRemove={removeNotification}
              getIcon={getNotificationIcon}
            />
          </TabsContent>
          <TabsContent value="read" className="p-0">
            <NotificationList
              notifications={notifications.filter((n) => n.read)}
              onMarkAsRead={handleMarkAsRead}
              onRemove={removeNotification}
              getIcon={getNotificationIcon}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

interface NotificationListProps {
  notifications: ReturnType<typeof useNotifications>["notifications"]
  onMarkAsRead: (id: string) => void
  onRemove: (id: string) => void
  getIcon: (type: NotificationType) => React.ReactNode
}

function NotificationList({ notifications, onMarkAsRead, onRemove, getIcon }: NotificationListProps) {
  if (notifications.length === 0) {
    return <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">No notifications</div>
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="divide-y">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn("flex gap-3 p-3 hover:bg-muted/50", !notification.read && "bg-muted/20")}
          >
            <div className="mt-1">{getIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{notification.title}</p>
                <button
                  onClick={() => onRemove(notification.id)}
                  className="h-5 w-5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </p>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 py-1 text-xs"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
