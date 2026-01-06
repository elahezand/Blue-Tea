import connectToDB from "@/db/db"
import contactModel from "@/model/contact"
import { contactValidationSchema } from "@/validators/contact"
import { getMe } from "@/utils/auth"
import { paginate } from "@/utils/helper"
import { NextResponse } from "next/server"
import { authAdmin } from "@/utils/auth"
export async function GET(req) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This API is protected")

        const { searchParams } = new URL(req.url);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            contactModel,   // Model
            searchParams,   // searchParams
            {},             // filter
            null,           // populate
            useCursor,
            true     // cursor | pagination
        );
        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDB()
        const user = await getMe()
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const reqBody = await req.json()
        const parsed = contactValidationSchema.safeParse(reqBody)

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }
        await contactModel.create(parsed.data)
        return NextResponse.json({ message: "Request sent successfully" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 })
    }
}
