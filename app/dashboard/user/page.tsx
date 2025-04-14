"use client"

import { useEffect, useState, useRef } from "react"
import { Box, ClipboardList, Package, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/components/notification-provider"
import { LoanRequestDialog } from "@/components/loan-request-dialog"
import { ReturnRequestDialog } from "@/components/return-request-dialog"
import { formatDistanceToNow } from "date-fns"

// Mock data for user dashboard
const mockUserLoans = [
  {
    id: "L001",
    assetId: "A001",
    assetName: "Dell XPS 15 Laptop",
    borrowDate: new Date("2025-03-10"),
    returnDate: new Date("2025-03-20"),
    status: "approved",
  },
  {
    id: "L002",
    assetId: "A005",
    assetName: "BenQ Projector",
    borrowDate: new Date("2025-03-15"),
    returnDate: new Date("2025-03-16"),
    status: "pending",
  },
]

const mockUserReturns = [
  {
    id: "R001",
    assetId: "A003",
    assetName: 'MacBook Pro 16"',
    returnDate: new Date("2025-03-12"),
    condition: "good",
    status: "approved",
  },
]

// Mock data for available assets
const mockAvailableAssets = [
  { id: "A010", name: "HP EliteBook Laptop", category: "Computer", location: "IT Department" },
  { id: "A011", name: 'Dell Monitor 27"', category: "Computer", location: "IT Department" },
  { id: "A012", name: "Logitech Wireless Mouse", category: "Computer", location: "IT Department" },
  { id: "A013", name: "Portable Projector", category: "Electronics", location: "Conference Room" },
  { id: "A014", name: "Wireless Headphones", category: "Electronics", location: "IT Department" },
]

// Mock data for user activity
const mockUserActivity = [
  {
    id: "1",
    action: "borrowed",
    asset: "Dell XPS 15 Laptop",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "2",
    action: "requested",
    asset: "BenQ Projector",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "3",
    action: "returned",
    asset: 'MacBook Pro 16"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
]

export default function UserDashboardPage() {
  const { addNotification } = useNotifications()
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false)
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const notificationSent = useRef(false)

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem("userName")
    setUserName(name)

    // Demo notification - only send once
    if (!notificationSent.current) {
      const timer = setTimeout(() => {
        addNotification({
          title: "Welcome Back",
          message: `Hello ${name || "User"}, welcome to your dashboard`,
          type: "info",
        })
        notificationSent.current = true
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [addNotification])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userName || "User"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUserLoans.filter((loan) => loan.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently borrowed assets</p>
            <Button className="mt-4 w-full" onClick={() => setIsLoanDialogOpen(true)}>
              Borrow Asset
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserLoans.filter((loan) => loan.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserReturns.length}</div>
            <p className="text-xs text-muted-foreground">Processed returns</p>
            <Button className="mt-4 w-full" onClick={() => setIsReturnDialogOpen(true)}>
              Return Asset
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAvailableAssets.length}</div>
            <p className="text-xs text-muted-foreground">Assets ready to borrow</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList>
          <TabsTrigger value="loans">My Loans</TabsTrigger>
          <TabsTrigger value="returns">My Returns</TabsTrigger>
          <TabsTrigger value="available">Available Assets</TabsTrigger>
          <TabsTrigger value="activity">My Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Current and Past Loans</CardTitle>
              <CardDescription>Assets you have borrowed</CardDescription>
            </CardHeader>
            <CardContent>
              {mockUserLoans.length === 0 ? (
                <p className="text-center text-muted-foreground">No loans found</p>
              ) : (
                <div className="space-y-4">
                  {mockUserLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{loan.assetName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {loan.assetId}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                            Borrowed: {loan.borrowDate.toLocaleDateString()}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                            Return by: {loan.returnDate.toLocaleDateString()}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 ${
                              loan.status === "approved"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {loan.status === "approved" ? "Approved" : "Pending"}
                          </span>
                        </div>
                      </div>
                      {loan.status === "approved" && (
                        <Button className="mt-3 sm:mt-0" variant="outline" onClick={() => setIsReturnDialogOpen(true)}>
                          Return
                        </Button>
                      )}
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
              <CardTitle>Return History</CardTitle>
              <CardDescription>Assets you have returned</CardDescription>
            </CardHeader>
            <CardContent>
              {mockUserReturns.length === 0 ? (
                <p className="text-center text-muted-foreground">No returns found</p>
              ) : (
                <div className="space-y-4">
                  {mockUserReturns.map((returnItem) => (
                    <div key={returnItem.id} className="rounded-lg border p-4">
                      <h3 className="font-medium">{returnItem.assetName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {returnItem.assetId}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                          Returned: {returnItem.returnDate.toLocaleDateString()}
                        </span>
                        <span className="rounded-full bg-green-500/10 px-2 py-1 text-green-500">
                          Condition: {returnItem.condition}
                        </span>
                        <span className="rounded-full bg-blue-500/10 px-2 py-1 text-blue-500">{returnItem.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Assets</CardTitle>
              <CardDescription>Assets that are available for borrowing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAvailableAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{asset.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {asset.id}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-blue-500/10 px-2 py-1 text-blue-500">
                          Category: {asset.category}
                        </span>
                        <span className="rounded-full bg-purple-500/10 px-2 py-1 text-purple-500">
                          Location: {asset.location}
                        </span>
                      </div>
                    </div>
                    <Button className="mt-3 sm:mt-0" variant="outline" onClick={() => setIsLoanDialogOpen(true)}>
                      Borrow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>My Recent Activity</CardTitle>
              <CardDescription>Your recent actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUserActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {activity.action === "borrowed" && <Package className="h-4 w-4 text-blue-500" />}
                      {activity.action === "requested" && <Clock className="h-4 w-4 text-amber-500" />}
                      {activity.action === "returned" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        You <span className="font-medium">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.asset}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LoanRequestDialog
        open={isLoanDialogOpen}
        onOpenChange={setIsLoanDialogOpen}
        onLoanRequested={(newLoan) => {
          addNotification({
            title: "Loan Request Submitted",
            message: `Your request to borrow ${newLoan.assetName} has been submitted`,
            type: "info",
          })
        }}
      />

      <ReturnRequestDialog
        open={isReturnDialogOpen}
        onOpenChange={setIsReturnDialogOpen}
        onReturnRequested={(newReturn) => {
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
