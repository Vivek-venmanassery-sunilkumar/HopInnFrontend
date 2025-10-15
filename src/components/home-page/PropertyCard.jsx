import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Users, IndianRupee } from 'lucide-react';

export default function PropertyCard({ property }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const searchState = useSelector((state) => state.search);
  
  // Get primary image URL from the API response
  const primaryImage = property.primaryImageUrl || '';
  
  // Get location info
  const location = `${property.district}, ${property.state}`;

  const handleCardClick = () => {
    // Pass search filters as state to PropertyDetails
    const searchFilters = searchState.searchFilters;
    const hasActiveSearch = searchState.hasActiveSearch;
    
    navigate(`/property/${property.id}`, {
      state: {
        searchFilters: hasActiveSearch ? searchFilters : null,
        hasActiveSearch
      }
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Property Image - Much larger, takes up most of the card */}
      <div className="relative h-64 w-full overflow-hidden">
        {primaryImage ? (
          <img 
            src={primaryImage} 
            alt={property.propertyName}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Subtle hover indicator */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300" />
        )}
      </div>

      {/* Property Details - Minimal and compact */}
      <div className={`p-3 transition-all duration-300 ${
        isHovered ? 'bg-gray-50' : 'bg-white'
      }`}>
        {/* Property Name and Location - Compact */}
        <div className="mb-2">
          <h3 className={`text-base font-semibold line-clamp-1 mb-1 transition-colors duration-300 ${
            isHovered ? 'text-gray-800' : 'text-gray-900'
          }`}>
            {property.propertyName}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="text-xs line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Minimal Stats - Only essential info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-600">
            <Users className="h-3 w-3 mr-1" />
            <span>{property.maxGuests} guests</span>
          </div>
          
          <div className={`flex items-center text-sm font-bold transition-colors duration-300 ${
            isHovered ? 'text-[#E55A2B]' : 'text-[#F68241]'
          }`}>
            <IndianRupee className="h-3 w-3 mr-1" />
            {property.pricePerNight}
          </div>
        </div>
      </div>
    </div>
  );
}
