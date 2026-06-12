import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const RATE_LIMIT = 100; // requests
const TIME_WINDOW = 60 * 1000; // 1 minute in ms
const ipRequestMap = new Map();

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  // console.log("MIDDLEWARE HIT:", pathname);
  //protected paths
  const protectedPaths = [
    "/api/admin",
    "/api/ukdata",
    "/api/editukdata/:path",
    "/api/editukdoc/:path",
    "/api/ukdoc",
    "/api/ukcom",
    "/api/editukcom/:path",
    "/api/editukcom/:path/add-year",
    "/api/editukcom/:path*",
    "/api/ukalliances",
    "/api/editukalliances/:path",
    "/api/getUkcharity",
    "/api/ukcharity/:path",
    "/api/EU/:path*",
    "/api/editEU/:path*",
  ];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (request.method === "GET" && pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (isProtected) {
    // Rate limiting logic
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    const now = Date.now();
    const timestamps = ipRequestMap.get(ip) || [];

    const recent = timestamps.filter(
      (timestamp) => now - timestamp < TIME_WINDOW
    );

    if (recent.length >= RATE_LIMIT) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Try again in a minute.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    recent.push(now);
    ipRequestMap.set(ip, recent);
  }

  const token = request.cookies.get("wastetoken")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({
          error: "Authentication required",
          message: "Please login to access this endpoint",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.json({ message: "invalid req." }, { status: 400 });
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid token",
          message: "Authentication token is invalid or expired",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.json({ message: "invalid req" }, { status: 400 });
  }
}

export const config = {
  matcher: [
    "/api/admin",
    "/api/ukdata",
    "/api/editukdata/:path",
    "/api/editukdoc/:path",
    "/api/ukdoc",
    "/api/ukcom",
    "/api/editukcom/:path",
    "/api/editukcom/:path/delete-year",
    "/api/editukcom/:path*",
    "/api/ukalliances",
    "/api/editukalliances/:path",
    "/api/getUkcharity",
    "/api/ukcharity/:path",
    "/api/EU/:path*",
    "/api/editEU/:path*",
  ],
};
