import ArticleModel from "@/model/article"
import connectToDB from "@/db/db"
import { isValidObjectId } from "mongoose"
import { authAdmin } from "@/utils/auth"
import { articleSchema } from "@/validators/article"
import handleFileUpload from "@/utils/serverFile"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const { id } = await params
        const isvalidId = isValidObjectId(id)
        if (!isvalidId) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 })

        const article = await ArticleModel.findOne({ _id: id }).lean()
        if (!article) NextResponse.json({ message: "Not Found" }, { status: 404 })

        return NextResponse.json(article, { status: 200 })

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const { id } = await params
        const isvalidId = isValidObjectId(id)

        if (!isvalidId) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 })

        await ArticleModel.findOneAndDelete({ _id: id })
        return NextResponse.json({ message: "Article Removed" }, { status: 200 })

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 200 })
    }
}


export async function PUT(req, { params }) {
    await connectToDB();
    try {
        const admin = await authAdmin();
        if (!admin) throw new Error("This api Protected");

        const { id } = await params;
        const isvalidId = isValidObjectId(id)
        if (!isvalidId) return NextResponse.json({ message: "Not Valid :)" }, { status: 422 })

        const existingArticle = await ArticleModel.findById(id);
        if (!existingArticle) {
            return NextResponse.json({ message: "Article not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        const parsed = articleSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const cover = await handleFileUpload(formData.get("cover")) || existingArticle.cover;
        await ArticleModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    ...parsed.data,
                    cover
                },
            }
        );

        return NextResponse.json({ message: "Article Updated" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message}, { status: 500 });
    }
}
