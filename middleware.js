import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl
    const adminToken = request.cookies.get('Admintoken')?.value
    const userToken = request.cookies.get('activeUser')?.value
    if (pathname.startsWith('/admin')) {
        if (!adminToken) {
            return NextResponse.redirect(new URL("/authentication/admin", request.url))
        }
    }
    if (pathname.startsWith('/user')) {
        if (!userToken) {
            return NextResponse.redirect(new URL("/authentication/login", request.url))
        }
    }
    if (pathname.startsWith('/authentication/admin') && adminToken) {
        return NextResponse.redirect(new URL("/admin", request.url))
    }
    if ((pathname.startsWith('/authentication/login') || pathname.startsWith('/authentication/signup')) && userToken) {
        return NextResponse.redirect(new URL("/user", request.url))
    }
    return NextResponse.next()
}
export const config = {
    matcher:['/admin/:path*','/authentication/:path*','/user/:path*']
} 