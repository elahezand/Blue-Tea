import connectToDB from "@/configs/db";
import CategoryModel from "@/model/category";
import { isValidObjectId } from "mongoose";
import { authAdmin } from "@/utils/auth";
import { NextResponse } from "next/server";
import { categorySchema } from "@/validators/category";


// GET single category
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const admin = await authAdmin();
    if (!admin) throw new Error("This API Protected");

    const { id } = params;
    if (!isValidObjectId(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 422 });

    const category = await CategoryModel.findById(id).lean();
    if (!category) throw new Error("Category not found");

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST new category
export async function POST(req) {
  try {
    await connectToDB();
    const admin = await authAdmin();
    if (!admin) throw new Error("This API Protected");

    const body = await req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { name, slug, parentId } = parsed.data;

    // Check duplicate
    const existing = await CategoryModel.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    }

    const category = await CategoryModel.create({ name, slug, parentId });
    return NextResponse.json({ message: "Category created", data: category }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT update category
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const admin = await authAdmin();
    if (!admin) throw new Error("This API Protected");

    const { id } = params;
    if (!isValidObjectId(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 422 });

    const body = await req.json();
    const parsed = categorySchema.partial().safeParse(body); // partial = optional fields

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const updated = await CategoryModel.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updated) throw new Error("Failed to update category");

    return NextResponse.json({ message: "Category updated", data: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const admin = await authAdmin();
    if (!admin) throw new Error("This API Protected");

    const { id } = params;
    if (!isValidObjectId(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 422 });

    const deleted = await CategoryModel.findByIdAndDelete(id);
    if (!deleted) throw new Error("Failed to delete category");

    return NextResponse.json({ message: "Category removed" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
