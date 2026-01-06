import { cookies } from "next/headers";
import connectToDB from "@/db/db";
import { verifyRefreshToken } from "@/utils/auth";
import UserModal from "@/model/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const cookiesStore = cookies();
    const tokenCookie = cookiesStore.get("refreshToken")?.value;

    if (!tokenCookie) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payloadToken = await verifyRefreshToken(tokenCookie);
    if (!payloadToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModal.findOne(
      { email: payloadToken.email },
      "-password -refreshToken -__v"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message:err.message}, { status: 500 });
  }
}
