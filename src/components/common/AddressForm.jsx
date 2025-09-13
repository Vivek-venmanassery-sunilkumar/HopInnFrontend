import { Controller } from "react-hook-form";
import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { LocationMap } from "./address-form-components/LocationMap";
import { StatusIndicator } from "./address-form-components/StatusIndicator";
import { countryGeonameMap } from "@/constants/geonamesMap";
import { AddressFields } from "./address-form-components/AddressFields";
import { COMMON_COUNTRIES } from "@/constants/commonCountries";


export default function AddressForm({ control, errors, prefix = '', setValue, watch }) {
  // State management
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [viewState, setViewState] = useState({ 
    longitude: 78.9629, 
    latitude: 20.5937, 
    zoom: 3 
  });
  
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Refs for stable function references
  const setValueRef = useRef(setValue);
  const fieldNameRef = useRef((name) => prefix ? `${prefix}.${name}` : name);

  // Update refs when props change
  useEffect(() => {
    setValueRef.current = setValue;
    fieldNameRef.current = (name) => prefix ? `${prefix}.${name}` : name;
  }, [setValue, prefix]);

  // Watch form values
  const houseName = watch(fieldNameRef.current('houseName'));
  const landmark = watch(fieldNameRef.current('landmark'));
  const district = watch(fieldNameRef.current('district'));
  const state = watch(fieldNameRef.current('state'));
  const country = watch(fieldNameRef.current('country'));
  const pincode = watch(fieldNameRef.current('pincode'));
  const coordinates = watch(fieldNameRef.current('coordinates'));

  // Check if all required address fields are filled
  const areAddressFieldsFilled = useCallback(() => {
    return houseName && district && state && country && pincode;
  }, [houseName, district, state, country, pincode]);

  // Initialize marker from form data
  useEffect(() => {
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      setMarker(coordinates);
      setViewState({
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        zoom: 14
      });
    }
  }, [coordinates]);

  // API functions for states and districts
  const fetchStates = useCallback(async (countryValue) => {
    if (!countryValue) {
      setStates([]);
      setDistricts([]);
      setValueRef.current(fieldNameRef.current('state'), null);
      setValueRef.current(fieldNameRef.current('district'), '');
      return;
    }

    setLoadingStates(true);
    try {
      const geonameId = countryGeonameMap[countryValue];
      if (geonameId) {
        const response = await fetch(
          `https://secure.geonames.org/childrenJSON?geonameId=${geonameId}&username=${import.meta.env.VITE_GEONAMES_USERNAME}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.geonames) {
            setStates(data.geonames.map(state => ({ 
              value: state.geonameId, 
              label: state.name,
            })));
          }
        }
      } else {
        // Fallback for countries not in our map
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (stateValue) => {
    if (!stateValue) {
      setDistricts([]);
      setValueRef.current(fieldNameRef.current('district'), '');
      return;
    }

    setLoadingDistricts(true);
    try {
      const response = await fetch(
        `https://secure.geonames.org/childrenJSON?geonameId=${stateValue}&username=${import.meta.env.VITE_GEONAMES_USERNAME}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.geonames) {
          setDistricts(data.geonames.map(city => ({ 
            value: city.name, 
            label: city.name 
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  // Effects for data fetching
  useEffect(() => {
    if (country?.value) {
      fetchStates(country.value);
    } else {
      setStates([]);
      setDistricts([]);
    }
  }, [country?.value, fetchStates]);

  useEffect(() => {
    if (state?.value) {
      fetchDistricts(state.value);
    } else {
      setDistricts([]);
    }
  }, [state?.value, fetchDistricts]);

  // Geocode address to get coordinates
  const geocodeAddress = useCallback(async () => {
    const addressParts = [
      pincode,
      houseName,
      landmark,
      district?.value || district,
      state?.label || state,
      country?.label || country
    ].filter(Boolean);

    if (addressParts.length === 0) return;

    const address = addressParts.join(', ');

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const validMarker = { 
          longitude: Number(longitude), 
          latitude: Number(latitude) 
        };
        
        setMarker(validMarker);
        setViewState({
          longitude: validMarker.longitude,
          latitude: validMarker.latitude,
          zoom: 14
        });
        setValueRef.current(fieldNameRef.current('coordinates'), validMarker);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }, [houseName, landmark, district, state, country, pincode]);

  // Auto-geocode when address fields are filled
  useEffect(() => {
    const autoGeocode = async () => {
      if (!areAddressFieldsFilled() || marker) return;
      
      setGeocodingLoading(true);
      await geocodeAddress();
      setGeocodingLoading(false);
    };

    const timeoutId = setTimeout(autoGeocode, 1000);
    return () => clearTimeout(timeoutId);
  }, [houseName, district, state, country, pincode, areAddressFieldsFilled, marker, geocodeAddress]);

  // Search for location
  const handleSearch = useCallback(async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&limit=5`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const validMarker = { 
          longitude: Number(longitude), 
          latitude: Number(latitude) 
        };
        
        setMarker(validMarker);
        setViewState({
          longitude: validMarker.longitude,
          latitude: validMarker.latitude,
          zoom: 14
        });
        
        setValueRef.current(fieldNameRef.current('coordinates'), validMarker);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [searchQuery]);

  // Handle map click to set marker
  const handleMapClick = useCallback((event) => {
    const { lngLat } = event;
    const validMarker = { 
      longitude: Number(lngLat.lng), 
      latitude: Number(lngLat.lat) 
    };
    
    setMarker(validMarker);
    setValueRef.current(fieldNameRef.current('coordinates'), validMarker);
  }, []);

  // Manual geocode trigger
  const handleManualGeocode = useCallback(async () => {
    setGeocodingLoading(true);
    await geocodeAddress();
    setGeocodingLoading(false);
  }, [geocodeAddress]);

  return (
    <div className="space-y-6">
      <div className="border p-6 rounded-lg space-y-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
        
        <AddressFields
          control={control}
          errors={errors}
          countries={COMMON_COUNTRIES}
          states={states}
          districts={districts}
          loadingStates={loadingStates}
          loadingDistricts={loadingDistricts}
          fieldName={fieldNameRef.current}
          country={country}
        />

        <Controller
          name={fieldNameRef.current('coordinates')}
          control={control}
          rules={{ required: 'Please ensure your location is pinpointed on the map' }}
          render={({ field }) => <input type="hidden" {...field} />}
        />
        
        <StatusIndicator
          geocodingLoading={geocodingLoading}
          marker={marker}
          areAddressFieldsFilled={areAddressFieldsFilled}
        />

        <div className="flex gap-4">
          <Button 
            type="button" 
            onClick={handleManualGeocode}
            variant="outline"
            className="flex items-center gap-2"
            disabled={geocodingLoading || !areAddressFieldsFilled()}
          >
            {geocodingLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            Update Location Coordinates
          </Button>
        </div>
      </div>

      {marker && (
        <LocationMap
          marker={marker}
          setMarker={setMarker}
          viewState={viewState}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleMapClick={handleMapClick}
          setViewState={setViewState}
          setValueRef={setValueRef}
          fieldNameRef={fieldNameRef}
        />
      )}
    </div>
  );
}