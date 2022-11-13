import {NextResponse, NextRequest} from 'next/server';

export async function middleware(req, ev) {
    const {pathname} = req.nextUrl;
    if (pathname === '/') {
        return NextResponse.rewrite(new URL('/search/basic', req.url));
    }
    return NextResponse.next();
}