import orderModal from '@/model/order'
import connectToDB from '@/configs/db'
import { authAdmin } from '@/utils/auth'
import { orderSchema } from '@/validators/order'
import { NextResponse } from 'next/server'
import { paginate } from '@/utils/helper'

export async function GET(req) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw ("This Api Protected")

        const { searchParams } = new URL(req.url);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            orderModal,   // Model
            searchParams,   // searchParams
            {},             // filter
            null,           // populate
            useCursor,
            true      // cursor | pagination
        );
        return NextResponse.json(result, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ message: err.message}, { status: 500 });
    }
}
export async function POST(req) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This Api Protected")

        const body = await req.json();
        const parsed = orderSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const newOrder = await orderModal.create(parsed.data);
        return NextResponse.json({ message: "Order Created Successfully", newOrder }, { status: 200 })

    } catch (err) {
        return NextResponse.json({ message:err.message }, { status: 500 });
    }
}
