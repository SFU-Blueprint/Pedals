import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const routes = [
    "/manage/people",
    "/manage/shift",
    "/change-access-code",
    "/export"
  ];
  if (routes.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/manage-login", req.url));
    }
    try {
      await jose.jwtVerify(
        token.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL("/manage-login", req.url));
    }
  } else if (token) {
    const response = NextResponse.next();
    response.cookies.delete("token");
    return response;
  }
  return NextResponse.next();
}
// Apply middleware only for these routes
export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
};
