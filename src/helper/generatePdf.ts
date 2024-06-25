import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";
import { cloudinaryConnect } from "@/config/cloudinaryConfig";
import cloudinary from "cloudinary";

cloudinaryConnect();

export async function generatePdf(title: string, content: string, imageUrl: string): Promise<cloudinary.UploadApiResponse> {
    let browser;
    try {
        // Load the HTML template
        const templatePath = path.join(process.cwd(), 'src', 'templates', 'template.html');
        let htmlContent;
        try {
            htmlContent = fs.readFileSync(templatePath, 'utf-8');
        } catch (fileReadError) {
            
            console.error('Error reading HTML template:', fileReadError);
            throw new Error('Failed to read HTML template');
            
        }

        // Replace placeholders with actual data
        htmlContent = htmlContent.replace('{{title}}', title);
        htmlContent = htmlContent.replace('{{content}}', content);
        htmlContent = htmlContent.replace('{{imageUrl}}', imageUrl);

        // Generate PDF from the filled HTML using Puppeteer
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4' });
        if (!pdfBuffer) {
            console.error('PDF generation failed');
            throw new Error('Failed to generate PDF');
        }

        // Save the PDF locally for debugging
        const pdfPath = path.join(process.cwd(), 'output.pdf');
        fs.writeFileSync(pdfPath, pdfBuffer);

        // Upload PDF to Cloudinary
        const uploadResponse = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { resource_type: 'raw', format: 'pdf' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result as cloudinary.UploadApiResponse);
                }
            );
            uploadStream.end(pdfBuffer);
        });

        if (!uploadResponse) {
            throw new Error('Upload response is undefined');
        }

        return uploadResponse;

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('PDF generation failed');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
