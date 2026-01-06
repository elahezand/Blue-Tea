import connectToDB from '@/db/db';
import UserModel from '@/model/user';
import { sendEmail } from '@/utils/sendEmail';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
function generateResetCode() {
  return crypto.randomInt(10000, 100000).toString();
}
export async function POST(req) {
  try {
    await connectToDB();
    const { email } = await req.json();
    const user = await UserModel.findOne({ email });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const resetCode = generateResetCode();

    user.resetCode = resetCode;
    user.resetCodeExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Password Reset Code",
      `<p>Your reset code is: <b>${resetCode}</b></p>`
    );

    return NextResponse.json({ message: "Reset code sent to email" }, { status: 200 });
  } catch (err) {

    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}