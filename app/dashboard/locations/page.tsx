"use client"

import { useState } from "react"
import { ArrowUpDown, Download, Edit, MapPin, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LocationDialog } from "@/components/location-dialog"
import { useNotifications } from "@/components/notification-provider"

interface Location {
  id: string
  name: string
  description: string
  address: string
  type: "office" | "warehouse" | "store" | "other"
  createdAt: Date
}

// Mock data for locations
const mockLocations: Location[] = [
  {
    id: "L001",
    name: "Main Office",
    description: "Headquarters building",
    address: "123 Corporate Drive, Business City, 12345",
    type: "office",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "L002",
    name: "Warehouse A",
    description: "Main storage facility",
    address: "456 Industrial Blvd, Warehouse District, 12345",
    type: "warehouse",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "L003",
    name: "Downtown Store",
    description: "Retail location in city center",
    address: "789 Main Street, Downtown, 12345",
    type: "store",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "L004",
    name: "IT Department",
    description: "IT workspace and server room",
    address: "123 Corporate Drive, 2nd Floor, Business City, 12345",
    type: "office",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "L005",
    name: "Marketing Office",
    description: "Marketing team workspace",
    address: "123 Corporate Drive, 3rd Floor, Business City, 12345",
    type: "office",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "L006",
    name: "Warehouse B",
    description: "Secondary storage facility",
    address: "457 Industrial Blvd, Warehouse District, 12345",
    type: "warehouse",
    createdAt: new Date("2024-03-10"),
  },
]

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(mockLocations)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const { addNotification } = useNotifications()

  const filteredLocations = locations.filter((location) => {
    return (
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleAddLocation = (newLocation: Omit<Location, "id" | "createdAt">) => {
    const locationId = `L${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}`
    const locationWithId = {
      ...newLocation,
      id: locationId,
      createdAt: new Date(),
    }
    setLocations([...locations, locationWithId])

    addNotification({
      title: "Location Added",
      message: `${newLocation.name} has been added to locations`,
      type: "success",
    })
  }

  const handleEditLocation = (updatedLocation: Location) => {
    setLocations((prev) => prev.map((location) => (location.id === updatedLocation.id ? updatedLocation : location)))

    addNotification({
      title: "Location Updated",
      message: `${updatedLocation.name} has been updated`,
      type: "success",
    })
  }

  const handleDeleteLocation = (id: string) => {
    const locationToDelete = locations.find((l) => l.id === id)
    setLocations(locations.filter((location) => location.id !== id))

    if (locationToDelete) {
      addNotification({
        title: "Location Deleted",
        message: `${locationToDelete.name} has been removed`,
        type: "info",
      })
    }
  }

  const openEditDialog = (location: Location) => {
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">Manage your organization's locations</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingLocation(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Location
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
                placeholder="Search locations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No locations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          {location.name}
                        </div>
                      </TableCell>
                      <TableCell>{location.description}</TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell className="capitalize">{location.type}</TableCell>
                      <TableCell>{location.createdAt.toLocaleDateString()}</TableCell>
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
                            <DropdownMenuItem onClick={() => openEditDialog(location)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteLocation(location.id)}
                            >
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

      <LocationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        location={editingLocation}
        onSave={(locationData) => {
          if (editingLocation) {
            handleEditLocation({
              ...locationData,
              id: editingLocation.id,
              createdAt: editingLocation.createdAt,
            })
          } else {
            handleAddLocation(locationData)
          }
        }}
      />
    </div>
  )
}
