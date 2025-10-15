import { useState, useRef, useEffect } from 'react'
import { Users, ChevronDown, X } from 'lucide-react'

const GuestSelector = ({ 
  initialValues = {},
  onGuestsChange,
  maxGuests = 16,
  showCloseButton = false,
  onClose,
  className = "",
  buttonClassName = "",
  isOpen = false,
  onToggle
}) => {
  const [adultCount, setAdultCount] = useState(initialValues.adultCount || 1)
  const [childrenCount, setChildrenCount] = useState(initialValues.childrenCount || 0)
  const [infantCount, setInfantCount] = useState(initialValues.infantCount || 0)
  const [showGuestsPicker, setShowGuestsPicker] = useState(isOpen)
  const guestsPickerRef = useRef(null)

  const totalGuests = adultCount + childrenCount

  // Close guests picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(event.target)) {
        setShowGuestsPicker(false)
        if (onClose) onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Update showGuestsPicker when isOpen prop changes
  useEffect(() => {
    setShowGuestsPicker(isOpen)
  }, [isOpen])

  const handleAdultChange = (count) => {
    const newCount = Math.max(1, Math.min(count, maxGuests - childrenCount))
    setAdultCount(newCount)
    updateGuests(newCount, childrenCount, infantCount)
  }

  const handleChildrenChange = (count) => {
    const newCount = Math.max(0, Math.min(count, maxGuests - adultCount))
    setChildrenCount(newCount)
    updateGuests(adultCount, newCount, infantCount)
  }

  const handleInfantChange = (count) => {
    const newCount = Math.max(0, Math.min(count, 5))
    setInfantCount(newCount)
    updateGuests(adultCount, childrenCount, newCount)
  }

  const updateGuests = (adults, children, infants) => {
    const total = adults + children
    if (onGuestsChange) {
      onGuestsChange({
        guests: total,
        adultCount: adults,
        childrenCount: children,
        infantCount: infants
      })
    }
  }

  const handleToggle = () => {
    const newState = !showGuestsPicker
    setShowGuestsPicker(newState)
    if (onToggle) onToggle(newState)
  }

  const getGuestText = () => {
    if (totalGuests >= maxGuests) {
      return `${maxGuests}+ guests`
    }
    if (totalGuests === 1) {
      return '1 guest'
    }
    return `${totalGuests} guests`
  }

  const getSummaryText = () => {
    if (totalGuests >= maxGuests) {
      return `${maxGuests}+ guests`
    }
    return `${totalGuests} ${totalGuests === 1 ? 'guest' : 'guests'}${infantCount > 0 ? `, ${infantCount} ${infantCount === 1 ? 'infant' : 'infants'}` : ''}`
  }

  return (
    <div className={`relative ${className}`} ref={guestsPickerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full text-left transition-all duration-300 ease-in-out ${buttonClassName}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900 transition-colors duration-200">Who</div>
            <div className="text-sm text-gray-500 transition-colors duration-200">
              {getGuestText()}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </button>

      {/* Guests Picker Modal */}
      {showGuestsPicker && (
        <div className="absolute top-full right-0 mt-2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-80 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Guests</h3>
              {showCloseButton && (
                <button
                  onClick={() => {
                    setShowGuestsPicker(false)
                    if (onClose) onClose()
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-gray-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdultChange(adultCount - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={adultCount <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center transition-all duration-200">{adultCount}</span>
                  <button
                    onClick={() => handleAdultChange(adultCount + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalGuests >= maxGuests}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-gray-500">Ages 2-12</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleChildrenChange(childrenCount - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={childrenCount <= 0}
                  >
                    -
                  </button>
                  <span className="w-8 text-center transition-all duration-200">{childrenCount}</span>
                  <button
                    onClick={() => handleChildrenChange(childrenCount + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalGuests >= maxGuests}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Infants</div>
                  <div className="text-sm text-gray-500">Under 2</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInfantChange(infantCount - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={infantCount <= 0}
                  >
                    -
                  </button>
                  <span className="w-8 text-center transition-all duration-200">{infantCount}</span>
                  <button
                    onClick={() => handleInfantChange(infantCount + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={infantCount >= 5}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {totalGuests >= maxGuests ? (
                    <span className="text-orange-600 font-medium">{maxGuests}+ guests</span>
                  ) : (
                    <span>{getSummaryText()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestSelector
