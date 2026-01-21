import connectToDB from "@/configs/db";
import ProductModal from "@/model/product";
import CategoryModel from "@/model/category";
import { authAdmin } from "@/utils/auth";
import { productSchema } from "@/validators/product";
import { paginate } from "@/utils/helper";
import handleFileUpload from "@/utils/serverFile";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);

        const useCursor = searchParams.has("cursor");        
        const categoryName = searchParams.get("category");

        const value = searchParams.get("value");
        const min = searchParams.get("min");
        const max = searchParams.get("max");

        let filter = {};

        if (categoryName) {
            const category = await CategoryModel
                .findOne({ name: categoryName })
                .lean();
            if (category) filter.category = category._id;
        }
        if (value) {
            filter.name = { $regex: value, $options: "i" };
        }
        if (min || max) {
            filter.price = {};
            if (min) filter.price.$gte = Number(min);
            if (max) filter.price.$lte = Number(max);
        }
        const result = await paginate(
            ProductModal,
            searchParams,
            filter,
            null,
            useCursor,
            true
        );
        return NextResponse.json(result, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        body.price = Number(body.price);
        body.score = Number(body.score);
        body.tags = body.tags?.split(",").map(t => t.trim());
        body.size = body.size?.split(",").map(s => s.trim());

        const parsed = productSchema.safeParse(body);
        if (!parsed.success)
            return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });

        const isProductExist = await ProductModal.findOne({ name: body.name });
        if (isProductExist)
            return NextResponse.json({ message: "This Product Already Exists :(" }, { status: 409 });

        const img = await handleFileUpload(formData.get("img")) || "";
        if (!img) return NextResponse.json({ message: "Image is required" }, { status: 400 });

        await ProductModal.create({
            ...parsed.data,
            img,
            isAvailable: true
        });

        return NextResponse.json({ message: "Product Created Successfully" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 })
    }
}
