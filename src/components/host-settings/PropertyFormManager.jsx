// components/host-settings/PropertyFormManager.jsx
import { useForm } from 'react-hook-form';
import { countryGeonameMap } from '@/constants/geonamesMap';

export const usePropertyForm = (editingProperty = null) => {
  const form = useForm({
    defaultValues: {
      propertyName: '',
      propertyDescription: '',
      propertyType: '',
      maxGuests: 1,
      bedrooms: 1,
      pricePerNight: 1000,
      amenities: [],
      propertyAddress: {
        houseName: '',
        district: '',
        state: '',
        country: '',
        pincode: '',
        landmark: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      propertyImages: [],
      propertyImageFiles: []
    }
  });

  const { setValue, reset } = form;

  const populateFormForEditing = (property) => {
    // Reset form first to clear any previous values
    reset();
    
    // Helper function to create select option format
    const createSelectOption = (value, label = value) => ({
      value: value,
      label: label
    });

    // Get country geonameId if available
    const countryName = property.propertyAddress?.country;
    const countryGeonameId = countryName ? countryGeonameMap[countryName] : null;

    // Set form values for editing with proper structure
    const formData = {
      propertyName: property.propertyName || '',
      propertyDescription: property.propertyDescription || '',
      propertyType: property.propertyType || '',
      maxGuests: property.maxGuests || 1,
      bedrooms: property.bedrooms || 1,
      pricePerNight: property.pricePerNight || 1000,
      amenities: property.amenities || [],
      propertyAddress: {
        houseName: property.propertyAddress?.houseName || '',
        district: property.propertyAddress?.district 
          ? createSelectOption(property.propertyAddress.district)
          : '',
        state: property.propertyAddress?.state 
          ? createSelectOption('', property.propertyAddress.state)
          : '',
        country: property.propertyAddress?.country 
          ? createSelectOption(countryGeonameId?.toString() || property.propertyAddress.country, property.propertyAddress.country)
          : '',
        pincode: property.propertyAddress?.pincode || '',
        landmark: property.propertyAddress?.landmark || '',
        coordinates: {
          latitude: property.propertyAddress?.coordinates?.latitude || 0,
          longitude: property.propertyAddress?.coordinates?.longitude || 0
        }
      },
      // Store original images with isExisting flag for comparison
      propertyImages: property.propertyImages?.map(img => ({
        imageUrl: img.imageUrl,
        publicId: img.publicId,
        isPrimary: img.isPrimary || false,
        isExisting: true // Flag to identify existing images
      })) || [],
      propertyImageFiles: [] // Initialize as empty for editing
    };
    
    console.log('🔧 Prefilling form with data:', formData);
    console.log('🖼️ Original property images:', property.propertyImages);
    
    // Set each field individually to ensure react-hook-form recognizes them
    Object.keys(formData).forEach(key => {
      if (key === 'propertyAddress') {
        Object.keys(formData.propertyAddress).forEach(addressKey => {
          if (addressKey === 'coordinates') {
            setValue(`propertyAddress.coordinates.latitude`, formData.propertyAddress.coordinates.latitude);
            setValue(`propertyAddress.coordinates.longitude`, formData.propertyAddress.coordinates.longitude);
          } else {
            setValue(`propertyAddress.${addressKey}`, formData.propertyAddress[addressKey]);
          }
        });
      } else {
        setValue(key, formData[key]);
      }
    });
  };

  return { ...form, populateFormForEditing };
};

export const transformDataForBackend = (data) => {
  // Transform address data from select objects to strings
  const transformedData = {
    ...data,
    propertyAddress: {
      ...data.propertyAddress,
      // Extract string values from select objects
      country: typeof data.propertyAddress.country === 'object' 
        ? data.propertyAddress.country.label 
        : data.propertyAddress.country,
      state: typeof data.propertyAddress.state === 'object' 
        ? data.propertyAddress.state.label 
        : data.propertyAddress.state,
      district: typeof data.propertyAddress.district === 'object' 
        ? data.propertyAddress.district.label 
        : data.propertyAddress.district,
    }
  };

  // Clean up propertyImages to match backend schema
  if (transformedData.propertyImages) {
    transformedData.propertyImages = transformedData.propertyImages.map(img => ({
      imageUrl: img.imageUrl,
      publicId: img.publicId,
      isPrimary: img.isPrimary || false
    }));
  }

  // Remove the temporary file references
  delete transformedData.propertyImageFiles;

  return transformedData;
};
