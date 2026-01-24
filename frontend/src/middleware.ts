import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // --- NHÓM 1: KIỂM TRA STEP (QUY TRÌNH QUÊN MẬT KHẨU/ĐĂNG KÝ) ---
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
      if (step !== "verified") {
        return NextResponse.redirect(new URL("/forgot", req.url));
      }
    }
    return NextResponse.next();
  }

  // --- NHÓM 2: KIỂM TRA ROLE (ADMIN/TEACHER) ---
  if (pathname.startsWith("/admin") || pathname.startsWith("/business")) {
    if (!token) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/role`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", 
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      const userRole = data.message;
      console.log("User role:", userRole);
      if (pathname.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      if (pathname.startsWith("/business") && userRole !== "business") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

// Gom tất cả đường dẫn vào đây
export const config = {
  matcher: [
    "/verify", 
    "/resetpassword", 
    "/admin/:path*", 
    "/business/:path*"
  ],
};