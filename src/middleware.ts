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

  const basicAuthRoutes = ["/checkin", "/register"];

  if (basicAuthRoutes.includes(req.nextUrl.pathname)) {
    const authHeader = req.headers.get("authorization");
    const origin = req.nextUrl.origin;

    // Always prompt for authentication in localhost
    if (!authHeader || !(await isValidPassword(authHeader, origin))) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"'
        }
      });
    }
  }

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
      return NextResponse.redirect(new URL("/manage-login", req.url));
    }
  }
  return NextResponse.next();
}

async function isValidPassword(
  authHeader: string,
  origin: string
): Promise<boolean> {
  const encodedCredentials = authHeader.split(" ")[1];
  const decoded = Buffer.from(encodedCredentials, "base64").toString();
  const [username, password] = decoded.split(":");

  try {
    const response = await fetch(`${origin}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
  return true;
}

// Apply middleware only for these routes
export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
};
