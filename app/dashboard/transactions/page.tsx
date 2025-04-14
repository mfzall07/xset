"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpDown, Download, Eye, Filter, Printer, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RoleGuard } from "@/components/role-guard"

// Types
interface CartItem {
  id: string
  name: string
  category: string
  value: number
  quantity: number
}

interface Customer {
  name: string
  email: string
  phone: string
}

interface Transaction {
  id: string
  items: CartItem[]
  customer: Customer
  total: number
  paymentMethod: string
  date: Date
}

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "T123456",
    items: [
      {
        id: "A001",
        name: "Dell XPS 15 Laptop",
        category: "Computer",
        value: 1899.99,
        quantity: 1,
      },
      {
        id: "A009",
        name: "Wireless Keyboard",
        category: "Computer",
        value: 89.99,
        quantity: 2,
      },
    ],
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-123-4567",
    },
    total: 2079.97,
    paymentMethod: "credit",
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "T123457",
    items: [
      {
        id: "A005",
        name: "BenQ Projector",
        category: "Electronics",
        value: 799.99,
        quantity: 1,
      },
    ],
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "",
    },
    total: 799.99,
    paymentMethod: "cash",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "T123458",
    items: [
      {
        id: "A010",
        name: "Wireless Mouse",
        category: "Computer",
        value: 49.99,
        quantity: 5,
      },
      {
        id: "A013",
        name: "Wireless Headphones",
        category: "Electronics",
        value: 179.99,
        quantity: 2,
      },
    ],
    customer: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "555-987-6543",
    },
    total: 609.93,
    paymentMethod: "debit",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter transactions based on search and payment method
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPayment = paymentFilter === "all" || transaction.paymentMethod === paymentFilter

    return matchesSearch && matchesPayment
  })

  // View transaction details
  const viewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  // Print receipt
  const printReceipt = () => {
    window.print()
  }

  return (
    <RoleGuard allowedRoles={["admin", "management"]}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and manage sales transactions</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        Transaction ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.customer.name}</TableCell>
                        <TableCell>
                          {transaction.items.length === 1
                            ? transaction.items[0].name
                            : `${transaction.items.length} items`}
                        </TableCell>
                        <TableCell>{formatDistanceToNow(transaction.date, { addSuffix: true })}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {transaction.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">${transaction.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => viewTransaction(transaction)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md print:shadow-none">
            <DialogHeader className="print:pb-0">
              <DialogTitle className="print:text-center">Receipt #{selectedTransaction?.id}</DialogTitle>
              <DialogDescription className="print:text-center">
                {selectedTransaction?.date.toLocaleDateString()} {selectedTransaction?.date.toLocaleTimeString()}
              </DialogDescription>
              <div className="hidden print:block print:text-center">
                <h1 className="text-xl font-bold">Asset Management System</h1>
                <p className="text-sm text-muted-foreground">123 Business Street, City, Country</p>
              </div>
            </DialogHeader>

            {selectedTransaction && (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Customer</h3>
                      <p className="text-sm">{selectedTransaction.customer.name}</p>
                      {selectedTransaction.customer.email && (
                        <p className="text-sm text-muted-foreground">{selectedTransaction.customer.email}</p>
                      )}
                      {selectedTransaction.customer.phone && (
                        <p className="text-sm text-muted-foreground">{selectedTransaction.customer.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium">Payment Method</h3>
                      <p className="text-sm capitalize">{selectedTransaction.paymentMethod}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 font-medium">Items</h3>
                    <div className="space-y-2">
                      {selectedTransaction.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <p>{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ${item.value.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-medium">${(item.value * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${selectedTransaction.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%)</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${selectedTransaction.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="hidden print:block text-center pt-8">
                    <p className="text-sm text-muted-foreground">Thank you for your purchase!</p>
                  </div>
                </div>

                <DialogFooter className="print:hidden">
                  <Button variant="outline" onClick={printReceipt}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
