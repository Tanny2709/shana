import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { ADMIN_USER, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    return new NextResponse("Admin access is not configured (missing ADMIN_USER/ADMIN_PASSWORD).", {
      status: 503,
    });
  }

  const authorization = request.headers.get("authorization");
  const expected = `Basic ${Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString("base64")}`;

  if (authorization !== expected) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
