"use client"

import { useState } from "react"
import { ArrowUpDown, Download, MoreHorizontal, Plus, Search, Shield, User } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserDialog } from "@/components/user-dialog"
import { useNotifications } from "@/components/notification-provider"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff" | "read-only"
  department: string
  status: "active" | "inactive"
  lastActive: Date
  avatar?: string
}

// Mock data for users
const mockUsers: UserData[] = [
  {
    id: "U001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    department: "IT",
    status: "active",
    lastActive: new Date("2025-03-14T10:30:00"),
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "U002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "manager",
    department: "Marketing",
    status: "active",
    lastActive: new Date("2025-03-13T15:45:00"),
  },
  {
    id: "U003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "staff",
    department: "Sales",
    status: "active",
    lastActive: new Date("2025-03-12T09:15:00"),
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "U004",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "manager",
    department: "HR",
    status: "active",
    lastActive: new Date("2025-03-14T11:20:00"),
  },
  {
    id: "U005",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "staff",
    department: "Finance",
    status: "inactive",
    lastActive: new Date("2025-03-10T14:30:00"),
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "U006",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "read-only",
    department: "Legal",
    status: "active",
    lastActive: new Date("2025-03-13T16:45:00"),
  },
  {
    id: "U007",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role: "manager",
    department: "Operations",
    status: "active",
    lastActive: new Date("2025-03-14T09:10:00"),
    avatar: "/placeholder-user.jpg",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addNotification } = useNotifications()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleStatusChange = (userId: string, newStatus: "active" | "inactive") => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

    const user = users.find((u) => u.id === userId)
    if (user) {
      addNotification({
        title: `User ${newStatus === "active" ? "Activated" : "Deactivated"}`,
        message: `${user.name} has been ${newStatus === "active" ? "activated" : "deactivated"}`,
        type: newStatus === "active" ? "success" : "info",
      })
    }
  }

  const getRoleBadge = (role: UserData["role"]) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>
      case "staff":
        return <Badge className="bg-green-500">Staff</Badge>
      case "read-only":
        return <Badge className="bg-gray-500">Read Only</Badge>
    }
  }

  const getStatusBadge = (status: UserData["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Inactive
          </Badge>
        )
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their permissions</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
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
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]">
                  <Shield className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="read-only">Read Only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.lastActive.toLocaleDateString()}{" "}
                        {user.lastActive.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
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
                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                            <DropdownMenuItem>Change role</DropdownMenuItem>
                            <DropdownMenuItem>Reset password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                Activate
                              </DropdownMenuItem>
                            )}
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

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUserAdded={(newUser) => {
          const userId = `U${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(3, "0")}`
          const userWithId = {
            ...newUser,
            id: userId,
            status: "active" as const,
            lastActive: new Date(),
          }
          setUsers([...users, userWithId])

          addNotification({
            title: "User Added",
            message: `${newUser.name} has been added as a ${newUser.role}`,
            type: "success",
          })
        }}
      />
    </div>
  )
}
