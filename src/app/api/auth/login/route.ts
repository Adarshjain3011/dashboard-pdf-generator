
import { NextResponse, NextRequest } from "next/server";

import User from "@/models/user.model";

import z from "zod";

import { isEmailAlreadyExist } from "@/helper/isEmailExists";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { dbConnection } from "@/config/dbConfig";

import { cloudinaryConnect } from "@/config/cloudinaryConfig";


const userSchema = z.object({

    email: z.string(),
    password: z.string(),

})

dbConnection();

cloudinaryConnect();

export async function POST(req: NextRequest, res: NextResponse) {

    try {

        const body = await req.json();

        // validate the data 

        try {

            userSchema.parse(body);

        } catch (error: any) {

            return NextResponse.json({

                message: "singup validation error",
                error: error.message,
            })
        }

        const { email, password } = body;

        const isUserExists = await isEmailAlreadyExist(email);

        if (!isUserExists) {

            return NextResponse.json({
                message: " no user exits with this email",
                data: null,
                error: null,
            },{

                status:400,

            })
        }

        // hash the password 

        const isPasswordMatch = await bcrypt.compare(password, isUserExists?.password);


        if (!isPasswordMatch) {

            return NextResponse.json({

                message: "password does not match",
                data: null,
                error: null,

            },{

                status:400,
            })
        }


        // create a token 

        const tokenValue = {

            id: isUserExists?._id,
            email: isUserExists?.email,
            name: isUserExists?.name

        }

        const token = jwt.sign(
            tokenValue,
            process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string,
            {
                expiresIn: "24h",
            }
        );

        const response = NextResponse.json({
            message: "User loggedin successfully",
            status: 200,
            data: isUserExists,
            error: null,
        });

        response.cookies.set(
            "token",
            token,
            {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            }
        );
        
        return response;


    } catch (error: any) {

        console.log(error.message);


        return NextResponse.json({

            message:"some error occurred during login ",
            status: 500,
            error: error.message,

        })
    }
}



