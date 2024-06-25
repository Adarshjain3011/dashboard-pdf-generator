import { cloudinaryConnect } from '@/config/cloudinaryConfig';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

import cloudinary from 'cloudinary';

cloudinaryConnect();

export async function ImageUploader(file: File, folder: string = "image", height: number | string = 100, quality: number | string = 100): Promise<cloudinary.UploadApiResponse> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const options: cloudinary.UploadApiOptions = {
      folder,
      height: Number(height),
      quality: Number(quality),
      resource_type: "auto"
    };

    return await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(options, (error, result:any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed');
  }
}





