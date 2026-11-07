import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIES, ROLES, ROUTES } from "@/utils/constant";
import { decodeJwt, isJwtExpired } from "@/utils/jwt";


// Need a logged-in user
const PROTECTED_ROUTES = [ROUTES.ACCOUNT, ROUTES.ADMIN, "/favorites", "/cart"];

const GUEST_ROUTES = [ROUTES.LOGIN];

const matches = (pathname: string, routes: readonly string[]): boolean =>
    routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

interface Session {
    isLoggedIn: boolean
    role: string | null
    isStale: boolean
}

const readSession = (request: NextRequest): Session => {
    const access = decodeJwt(request.cookies.get(AUTH_COOKIES.ACCESS)?.value);
    const refresh = decodeJwt(request.cookies.get(AUTH_COOKIES.REFRESH)?.value);

    const accessValid = access && !isJwtExpired(access);
    const refreshValid = refresh && !isJwtExpired(refresh);

    return {
        isLoggedIn: Boolean(accessValid || refreshValid),
        role: access?.role || refresh?.role || null,
        isStale: Boolean((access || refresh) && !accessValid && !refreshValid),
    };
};

const redirectTo = (request: NextRequest, path: string, { withNext = false, clearCookies = false } = {}): NextResponse => {
    const url = new URL(path, request.url);
    if (withNext) url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);

    const response = NextResponse.redirect(url);
    if (clearCookies) {
        response.cookies.delete(AUTH_COOKIES.ACCESS);
        response.cookies.delete(AUTH_COOKIES.REFRESH);
    }
    return response;
};

export function proxy(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;
    const { isLoggedIn, role, isStale } = readSession(request);

    if (matches(pathname, PROTECTED_ROUTES) && !isLoggedIn) {
        return redirectTo(request, ROUTES.LOGIN, { withNext: true, clearCookies: isStale });
    }

    if (matches(pathname, [ROUTES.ADMIN]) && role && role !== ROLES.ADMIN) {
        return redirectTo(request, ROUTES.ACCOUNT);
    }

    if (matches(pathname, GUEST_ROUTES) && isLoggedIn) {
        return redirectTo(request, role === ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.ACCOUNT);
    }

    const response = NextResponse.next();
    if (isStale) {
        response.cookies.delete(AUTH_COOKIES.ACCESS);
        response.cookies.delete(AUTH_COOKIES.REFRESH);
    }
    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)"],
};
