"use client"

import { useState } from "react"
import { ArrowUpDown, Download, Edit, MoreHorizontal, Plus, Search, Tag, Trash2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { CategoryDialog } from "@/components/category-dialog"
import { useNotifications } from "@/components/notification-provider"

interface Category {
  id: string
  name: string
  description: string
  color: string
  createdAt: Date
}

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: "C001",
    name: "Computer",
    description: "Desktop computers, laptops, and servers",
    color: "blue",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "C002",
    name: "Furniture",
    description: "Office furniture including desks, chairs, and cabinets",
    color: "amber",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "C003",
    name: "Electronics",
    description: "Electronic devices like projectors, TVs, and audio equipment",
    color: "purple",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "C004",
    name: "Mobile",
    description: "Mobile phones, tablets, and portable devices",
    color: "green",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "C005",
    name: "Printer",
    description: "Printers, scanners, and multifunction devices",
    color: "red",
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "C006",
    name: "IT Equipment",
    description: "Network equipment, cables, and IT accessories",
    color: "indigo",
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "C007",
    name: "Vehicle",
    description: "Company vehicles and transportation equipment",
    color: "orange",
    createdAt: new Date("2024-03-10"),
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { addNotification } = useNotifications()

  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleAddCategory = (newCategory: Omit<Category, "id" | "createdAt">) => {
    const categoryId = `C${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}`
    const categoryWithId = {
      ...newCategory,
      id: categoryId,
      createdAt: new Date(),
    }
    setCategories([...categories, categoryWithId])

    addNotification({
      title: "Category Added",
      message: `${newCategory.name} has been added to categories`,
      type: "success",
    })
  }

  const handleEditCategory = (updatedCategory: Category) => {
    setCategories((prev) => prev.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)))

    addNotification({
      title: "Category Updated",
      message: `${updatedCategory.name} has been updated`,
      type: "success",
    })
  }

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find((c) => c.id === id)
    setCategories(categories.filter((category) => category.id !== id))

    if (categoryToDelete) {
      addNotification({
        title: "Category Deleted",
        message: `${categoryToDelete.name} has been removed`,
        type: "info",
      })
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const getCategoryBadge = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      amber: "bg-amber-500",
      indigo: "bg-indigo-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      gray: "bg-gray-500",
    }

    return <Badge className={colorMap[color] || "bg-gray-500"}>{color}</Badge>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your asset categories</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingCategory(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
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
                placeholder="Search categories..."
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
                  <TableHead>Color</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{getCategoryBadge(category.color)}</TableCell>
                      <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
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
                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(category.id)}
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

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSave={(categoryData) => {
          if (editingCategory) {
            handleEditCategory({
              ...categoryData,
              id: editingCategory.id,
              createdAt: editingCategory.createdAt,
            })
          } else {
            handleAddCategory(categoryData)
          }
        }}
      />
    </div>
  )
}
