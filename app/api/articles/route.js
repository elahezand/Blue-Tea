import connectToDB from "@/configs/db"
import ArticleModel from "@/model/article"
import { authAdmin } from "@/utils/auth"
import { articleSchema } from "@/validators/article"
import { paginate } from "@/utils/helper"
import handleFileUpload from "@/utils/serverFile"
import { NextResponse } from "next/server"
export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            ArticleModel,   // Model
            searchParams,   // searchParams
            {},             // filter
            null,           // populate
            useCursor,
            true       // cursor | pagination
        );
        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDB()
        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const formData = await req.formData()
        const body = Object.fromEntries(formData.entries());

        const parsed = articleSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        const isArticletExist = await ArticleModel.findOne({ title: body.title })
        if (isArticletExist) {
            return NextResponse.json(
                { message: "Article already exists" },
                { status: 409 }
            )
        }
        const cover = await handleFileUpload(formData.get("cover")) || "";
        const article = await ArticleModel.create({
            ...parsed.data,
            cover
        })
        return NextResponse.json(
            {
                message: "Article Created Successfully",
                data: article
            },
            { status: 201 }
        )

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 })
    }

}


