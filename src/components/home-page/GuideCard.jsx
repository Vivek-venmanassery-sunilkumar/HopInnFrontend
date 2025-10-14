import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, User, Languages } from 'lucide-react';

export default function GuideCard({ guide }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Get profile image URL from the API response
  const profileImage = guide.profileImage || '';
  
  // Get location info
  const location = `${guide.district}, ${guide.state}`;
  
  // Get full name
  const fullName = `${guide.firstName} ${guide.lastName || ''}`.trim();

  const handleCardClick = () => {
    navigate(`/guide/${guide.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Guide Profile Image - Much larger, takes up most of the card */}
      <div className="relative h-64 w-full overflow-hidden">
        {profileImage ? (
          <img 
            src={profileImage} 
            alt={fullName}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F68241]/20 to-[#2D5016]/20 flex items-center justify-center">
            <div className="text-center">
              <User className="h-16 w-16 text-[#F68241] mx-auto mb-2" />
              <span className="text-[#2D5016] font-medium">Local Guide</span>
            </div>
          </div>
        )}
        
        {/* Subtle hover indicator */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300" />
        )}
        
        {/* Expertise badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-medium text-[#2D5016]">{guide.profession}</span>
        </div>
      </div>

      {/* Guide Details - Minimal and compact */}
      <div className={`p-3 transition-all duration-300 ${
        isHovered ? 'bg-gray-50' : 'bg-white'
      }`}>
        {/* Guide Name and Location - Compact */}
        <div className="mb-2">
          <h3 className={`text-base font-semibold line-clamp-1 mb-1 transition-colors duration-300 ${
            isHovered ? 'text-gray-800' : 'text-gray-900'
          }`}>
            {fullName}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="text-xs line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Bio - Truncated */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {guide.bio}
        </p>

        {/* Languages - If available */}
        {guide.knownLanguages && guide.knownLanguages.length > 0 && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Languages className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">
              {guide.knownLanguages.slice(0, 2).join(', ')}
              {guide.knownLanguages.length > 2 && ` +${guide.knownLanguages.length - 2} more`}
            </span>
          </div>
        )}

        {/* Stats and Price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-600">
            <Clock className="h-3 w-3 mr-1" />
            <span>Available</span>
          </div>
          
          <div className={`flex items-center text-sm font-bold transition-colors duration-300 ${
            isHovered ? 'text-[#E55A2B]' : 'text-[#F68241]'
          }`}>
            <span className="text-xs mr-1">₹</span>
            {guide.hourlyRate}/hr
          </div>
        </div>
      </div>
    </div>
  );
}
