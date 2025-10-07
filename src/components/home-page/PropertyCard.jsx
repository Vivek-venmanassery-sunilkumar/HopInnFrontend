import { useState } from 'react';
import { MapPin, Users, Bed, IndianRupee, Star } from 'lucide-react';

export default function PropertyCard({ property }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get primary image URL from the API response
  const primaryImage = property.primaryImageUrl || '';
  
  // Get location info
  const location = `${property.district}, ${property.state}`;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image */}
      <div className="relative h-48 w-full">
        {primaryImage ? (
          <img 
            src={primaryImage} 
            alt={property.propertyName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Hover overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity">
            <div className="text-white text-center">
              <p className="text-sm font-medium">Click to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Property Name and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
            {property.propertyName}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Property Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {property.propertyDescription}
        </p>

        {/* Property Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-[#F68241]" />
            <div>
              <div className="font-semibold text-gray-700">{property.maxGuests}</div>
              <div className="text-xs text-gray-500">guests</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Bed className="h-4 w-4 mr-1 text-[#F68241]" />
            <div>
              <div className="font-semibold text-gray-700">{property.bedrooms}</div>
              <div className="text-xs text-gray-500">bedrooms</div>
            </div>
          </div>
        </div>

        {/* Price and Type */}
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <div className="font-semibold text-gray-700 capitalize">{property.propertyType}</div>
            <div className="text-xs text-gray-500">type</div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-lg font-bold text-[#F68241]">
              <IndianRupee className="h-4 w-4 mr-1" />
              {property.pricePerNight}
            </div>
            <div className="text-xs text-gray-500">per night</div>
          </div>
        </div>
      </div>
    </div>
  );
}
