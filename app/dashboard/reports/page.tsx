"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Filter, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AssetStatusChart } from "@/components/asset-status-chart"
import { AssetCategoryChart } from "@/components/asset-category-chart"
import { AssetValueChart } from "@/components/asset-value-chart"
import { AssetActivityChart } from "@/components/asset-activity-chart"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<string>("30")
  const [reportType, setReportType] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and view reports on your assets and activities</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Customize your report view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <FileText className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="assets">Asset Inventory</SelectItem>
                      <SelectItem value="loans">Loan Activity</SelectItem>
                      <SelectItem value="transfers">Transfer Activity</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="depreciation">Depreciation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="computer">Computers</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="vehicle">Vehicles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {dateRange === "custom" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="start-date" className="text-sm font-medium">
                      Start Date
                    </label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="end-date" className="text-sm font-medium">
                      End Date
                    </label>
                    <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              )}

              <Button className="w-full sm:w-auto">Generate Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Status Distribution</CardTitle>
                <CardDescription>Current status of all assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AssetStatusChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset Categories</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AssetCategoryChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset Value Over Time</CardTitle>
                <CardDescription>Total value of assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AssetValueChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset Activity</CardTitle>
                <CardDescription>Loans, transfers, and returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AssetActivityChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Inventory Report</CardTitle>
              <CardDescription>Detailed inventory of all assets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This report shows a detailed inventory of all assets, including their current status, location, and
                value.
              </p>
              <div className="mt-4 flex justify-center">
                <FileText className="h-24 w-24 text-muted-foreground" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Generate a report to view the data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Report</CardTitle>
              <CardDescription>Loans, transfers, and returns activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This report shows all asset activity, including loans, transfers, and returns over the selected time
                period.
              </p>
              <div className="mt-4 flex justify-center">
                <FileText className="h-24 w-24 text-muted-foreground" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Generate a report to view the data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Report</CardTitle>
              <CardDescription>Asset value and depreciation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This report shows the financial aspects of your assets, including total value, depreciation, and
                maintenance costs.
              </p>
              <div className="mt-4 flex justify-center">
                <FileText className="h-24 w-24 text-muted-foreground" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Generate a report to view the data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
