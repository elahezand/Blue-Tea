// app/api/auth/signin/route.js
import connectToDB from "@/db/db";
import UserModal from "@/model/user";
import { verifyPassword, generateToken, generateRefreshToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { identifier, password } = body;

    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*\-]).{8,}$/;
    const isValidPassword = regex.test(password);

    if (!isValidPassword) {
      return NextResponse.json({ message: "Password is not valid" }, { status: 422 });
    }

    const user = await UserModal.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Password is incorrect" }, { status: 422 });
    }

    let email = user.email || `${user.phone}@gmail.com`;
    const accessToken = await generateToken({ email });
    const refreshToken = await generateRefreshToken({ email });

    return NextResponse.json(
      { message: "LogIn successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            `token=${accessToken}; Path=/; HttpOnly; SameSite=Lax`,
            `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Lax`
          ]
        }
      }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

