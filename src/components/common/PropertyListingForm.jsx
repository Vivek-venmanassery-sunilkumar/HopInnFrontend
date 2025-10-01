// components/registration/PropertyListingForm.jsx
import { useState, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, Plus } from 'lucide-react';
import AddressForm from './AddressForm';

// Common amenities with labels and icons
const PROPERTY_AMENITIES = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'heating', label: 'Heating' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'tv', label: 'TV' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'breakfast', label: 'Breakfast Included' },
  { id: 'workspace', label: 'Dedicated Workspace' },
  { id: 'petFriendly', label: 'Pet Friendly' },
  { id: 'washingMachine', label: 'Washing Machine' },
  { id: 'dryer', label: 'Dryer' },
];

export default function PropertyListingForm({
  control,
  register,
  errors,
  setValue,
  watch,
  isLoading,
  isEditing = false,
  existingImages = []
}) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [customAmenity, setCustomAmenity] = useState('');
  const fileInputRef = useRef(null);
  
  // Watch amenities
  const amenities = watch('amenities') || [];

  // Initialize existing images when editing
  useEffect(() => {
    if (isEditing && existingImages && existingImages.length > 0) {
      const existingImagesForDisplay = existingImages.map(img => ({
        imageUrl: img.imageUrl,
        preview: img.imageUrl,
        publicId: img.publicId,
        isPrimary: img.isPrimary || false,
        isExisting: true // Flag to identify existing images
      }));
      
      setSelectedImages(existingImagesForDisplay);
      setValue('propertyImages', existingImages);
    }
  }, [isEditing, existingImages, setValue]);

  // Handle image selection (not upload)
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    // Check if we've reached the maximum number of images (e.g., 10)
    const currentImageCount = selectedImages.length;
    if (currentImageCount + files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: currentImageCount === 0 && !selectedImages.some(img => img.isPrimary), // Set as primary only if no primary exists
      isExisting: false // Flag to identify new uploads
    }));
    
    const updatedImages = [...selectedImages, ...newImages];
    setSelectedImages(updatedImages);
    
    // Update both form fields
    setValue('propertyImageFiles', updatedImages.filter(img => !img.isExisting));
    
    // Combine existing images with new uploads for the final propertyImages
    const finalPropertyImages = updatedImages.map(img => ({
      imageUrl: img.imageUrl || img.preview, // Use existing URL or preview for new uploads
      publicId: img.publicId,
      isPrimary: img.isPrimary
    }));
    setValue('propertyImages', finalPropertyImages);
  };

  // Remove an image
  const removeImage = (index) => {
    const imageToRemove = selectedImages[index];
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    
    // If we're removing the primary image, set the first remaining image as primary
    if (imageToRemove.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    setSelectedImages(updatedImages);
    
    // Update form values
    setValue('propertyImageFiles', updatedImages.filter(img => !img.isExisting));
    
    const finalPropertyImages = updatedImages.map(img => ({
      imageUrl: img.imageUrl || img.preview,
      publicId: img.publicId,
      isPrimary: img.isPrimary
    }));
    setValue('propertyImages', finalPropertyImages);
  };

  // Set primary image
  const setPrimaryImage = (index) => {
    const updatedImages = selectedImages.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setSelectedImages(updatedImages);
    
    // Update form values
    const finalPropertyImages = updatedImages.map(img => ({
      imageUrl: img.imageUrl || img.preview,
      publicId: img.publicId,
      isPrimary: img.isPrimary
    }));
    setValue('propertyImages', finalPropertyImages);
  };

  // Add custom amenity
  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setValue('amenities', [...amenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  // Remove amenity
  const removeAmenity = (amenityToRemove) => {
    setValue('amenities', amenities.filter(a => a !== amenityToRemove));
  };

  // Handle numeric input changes to convert string to integer
  const handleNumericChange = (fieldName, value) => {
    // Convert empty string to 0, otherwise parse as integer
    const numericValue = value === '' ? 0 : parseInt(value, 10) || 0;
    setValue(fieldName, numericValue);
  };

  // Different validation and UI text based on editing mode
  const imageLabel = isEditing ? 'Update Property Images' : 'Property Images *';
  const imageDescription = isEditing 
    ? 'Update your property images. Existing images will be kept unless removed.'
    : 'Upload at least 3 images of your property';

  const descriptionValidation = isEditing 
    ? { required: 'Property description is required' }
    : { 
        required: 'Property description is required',
        minLength: {
          value: 100,
          message: 'Please provide at least 100 characters about your property'
        }
      };

  const submitButtonText = isEditing ? 'Update Property' : 'Add Property';

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Property Information' : 'Property Information'}
        </h2>
        <p className="text-gray-600">
          {isEditing ? 'Update your property details' : 'Tell us about your property'}
        </p>
      </div>

      {/* Property Name */}
      <div>
        <Label htmlFor="propertyName">Property Name *</Label>
        <Input 
          id="propertyName"
          {...register('propertyName', { required: 'Property name is required' })} 
          placeholder="e.g., Seaside Villa, Downtown Apartment, Mountain Retreat"
          className="mt-1"
        />
        {errors.propertyName && <span className="text-red-500 text-sm">{errors.propertyName.message}</span>}
      </div>

      {/* Property Description */}
      <div>
        <Label htmlFor="propertyDescription">Property Description *</Label>
        <Textarea 
          id="propertyDescription"
          {...register('propertyDescription', descriptionValidation)} 
          placeholder="Describe your property, its unique features, nearby attractions, and what makes it special..."
          rows={4}
          className="mt-1"
        />
        {errors.propertyDescription && (
          <span className="text-red-500 text-sm">{errors.propertyDescription.message}</span>
        )}
        {!isEditing && (
          <p className="text-sm text-gray-500 mt-1">
            Minimum 100 characters required for new listings
          </p>
        )}
      </div>

      {/* Property Images */}
      <div>
        <Label>{imageLabel}</Label>
        <p className="text-sm text-gray-500 mb-2">{imageDescription}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image.preview} 
                alt={`Property ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-white p-1 bg-red-500 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {image.isPrimary && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
              {!image.isPrimary && (
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className="absolute top-1 left-1 bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-600"
                >
                  Set Primary
                </button>
              )}
              {image.isExisting && (
                <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Existing
                </div>
              )}
            </div>
          ))}
          
          {selectedImages.length < 10 && (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">
                  {isEditing ? 'Add More Images' : 'Upload Image'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedImages.length}/10 images
                </p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageSelect} 
                className="hidden" 
                disabled={uploadingImages}
              />
            </label>
          )}
        </div>
        
        {errors.propertyImages && (
          <span className="text-red-500 text-sm">{errors.propertyImages.message}</span>
        )}
        
        {!isEditing && selectedImages.length < 3 && (
          <p className="text-amber-600 text-sm">
            Please upload at least 3 images for your property listing
          </p>
        )}
      </div>

      {/* Property Type */}
      <div>
        <Label htmlFor="propertyType">Property Type *</Label>
        <select
          id="propertyType"
          {...register('propertyType', { required: 'Property type is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select property type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="cottage">Cottage</option>
          <option value="studio">Studio</option>
          <option value="loft">Loft</option>
          <option value="other">Other</option>
        </select>
        {errors.propertyType && <span className="text-red-500 text-sm">{errors.propertyType.message}</span>}
      </div>

      {/* Number of Guests and Bedrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="maxGuests">Maximum Guests *</Label>
          <Input 
            id="maxGuests"
            type="number" 
            {...register('maxGuests', { 
              required: 'Maximum guests is required',
              min: { value: 1, message: 'Must accommodate at least 1 guest' },
              valueAsNumber: true
            })} 
            onChange={(e) => handleNumericChange('maxGuests', e.target.value)}
            className="mt-1"
          />
          {errors.maxGuests && <span className="text-red-500 text-sm">{errors.maxGuests.message}</span>}
        </div>

        <div>
          <Label htmlFor="bedrooms">Bedrooms *</Label>
          <Input 
            id="bedrooms"
            type="number" 
            {...register('bedrooms', { 
              required: 'Number of bedrooms is required',
              min: { value: 0, message: 'Must be 0 or more' },
              valueAsNumber: true
            })} 
            onChange={(e) => handleNumericChange('bedrooms', e.target.value)}
            className="mt-1"
          />
          {errors.bedrooms && <span className="text-red-500 text-sm">{errors.bedrooms.message}</span>}
        </div>
      </div>

      {/* Price per Night */}
      <div>
        <Label htmlFor="pricePerNight">Price per Night (₹) *</Label>
        <Input 
          id="pricePerNight"
          type="number" 
          {...register('pricePerNight', { 
            required: 'Price per night is required',
            min: { value: 100, message: 'Minimum price is ₹100 per night' },
            max: { value: 50000, message: 'Maximum price is ₹50,000 per night' },
            valueAsNumber: true
          })} 
          onChange={(e) => handleNumericChange('pricePerNight', e.target.value)}
          placeholder="e.g., 2500"
          className="mt-1"
        />
        {errors.pricePerNight && <span className="text-red-500 text-sm">{errors.pricePerNight.message}</span>}
      </div>

      {/* Amenities */}
      <div>
        <Label>Amenities</Label>
        <p className="text-sm text-gray-500 mb-2">Select amenities available at your property</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {PROPERTY_AMENITIES.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Controller
                name="amenities"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={amenity.id}
                    checked={field.value?.includes(amenity.id)}
                    onCheckedChange={(checked) => {
                      const updatedAmenities = checked
                        ? [...(field.value || []), amenity.id]
                        : field.value?.filter(a => a !== amenity.id) || [];
                      field.onChange(updatedAmenities);
                    }}
                  />
                )}
              />
              <label htmlFor={amenity.id} className="text-sm font-medium leading-none">
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
        
        {/* Custom Amenities */}
        <div className="flex gap-2">
          <Input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder="Add custom amenity"
            className="flex-1"
          />
          <Button type="button" onClick={addCustomAmenity} variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {/* Display selected amenities */}
        {amenities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Selected Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Property Address */}
      <div>
        <Label>Property Address *</Label>
        <AddressForm 
          control={control}
          watch={watch}
          setValue={setValue}
          errors={errors}
          prefix="propertyAddress"
        />
      </div>
    </div>
  );
}