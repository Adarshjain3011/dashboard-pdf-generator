import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cloudinaryConnect } from '@/config/cloudinaryConfig';
import { ImageUploader } from '@/helper/ImageUploader';
import { generatePdf } from '@/helper/generatePdf';
import DummyData from '@/models/dummyData.model';

import { dbConnection } from '@/config/dbConfig';

dbConnection();

// Handle POST request to generate PDF
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const pdfName = formData.get('name');
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const imageFile = formData.get('imageUrl') as File;

        if (!title || !content || !imageFile) {
            return NextResponse.json({
                message: "All fields are not fulfilled.",
                data: null,
                error: null,
            }, { status: 400 });
        }


        let uploadResult;
        try {
            uploadResult = await ImageUploader(imageFile);
        } catch (e: any) {
            return NextResponse.json({
                message: "Error uploading image to Cloudinary.",
                error: e.message,
                data: null,
            }, { status: 400 });
        }

        let pdfResult;
        try {
            pdfResult = await generatePdf(title, content, uploadResult.secure_url);
        } catch (e: any) {
            return NextResponse.json({
                message: "Error generating PDF.",
                error: e.message,
                data: null,
            }, { status: 400 });
        }

        const dummyData = new DummyData({
            title,
            content,
            imageUrl: uploadResult.secure_url,
            pdfUrl: pdfResult.secure_url,
        });

        await dummyData.save();

        return NextResponse.json({
            message: 'PDF generated successfully',
            data: { dummyData },
            error: null,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({
            message: 'Some error occurred',
            error: error.message,
        }, {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Handle GET request to fetch all PDFs
export async function GET(req: NextRequest) {
    try {
        const allPdfs = await DummyData.find({});
        return NextResponse.json({
            message: 'All PDFs fetched successfully',
            data:allPdfs,
            error: null,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching PDFs:', error);
        return NextResponse.json({
            message: 'Some error occurred while fetching all PDFs',
            error: error.message,
        }, { status: 500 });
    }
}


