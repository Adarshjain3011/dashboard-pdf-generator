

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(req:NextRequest){

    const path = req.nextUrl.pathname;

    console.log("pathname",path)

    const publicPath ="/auth/";


    let token = req.cookies.get("token")?.value || "";

    console.log("token",token);

    const ispublicPath = publicPath.startsWith(path);

    if(ispublicPath && token){

        return NextResponse.redirect(new URL("/",req.nextUrl));


    }

    if(!ispublicPath && !token){

        
        return NextResponse.redirect(new URL("/login",req.nextUrl));


    }


}


// see the matching paths 

export const config = {

    matcher: ['/((?!api|static|.\\..|_next).*)', '/auth/verifyEmail/:token'],

};

