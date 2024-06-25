import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        message: "PDF ID is required",
        data: null,
        error: "Missing PDF ID"
      }, {
        status: 400,
      });
    }

    console.log("ID is", id);

    // Construct the file path (adjust this to match your actual file storage path)
    const filePath = path.join(process.cwd(), 'public', 'pdfs', `${id}.pdf`);

    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch (accessError:any) {
      return NextResponse.json({
        message: "File not found",
        data: null,
        error: accessError.message,
      }, {
        status: 404,
      });
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Create a response with the file content
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${id}.pdf"`,
      },
    });

    return response;
  } catch (error: any) {
    console.error('Error occurred during PDF download', error);

    return NextResponse.json({
      message: "Error occurred during PDF download",
      data: null,
      error: error.message,
    }, {
      status: 500,
    });
  }
}
