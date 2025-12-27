import mongoose from "mongoose";
import ProductModal from "./product";
import UserModal from "./user";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        price: {
          type: Number,
          required: true,
        },
        count: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },
  },
  {
    timestamps: true,
  }
);

const orderModal = mongoose.models.Order ||
  mongoose.model("Order", orderSchema);


  export default orderModal