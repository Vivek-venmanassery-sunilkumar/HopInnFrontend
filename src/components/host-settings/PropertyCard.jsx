// components/host-settings/PropertyCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, MapPin, Users, Bed, IndianRupee, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyCard({ property, onEdit }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Get primary image (first image for now due to multiple primary images issue)
  const primaryImage = property.propertyImages?.[0]?.imageUrl || '';
  
  // Get location info
  const location = property.propertyAddress ? 
    `${property.propertyAddress.district}, ${property.propertyAddress.state}` : 
    'Location not specified';

  // Handle card click to navigate to property details
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/property/${property.property_id}`);
  };

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] overflow-hidden hover:shadow-xl transition-all duration-300 w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex flex-row h-48">
        {/* Property Details - Left Side */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Property Name and Location */}
            <div>
              <h3 className="text-xl font-bold text-[#2D5016] line-clamp-1">
                {property.propertyName}
              </h3>
              <div className="flex items-center text-[#8B4513] mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm line-clamp-1">{location}</span>
              </div>
            </div>

            {/* Property Description */}
            <p className="text-gray-600 text-sm line-clamp-2">
              {property.propertyDescription}
            </p>

            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center text-sm">
                <IndianRupee className="h-4 w-4 mr-1 text-[#F68241]" />
                <div>
                  <div className="font-semibold text-gray-700">₹{property.pricePerNight}</div>
                  <div className="text-xs text-gray-500">per night</div>
                </div>
              </div>
              
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
              
              <div className="text-sm">
                <div className="font-semibold text-gray-700 capitalize">{property.propertyType}</div>
                <div className="text-xs text-gray-500">type</div>
              </div>
            </div>
          </div>

          {/* Amenities and Edit Button */}
          <div className="flex justify-between items-end">
            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="flex-1">
                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span 
                      key={index}
                      className="bg-[#F68241]/10 text-[#8B4513] px-2 py-1 rounded-full text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Edit Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white ml-4"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Property Image - Right Side */}
        <div className="relative w-64 flex-shrink-0">
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
          
          {/* Hover overlay with quick actions */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity">
              <div className="text-white text-center space-y-2">
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${property.property_id}`);
                    }}
                    className="bg-white text-[#F68241] hover:bg-gray-100"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(property);
                    }}
                    className="bg-white text-[#F68241] hover:bg-gray-100"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Quick Edit
                  </Button>
                </div>
                <p className="text-sm">Click anywhere to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

