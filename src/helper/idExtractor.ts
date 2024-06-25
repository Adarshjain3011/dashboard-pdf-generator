
export const getPublicIdFromUrl = (url: string): string => {
    // Split the URL by '/' to get the segments
    const parts = url.split('/');
  
    // Get the last segment which contains the public ID and the file extension
    const publicIdWithExtension = parts[parts.length - 1];
  
    // Split by '.' to separate the public ID from the extension
    const publicId = publicIdWithExtension.split('.')[0];
  
    return publicId;
  };
  

  