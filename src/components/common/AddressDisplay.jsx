import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';

export default function AddressDisplay({ 
  address, 
  showMap = true, 
  mapHeight = "h-40" // Smaller default height
}) {
  if (!address) {
    return <p className="text-gray-600 text-sm">No address information available.</p>;
  }

  const { houseName, landmark, pincode, district, state, country, coordinates } = address;

  return (
    <div className="space-y-3">
      {/* Address Text - More Compact */}
      <div className="space-y-2">
        <p className="font-medium text-gray-900 text-sm">{houseName || 'Address not specified'}</p>
        {landmark && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs py-0">
              Landmark
            </Badge>
            <span className="text-gray-700 text-sm">{landmark}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs px-2 py-0">
            {district}
          </Badge>
          <Badge variant="secondary" className="text-xs px-2 py-0">
            {state}
          </Badge>
          <Badge variant="secondary" className="text-xs px-2 py-0">
            {pincode}
          </Badge>
          <Badge variant="secondary" className="text-xs px-2 py-0">
            {country}
          </Badge>
        </div>
      </div>

      {/* Map Display - Smaller */}
      {showMap && coordinates && coordinates.lat && coordinates.lon && (
        <div className="mt-3">
          <div className={`${mapHeight} rounded-lg overflow-hidden border`}>
            <InteractiveMapPreview 
              latitude={coordinates.lat} 
              longitude={coordinates.lon} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive Map Preview Component - More Compact
function InteractiveMapPreview({ latitude, longitude }) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const [viewState, setViewState] = useState({
    longitude: Number(longitude),
    latitude: Number(latitude),
    zoom: 13 // Slightly zoomed out to fit better in smaller space
  });

  // Update viewState when coordinates change
  useEffect(() => {
    setViewState({
      longitude: Number(longitude),
      latitude: Number(latitude),
      zoom: 13
    });
  }, [latitude, longitude]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-xs">Map configuration missing</p>
      </div>
    );
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-xs">Invalid coordinates</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: '100%', height: '100%' }}
        // Interactive but won't change the marker location
        scrollZoom={true}
        dragPan={true}
        dragRotate={false} // Disable rotation for simpler interaction
        doubleClickZoom={true}
        touchZoomRotate={true}
        attributionControl={false} // Hide attribution to save space
      >
        <Marker 
          longitude={lng} 
          latitude={lat}
          draggable={false} // Marker is fixed, cannot be dragged
        >
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md" />
            <div className="bg-white/90 px-1 py-0.5 rounded text-xs font-medium mt-0.5 whitespace-nowrap">
              <MapPin className="h-2 w-2 text-red-600 inline mr-0.5" />
              Location
            </div>
          </div>
        </Marker>
      </Map>
      
      {/* Smaller coordinates display */}
      <div className="absolute bottom-1 left-1 bg-white/90 px-1.5 py-0.5 rounded text-xs">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>

      {/* Reset view button */}
      <button 
        onClick={() => setViewState({
          longitude: Number(longitude),
          latitude: Number(latitude),
          zoom: 13
        })}
        className="absolute top-1 right-1 bg-white/90 hover:bg-white px-1.5 py-0.5 rounded text-xs font-medium border shadow-sm"
      >
        Reset
      </button>
    </div>
  );
}