

import { NextRequest, NextResponse } from "next/server";

import DummyData from "@/models/dummyData.model";

import { getPublicIdFromUrl } from "@/helper/idExtractor";

import { cloudinaryConnect } from "@/config/cloudinaryConfig";

import cloudinary from "cloudinary";

cloudinaryConnect();


export async function GET(req: NextRequest, res: NextResponse) {


    try {

        const { id } = req.query;

        if (!id) {

            return NextResponse.json({


                message: "pdf id is not provided ",
                data: null,
                error: null

            }, {

                status: 400,
            })
        }

        // Find the record in MongoDB

        const record = await DummyData.findById(id);

        if (!record) {

            return NextResponse.json({

                message: "pdf id is not found ",
                error: null,
                data: null,
                status: 400,
            })
        }

        // Delete the associated image from Cloudinary

        const imagePublicId = getPublicIdFromUrl(record.imageUrl);

        await cloudinary.v2.uploader.destroy(imagePublicId, { resource_type: 'image' });

        // Delete the associated PDF from Cloudinary

        const pdfPublicId = getPublicIdFromUrl(record.pdfUrl);
        await cloudinary.v2.uploader.destroy(pdfPublicId, { resource_type: 'raw' });


        // Delete the record from database 

        const DeletePdf = await DummyData.findByIdAndDelete({


            _id: record._id,

        })

        return NextResponse.json({

            message: "pdf deleted successfully",
            error: null,
            data: null,
            status: 200,

        })



    } catch (error: any) {


        return NextResponse.json({

            message: "pdf id is not provided",
            error: error.message,
            data: null,
            status: 500,
        })

    }
}


