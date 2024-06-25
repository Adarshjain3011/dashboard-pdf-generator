// components/DownloadButton.tsx
import React from 'react';
import axios from 'axios';

interface DownloadButtonProps {
  pdfId: string;
  name:string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ pdfId,name }) => {
  const downloadPdf = async () => {
    try {
      const response = await axios.get(`/api/pdf/downloadPdf?id=${pdfId}`, {
        responseType: 'blob',
      });

      console.log("Downloading PDF with ID:", pdfId);
      console.log("Response data:", response.data);

      // Create a URL for the PDF blob and initiate the download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `downloaded_pdf_${name}.pdf`); // Set a suitable filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL after the download to free up memory
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('Error downloading PDF:', error.message);
    }
  };

  return (
    <button onClick={downloadPdf} className="bg-blue-500 text-white px-4 py-2 rounded">
      Download PDF
    </button>
  );
};

export default DownloadButton;
