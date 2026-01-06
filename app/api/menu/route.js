import connectToDB from "@/db/db"
import { menuSchema } from "@/validators/menuItem"
import menuItemModel from "@/model/menuItem"
import { authAdmin } from "@/utils/auth"
import handleFileUpload from "@/utils/serverFile"
export async function GET() {
    try {
        await connectToDB()
        const menuItems = await menuItemModel.find({}, "-__v").lean()
        return Response.json(menuItems, { status: 200 })
    }
    catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        await connectToDB()

        const admin = await authAdmin()
        if (!admin) throw new Error("This api Protected")

        const formData = await req.formData()
        const body = Object.fromEntries(formData.entries());
        body.price = Number(body.price);

        const parsed = menuSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        const isMenuItemExist = await menuItemModel.findOne({ name: body.name })

        if (isMenuItemExist) {
            return NextResponse.json(
                { message: "Article already exists" },
                { status: 409 }
            )
        }

        const image = await handleFileUpload(formData.get("cover")) || "";
        await menuItemModel.create({
            ...parsed.data,
            image
        })

        return Response.json({ message: "This Item created Successfully" }, { status: 200 })
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }

}
