import connectToDB from "@/db/db";
import commentModel from "@/model/comment";
import { getMe } from "@/utils/auth";
import ProductModal from "@/model/product";
import { commentValidationSchema } from "@/validators/comment";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
    try {
        await connectToDB();

        const { id } = params;
        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;

        const product = await ProductModal.findById(id).lean();
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        let cursor = null;
        if (page > 1) {
            const prev = await commentModel
                .find({ productID: product._id })
                .sort({ _id: 1 })
                .limit((page - 1) * limit)
                .lean();

            cursor = prev[prev.length - 1]?._id;
        }

        const query = cursor
            ? { _id: { $gt: cursor }, productID: product._id }
            : { productID: product._id };

        const totalCount = await commentModel.countDocuments({ productID: product._id });

        const comments = await commentModel
            .find(query)
            .sort({ _id: 1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ comments, totalCount }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await connectToDB();

        const user = await getMe();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        body.score = Number(body.score);

        const parsed = commentValidationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const product = await ProductModal.findById(body.productID);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        await commentModel.create({
            ...parsed.data,
            productID: body.productID,
            userID: user._id,
        });

        return NextResponse.json(
            { message: "Comment sent successfully" },
            { status: 201 }
        );
    } catch (err) {

        return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
}
