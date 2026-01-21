import connectToDB from "@/configs/db";
import { authAdmin } from "@/utils/auth";
import UserModal from "@/model/user";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        await connectToDB();

        const admin = await authAdmin();
        if (!admin) throw new Error("This API is Protected");

        const { userID } = await req.json();
        const user = await UserModal.findById(userID);
        if (!user) return NextResponse.json({ message: "User Not Found" }, { status: 404 });

        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        await UserModal.findByIdAndUpdate(userID, { $set: { role: newRole } });

        return NextResponse.json({ message: `User role changed to ${newRole}` }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message:err.message}, { status: 500 });
    }
}
