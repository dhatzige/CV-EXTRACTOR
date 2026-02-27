import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { passphrase } = await request.json();
  const correct = process.env.APP_PASSPHRASE;

  if (!correct) {
    return NextResponse.json(
      { error: "Passphrase not configured on server" },
      { status: 500 }
    );
  }

  if (passphrase !== correct) {
    return NextResponse.json({ error: "Incorrect passphrase" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth_token", correct, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
