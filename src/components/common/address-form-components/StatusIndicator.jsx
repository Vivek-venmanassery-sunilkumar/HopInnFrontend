import { MapPin, Loader2 } from 'lucide-react';

export function StatusIndicator({ geocodingLoading, marker, areAddressFieldsFilled }) {
  return (
    <div className="flex items-center gap-4">
      {geocodingLoading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Finding your location...</span>
        </div>
      )}
      
      {marker && !geocodingLoading && (
        <div className="flex items-center gap-2 text-green-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            Location found: {marker.latitude?.toFixed(4)}, {marker.longitude?.toFixed(4)}
          </span>
        </div>
      )}

      {!marker && !geocodingLoading && areAddressFieldsFilled() && (
        <div className="flex items-center gap-2 text-amber-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">Completing address details...</span>
        </div>
      )}
    </div>
  );
}