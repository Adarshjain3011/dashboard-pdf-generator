

import { NextResponse,NextRequest } from "next/server";

import User from "@/models/user.model";

import z from "zod";

import {isEmailAlreadyExist} from "@/helper/isEmailExists";

import bcrypt from "bcrypt";

import { dbConnection } from "@/config/dbConfig";


const userSchema = z.object({

    name:z.string(),
    email:z.string(),
    password:z.string(),

})

dbConnection();


export async function POST(req:NextRequest, res: NextResponse){

    try{

        const body = await req.json();

        // validate the data 

        try{

            userSchema.parse(body);

        }catch(error:any){

            return NextResponse.json({

                message:"singup validation error",
                error:error.message,
            })
        }

        const {name,email,password} = body;

        const isUserExists = await isEmailAlreadyExist(email);

        if(isUserExists){

            return NextResponse.json({
                message:"user already exists plz go to login page ",
                data:null,
                error:null,
            },{

                status:400
                
            })
        }

        // hash the password 

        const hashedPassword = await bcrypt.hash(password,6);

        // create a new user entry in db 

        const newUser = await User.create({

            name,
            email,
            password:hashedPassword,

        })
        

        return NextResponse.json({

            message:"new user is created successfully",
            error:null,
            data:newUser,

        })


    }catch(error:any){

        console.log(error.message);


        return NextResponse.json({

            status:500,
            message:error.message,

        })
    }
}



