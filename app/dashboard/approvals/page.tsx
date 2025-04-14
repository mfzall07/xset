"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useNotifications } from "@/components/notification-provider"

// Mock data for approvals
const mockLoanApprovals = [
  {
    id: "L001",
    type: "loan",
    assetId: "A001",
    assetName: "Dell XPS 15 Laptop",
    requester: "John Doe",
    requesterAvatar: "/placeholder-user.jpg",
    requesterInitials: "JD",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "pending",
    details: "Needed for project presentation on Friday",
  },
  {
    id: "L002",
    type: "loan",
    assetId: "A005",
    assetName: "BenQ Projector",
    requester: "Jane Smith",
    requesterInitials: "JS",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "pending",
    details: "For client meeting tomorrow",
  },
]

const mockTransferApprovals = [
  {
    id: "T001",
    type: "transfer",
    assetIds: ["A007", "A008", "A009"],
    assetNames: ["Standing Desk", "Office Chair", "Monitor"],
    quantity: 3,
    sourceLocation: "Storage",
    destinationLocation: "HR Department",
    requester: "Mike Johnson",
    requesterAvatar: "/placeholder-user.jpg",
    requesterInitials: "MJ",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    status: "pending",
    details: "New employee onboarding",
  },
  {
    id: "T002",
    type: "transfer",
    assetIds: ["A011", "A012", "A013", "A014", "A015"],
    assetNames: ["Monitors (5)"],
    quantity: 5,
    sourceLocation: "IT Department",
    destinationLocation: "Sales Department",
    requester: "David Brown",
    requesterInitials: "DB",
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    status: "pending",
    details: "New monitors for sales team",
  },
]

const mockReturnApprovals = [
  {
    id: "R001",
    type: "return",
    assetId: "A003",
    assetName: 'MacBook Pro 16"',
    requester: "Sarah Williams",
    requesterInitials: "SW",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    status: "pending",
    condition: "damaged",
    details: "Screen has scratches on the bottom right corner",
  },
  {
    id: "R002",
    type: "return",
    assetId: "A006",
    assetName: "iPhone 14 Pro",
    requester: "Emily Davis",
    requesterInitials: "ED",
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 90 minutes ago
    status: "pending",
    condition: "missing-parts",
    details: "Charger and earphones missing",
  },
]

