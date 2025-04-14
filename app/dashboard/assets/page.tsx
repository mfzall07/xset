"use client"

import { useState } from "react"
import { ArrowUpDown, Download, Filter, MoreHorizontal, Package, Plus, Search, Trash2 } from "lucide-react"
import Image from "next/image"
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
import { AssetDialog } from "@/components/asset-dialog"
import { useNotifications } from "@/components/notification-provider"

interface Asset {
  id: string
  name: string
  category: string
  status: "available" | "in-use" | "maintenance" | "retired" | "lost"
  location: string
  assignedTo?: string
  purchaseDate: Date
  value: number
  image?: string
}

// Mock data for assets
const mockAssets: Asset[] = [
  {
    id: "A001",
    name: "Dell XPS 15 Laptop",
    category: "Computer",
    status: "in-use",
    location: "IT Department",
    assignedTo: "John Doe",
    purchaseDate: new Date("2023-01-15"),
    value: 1899.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "A002",
    name: "HP LaserJet Printer",
    category: "Printer",
    status: "available",
    location: "Office 101",
    purchaseDate: new Date("2022-11-05"),
    value: 499.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "A003",
    name: 'MacBook Pro 16"',
    category: "Computer",
    status: "maintenance",
    location: "IT Repair",
    purchaseDate: new Date("2022-08-20"),
    value: 2499.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "A004",
    name: "Aeron Office Chair",
    category: "Furniture",
    status: "in-use",
    location: "Marketing",
    assignedTo: "Jane Smith",
    purchaseDate: new Date("2022-05-10"),
    value: 1099.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "A005",
    name: "BenQ Projector",
    category: "Electronics",
    status: "available",
    location: "Conference Room",
    purchaseDate: new Date("2023-02-28"),
    value: 799.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "A006",
    name: "iPhone 14 Pro",
    category: "Mobile",
    status: "lost",
    location: "Unknown",
    assignedTo: "Mike Johnson",
    purchaseDate: new Date("2022-09-15"),
    value: 999.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "A007",
    name: "Standing Desk",
    category: "Furniture",
    status: "in-use",
    location: "HR Department",
    assignedTo: "Sarah Williams",
    purchaseDate: new Date("2022-07-12"),
    value: 699.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "A008",
    name: "Server Rack",
    category: "IT Equipment",
    status: "retired",
    location: "Storage",
    purchaseDate: new Date("2020-03-20"),
    value: 1299.99,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addNotification } = useNotifications()

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleDeleteAsset = (id: string) => {
    const assetToDelete = assets.find((a) => a.id === id)
    setAssets(assets.filter((asset) => asset.id !== id))

    if (assetToDelete) {
      addNotification({
        title: "Asset Deleted",
        message: `${assetToDelete.name} has been removed from inventory`,
        type: "info",
      })
    }
  }

  const getStatusBadge = (status: Asset["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "in-use":
        return <Badge className="bg-blue-500">In Use</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>
      case "retired":
        return <Badge className="bg-gray-500">Retired</Badge>
      case "lost":
        return <Badge className="bg-red-500">Lost/Stolen</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Manage your organization's assets</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
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
                placeholder="Search assets..."
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="lost">Lost/Stolen</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Computer">Computer</SelectItem>
                  <SelectItem value="Printer">Printer</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Asset ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No assets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border">
                          {asset.image ? (
                            <Image
                              src={asset.image || "/placeholder.svg"}
                              alt={asset.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{asset.id}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{asset.assignedTo || "-"}</TableCell>
                      <TableCell className="text-right">${asset.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit asset</DropdownMenuItem>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Request loan</DropdownMenuItem>
                            <DropdownMenuItem>Request transfer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAsset(asset.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AssetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAssetAdded={(newAsset) => {
          setAssets([...assets, newAsset])
          addNotification({
            title: "Asset Added",
            message: `${newAsset.name} has been added to inventory`,
            type: "success",
          })
        }}
      />
    </div>
  )
}
