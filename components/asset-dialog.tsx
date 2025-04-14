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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssetAdded: (asset: any) => void
  asset?: any // For editing existing assets
}

// Mock data for categories and locations
const mockCategories = [
  { id: "C001", name: "Computer" },
  { id: "C002", name: "Furniture" },
  { id: "C003", name: "Electronics" },
  { id: "C004", name: "Mobile" },
  { id: "C005", name: "Printer" },
  { id: "C006", name: "IT Equipment" },
  { id: "C007", name: "Vehicle" },
]

const mockLocations = [
  { id: "L001", name: "Main Office" },
  { id: "L002", name: "Warehouse A" },
  { id: "L003", name: "Downtown Store" },
  { id: "L004", name: "IT Department" },
  { id: "L005", name: "Marketing Office" },
  { id: "L006", name: "Warehouse B" },
]

export function AssetDialog({ open, onOpenChange, onAssetAdded, asset }: AssetDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "available",
    location: "",
    purchaseDate: "",
    value: "",
    description: "",
  })

  // Update form data when editing an existing asset
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || "",
        category: asset.category || "",
        status: asset.status || "available",
        location: asset.location || "",
        purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().split("T")[0] : "",
        value: asset.value ? asset.value.toString() : "",
        description: asset.description || "",
      })
    } else {
      // Reset form when adding a new asset
      setFormData({
        name: "",
        category: "",
        status: "available",
        location: "",
        purchaseDate: "",
        value: "",
        description: "",
      })
    }
  }, [asset, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a random asset ID if it's a new asset
    const assetId = asset
      ? asset.id
      : `A${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(3, "0")}`

    const newAsset = {
      id: assetId,
      name: formData.name,
      category: formData.category,
      status: formData.status,
      location: formData.location,
      purchaseDate: new Date(formData.purchaseDate),
      value: Number.parseFloat(formData.value),
      description: formData.description,
      image: asset?.image || "/placeholder.svg?height=80&width=80",
    }

    onAssetAdded(newAsset)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            <DialogDescription>
              {asset
                ? "Update the details of this asset"
                : "Enter the details of the new asset to add to your inventory"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in-use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="lost">Lost/Stolen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleSelectChange("location", value)}
                  required
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{asset ? "Save Changes" : "Add Asset"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
