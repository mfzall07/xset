"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Printer, ArrowLeft, CheckCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications } from "@/components/notification-provider"
import { RoleGuard } from "@/components/role-guard"

// Types
interface Asset {
  id: string
  name: string
  category: string
  status: "available" | "in-use" | "maintenance" | "retired" | "lost"
  location: string
  value: number
  image?: string
  quantity?: number // For POS purposes
}

interface CartItem extends Asset {
  quantity: number
}

interface Customer {
  name: string
  email: string
  phone: string
}

interface Transaction {
  id: string
  items: CartItem[]
  customer: Customer
  total: number
  paymentMethod: string
  date: Date
}

// Mock data for available assets (products)
const mockProducts: Asset[] = [
  {
    id: "A001",
    name: "Dell XPS 15 Laptop",
    category: "Computer",
    status: "available",
    location: "IT Department",
    value: 1899.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 5,
  },
  {
    id: "A002",
    name: "HP LaserJet Printer",
    category: "Printer",
    status: "available",
    location: "Office 101",
    value: 499.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 3,
  },
  {
    id: "A005",
    name: "BenQ Projector",
    category: "Electronics",
    status: "available",
    location: "Conference Room",
    value: 799.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 2,
  },
  {
    id: "A009",
    name: "Wireless Keyboard",
    category: "Computer",
    status: "available",
    location: "IT Department",
    value: 89.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 10,
  },
  {
    id: "A010",
    name: "Wireless Mouse",
    category: "Computer",
    status: "available",
    location: "IT Department",
    value: 49.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 15,
  },
  {
    id: "A011",
    name: '24" Monitor',
    category: "Computer",
    status: "available",
    location: "IT Department",
    value: 249.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 7,
  },
  {
    id: "A012",
    name: "USB-C Dock",
    category: "Computer",
    status: "available",
    location: "IT Department",
    value: 129.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 8,
  },
  {
    id: "A013",
    name: "Wireless Headphones",
    category: "Electronics",
    status: "available",
    location: "IT Department",
    value: 179.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 6,
  },
]

