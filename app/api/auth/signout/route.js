// app/api/auth/signout/route.js
import { cookies } from "next/headers";
import connectToDB from "@/db/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDB();
    const cookiesStore = cookies();

    cookiesStore.delete("token");
    cookiesStore.delete("refreshToken");

    return NextResponse.json(
      { message: "You logged out successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message},
      { status: 500 }
    );
  }
}
