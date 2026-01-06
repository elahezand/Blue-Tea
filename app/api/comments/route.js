import connectToDB from "@/db/db";
import commentModel from "@/model/comment";
import { getMe } from "@/utils/auth";
import ProductModal from "@/model/product";
import { paginate } from "@/utils/helper";
import { commentValidationSchema } from "@/validators/comment";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
    try {
        await connectToDB();

        const { id } = await params;
        const { searchParams } = new URL(req.url);

        const product = await ProductModal.findById(id).lean();
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            commentModel,               // Model
            searchParams,               // searchParams
            { productID: product._id }, // filter
            null,                       // populate
            useCursor ,
            true                  // cursor /page
        );

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message}, { status: 500 });
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
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
