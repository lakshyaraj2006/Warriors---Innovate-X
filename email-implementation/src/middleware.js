import { NextResponse } from "next/server";

export function middleware(req) {
  const authToken = req.cookies.get("authtoken")?.value;
  const { pathname } = req.nextUrl;

  if (authToken) {
    if (pathname !== "/profile") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  } else {
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
