
import path from "path";

import fs from "fs";

import puppeteer from "puppeteer";

import { cloudinaryConnect } from "@/config/cloudinaryConfig";

import cloudinary from "cloudinary";

cloudinaryConnect();

export async function generatePdf(title: string, content: string, imageUrl: string): Promise<cloudinary.UploadApiResponse> {
    try {
        // Load the HTML template
        const templatePath = path.join(process.cwd(), 'src', 'templates', 'template.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholders with actual data
        htmlContent = htmlContent.replace('{{title}}', title);
        htmlContent = htmlContent.replace('{{content}}', content);
        htmlContent = htmlContent.replace('{{imageUrl}}', imageUrl);

        // Generate PDF from the filled HTML using Puppeteer
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Upload PDF to Cloudinary
        const uploadResponse = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
                { resource_type: 'raw' },
                (error: any, result: any) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            ).end(pdfBuffer);
        });

        return uploadResponse;

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('PDF generation failed');
    }
}


