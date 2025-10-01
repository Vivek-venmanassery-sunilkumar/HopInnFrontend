// components/host-settings/PropertyManagementTab.jsx
import { useState } from 'react';
import { Plus, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyListingForm from '../common/PropertyListingForm';
import { useAddProperty, useFetchProperties, useUpdatePropertyDetails } from '@/hooks/PropertyHooks';
import PropertyCard from './PropertyCard';
import { usePropertyForm, transformDataForBackend } from './PropertyFormManager';
import { uploadImagesToCloudinary, deleteRemovedImages, identifyImagesToDelete } from './PropertyImageManager';

export default function PropertyManagementTab() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const addPropertyMutation = useAddProperty();
  const updatePropertyMutation = useUpdatePropertyDetails();
  const { data: propertiesData, isLoading: isLoadingProperties, error, refetch } = useFetchProperties();
  
  const properties = propertiesData?.data || [];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    populateFormForEditing
  } = usePropertyForm(editingProperty);

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowAddForm(true);
    populateFormForEditing(property);
  };


  const onSubmit = async (data) => {
    console.log('🚀 Starting form submission...');
    
    try {
      // Validate minimum image requirement
      const totalImages = (data.propertyImages?.length || 0) + (data.propertyImageFiles?.length || 0);
      if (totalImages < 3) {
        alert('Minimum 3 images are required for property listing');
        return;
      }
      
      // Store original images for comparison (in edit mode)
      const originalImages = editingProperty ? [...editingProperty.propertyImages] : [];

      console.log('🔍 DEBUG - Image Analysis:', {
        isEditing: !!editingProperty,
        originalImagesCount: originalImages.length,
        formImagesCount: data.propertyImages?.length || 0,
        newImageFilesCount: data.propertyImageFiles?.length || 0,
        originalImages: originalImages?.map(img => ({ 
          publicId: img.publicId, 
          imageUrl: img.imageUrl
        })),
        formImages: data.propertyImages?.map(img => ({ 
          publicId: img.publicId, 
          isExisting: img.isExisting 
        }))
      });

      // STEP 1: Identify which existing images were removed
      const imagesToDelete = identifyImagesToDelete(originalImages, data.propertyImages);

      // STEP 2: Delete removed images from Cloudinary ONLY if there are any to delete
      if (editingProperty && imagesToDelete.length > 0) {
        console.log('🗑️ Proceeding with deletion of', imagesToDelete.length, 'images');
        setUploadingImages(true);
        try {
          const deletionResults = await deleteRemovedImages(imagesToDelete);
          
          // Check if any deletions failed
          const failedDeletions = deletionResults.filter(r => !r.success);
          if (failedDeletions.length > 0) {
            console.warn('⚠️ Some image deletions failed:', failedDeletions);
            // Show a warning but don't block the update
            alert(`Warning: ${failedDeletions.length} image(s) could not be deleted from Cloudinary. The property will still be updated.`);
          }
        } catch (error) {
          console.error('❌ Image deletion failed:', error);
          alert('Warning: Failed to delete some images from Cloudinary. The property will still be updated.');
          // Continue anyway - we don't want to block the entire update if deletion fails
        } finally {
          setUploadingImages(false);
        }
      } else if (editingProperty) {
        console.log('✅ No images to delete - all existing images preserved');
      }

      // STEP 3: Upload new images to Cloudinary
      if (data.propertyImageFiles && data.propertyImageFiles.length > 0) {
        console.log('📤 Uploading', data.propertyImageFiles.length, 'new images');
        setUploadingImages(true);
        try {
          const uploadedImages = await uploadImagesToCloudinary(data.propertyImageFiles);
          
          // Combine existing images with newly uploaded images
          const existingImages = data.propertyImages?.filter(img => img.isExisting) || [];
          const allImages = [...existingImages, ...uploadedImages];
          
          // Update the propertyImages with the combined array
          data.propertyImages = allImages;
          
          console.log('✅ Final image set:', {
            existingImagesCount: existingImages.length,
            uploadedImagesCount: uploadedImages.length,
            totalImagesCount: allImages.length
          });
        } catch (error) {
          console.error('❌ Image upload failed:', error);
          alert('Failed to upload some images. Please try again.');
          setUploadingImages(false);
          return;
        } finally {
          setUploadingImages(false);
        }
      }

      // STEP 4: Transform data for backend
      const transformedData = transformDataForBackend(data);

      console.log('📦 Final data for submission:', {
        propertyImages: transformedData.propertyImages?.map(img => ({
          publicId: img.publicId,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary
        }))
      });

      if (editingProperty) {
        // Update existing property
        console.log('✏️ Updating existing property:', editingProperty.property_id);
        
        // Prepare the update payload according to your backend format
        const updatePayload = {
          amenities: transformedData.amenities || [],
          bedrooms: parseInt(transformedData.bedrooms) || 1,
          maxGuests: parseInt(transformedData.maxGuests) || 1,
          pricePerNight: parseFloat(transformedData.pricePerNight) || 1000,
          propertyAddress: {
            coordinates: {
              latitude: typeof transformedData.propertyAddress.coordinates.latitude === 'string' 
                ? parseFloat(transformedData.propertyAddress.coordinates.latitude) 
                : transformedData.propertyAddress.coordinates.latitude || 0,
              longitude: typeof transformedData.propertyAddress.coordinates.longitude === 'string'
                ? parseFloat(transformedData.propertyAddress.coordinates.longitude)
                : transformedData.propertyAddress.coordinates.longitude || 0
            },
            country: transformedData.propertyAddress.country,
            district: transformedData.propertyAddress.district,
            houseName: transformedData.propertyAddress.houseName,
            landmark: transformedData.propertyAddress.landmark || "",
            pincode: transformedData.propertyAddress.pincode,
            state: transformedData.propertyAddress.state
          },
          propertyDescription: transformedData.propertyDescription,
          propertyImages: transformedData.propertyImages || [],
          propertyName: transformedData.propertyName,
          propertyType: transformedData.propertyType,
          property_id: editingProperty.property_id
        };

        console.log('📤 Sending update payload:', updatePayload);
        await updatePropertyMutation.mutateAsync(updatePayload);
        
        console.log('✅ Property updated successfully');
        
        // Reset form and state
        reset();
        setEditingProperty(null);
        setShowAddForm(false);
        
        // Refetch properties to show updated data
        refetch();
        
      } else {
        // Add new property via API
        console.log('🆕 Adding new property');
        
        // Format address fields and transform to backend format
        const addPayload = {
          amenities: transformedData.amenities || [],
          bedrooms: parseInt(transformedData.bedrooms) || 1,
          maxGuests: parseInt(transformedData.maxGuests) || 1,
          pricePerNight: parseFloat(transformedData.pricePerNight) || 1000,
          propertyAddress: {
            coordinates: {
              latitude: typeof transformedData.propertyAddress.coordinates.latitude === 'string'
                ? parseFloat(transformedData.propertyAddress.coordinates.latitude)
                : transformedData.propertyAddress.coordinates.latitude || 0,
              longitude: typeof transformedData.propertyAddress.coordinates.longitude === 'string'
                ? parseFloat(transformedData.propertyAddress.coordinates.longitude)
                : transformedData.propertyAddress.coordinates.longitude || 0
            },
            country: transformedData.propertyAddress.country,
            district: transformedData.propertyAddress.district,
            houseName: transformedData.propertyAddress.houseName,
            landmark: transformedData.propertyAddress.landmark || "",
            pincode: transformedData.propertyAddress.pincode,
            state: transformedData.propertyAddress.state
          },
          propertyDescription: transformedData.propertyDescription,
          propertyImages: transformedData.propertyImages || [],
          propertyName: transformedData.propertyName,
          propertyType: transformedData.propertyType
        };

        console.log('📤 Sending add payload:', addPayload);
        await addPropertyMutation.mutateAsync(addPayload);
        
        console.log('✅ Property added successfully');
        reset();
        setShowAddForm(false);
        refetch();
      }
    } catch (error) {
      console.error('❌ Failed to save property:', error);
      alert(`Failed to save property: ${error.message}`);
    }
  };

  const handleCancel = () => {
    console.log('❌ Form cancelled');
    setShowAddForm(false);
    setEditingProperty(null);
    reset();
  };

  const isLoading = addPropertyMutation.isPending || updatePropertyMutation.isPending || uploadingImages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#2D5016]">Property Management</h2>
          <p className="text-[#8B4513]">Manage your listed properties</p>
        </div>
        
        {!showAddForm && (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        )}
      </div>

      {/* Add/Edit Property Form */}
      {showAddForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#2D5016]">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </h3>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="border-[#D4B5A0] text-[#8B4513] hover:bg-[#F68241]/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PropertyListingForm
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              isLoading={isLoading}
              isEditing={!!editingProperty}
              existingImages={editingProperty?.propertyImages} // Pass existing images here
            />
            
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {uploadingImages ? 'Processing Images...' : 
                     editingProperty ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingProperty ? 'Update Property' : 'Add Property'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Properties List */}
      {!showAddForm && (
        <div className="space-y-4">
          {isLoadingProperties ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68241] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0]">
              <p className="text-red-500 mb-2">Error loading properties</p>
              <p className="text-gray-500 text-sm">{error.message}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0]">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Properties Listed</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first property</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.property_id}
                  property={property}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}