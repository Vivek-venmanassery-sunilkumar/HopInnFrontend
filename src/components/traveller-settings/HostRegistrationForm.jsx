import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useHostOnboard } from '@/hooks/HostHooks';
import { useDispatch } from 'react-redux';
import { uploadToCloudinary } from '@/lib/cloudinaryUtils';
import HostFormFields from '../common/HostFormFields';
import PropertyListingForm from '../common/PropertyListingForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HostRegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm();
  const { mutateAsync: onboardHost, isPending: isLoading } = useHostOnboard();
  const [uploadingImages, setUploadingImages] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Upload images to Cloudinary first
      if (data.propertyImageFiles && data.propertyImageFiles.length > 0) {
        setUploadingImages(true);
        const uploadedImages = [];
        
        for (const imageFile of data.propertyImageFiles) {
          try {
            const result = await uploadToCloudinary(imageFile.file);
            uploadedImages.push({
              imageUrl: result.imageUrl,
              publicId: result.publicId,
              isPrimary: imageFile.isPrimary || false
            });
          } catch (error) {
            console.error('Error uploading image:', error);
            // Continue with other images even if one fails
          }
        }
        
        data.propertyImages = uploadedImages;
        delete data.propertyImageFiles; // Remove the temporary file references
      }
      
      // Format knownLanguages as values
      if (data.knownLanguages) {
        data.knownLanguages = data.knownLanguages.map(l => l.value);
      }
      
      // Format address fields if they're objects
      if (data.propertyAddress) {
        if (data.propertyAddress.country && typeof data.propertyAddress.country === 'object') {
          data.propertyAddress.country = data.propertyAddress.country.value;
        }

        if (data.propertyAddress.district && typeof data.propertyAddress.district === 'object') {
          data.propertyAddress.district = data.propertyAddress.district.value;
        }

        if (data.propertyAddress.state && typeof data.propertyAddress.state === 'object') {
          data.propertyAddress.state = data.propertyAddress.state.label;
        }
      }

      console.log('Host Registration:', data);
      const response = await onboardHost(data, {
        onSuccess: async () => {
          navigate('/host-settings');
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Host Registration</h2>
        <p className="text-gray-600">Complete your profile to become a host</p>
      </div>

      {/* Host Personal Information */}
      <HostFormFields
        control={control}
        register={register}
        errors={errors}
      />

      {/* Property Information */}
      <PropertyListingForm
        control={control}
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        isLoading={isLoading}
      />

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Host Agreement</h4>
        <p className="text-green-700 text-sm">
          By submitting this form, you agree to our terms and confirm that you have the necessary 
          permissions to host guests in your property.
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700" 
        size="lg"
        disabled={isLoading || uploadingImages}
      >
        {isLoading || uploadingImages ? 'Submitting...' : 'Submit Host Registration'}
      </Button>
      {uploadingImages && (
        <p className='text-sm text-blue-500 text-center'>
          Uploadign images... Please wait.
        </p>
      )}
    </form>
  );
}