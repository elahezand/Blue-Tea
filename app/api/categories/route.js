import connectToDB from "@/configs/db";
import CategoryModel from "@/model/category";
import { NextResponse } from "next/server";
import { categorySchema } from "@/validators/category";

export async function GET() {
    try {
        await connectToDB();
        const categories = await CategoryModel.find({}, "-__v").lean();
        return NextResponse.json({ categories }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDB();

        const body = await req.json();
        const parsed = categorySchema.partial().safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const isCategoryExisted = await CategoryModel.findOne({ name: parsed.data.name });
        if (isCategoryExisted) {
            return NextResponse.json(
                { message: "Category already exists" },
                { status: 409 }
            );
        }

        const category = await CategoryModel.create(parsed.data);
        return NextResponse.json(
            { message: "Category created successfully", category },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
