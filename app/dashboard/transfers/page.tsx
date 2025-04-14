"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpDown, CheckCircle, Download, Filter, MoreHorizontal, Plus, Search, Truck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TransferRequestDialog } from "@/components/transfer-request-dialog"
import { useNotifications } from "@/components/notification-provider"

interface Transfer {
  id: string
  assetIds: string[]
  assetNames: string[]
  quantity: number
  sourceLocation: string
  destinationLocation: string
  requestedBy: string
  requestDate: Date
  status: "pending" | "approved" | "rejected" | "completed"
  approver?: string
  notes?: string
}

// Mock data for transfers
const mockTransfers: Transfer[] = [
  {
    id: "T001",
    assetIds: ["A001", "A002"],
    assetNames: ["Dell XPS 15 Laptop", "HP LaserJet Printer"],
    quantity: 2,
    sourceLocation: "IT Department",
    destinationLocation: "Marketing",
    requestedBy: "John Doe",
    requestDate: new Date("2025-03-10"),
    status: "approved",
    approver: "Admin User",
    notes: "Equipment needed for new marketing team",
  },
  {
    id: "T002",
    assetIds: ["A005"],
    assetNames: ["BenQ Projector"],
    quantity: 1,
    sourceLocation: "Conference Room",
    destinationLocation: "Training Room",
    requestedBy: "Jane Smith",
    requestDate: new Date("2025-03-12"),
    status: "pending",
    notes: "Needed for training session",
  },
  {
    id: "T003",
    assetIds: ["A007", "A008", "A009"],
    assetNames: ["Standing Desk", "Office Chair", "Monitor"],
    quantity: 3,
    sourceLocation: "Storage",
    destinationLocation: "HR Department",
    requestedBy: "Mike Johnson",
    requestDate: new Date("2025-03-08"),
    status: "completed",
    approver: "Admin User",
  },
  {
    id: "T004",
    assetIds: ["A010"],
    assetNames: ["Server Rack"],
    quantity: 1,
    sourceLocation: "Data Center",
    destinationLocation: "IT Department",
    requestedBy: "Sarah Williams",
    requestDate: new Date("2025-03-11"),
    status: "rejected",
    approver: "Admin User",
    notes: "Server rack needed in data center",
  },
  {
    id: "T005",
    assetIds: ["A011", "A012", "A013", "A014", "A015"],
    assetNames: ["Monitors (5)"],
    quantity: 5,
    sourceLocation: "IT Department",
    destinationLocation: "Sales Department",
    requestedBy: "David Brown",
    requestDate: new Date("2025-03-13"),
    status: "pending",
    notes: "New monitors for sales team",
  },
]

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addNotification } = useNotifications()

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.assetNames.some((name) => name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      transfer.sourceLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id ? { ...transfer, status: "approved", approver: "Admin User" } : transfer,
      ),
    )

    const transfer = transfers.find((t) => t.id === id)
    if (transfer) {
      addNotification({
        title: "Transfer Approved",
        message: `You approved the transfer request from ${transfer.sourceLocation} to ${transfer.destinationLocation}`,
        type: "success",
      })
    }
  }

  const handleReject = (id: string) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id ? { ...transfer, status: "rejected", approver: "Admin User" } : transfer,
      ),
    )

    const transfer = transfers.find((t) => t.id === id)
    if (transfer) {
      addNotification({
        title: "Transfer Rejected",
        message: `You rejected the transfer request from ${transfer.sourceLocation} to ${transfer.destinationLocation}`,
        type: "error",
      })
    }
  }

  const handleComplete = (id: string) => {
    setTransfers((prev) =>
      prev.map((transfer) => (transfer.id === id ? { ...transfer, status: "completed" } : transfer)),
    )

    const transfer = transfers.find((t) => t.id === id)
    if (transfer) {
      addNotification({
        title: "Transfer Completed",
        message: `The transfer from ${transfer.sourceLocation} to ${transfer.destinationLocation} has been completed`,
        type: "success",
      })
    }
  }

  const getStatusBadge = (status: Transfer["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Pending
          </Badge>
        )
      case "approved":
        return <Badge className="bg-blue-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Transfers</h1>
          <p className="text-muted-foreground">Manage asset transfer requests and approvals</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Transfer Request
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transfers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center">
                      ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Assets</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No transfers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">{transfer.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{transfer.assetNames.join(", ")}</span>
                          <span className="text-xs text-muted-foreground">Qty: {transfer.quantity}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transfer.sourceLocation}</TableCell>
                      <TableCell>{transfer.destinationLocation}</TableCell>
                      <TableCell>{transfer.requestedBy}</TableCell>
                      <TableCell>{formatDistanceToNow(transfer.requestDate, { addSuffix: true })}</TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell>
                        {transfer.status === "pending" ? (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(transfer.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(transfer.id)}
                              className="h-8 w-8 text-green-500"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                          </div>
                        ) : transfer.status === "approved" ? (
                          <Button variant="outline" size="sm" onClick={() => handleComplete(transfer.id)}>
                            <Truck className="mr-2 h-4 w-4" />
                            Complete
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Print receipt</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TransferRequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTransferRequested={(newTransfer) => {
          const transferId = `T${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(3, "0")}`
          const transferWithId = {
            ...newTransfer,
            id: transferId,
            status: "pending" as const,
            requestDate: new Date(),
          }
          setTransfers([...transfers, transferWithId])

          addNotification({
            title: "Transfer Request Submitted",
            message: `Your request to transfer assets from ${newTransfer.sourceLocation} to ${newTransfer.destinationLocation} has been submitted`,
            type: "info",
          })
        }}
      />
    </div>
  )
}
