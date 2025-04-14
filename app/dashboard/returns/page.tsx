"use client"

import { useState } from "react"
import { ArrowUpDown, CheckCircle, Download, Filter, MoreHorizontal, Plus, Search, X } from "lucide-react"
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
import { ReturnRequestDialog } from "@/components/return-request-dialog"
import { useNotifications } from "@/components/notification-provider"

interface Return {
  id: string
  assetId: string
  assetName: string
  borrower: string
  returnDate: Date
  condition: "good" | "damaged" | "missing-parts" | "lost"
  status: "pending" | "approved" | "rejected"
  notes?: string
  approver?: string
}

// Mock data for returns
const mockReturns: Return[] = [
  {
    id: "R001",
    assetId: "A001",
    assetName: "Dell XPS 15 Laptop",
    borrower: "John Doe",
    returnDate: new Date("2025-03-14"),
    condition: "good",
    status: "approved",
    approver: "Admin User",
  },
  {
    id: "R002",
    assetId: "A005",
    assetName: "BenQ Projector",
    borrower: "Jane Smith",
    returnDate: new Date("2025-03-15"),
    condition: "damaged",
    status: "pending",
    notes: "Screen has scratches",
  },
  {
    id: "R003",
    assetId: "A003",
    assetName: 'MacBook Pro 16"',
    borrower: "Mike Johnson",
    returnDate: new Date("2025-03-12"),
    condition: "missing-parts",
    status: "pending",
    notes: "Charger missing",
  },
  {
    id: "R004",
    assetId: "A006",
    assetName: "iPhone 14 Pro",
    borrower: "Sarah Williams",
    returnDate: new Date("2025-03-10"),
    condition: "lost",
    status: "rejected",
    approver: "Admin User",
    notes: "Device not returned, replacement required",
  },
  {
    id: "R005",
    assetId: "A007",
    assetName: "Standing Desk",
    borrower: "David Brown",
    returnDate: new Date("2025-03-13"),
    condition: "good",
    status: "approved",
    approver: "Admin User",
  },
]

export default function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>(mockReturns)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addNotification } = useNotifications()

  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch =
      returnItem.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || returnItem.status === statusFilter
    const matchesCondition = conditionFilter === "all" || returnItem.condition === conditionFilter

    return matchesSearch && matchesStatus && matchesCondition
  })

  const handleApprove = (id: string) => {
    setReturns((prev) =>
      prev.map((returnItem) =>
        returnItem.id === id ? { ...returnItem, status: "approved", approver: "Admin User" } : returnItem,
      ),
    )

    const returnItem = returns.find((r) => r.id === id)
    if (returnItem) {
      addNotification({
        title: "Return Approved",
        message: `You approved the return of ${returnItem.assetName}`,
        type: "success",
      })
    }
  }

  const handleReject = (id: string) => {
    setReturns((prev) =>
      prev.map((returnItem) =>
        returnItem.id === id ? { ...returnItem, status: "rejected", approver: "Admin User" } : returnItem,
      ),
    )

    const returnItem = returns.find((r) => r.id === id)
    if (returnItem) {
      addNotification({
        title: "Return Rejected",
        message: `You rejected the return of ${returnItem.assetName}`,
        type: "error",
      })
    }
  }

  const getStatusBadge = (status: Return["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Pending
          </Badge>
        )
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
    }
  }

  const getConditionBadge = (condition: Return["condition"]) => {
    switch (condition) {
      case "good":
        return <Badge className="bg-green-500">Good</Badge>
      case "damaged":
        return <Badge className="bg-yellow-500">Damaged</Badge>
      case "missing-parts":
        return <Badge className="bg-orange-500">Missing Parts</Badge>
      case "lost":
        return <Badge className="bg-red-500">Lost</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Returns</h1>
          <p className="text-muted-foreground">Manage asset return requests and approvals</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Return Request
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
                placeholder="Search returns..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
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
                </SelectContent>
              </Select>
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="missing-parts">Missing Parts</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
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
                      Return ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No returns found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{returnItem.assetName}</span>
                          <span className="text-xs text-muted-foreground">{returnItem.assetId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{returnItem.borrower}</TableCell>
                      <TableCell>{returnItem.returnDate.toLocaleDateString()}</TableCell>
                      <TableCell>{getConditionBadge(returnItem.condition)}</TableCell>
                      <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">{returnItem.notes || "-"}</div>
                      </TableCell>
                      <TableCell>
                        {returnItem.status === "pending" ? (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(returnItem.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(returnItem.id)}
                              className="h-8 w-8 text-green-500"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                          </div>
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

      <ReturnRequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onReturnRequested={(newReturn) => {
          const returnId = `R${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(3, "0")}`
          const returnWithId = {
            ...newReturn,
            id: returnId,
            status: "pending" as const,
          }
          setReturns([...returns, returnWithId])

          addNotification({
            title: "Return Request Submitted",
            message: `Your request to return ${newReturn.assetName} has been submitted`,
            type: "info",
          })
        }}
      />
    </div>
  )
}
