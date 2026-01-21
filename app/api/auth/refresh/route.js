import connectToDB from "@/configs/db";
import UserModal from "@/model/user";
import { verifyRefreshToken, generateToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDB();

    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken")?.value;

    if (!refreshTokenCookie) {
      return NextResponse.json({ message: "User unauthorized" }, { status: 401 });
    }

    const payloadToken = await verifyRefreshToken(refreshTokenCookie);
    if (!payloadToken) {
      return NextResponse.json({ message: "User unauthorized" }, { status: 401 });
    }

    const user = await UserModal.findOne({ email: payloadToken.email });
    if (!user) {
      return NextResponse.json({ message: "User unauthorized" }, { status: 401 });
    }

    const newAccessToken = await generateToken({ email: payloadToken.email });

    return NextResponse.json(
      { message: "Access token refreshed", token: newAccessToken },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${newAccessToken}; Path=/; HttpOnly; SameSite=Lax`,
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message || "Unknown error" }, { status: 500 });
  }
}
