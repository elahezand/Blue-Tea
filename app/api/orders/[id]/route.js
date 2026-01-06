import connectToDB from "@/db/db"
import orderModal from "@/model/order"
import { isValidObjectId } from "mongoose"
import { authAdmin } from "@/utils/auth"
import { NextResponse } from "next/server"
import { orderSchema } from "@/validators/order"

export async function GET(req, { params }) {
    try {
        await connectToDB()
        const { id } = await params
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 })

        const order = await orderModal.findOne({ _id: id }).lean()
        return NextResponse.json(order, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const { id } = params
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 })

        await orderModal.findOneAndDelete({ _id: id })
        return NextResponse.json({ message: "Order Removed" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 })
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const { id } = params
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 })

        const formData = await req.formData()
        const data = {}
        formData.forEach((value, key) => {
            data[key] = isNaN(Number(value)) ? value : Number(value)
        })

        const shippingAddress = {
            fullName: data["shippingAddress.fullName"],
            phone: data["shippingAddress.phone"],
            address: data["shippingAddress.address"],
            city: data["shippingAddress.city"],
            postalCode: data["shippingAddress.postalCode"],
        }

        if (data.items) data.items = JSON.parse(data.items)
        const parsed = orderSchema.safeParse(data)
        if (!parsed.success) {
            return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 })
        }

        await orderModal.findOneAndUpdate({ _id: id }, {
            $set: {
                ...parsed.data,
                shippingAddress
            }
        })
        return NextResponse.json({ message: "Order Updated" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message: err.message}, { status: 500 })
    }
}
