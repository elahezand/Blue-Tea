import { z } from "zod";

export const orderSchema = z.object({
  user: z.string().min(1, "User is required"),

  items: z.array(
    z.object({
      product: z.string().min(1, "Product is required"),
      title: z.string().optional(),
      price: z.number().positive(),
      count: z.number().int().min(1),
    })
  ).min(1, "Order must have at least one item"),

  totalPrice: z.number().positive(),

  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "canceled",
  ]).optional(),

  paymentMethod: z.enum(["online", "cash"]),

  isPaid: z.boolean().optional(),
  paidAt: z.date().optional(),

  shippingAddress: z.object({
    fullName: z.string().min(3),
    phone: z.string().min(8),
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().optional(),
  }).optional(),
});

export type OrderInput = z.infer<typeof orderSchema>

// Delivery details form in the cart (was inside components/template/cart/cartItems)
export const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(8, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
})

export type ShippingInput = z.infer<typeof shippingSchema>
