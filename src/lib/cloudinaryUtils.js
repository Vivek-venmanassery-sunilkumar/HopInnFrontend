import { authApi } from "@/axios/auth.axios";

const getCloudinarySignature = async()=>{
    try{
        const response = await authApi.get('/cloudinary/signature');
        return response.data;
    }catch(error){
        console.error('Error fetching Cloudinary Signature:', error);
        throw new Error('Failed to get Cloudinary authentication');
    }
};


export const uploadToCloudinary = async (file) => {
    try {
        // Get signature data from backend
        const signatureData = await getCloudinarySignature()
        
        // Create FormData for upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', signatureData.apiKey)
        formData.append('timestamp', signatureData.timestamp)
        formData.append('signature', signatureData.signature)
        
        // Upload to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        })
        
        if (!response.ok) {
            throw new Error('Failed to upload image to Cloudinary')
        }
        
        const result = await response.json()
        return {
            imageUrl: result.secure_url,
            publicId: result.public_id
        }
        
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        throw new Error('Failed to upload image')
    }
}
