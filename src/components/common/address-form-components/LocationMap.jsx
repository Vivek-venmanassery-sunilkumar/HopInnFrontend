import Map, { Marker } from 'react-map-gl/mapbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function LocationMap({ 
  marker, 
  setMarker,
  viewState, 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  handleMapClick, 
  setViewState, 
  setValueRef, 
  fieldNameRef 
}) {
  return (
    <div className="border p-6 rounded-lg space-y-4 bg-gray-50">
      <h4 className="text-lg font-semibold text-gray-800">Verify Your Location</h4>
      <p className="text-sm text-gray-600">
        Your location has been automatically detected. Drag the map to adjust the pin for maximum accuracy.
      </p>
      
      <div className="flex gap-2">
        <Input
          placeholder="Search for a different location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          style={{ width: '100%', height: '100%' }}
        >
          {marker && (
            <Marker 
              longitude={marker.longitude} 
              latitude={marker.latitude} 
              draggable
              onDragEnd={({ lngLat }) => {
                const validMarker = { 
                  longitude: Number(lngLat.lng), 
                  latitude: Number(lngLat.lat) 
                };
                setMarker(validMarker);
                setValueRef.current(fieldNameRef.current('coordinates'), validMarker);
              }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer" />
            </Marker>
          )}
        </Map>
      </div>

      {marker && (
        <div className="text-sm text-gray-600 p-3 bg-white rounded border">
          <strong>Selected coordinates:</strong> {marker.latitude?.toFixed(6)}, {marker.longitude?.toFixed(6)}
        </div>
      )}

      <p className="text-sm text-gray-500">
        💡 Click and drag the pin to adjust your exact location. This ensures travelers can find you easily!
      </p>
    </div>
  );
}