import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Override on Vercel with BASIC_AUTH_USER / BASIC_AUTH_PASSWORD if needed. */
const USER = process.env.BASIC_AUTH_USER ?? "test";
const PASS = process.env.BASIC_AUTH_PASSWORD ?? "test1";
const REALM = "GMD Fences";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}"`,
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/api/healthz") {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const idx = decoded.indexOf(":");
      if (idx !== -1) {
        const user = decoded.slice(0, idx);
        const pass = decoded.slice(idx + 1);
        if (user === USER && pass === PASS) {
          return NextResponse.next();
        }
      }
    } catch {
      return unauthorized();
    }
  }

  return unauthorized();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
