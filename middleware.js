import {NextResponse, NextRequest} from 'next/server';

export async function middleware(req, ev) {
    const {pathname} = req.nextUrl;
    console.log(pathname);
    if (pathname === '/') {
        return NextResponse.rewrite(new URL('/search/basic', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/']
};