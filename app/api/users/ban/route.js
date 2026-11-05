import connectToDB from "@/configs/db";
import BanModal from "@/model/ban";
import { authAdmin } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDB();
        const admin = await authAdmin();
        if (!admin) throw new Error("This API is protected");

        const { email, username } = await req.json();
        const existing = await BanModal.findOne({
            $or: [
                { email },
                { username }
            ]
        });
        if (existing) {
            await BanModal.deleteOne({ email: user.email });
            return NextResponse.json({ message: "User unbanned successfully" }, { status: 200 });
        }
        await BanModal.create({ email: user.email });
        return NextResponse.json({ message: "User banned successfully" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

