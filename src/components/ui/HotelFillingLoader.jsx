import React from 'react'

const HotelFillingLoader = ({ 
  message = "Loading...", 
  size = "sm",
  showMessage = false 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {/* Hotel Container */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Hotel Structure */}
        <div className="absolute inset-0">
          {/* Hotel Base */}
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gray-200 rounded-b-lg border border-gray-300"></div>
          
          {/* Hotel Roof */}
          <div className="absolute top-0 left-0 right-0 h-1/4">
            <div className="w-full h-full bg-gray-200 border border-gray-300 transform -skew-y-3 origin-bottom-left"></div>
            <div className="w-full h-full bg-gray-200 border border-gray-300 transform skew-y-3 origin-bottom-right"></div>
          </div>
          
          {/* Hotel Windows (multiple floors) */}
          <div className="absolute top-1/4 left-1/6 w-1/8 h-1/8 bg-gray-300 border border-gray-400 rounded-sm"></div>
          <div className="absolute top-1/4 right-1/6 w-1/8 h-1/8 bg-gray-300 border border-gray-400 rounded-sm"></div>
          <div className="absolute top-1/2 left-1/6 w-1/8 h-1/8 bg-gray-300 border border-gray-400 rounded-sm"></div>
          <div className="absolute top-1/2 right-1/6 w-1/8 h-1/8 bg-gray-300 border border-gray-400 rounded-sm"></div>
          <div className="absolute top-3/4 left-1/6 w-1/8 h-1/8 bg-gray-300 border border-gray-400 rounded-sm"></div>
          <div className="absolute top-3/4 right-1/6 w-1/8 h-1/8 bg-gray-300 border border-gray-400 rounded-sm"></div>
          
          {/* Hotel Door */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/6 h-1/4 bg-gray-300 border border-gray-400 rounded-t-sm"></div>
        </div>

        {/* Filling Animation */}
        <div className="absolute inset-0 overflow-hidden rounded-b-lg">
          <div className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-t from-[#F68241] to-[#F3CA62] animate-hotel-fill"></div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full">
          <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F68241] to-[#F3CA62] animate-progress-bar"></div>
          </div>
        </div>
      </div>

      {/* Message */}
      {showMessage && (
        <div className="text-center">
          <p className="text-[#F68241] font-medium text-xs animate-pulse">
            {message}
          </p>
        </div>
      )}

      {/* Loading Dots */}
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-[#F68241] rounded-full animate-bounce"></div>
        <div className="w-1 h-1 bg-[#F3CA62] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 h-1 bg-[#8B4513] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}

export default HotelFillingLoader
