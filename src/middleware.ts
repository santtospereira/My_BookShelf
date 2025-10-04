import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments the `Request` with the user's token.
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;

    // If authenticated and trying to access the root, redirect to dashboard
    if (isAuthenticated && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If unauthenticated and trying to access /dashboard, redirect to signin
    if (!isAuthenticated && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Protect root and all routes under /dashboard
};