export default function POSPage() {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [products, setProducts] = useState<Asset[]>(mockProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "receipt">("cart")
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory && product.status === "available" && (product.quantity || 0) > 0
  })

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.value * item.quantity, 0)

  // Add item to cart
  const addToCart = (product: Asset) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // Check if we have enough quantity
      if (existingItem.quantity + 1 <= (product.quantity || 0)) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      } else {
        addNotification({
          title: "Quantity Limit",
          message: `Only ${product.quantity} units available`,
          type: "warning",
        })
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    // Find the product to check available quantity
    const product = products.find((p) => p.id === productId)

    if (product && newQuantity > 0) {
      if (newQuantity <= (product.quantity || 0)) {
        setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
      } else {
        addNotification({
          title: "Quantity Limit",
          message: `Only ${product.quantity} units available`,
          type: "warning",
        })
      }
    } else if (newQuantity === 0) {
      removeFromCart(productId)
    }
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      addNotification({
        title: "Empty Cart",
        message: "Please add items to your cart before checkout",
        type: "warning",
      })
      return
    }

    setCheckoutStep("checkout")
  }

  // Handle customer info change
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomer((prev) => ({ ...prev, [name]: value }))
  }

  // Process payment
  const processPayment = () => {
    // Validate customer info
    if (!customer.name) {
      addNotification({
        title: "Missing Information",
        message: "Please enter customer name",
        type: "warning",
      })
      return
    }

    // Create transaction
    const transaction: Transaction = {
      id: `T${Date.now().toString().slice(-6)}`,
      items: [...cart],
      customer,
      total: cartTotal,
      paymentMethod,
      date: new Date(),
    }

    // Update product quantities
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id)
      if (cartItem) {
        return {
          ...product,
          quantity: (product.quantity || 0) - cartItem.quantity,
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setCurrentTransaction(transaction)
    setCheckoutStep("receipt")

    addNotification({
      title: "Sale Complete",
      message: `Transaction ${transaction.id} has been processed`,
      type: "success",
    })
  }

  // Print receipt
  const printReceipt = () => {
    window.print()
  }

  // Start new transaction
  const startNewTransaction = () => {
    setCart([])
    setCustomer({
      name: "",
      email: "",
      phone: "",
    })
    setPaymentMethod("cash")
    setCurrentTransaction(null)
    setCheckoutStep("cart")
  }

  return (
    <RoleGuard allowedRoles={["admin", "management"]}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
            <p className="text-muted-foreground">Sell assets and generate receipts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Products Section */}
          <div className={`lg:col-span-2 ${checkoutStep !== "cart" ? "hidden lg:block" : ""}`}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Computer">Computer</SelectItem>
                      <SelectItem value="Printer">Printer</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-muted-foreground">No products found</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square w-full overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="h-full w-full object-cover transition-all hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.id}</p>
                            </div>
                            <p className="font-bold">${product.value.toFixed(2)}</p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline">Stock: {product.quantity}</Badge>
                            <Button size="sm" onClick={() => addToCart(product)}>
                              <Plus className="mr-1 h-4 w-4" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart/Checkout Section */}
          <div className="lg:col-span-1">
            {checkoutStep === "cart" && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Shopping Cart</CardTitle>
                    <Badge variant="outline" className="text-base">
                      {cart.length} {cart.length === 1 ? "item" : "items"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-auto">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <ShoppingCart className="mb-2 h-12 w-12" />
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-md border">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">${item.value.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="w-20 text-right font-medium">${(item.value * item.quantity).toFixed(2)}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <Separator />
                <CardFooter className="flex flex-col gap-4 p-6">
                  <div className="flex w-full items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={clearCart} disabled={cart.length === 0}>
                      Clear
                    </Button>
                    <Button className="flex-1" onClick={handleCheckout} disabled={cart.length === 0}>
                      Checkout
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}

            {checkoutStep === "checkout" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => setCheckoutStep("cart")}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>Checkout</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Customer Information</h3>
                    <div className="space-y-2">
                      <Input
                        name="name"
                        placeholder="Customer Name *"
                        value={customer.name}
                        onChange={handleCustomerChange}
                        required
                      />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email (optional)"
                        value={customer.email}
                        onChange={handleCustomerChange}
                      />
                      <Input
                        name="phone"
                        placeholder="Phone (optional)"
                        value={customer.phone}
                        onChange={handleCustomerChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Payment Method</h3>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Order Summary</h3>
                    <div className="space-y-1">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity} x {item.name}
                          </span>
                          <span>${(item.value * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={processPayment}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Payment
                  </Button>
                </CardFooter>
              </Card>
            )}

            {checkoutStep === "receipt" && currentTransaction && (
              <Card className="print:shadow-none">
                <CardHeader className="print:pb-0">
                  <div className="flex items-center print:hidden">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={startNewTransaction}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>Receipt</CardTitle>
                  </div>
                  <div className="hidden print:block">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Asset Management System</h1>
                      <p className="text-muted-foreground">123 Business Street, City, Country</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Receipt #{currentTransaction.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentTransaction.date.toLocaleDateString()} {currentTransaction.date.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium">Customer</h3>
                      <p className="text-sm">{currentTransaction.customer.name}</p>
                      {currentTransaction.customer.email && (
                        <p className="text-sm text-muted-foreground">{currentTransaction.customer.email}</p>
                      )}
                      {currentTransaction.customer.phone && (
                        <p className="text-sm text-muted-foreground">{currentTransaction.customer.phone}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 font-medium">Items</h3>
                    <div className="space-y-2">
                      {currentTransaction.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <p>{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ${item.value.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-medium">${(item.value * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${currentTransaction.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%)</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${currentTransaction.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span> {currentTransaction.paymentMethod}
                    </p>
                  </div>

                  <div className="hidden print:block text-center pt-8">
                    <p className="text-sm text-muted-foreground">Thank you for your purchase!</p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 print:hidden">
                  <Button className="w-full" onClick={printReceipt}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Button>
                  <Button variant="outline" className="w-full" onClick={startNewTransaction}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    New Transaction
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
