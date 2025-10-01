// components/host-settings/PropertyImageManager.jsx
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinaryUtils';

export const uploadImagesToCloudinary = async (imageFiles) => {
  const uploadedImages = [];
  
  for (const imageFile of imageFiles) {
    try {
      console.log('📤 Uploading image to Cloudinary:', imageFile.file.name);
      const result = await uploadToCloudinary(imageFile.file);
      console.log('✅ Successfully uploaded image:', result.publicId);
      uploadedImages.push({
        imageUrl: result.imageUrl,
        publicId: result.publicId,
        isPrimary: imageFile.isPrimary || false
      });
    } catch (error) {
      console.error('❌ Error uploading image to Cloudinary:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
  
  return uploadedImages;
};

export const deleteRemovedImages = async (imagesToDelete) => {
  console.log('🗑️ Starting deletion of', imagesToDelete.length, 'images from Cloudinary');
  
  const deletionResults = [];
  
  for (const image of imagesToDelete) {
    try {
      // Validate that the image has a publicId before attempting deletion
      if (!image.publicId) {
        console.warn('⚠️ Skipping image deletion - no publicId found:', image);
        deletionResults.push({ success: false, error: 'No publicId', image });
        continue;
      }
      
      console.log('🗑️ Attempting to delete image:', image.publicId);
      const result = await deleteFromCloudinary(image.publicId);
      
      if (result) {
        console.log('✅ Successfully deleted image from Cloudinary:', image.publicId);
        deletionResults.push({ success: true, image });
      } else {
        console.warn('⚠️ Cloudinary deletion returned false for:', image.publicId);
        deletionResults.push({ success: false, error: 'Cloudinary returned false', image });
      }
    } catch (error) {
      console.error('❌ Failed to delete image from Cloudinary:', image.publicId, error);
      deletionResults.push({ success: false, error: error.message, image });
      // Continue with other deletions even if one fails
    }
  }
  
  // Log summary of deletion results
  const successfulDeletions = deletionResults.filter(r => r.success).length;
  const failedDeletions = deletionResults.filter(r => !r.success).length;
  
  console.log('📊 Deletion Summary:', {
    total: imagesToDelete.length,
    successful: successfulDeletions,
    failed: failedDeletions,
    results: deletionResults
  });
  
  return deletionResults;
};

export const identifyImagesToDelete = (originalImages, currentImages) => {
  if (!originalImages || originalImages.length === 0) {
    return [];
  }

  // Get the current existing images from form data (with isExisting flag)
  const currentExistingImages = currentImages?.filter(img => img.isExisting) || [];
  
  console.log('🔍 DEBUG - Image Comparison:', {
    originalImages: originalImages.map(img => img.publicId),
    currentExistingImages: currentExistingImages.map(img => img.publicId)
  });

  // Find images that were in original but NOT in current form data
  const imagesToDelete = originalImages.filter(originalImg => {
    const existsInCurrent = currentExistingImages.some(currentImg => 
      currentImg.publicId === originalImg.publicId
    );
    if (!existsInCurrent) {
      console.log('❌ Image marked for deletion:', originalImg.publicId);
    }
    return !existsInCurrent;
  });
  
  console.log('📊 DEBUG - Deletion Analysis:', {
    imagesToDeleteCount: imagesToDelete.length,
    imagesToDelete: imagesToDelete.map(img => img.publicId)
  });

  return imagesToDelete;
};
