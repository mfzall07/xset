"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  target: string
  timestamp: Date
}

// Mock data for recent activity
const mockActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "/placeholder-user.jpg",
      initials: "JD",
    },
    action: "borrowed",
    target: "Dell XPS 15 Laptop",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      initials: "JS",
    },
    action: "approved",
    target: "transfer of 5 monitors to Marketing",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder-user.jpg",
      initials: "MJ",
    },
    action: "added",
    target: "10 new office chairs to inventory",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: "4",
    user: {
      name: "Sarah Williams",
      initials: "SW",
    },
    action: "updated",
    target: "status of Projector BenQ to 'Maintenance'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "5",
    user: {
      name: "David Brown",
      avatar: "/placeholder-user.jpg",
      initials: "DB",
    },
    action: "returned",
    target: "MacBook Pro with damaged screen",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: "6",
    user: {
      name: "Emily Davis",
      initials: "ED",
    },
    action: "rejected",
    target: "loan request for Server Rack",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "7",
    user: {
      name: "Robert Wilson",
      avatar: "/placeholder-user.jpg",
      initials: "RW",
    },
    action: "transferred",
    target: "3 desks from IT to HR department",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
]

export function RecentActivity() {
  const [activities] = useState<Activity[]>(mockActivities)

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span> <span>{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
