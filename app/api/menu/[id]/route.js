import connectToDB from "@/configs/db";
import menuItemModel from "@/model/menuItem";
import { isValidObjectId } from "mongoose";
import { authAdmin } from "@/utils/auth";
import { menuSchema } from "@/validators/menuItem";
import handleFileUpload from "@/utils/serverFile";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectToDB();
        const admin = await authAdmin();
        if (!admin) throw new Error("This API Protected");

        const { id } = await params;
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 });

        const menuItem = await menuItemModel.findOne({ _id: id }).lean();
        if (!menuItem) throw new Error("Failed to get data");

        return NextResponse.json(menuItem, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDB();
        const admin = await authAdmin();
        if (!admin) throw new Error("This API Protected");

        const { id } = await params;
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Not Found" }, { status: 404 });

        await menuItemModel.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Item Removed" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message:err.message}, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDB();
        const admin = await authAdmin();
        if (!admin) throw new Error("This API Protected");

        const { id } = await params;
        if (!isValidObjectId(id)) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 });
        const isExistMenuItem = await menuItemModel.find({ _id: id })

        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        if (body.price) body.price = Number(body.price);

        // parse data with schema
        const parsed = menuSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        // handle image only if it's uploaded
        const image = await handleFileUpload(formData.get("cover")) || isExistMenuItem.image;
        const updateData = { ...parsed.data, image }

        await menuItemModel.findOneAndUpdate({ _id: id }, { $set: updateData });
        return NextResponse.json({ message: "Menu Updated" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
