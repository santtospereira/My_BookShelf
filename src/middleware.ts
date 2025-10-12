import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;

    if (isAuthenticated && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/" || pathname.startsWith("/auth")) {
          return true; 
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"], 
};