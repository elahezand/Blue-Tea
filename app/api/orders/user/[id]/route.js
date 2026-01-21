import connectToDB from "@/configs/db"
import orderModal from "@/model/order"
import { paginate } from "@/utils/helper"
import { isValidObjectId } from "mongoose"
import { authUser } from "@/utils/auth"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    try {
        await connectToDB()
        const { id } = await params
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 })

        const user = await authUser()
        if (!user) throw new Error("This api Protected")

        const { searchParams } = new URL(req.url);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            orderModal,   // Model
            searchParams,   // searchParams
            { user: user.id },             // filter
            null,           // populate
            useCursor,
            true     // cursor | pagination
        );

        return NextResponse.json(result, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 })
    }
}
