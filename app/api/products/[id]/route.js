import connectToDB from "@/configs/db";
import ProductModel from "@/model/product";
import { isValidObjectId } from "mongoose";
import { productSchema } from "@/validators/product";
import { authAdmin } from "@/utils/auth";
import handleFileUpload from "@/utils/serverFile";
import { NextResponse } from "next/server";

/* ===================== GET ===================== */
export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { id } = await params;
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 422 });

        const product = await ProductModel.findById(id).lean();
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        return NextResponse.json(product, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
}

/* ===================== DELETE ===================== */
export async function DELETE(req, { params }) {
    try {
        await connectToDB();

        const admin = await authAdmin();
        if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 422 });

        await ProductModel.findByIdAndDelete(id);

        return NextResponse.json({ message: "Product removed" }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
}

/* ===================== PUT ===================== */
export async function PUT(req, { params }) {
    try {
        await connectToDB();

        const admin = await authAdmin();
        if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
       
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 422 });
       
        const currentProduct = await ProductModel.findById(id);
        if (!currentProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        if (body.price) body.price = Number(body.price);
        if (body.score) body.score = Number(body.score);
        if (body.tags) {
            body.tags = body.tags.split(",").map(t => t.trim());
        }
        if (body.size) {
            body.size = body.size.split(",").map(s => s.trim());
        }

        // PUT => partial validation
        const parsed = productSchema.partial().safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        /* optional image upload */
        const img = await handleFileUpload(formData.get("img")) || currentProduct.img;
        if (!img) return NextResponse.json({ message: "Image is required" }, { status: 400 });

        await ProductModel.findByIdAndUpdate(id, {
            $set: {
                ...parsed.data,
                img,
            },
        });

        return NextResponse.json({ message: "Product updated" }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
}
