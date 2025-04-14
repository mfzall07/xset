"use client"

import { useEffect, useRef } from "react"
import { ClipboardList, Package, CreditCard, Receipt } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotifications } from "@/components/notification-provider"
import { ActivityLog } from "@/components/activity-log"
import { ApprovalQueue } from "@/components/approval-queue"
import { AssetStatusChart } from "@/components/asset-status-chart"
import { SalesChart } from "@/components/sales-chart"

export default function AdminDashboardPage() {
  const { addNotification } = useNotifications()
  const notificationSent = useRef(false)

  // Demo notification - would be triggered by real events in production
  useEffect(() => {
    // Hanya kirim notifikasi sekali
    if (!notificationSent.current) {
      const timer = setTimeout(() => {
        addNotification({
          title: "New Loan Request",
          message: "John Doe has requested to borrow Laptop XPS-15",
          type: "info",
        })
        notificationSent.current = true
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [addNotification])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Complete overview of your asset management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+24 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,489.95</div>
            <p className="text-xs text-muted-foreground">+$845.20 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+8 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Asset Status Overview</CardTitle>
            <CardDescription>Distribution of assets by status</CardDescription>
          </CardHeader>
          <CardContent>
            <AssetStatusChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>Pending requests requiring your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <ApprovalQueue />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>System-wide activity log</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityLog />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
