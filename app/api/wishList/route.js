import connectToDB from "@/db/db";
import WishlistModal from "@/model/wishList";
import ProductModal from "@/model/product";
import { authUser } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { paginate } from "@/utils/helper";
import { NextResponse } from "next/server";
export async function GET(req) {
    try {
        await connectToDB();
        const user = await authUser();
        if (!user) throw new Error("This API Protected");

        const { searchParams } = new URL(req.url);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            WishlistModal,          // Model
            searchParams,           // searchParams
            { user: user._id },     // filter
            "products",   // populate
            useCursor,
            true              // cursor | pagination
        );

        return NextResponse.json(result, { status: 200 });
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
        const { productID } = body;

        if (!isValidObjectId(productID)) return NextResponse.json({ message: "Invalid Product ID" }, { status: 422 });

        const product = await ProductModal.findById(productID);
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        const exists = await WishlistModal.findOne({ user: user._id, products: productID });
        if (exists) return NextResponse.json({ message: "Product already in wishlist" }, { status: 409 });

        await WishlistModal.findOneAndUpdate(
            { user: user._id },
            { $push: { products: productID } },
            { upsert: true }
        );

        return NextResponse.json({ message: "Product added to wishlist" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message:err.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDB();
        const user = await getMe();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const productID = searchParams.get("productID");

        if (!isValidObjectId(productID)) return NextResponse.json({ message: "Invalid Product ID" }, { status: 422 });

        await WishlistModal.findOneAndUpdate(
            { user: user._id },
            { $pull: { products: productID } }
        );

        return NextResponse.json({ message: "Product removed from wishlist" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message:err.message }, { status: 500 });
    }
}
