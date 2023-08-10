import { getToken } from "next-auth/jwt";
import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";

export default async function middleware(
	req: NextRequestWithAuth,
	event: NextFetchEvent
) {
	const token = await getToken({ req });
	const isAuthenticated = !!token;
	if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
		return NextResponse.redirect(new URL("/", req.url));
	}
	if (req.nextUrl.pathname.startsWith("/signup") && isAuthenticated) {
		return NextResponse.redirect(new URL("/", req.url));
	}
	const authMiddleware = withAuth({
		pages: {
			signIn: "/login",
			newUser: "/signup",
		},
		callbacks: {
			authorized: async ({ req, token }) => {
				const pathname = req.nextUrl.pathname;
				if (pathname.startsWith("/signup") && !token) {
					return true;
				}
				if (token) return true;
				return false;
			},
		},
	});

	return authMiddleware(req, event);
}

export const config = { matcher: ["/", "/login", "/signup"] };
