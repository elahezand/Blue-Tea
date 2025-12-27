import orderModal from '@/model/order'
import connectToDB from '@/db/db'
import { authAdmin } from '@/utils/auth'
import { orderSchema } from '@/validators/order'
import { NextResponse } from 'next/server'

export async function GET(req) {
    try {
        connectToDB()
        const admin = await authAdmin()
        if (!admin) throw ("This Api Protected")

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 15;

        let cursor = null;

        if (page > 1) {
            const prevOrders = await orderModal
                .find({})
                .sort({ _id: 1 })
                .limit((page - 1) * limit)
                .lean();

            cursor = prevOrders[prevOrders.length - 1]?._id;
        }

        const query = cursor ? { _id: { $gt: cursor } } : {};
        const totalCount = await orderModal.countDocuments({});

        const orders = await orderModal
            .find(query)
            .sort({ _id: 1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ orders, totalCount }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: "UNKNOWN ERROR" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        connectToDB()
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
        return NextResponse.json({ message: "UNKNOWN ERROR" }, { status: 500 });
    }
}
