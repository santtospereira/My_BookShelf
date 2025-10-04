import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;

    // If authenticated and trying to access the root, redirect to dashboard
    if (isAuthenticated && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // For all other routes (which are considered protected by default),
    // if not authenticated, withAuth will handle the redirect to signin.
    // If authenticated, allow access.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow unauthenticated access to public routes
        if (pathname === "/" || pathname.startsWith("/auth")) {
          return true; // Allow access
        }

        // For all other routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"], // Match all routes that need middleware logic
};