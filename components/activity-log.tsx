"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, Clock, FileEdit, Package, Plus, Trash2, Truck, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

type ActivityType = "create" | "update" | "delete" | "approve" | "reject" | "transfer" | "return"

interface Activity {
  id: string
  type: ActivityType
  description: string
  user: string
  timestamp: Date
  entity: "asset" | "loan" | "transfer" | "return" | "user"
}

// Mock data for activity log
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "create",
    description: "Added new laptop Dell XPS 15",
    user: "John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    entity: "asset",
  },
  {
    id: "2",
    type: "approve",
    description: "Approved loan request for Projector BenQ",
    user: "Jane Smith",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    entity: "loan",
  },
  {
    id: "3",
    type: "transfer",
    description: "Transferred 5 monitors from IT to Marketing",
    user: "Mike Johnson",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    entity: "transfer",
  },
  {
    id: "4",
    type: "update",
    description: "Updated asset status for Office Chair to 'Maintenance'",
    user: "Sarah Williams",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    entity: "asset",
  },
  {
    id: "5",
    type: "delete",
    description: "Removed obsolete equipment from inventory",
    user: "John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    entity: "asset",
  },
  {
    id: "6",
    type: "reject",
    description: "Rejected transfer request for Server Rack",
    user: "Jane Smith",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    entity: "transfer",
  },
  {
    id: "7",
    type: "return",
    description: "Processed return of MacBook Pro",
    user: "Mike Johnson",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    entity: "return",
  },
]

export function ActivityLog() {
  const [activities] = useState<Activity[]>(mockActivities)
  const [filter, setFilter] = useState<ActivityType | "all">("all")

  const filteredActivities = filter === "all" ? activities : activities.filter((activity) => activity.type === filter)

  const getActivityIcon = (type: ActivityType, entity: Activity["entity"]) => {
    switch (type) {
      case "create":
        return <Plus className="h-4 w-4 text-green-500" />
      case "update":
        return <FileEdit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "approve":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "reject":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "transfer":
        return <Truck className="h-4 w-4 text-purple-500" />
      case "return":
        return <Package className="h-4 w-4 text-indigo-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "create" ? "default" : "outline"} size="sm" onClick={() => setFilter("create")}>
          Created
        </Button>
        <Button variant={filter === "update" ? "default" : "outline"} size="sm" onClick={() => setFilter("update")}>
          Updated
        </Button>
        <Button variant={filter === "approve" ? "default" : "outline"} size="sm" onClick={() => setFilter("approve")}>
          Approved
        </Button>
        <Button variant={filter === "reject" ? "default" : "outline"} size="sm" onClick={() => setFilter("reject")}>
          Rejected
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-0.5">{getActivityIcon(activity.type, activity.entity)}</div>
              <div className="space-y-1">
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
