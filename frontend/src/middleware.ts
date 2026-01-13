import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = await fetch("http://localhost:5000/api/check-step", {
    headers: {
      Cookie: req.headers.get("cookie") || "",
    },
    cache: "no-store",
  });
  const data = await res.json();
  const step = data.message;
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/verify")) {
    if (step === "forgot" || step === "register") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname.startsWith("/resetpassword")) {
    if (step === "verified") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/forgot", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/verify", "/resetpassword"],
};
