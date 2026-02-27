import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Allow the auth API and login page through
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/api/auth" ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("auth_token")?.value;
  const correctPassphrase = process.env.APP_PASSPHRASE;

  if (!correctPassphrase || authCookie !== correctPassphrase) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
