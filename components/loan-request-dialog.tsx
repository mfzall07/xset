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

interface LoanRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoanRequested: (loan: any) => void
}

// Mock data for assets and users
const mockAssets = [
  { id: "A001", name: "Dell XPS 15 Laptop" },
  { id: "A002", name: "HP LaserJet Printer" },
  { id: "A003", name: 'MacBook Pro 16"' },
  { id: "A004", name: "Aeron Office Chair" },
  { id: "A005", name: "BenQ Projector" },
]

const mockUsers = [
  { id: "U001", name: "John Doe" },
  { id: "U002", name: "Jane Smith" },
  { id: "U003", name: "Mike Johnson" },
  { id: "U004", name: "Sarah Williams" },
  { id: "U005", name: "David Brown" },
]

export function LoanRequestDialog({ open, onOpenChange, onLoanRequested }: LoanRequestDialogProps) {
  const [formData, setFormData] = useState({
    assetId: "",
    assetName: "",
    borrower: "",
    borrowDate: "",
    returnDate: "",
    notes: "",
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        assetId: "",
        assetName: "",
        borrower: "",
        borrowDate: "",
        returnDate: "",
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

  const handleBorrowerChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      borrower: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLoan = {
      ...formData,
      borrowDate: new Date(formData.borrowDate),
      returnDate: new Date(formData.returnDate),
    }

    onLoanRequested(newLoan)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request Asset Loan</DialogTitle>
            <DialogDescription>Fill out the form to request an asset loan.</DialogDescription>
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
              <Label htmlFor="borrower">Borrower</Label>
              <Select value={formData.borrower} onValueChange={handleBorrowerChange} required>
                <SelectTrigger id="borrower">
                  <SelectValue placeholder="Select borrower" />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="borrowDate">Borrow Date</Label>
                <Input
                  id="borrowDate"
                  name="borrowDate"
                  type="date"
                  value={formData.borrowDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <Input
                  id="returnDate"
                  name="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Purpose / Notes</Label>
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
