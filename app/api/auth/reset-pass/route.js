import connectToDB from '@/db/db';
import UserModal from '@/model/user';
import { hashPassword } from '@/utils/auth';
import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    await connectToDB();

    const { email, resetCode, newPassword } = await req.json();

    const user = await UserModal.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.resetCode !== resetCode)
      return NextResponse.json({ message: "Invalid reset code" }, { status: 422 });

    if (Date.now() > user.resetCodeExpire)
      return NextResponse.json({ message: "Reset code expired" }, { status: 422 });

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    user.resetCode = null;
    user.resetCodeExpire = null;

    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message},
      { status: 500 }
    );
  }
}

