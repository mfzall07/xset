"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationData {
  name: string
  description: string
  address: string
  type: "office" | "warehouse" | "store" | "other"
}

interface LocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: {
    id: string
    name: string
    description: string
    address: string
    type: "office" | "warehouse" | "store" | "other"
    createdAt: Date
  } | null
  onSave: (location: LocationData) => void
}

export function LocationDialog({ open, onOpenChange, location, onSave }: LocationDialogProps) {
  const [formData, setFormData] = useState<LocationData>({
    name: "",
    description: "",
    address: "",
    type: "office",
  })

  // Update form data when editing an existing location
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        description: location.description,
        address: location.address,
        type: location.type,
      })
    } else {
      // Reset form when adding a new location
      setFormData({
        name: "",
        description: "",
        address: "",
        type: "office",
      })
    }
  }, [location, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value as "office" | "warehouse" | "store" | "other",
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{location ? "Edit Location" : "Add New Location"}</DialogTitle>
            <DialogDescription>
              {location
                ? "Update the details for this location"
                : "Enter the details of the new location to add to your organization"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Location Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="store">Store</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{location ? "Save Changes" : "Add Location"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
