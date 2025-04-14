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
import { LoanRequestDialog } from "@/components/loan-request-dialog"
import { useNotifications } from "@/components/notification-provider"

interface Loan {
  id: string
  assetId: string
  assetName: string
  borrower: string
  borrowDate: Date
  returnDate: Date
  status: "pending" | "approved" | "rejected" | "returned" | "overdue"
  approver?: string
  notes?: string
}

// Mock data for loans
const mockLoans: Loan[] = [
  {
    id: "L001",
    assetId: "A001",
    assetName: "Dell XPS 15 Laptop",
    borrower: "John Doe",
    borrowDate: new Date("2025-03-10"),
    returnDate: new Date("2025-03-20"),
    status: "approved",
    approver: "Admin User",
    notes: "For project presentation",
  },
  {
    id: "L002",
    assetId: "A005",
    assetName: "BenQ Projector",
    borrower: "Jane Smith",
    borrowDate: new Date("2025-03-15"),
    returnDate: new Date("2025-03-16"),
    status: "pending",
    notes: "For client meeting",
  },
  {
    id: "L003",
    assetId: "A003",
    assetName: 'MacBook Pro 16"',
    borrower: "Mike Johnson",
    borrowDate: new Date("2025-03-05"),
    returnDate: new Date("2025-03-12"),
    status: "returned",
    approver: "Admin User",
  },
  {
    id: "L004",
    assetId: "A006",
    assetName: "iPhone 14 Pro",
    borrower: "Sarah Williams",
    borrowDate: new Date("2025-03-01"),
    returnDate: new Date("2025-03-08"),
    status: "overdue",
    approver: "Admin User",
    notes: "For testing mobile app",
  },
  {
    id: "L005",
    assetId: "A002",
    assetName: "HP LaserJet Printer",
    borrower: "David Brown",
    borrowDate: new Date("2025-03-12"),
    returnDate: new Date("2025-03-19"),
    status: "rejected",
    approver: "Admin User",
    notes: "Printer needed in office",
  },
]

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addNotification } = useNotifications()

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || loan.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, status: "approved", approver: "Admin User" } : loan)),
    )

    const loan = loans.find((l) => l.id === id)
    if (loan) {
      addNotification({
        title: "Loan Approved",
        message: `You approved the loan request for ${loan.assetName}`,
        type: "success",
      })
    }
  }

  const handleReject = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, status: "rejected", approver: "Admin User" } : loan)),
    )

    const loan = loans.find((l) => l.id === id)
    if (loan) {
      addNotification({
        title: "Loan Rejected",
        message: `You rejected the loan request for ${loan.assetName}`,
        type: "error",
      })
    }
  }

  const getStatusBadge = (status: Loan["status"]) => {
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
      case "returned":
        return <Badge className="bg-blue-500">Returned</Badge>
      case "overdue":
        return <Badge className="bg-destructive">Overdue</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Loans</h1>
          <p className="text-muted-foreground">Manage asset loan requests and approvals</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Loan Request
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
                placeholder="Search loans..."
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
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
                      Loan ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No loans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{loan.assetName}</span>
                          <span className="text-xs text-muted-foreground">{loan.assetId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{loan.borrower}</TableCell>
                      <TableCell>{loan.borrowDate.toLocaleDateString()}</TableCell>
                      <TableCell>{loan.returnDate.toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell>{loan.approver || "-"}</TableCell>
                      <TableCell>
                        {loan.status === "pending" ? (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(loan.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(loan.id)}
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
                              {loan.status === "approved" && <DropdownMenuItem>Mark as returned</DropdownMenuItem>}
                              {loan.status === "overdue" && <DropdownMenuItem>Send reminder</DropdownMenuItem>}
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

      <LoanRequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onLoanRequested={(newLoan) => {
          const loanId = `L${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(3, "0")}`
          const loanWithId = { ...newLoan, id: loanId, status: "pending" as const }
          setLoans([...loans, loanWithId])

          addNotification({
            title: "Loan Request Submitted",
            message: `Your request to borrow ${newLoan.assetName} has been submitted`,
            type: "info",
          })
        }}
      />
    </div>
  )
}
