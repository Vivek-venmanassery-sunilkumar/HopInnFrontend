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

export const deleteFromCloudinary = async (publicId) => {
    try {
        // Get signature data from backend (same as upload)
        const signatureData = await getCloudinarySignature();
        
        // Create FormData for deletion
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp);
        formData.append('signature', signatureData.signature);

        // Call Cloudinary destroy API
        const response = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/destroy`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to delete image from Cloudinary');
        }

        const result = await response.json();
        
        // Match your backend logic - check if result is 'ok'
        if (result.result === 'ok') {
            return true;
        } else {
            throw new Error(`Cloudinary deletion failed: ${result.result}`);
        }
        
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete image');
    }
};