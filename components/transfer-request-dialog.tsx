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

interface TransferRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTransferRequested: (transfer: any) => void
}

// Mock data for assets, locations, and users
const mockAssets = [
  { id: "A001", name: "Dell XPS 15 Laptop" },
  { id: "A002", name: "HP LaserJet Printer" },
  { id: "A003", name: 'MacBook Pro 16"' },
  { id: "A004", name: "Aeron Office Chair" },
  { id: "A005", name: "BenQ Projector" },
]

const mockLocations = [
  { id: "L001", name: "Main Office" },
  { id: "L002", name: "Warehouse A" },
  { id: "L003", name: "Downtown Store" },
  { id: "L004", name: "IT Department" },
  { id: "L005", name: "Marketing Office" },
  { id: "L006", name: "Warehouse B" },
]

const mockUsers = [
  { id: "U001", name: "John Doe" },
  { id: "U002", name: "Jane Smith" },
  { id: "U003", name: "Mike Johnson" },
  { id: "U004", name: "Sarah Williams" },
  { id: "U005", name: "David Brown" },
]

export function TransferRequestDialog({ open, onOpenChange, onTransferRequested }: TransferRequestDialogProps) {
  const [formData, setFormData] = useState({
    assetId: "",
    assetName: "",
    quantity: "1",
    sourceLocation: "",
    destinationLocation: "",
    requestedBy: "",
    notes: "",
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        assetId: "",
        assetName: "",
        quantity: "1",
        sourceLocation: "",
        destinationLocation: "",
        requestedBy: "",
        notes: "",
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAssetChange = (value: string) => {
    const selectedAsset = mockAssets.find((asset) => asset.id === value)
    if (selectedAsset) {
      setFormData((prev) => ({
        ...prev,
        assetId: selectedAsset.id,
        assetName: selectedAsset.name,
      }))
    }
  }

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUserChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      requestedBy: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTransfer = {
      assetIds: [formData.assetId],
      assetNames: [formData.assetName],
      quantity: Number.parseInt(formData.quantity),
      sourceLocation: formData.sourceLocation,
      destinationLocation: formData.destinationLocation,
      requestedBy: formData.requestedBy,
      notes: formData.notes,
    }

    onTransferRequested(newTransfer)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request Asset Transfer</DialogTitle>
            <DialogDescription>Fill out the form to request an asset transfer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select value={formData.assetId} onValueChange={handleAssetChange} required>
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {mockAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sourceLocation">Source Location</Label>
                <Select
                  value={formData.sourceLocation}
                  onValueChange={(value) => handleLocationChange("sourceLocation", value)}
                  required
                >
                  <SelectTrigger id="sourceLocation">
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
              <div className="space-y-2">
                <Label htmlFor="destinationLocation">Destination Location</Label>
                <Select
                  value={formData.destinationLocation}
                  onValueChange={(value) => handleLocationChange("destinationLocation", value)}
                  required
                >
                  <SelectTrigger id="destinationLocation">
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
            <div className="space-y-2">
              <Label htmlFor="requestedBy">Requested By</Label>
              <Select value={formData.requestedBy} onValueChange={handleUserChange} required>
                <SelectTrigger id="requestedBy">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Reason / Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
