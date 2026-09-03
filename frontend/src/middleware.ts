import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/verify") || pathname.startsWith("/resetpassword")) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-step`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });
    const data = await res.json();
    const step = data.message;

    if (pathname.startsWith("/verify")) {
      if (step !== "forgot" && step !== "register") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
    if (pathname.startsWith("/resetpassword")) {
      if (step !== "verifiedresetpassword") {
        return NextResponse.redirect(new URL("/forgot", req.url));
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Gom tất cả đường dẫn vào đây
export const config = {
  matcher: [
    "/verify", 
    "/resetpassword", 
  ],
};