export default function ApprovalsPage() {
  const [loanApprovals, setLoanApprovals] = useState(mockLoanApprovals)
  const [transferApprovals, setTransferApprovals] = useState(mockTransferApprovals)
  const [returnApprovals, setReturnApprovals] = useState(mockReturnApprovals)
  const { addNotification } = useNotifications()

  const handleApprove = (type: string, id: string) => {
    if (type === "loan") {
      const approval = loanApprovals.find((a) => a.id === id)
      setLoanApprovals(loanApprovals.filter((a) => a.id !== id))

      if (approval) {
        addNotification({
          title: "Loan Approved",
          message: `You approved ${approval.requester}'s request to borrow ${approval.assetName}`,
          type: "success",
        })
      }
    } else if (type === "transfer") {
      const approval = transferApprovals.find((a) => a.id === id)
      setTransferApprovals(transferApprovals.filter((a) => a.id !== id))

      if (approval) {
        addNotification({
          title: "Transfer Approved",
          message: `You approved the transfer of assets from ${approval.sourceLocation} to ${approval.destinationLocation}`,
          type: "success",
        })
      }
    } else if (type === "return") {
      const approval = returnApprovals.find((a) => a.id === id)
      setReturnApprovals(returnApprovals.filter((a) => a.id !== id))

      if (approval) {
        addNotification({
          title: "Return Approved",
          message: `You approved ${approval.requester}'s return of ${approval.assetName}`,
          type: "success",
        })
      }
    }
  }

  const handleReject = (type: string, id: string) => {
    if (type === "loan") {
      const approval = loanApprovals.find((a) => a.id === id)
      setLoanApprovals(loanApprovals.filter((a) => a.id !== id))

      if (approval) {
        addNotification({
          title: "Loan Rejected",
          message: `You rejected ${approval.requester}'s request to borrow ${approval.assetName}`,
          type: "error",
        })
      }
    } else if (type === "transfer") {
      const approval = transferApprovals.find((a) => a.id === id)
      setTransferApprovals(transferApprovals.filter((a) => a.id !== id))

      if (approval) {
        addNotification({
          title: "Transfer Rejected",
          message: `You rejected the transfer of assets from ${approval.sourceLocation} to ${approval.destinationLocation}`,
          type: "error",
        })
      }
    } else if (type === "return") {
      const approval = returnApprovals.find((a) => a.id === id)
      setReturnApprovals(returnApprovals.filter((a) => a.id !== id))

      if (approval) {
        addNotification({
          title: "Return Rejected",
          message: `You rejected ${approval.requester}'s return of ${approval.assetName}`,
          type: "error",
        })
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground">Manage pending approval requests</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loan Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transfer Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transferApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Return Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList>
          <TabsTrigger value="loans">Loan Requests</TabsTrigger>
          <TabsTrigger value="transfers">Transfer Requests</TabsTrigger>
          <TabsTrigger value="returns">Return Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Pending Loan Approvals</CardTitle>
              <CardDescription>Review and approve loan requests</CardDescription>
            </CardHeader>
            <CardContent>
              {loanApprovals.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No pending loan approvals
                </div>
              ) : (
                <div className="space-y-4">
                  {loanApprovals.map((approval) => (
                    <div key={approval.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={approval.requesterAvatar} alt={approval.requester} />
                          <AvatarFallback>{approval.requesterInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{approval.requester}</h3>
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Requested {formatDistanceToNow(approval.timestamp, { addSuffix: true })}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm">
                              <span className="font-medium">Asset:</span> {approval.assetName} ({approval.assetId})
                            </p>
                            {approval.details && (
                              <p className="mt-1 text-sm">
                                <span className="font-medium">Details:</span> {approval.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReject("loan", approval.id)}>
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove("loan", approval.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <CardTitle>Pending Transfer Approvals</CardTitle>
              <CardDescription>Review and approve transfer requests</CardDescription>
            </CardHeader>
            <CardContent>
              {transferApprovals.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No pending transfer approvals
                </div>
              ) : (
                <div className="space-y-4">
                  {transferApprovals.map((approval) => (
                    <div key={approval.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={approval.requesterAvatar} alt={approval.requester} />
                          <AvatarFallback>{approval.requesterInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{approval.requester}</h3>
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Requested {formatDistanceToNow(approval.timestamp, { addSuffix: true })}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm">
                              <span className="font-medium">Assets:</span> {approval.assetNames.join(", ")}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">From:</span> {approval.sourceLocation}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">To:</span> {approval.destinationLocation}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Quantity:</span> {approval.quantity}
                            </p>
                            {approval.details && (
                              <p className="mt-1 text-sm">
                                <span className="font-medium">Details:</span> {approval.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReject("transfer", approval.id)}>
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove("transfer", approval.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>Pending Return Approvals</CardTitle>
              <CardDescription>Review and approve return requests</CardDescription>
            </CardHeader>
            <CardContent>
              {returnApprovals.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No pending return approvals
                </div>
              ) : (
                <div className="space-y-4">
                  {returnApprovals.map((approval) => (
                    <div key={approval.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={approval.requesterAvatar} alt={approval.requester} />
                          <AvatarFallback>{approval.requesterInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{approval.requester}</h3>
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Requested {formatDistanceToNow(approval.timestamp, { addSuffix: true })}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm">
                              <span className="font-medium">Asset:</span> {approval.assetName} ({approval.assetId})
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Condition:</span>{" "}
                              <Badge
                                className={
                                  approval.condition === "good"
                                    ? "bg-green-500"
                                    : approval.condition === "damaged"
                                      ? "bg-yellow-500"
                                      : approval.condition === "missing-parts"
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                }
                              >
                                {approval.condition}
                              </Badge>
                            </p>
                            {approval.details && (
                              <p className="mt-1 text-sm">
                                <span className="font-medium">Details:</span> {approval.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReject("return", approval.id)}>
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove("return", approval.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
