"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, Package, Truck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "./notification-provider"

type ApprovalType = "loan" | "transfer" | "return"

interface ApprovalRequest {
  id: string
  type: ApprovalType
  title: string
  requester: string
  timestamp: Date
  status: "pending" | "approved" | "rejected"
}

// Mock data for approval queue
const mockApprovals: ApprovalRequest[] = [
  {
    id: "1",
    type: "loan",
    title: "Laptop Dell XPS 15",
    requester: "John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "pending",
  },
  {
    id: "2",
    type: "transfer",
    title: "5 Monitors from IT to Marketing",
    requester: "Jane Smith",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "pending",
  },
  {
    id: "3",
    type: "return",
    title: "MacBook Pro with damaged screen",
    requester: "Mike Johnson",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "pending",
  },
  {
    id: "4",
    type: "loan",
    title: "Projector BenQ for conference room",
    requester: "Sarah Williams",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: "pending",
  },
]

export function ApprovalQueue() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals)
  const { addNotification } = useNotifications()

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((approval) => (approval.id === id ? { ...approval, status: "approved" } : approval)),
    )

    const approval = approvals.find((a) => a.id === id)
    if (approval) {
      addNotification({
        title: "Request Approved",
        message: `You approved the ${approval.type} request for ${approval.title}`,
        type: "success",
      })
    }
  }

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((approval) => (approval.id === id ? { ...approval, status: "rejected" } : approval)),
    )

    const approval = approvals.find((a) => a.id === id)
    if (approval) {
      addNotification({
        title: "Request Rejected",
        message: `You rejected the ${approval.type} request for ${approval.title}`,
        type: "error",
      })
    }
  }

  const getTypeIcon = (type: ApprovalType) => {
    switch (type) {
      case "loan":
        return <Package className="h-4 w-4 text-blue-500" />
      case "transfer":
        return <Truck className="h-4 w-4 text-purple-500" />
      case "return":
        return <Clock className="h-4 w-4 text-amber-500" />
    }
  }

  const getStatusIcon = (status: ApprovalRequest["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const pendingApprovals = approvals.filter((a) => a.status === "pending")

  return (
    <ScrollArea className="h-[300px]">
      {pendingApprovals.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">No pending approvals</div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(approval.type)}
                  <div>
                    <p className="text-sm font-medium">{approval.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested by {approval.requester} • {formatDistanceToNow(approval.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {getStatusIcon(approval.status)}
              </div>
              {approval.status === "pending" && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleReject(approval.id)}>
                    Reject
                  </Button>
                  <Button size="sm" className="w-full" onClick={() => handleApprove(approval.id)}>
                    Approve
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
