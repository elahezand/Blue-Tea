import connectToDB from "@/db/db"
import { isValidObjectId } from "mongoose"
import reservationModal from "@/model/reservation"
import { paginate } from "@/utils/helper"
import { reservationValidationSchema } from "@/validators/reservation"
import { authAdmin, authUser } from "@/utils/auth"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    try {
        await connectToDB()
        const user = await authUser()
        if (!user) throw ("This Api Protected")

        const { id } = await params
        const isvalidId = isValidObjectId(id)
        if (!isvalidId) return NextResponse.json({ message: "Not Valid :)" }, { satatus: 422 })

        const { searchParams } = new URL(req.url);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            reservationModal,   // Model
            searchParams,   // searchParams
            { userID: id },             // filter
            null,           // populate
            useCursor,
            true      // cursor | pagination
        );

        return NextResponse.json(result, { status: 200 })

    } catch (err) {        
        return NextResponse.json({ message: err.message}, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const { id } = await params
        const isvalidId = isValidObjectId(id)

        if (!isvalidId) return NextResponse.json({ message: "Not Valid :)" }, { satatus: 422 })

        await reservationModal.findOneAndDelete({ _id: id })
        return NextResponse.json({ message: "Product Removed" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message:err.message }, { status: 500 })
    }
}


export async function PUT(req, { params }) {
    try {
        await connectToDB()
        const { id } = await params
        const isvalidId = isValidObjectId(id)

        if (!isvalidId) return Response.json({ message: "Not Valid :)" }, { satatus: 422 })

        const body = await req.json()
        const parsed = reservationValidationSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        await reservationModal.findOneAndUpdate({ _id: id }, {
            $set: parsed.data
        }
        )
        return Response.json({ message: "reservation created successfully" }, { status: 200, })

    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }

}

