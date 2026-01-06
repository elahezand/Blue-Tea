import connectToDB from "@/db/db";
import UserModal from "@/model/user";
import { hashPassword } from "@/utils/auth";
import { userValidationSchema } from "@/validators/user";
import { generateRefreshToken, generateToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const parsed = userValidationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, password, phone, email } = body;

    const isUserExist = await UserModal.findOne({ $or: [{ email }, { phone }] });
    const users = await UserModal.find({});

    if (isUserExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const accessToken = await generateToken({ email });
    const refreshToken = await generateRefreshToken({ email });

    await UserModal.create({
      email: email || null,
      name,
      phone,
      password: hashedPassword,
      role: users.length < 3 ? "ADMIN" : "USER",
      refreshToken,
    });

    return NextResponse.json(
      { message: "You registered successfully." },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            `token=${accessToken}; Path=/; HttpOnly; SameSite=Lax`,
            `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Lax`,
          ],
        },
      }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message}, { status: 500 });
  }
}
