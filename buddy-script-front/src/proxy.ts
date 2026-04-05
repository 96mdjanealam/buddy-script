import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Define public and auth routes
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Define protected routes (e.g., everything except auth routes and landing page if public)
  // For now, let's assume / is protected
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile");

  if (isAuthRoute && accessToken) {
    // If logged in and trying to access login/register, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute && !accessToken) {
    // If NOT logged in and trying to access protected route, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
