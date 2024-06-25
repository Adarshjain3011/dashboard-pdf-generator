"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../common/Navbar';

import DownloadButtonPage from '../common/DownloadButton';

interface PdfDataType {
    name: string;
    title: string;
    content: string;
    imageUrl: FileList | null; // Adjusted to handle single file upload
}

export default function DashboardPage() {

    const [allPdfData, setAllPdfData] = useState(null);
    const [pdfData, setPdfData] = useState<PdfDataType>({
        name: '',
        title: '',
        content: '',
        imageUrl: null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPdfData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setPdfData((prevData) => ({ ...prevData, imageUrl: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(pdfData.imageUrl);

        const formData = new FormData();
        formData.append('name', pdfData.name);
        formData.append('title', pdfData.title);
        formData.append('content', pdfData.content);
        if (pdfData.imageUrl) {
            formData.append('imageUrl', pdfData.imageUrl); // Access the first file in FileList
        }

        console.log(formData.get("imageUrl"));

        try {

            const response = await axios.post('/api/pdf/createPdf', formData, {

                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Response data:", response.data);

        } catch (error) {

            console.error('Error response:', error);
        }
    };

    const fetchAllPdf = async () => {

        try {
            const response = await axios.get('/api/pdf/createPdf');
            console.log(response?.data?.data);
            setAllPdfData(response?.data?.data); // Assuming the data structure of response is { message, data, error }

        } catch (error) {

            console.error('Error fetching PDF data', error);
        }
    };

    useEffect(() => {

        // Fetch all PDFs on component mount

        fetchAllPdf();

    }, []);

    return (
        <div>
            <div className="">

                <Navbar></Navbar>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        value={pdfData.name}
                        onChange={handleInputChange}
                        placeholder="Enter the name of the document"
                        className="mb-2 p-2 border text-black border-gray-300"
                    />
                    <input
                        type="text"
                        name="title"
                        value={pdfData.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="mb-2 p-2 border text-black border-gray-300"
                    />
                    <textarea
                        name="content"
                        value={pdfData.content}
                        onChange={handleInputChange}
                        placeholder="Content"
                        className="mb-2 p-2 border text-black border-gray-300"
                    />
                    <input
                        type="file"
                        name="imageUrl"
                        onChange={handleFileChange}
                        className="mb-2 p-2 border text-black border-gray-300"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Generate PDF
                    </button>
                </form>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">All PDFs</h2>
                    <ul>
                        {

                            allPdfData && allPdfData?.map((pdf:any, index:number) => (
                                <li key={index} className="border-b border-gray-300 py-2">
                                    <h3 className="font-bold">{pdf.title}</h3>
                                    <p>{pdf.content}</p>
                                    {pdf.imageUrl && typeof pdf.imageUrl === 'string' && (
                                        <img
                                            src={pdf.imageUrl}
                                            alt={pdf.title}
                                            className="w-32 h-32 object-cover"
                                        />
                                    )}

                                    <DownloadButtonPage pdfId={pdf._id} name={pdf.title}/>

                                </li>
                            ))

                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}
