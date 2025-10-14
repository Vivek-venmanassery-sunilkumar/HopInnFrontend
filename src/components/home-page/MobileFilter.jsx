import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Users, Calendar, ChevronDown, X } from 'lucide-react'
import MobileDatePicker from './MobileDatePicker'

const MobileFilter = ({ onFilter, onClear, isLoading = false, initialValues = {} }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      destination: initialValues.destination || '',
      fromDate: initialValues.fromDate || '',
      toDate: initialValues.toDate || '',
      guests: initialValues.guests || 1
    }
  })
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState(initialValues.destination || '')
  const [selectedCoordinates, setSelectedCoordinates] = useState(initialValues.latitude && initialValues.longitude ? {
    latitude: initialValues.latitude,
    longitude: initialValues.longitude
  } : null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestsPicker, setShowGuestsPicker] = useState(false)
  const [currentDateField, setCurrentDateField] = useState('checkin')
  const [guestCount, setGuestCount] = useState(initialValues.guests || 1)
  const [adultCount, setAdultCount] = useState(initialValues.adultCount || 1)
  const [childrenCount, setChildrenCount] = useState(initialValues.childrenCount || 0)
  const [infantCount, setInfantCount] = useState(initialValues.infantCount || 0)
  const suggestionsRef = useRef(null)
  const inputRef = useRef(null)
  
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  const destinationValue = watch('destination')
  const fromDateValue = watch('fromDate')
  const toDateValue = watch('toDate')

  // Sync form values when initialValues change (e.g., when switching between desktop/mobile)
  useEffect(() => {
    if (initialValues) {
      setValue('destination', initialValues.destination || '')
      setValue('fromDate', initialValues.fromDate || '')
      setValue('toDate', initialValues.toDate || '')
      setValue('guests', initialValues.guests || 1)
      
      setSelectedDestination(initialValues.destination || '')
      setSelectedCoordinates(
        initialValues.latitude && initialValues.longitude 
          ? { latitude: initialValues.latitude, longitude: initialValues.longitude }
          : null
      )
      
      setAdultCount(initialValues.adultCount || 1)
      setChildrenCount(initialValues.childrenCount || 0)
      setInfantCount(initialValues.infantCount || 0)
      setGuestCount(initialValues.guests || 1)
    }
  }, [initialValues, setValue])

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (destinationValue && destinationValue.length > 2 && destinationValue !== selectedDestination) {
        searchPlaces(destinationValue)
      } else {
        setDestinationSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [destinationValue, selectedDestination])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchPlaces = async (query) => {
    if (!mapboxToken) {
      console.warn('Mapbox access token not found')
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=5&types=place,locality,neighborhood,address&country=IN&proximity=77.2090,28.6139`
      )
      
      if (response.ok) {
        const data = await response.json()
        const suggestions = data.features || []
        setDestinationSuggestions(suggestions)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error fetching place suggestions:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSelectedDestination(suggestion.place_name)
    setValue('destination', suggestion.place_name)
    setSelectedCoordinates({
      latitude: suggestion.center[1],
      longitude: suggestion.center[0]
    })
    setShowSuggestions(false)
    setDestinationSuggestions([])
    setActiveFilter(null)
  }

  const handleDestinationInputChange = (e) => {
    const value = e.target.value
    setValue('destination', value)
    
    if (selectedDestination && value !== selectedDestination) {
      setSelectedDestination('')
      setSelectedCoordinates(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      if (dateString.includes('-') && dateString.length === 10) {
        const [year, month, day] = dateString.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  const getCheckInText = () => {
    if (fromDateValue) {
      return formatDate(fromDateValue)
    }
    return 'Add dates'
  }

  const getCheckOutText = () => {
    if (toDateValue) {
      return formatDate(toDateValue)
    }
    return 'Add dates'
  }

  const handleFilterClick = (filterType) => {
    if (filterType !== 'dates' && showDatePicker) {
      setShowDatePicker(false)
    }
    if (filterType !== 'guests' && showGuestsPicker) {
      setShowGuestsPicker(false)
    }
    if (filterType !== 'where' && activeFilter === 'where') {
      setShowSuggestions(false)
    }
    
    setActiveFilter(filterType)
    
    if (filterType === 'dates') {
      setShowDatePicker(true)
      setShowGuestsPicker(false)
    } else if (filterType === 'guests') {
      setShowGuestsPicker(true)
      setShowDatePicker(false)
    }
  }

  const handleDateSelect = (checkIn, checkOut) => {
    setValue('fromDate', checkIn)
    setValue('toDate', checkOut)
    setShowDatePicker(false)
    setActiveFilter(null)
  }

  const handleDateChange = (checkIn, checkOut) => {
    setValue('fromDate', checkIn)
    setValue('toDate', checkOut)
    
    if (!checkIn && !checkOut) {
      setCurrentDateField('checkin')
    } else if (checkIn && !checkOut) {
      setCurrentDateField('checkout')
    } else if (checkIn && checkOut) {
      setCurrentDateField('checkout')
    }
  }

  const handleGuestsChange = (count) => {
    setGuestCount(count)
    setValue('guests', count)
  }

  const handleAdultChange = (count) => {
    setAdultCount(count)
    const totalGuests = count + childrenCount
    setGuestCount(totalGuests)
    setValue('guests', totalGuests)
  }

  const handleChildrenChange = (count) => {
    setChildrenCount(count)
    const totalGuests = adultCount + count
    setGuestCount(totalGuests)
    setValue('guests', totalGuests)
  }

  const handleInfantChange = (count) => {
    setInfantCount(count)
  }

  const getGuestText = () => {
    const totalGuests = adultCount + childrenCount
    if (totalGuests >= 16) {
      return '16+ guests'
    }
    if (totalGuests === 1) {
      return '1 guest'
    }
    return `${totalGuests} guests`
  }

  const hasActiveFilters = () => {
    return (
      selectedDestination ||
      fromDateValue ||
      toDateValue ||
      adultCount > 1 ||
      childrenCount > 0 ||
      infantCount > 0 ||
      selectedCoordinates
    )
  }

  const onSubmit = (data) => {
    const createUTCDate = (dateString) => {
      if (!dateString) return null
      const [year, month, day] = dateString.split('-').map(Number)
      const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
      return date.toISOString()
    }

    const filterData = {
      ...data,
      fromDate: createUTCDate(data.fromDate),
      toDate: createUTCDate(data.toDate),
      guests: data.guests ? parseInt(data.guests) : null,
      adultCount: adultCount,
      childrenCount: childrenCount,
      infantCount: infantCount,
      latitude: selectedCoordinates?.latitude || null,
      longitude: selectedCoordinates?.longitude || null,
      children_onboard: (childrenCount > 0 || infantCount > 0)
    }
    
    onFilter(filterData)
    setActiveFilter(null)
    setShowDatePicker(false)
    setShowGuestsPicker(false)
  }

  const handleClear = () => {
    reset()
    setSelectedDestination('')
    setSelectedCoordinates(null)
    setDestinationSuggestions([])
    setShowSuggestions(false)
    setGuestCount(1)
    setAdultCount(1)
    setChildrenCount(0)
    setInfantCount(0)
    setActiveFilter(null)
    setShowDatePicker(false)
    setShowGuestsPicker(false)
    setCurrentDateField('checkin')
    onClear()
  }

  return (
    <div className="relative">
      {/* Mobile Filter - Stacked Layout */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 space-y-4">
        {/* Where */}
        <div className="relative">
          <div className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${
            activeFilter === 'where' 
              ? 'bg-gray-100 border-2 border-blue-500' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="text-sm font-medium text-gray-900 mb-1">Where</div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search destinations"
              value={destinationValue || ''}
              onChange={handleDestinationInputChange}
              onFocus={() => handleFilterClick('where')}
              className="w-full text-sm text-gray-500 bg-transparent border-none outline-none placeholder-gray-500"
            />
          </div>
          
          {/* Destination Suggestions */}
          {activeFilter === 'where' && showSuggestions && destinationSuggestions.length > 0 && (
            <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-48 overflow-y-auto">
                <div className="p-2">
                  {destinationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#F68241] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.place_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-2 gap-3">
          {/* Check in */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                handleFilterClick('dates')
                if (fromDateValue && toDateValue) {
                  setValue('toDate', '')
                  setCurrentDateField('checkin')
                } else {
                  setCurrentDateField('checkin')
                }
              }}
              className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ease-in-out ${
                activeFilter === 'dates' && currentDateField === 'checkin'
                  ? 'bg-gray-100 border-2 border-blue-500' 
                  : activeFilter === 'dates'
                  ? 'bg-gray-50 border border-gray-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">Check in</div>
              <div className="text-sm text-gray-500">
                {getCheckInText()}
              </div>
            </button>
          </div>

          {/* Check out */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                handleFilterClick('dates')
                if (fromDateValue && toDateValue) {
                  setCurrentDateField('checkout')
                } else if (fromDateValue && !toDateValue) {
                  setCurrentDateField('checkout')
                } else {
                  setCurrentDateField('checkin')
                }
              }}
              className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ease-in-out ${
                activeFilter === 'dates' && currentDateField === 'checkout'
                  ? 'bg-gray-100 border-2 border-blue-500' 
                  : activeFilter === 'dates'
                  ? 'bg-gray-50 border border-gray-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">Check out</div>
              <div className="text-sm text-gray-500">
                {getCheckOutText()}
              </div>
            </button>
          </div>
        </div>

        {/* Who */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleFilterClick('guests')}
            className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ease-in-out ${
              activeFilter === 'guests' 
                ? 'bg-gray-100 border-2 border-blue-500' 
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="text-sm font-medium text-gray-900">Who</div>
            <div className="text-sm text-gray-500">
              {getGuestText()}
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {hasActiveFilters() && (
            <Button
              type="button"
              onClick={handleClear}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-4 py-3 flex items-center gap-2 transition-all duration-300"
            >
              <X className="h-4 w-4" />
              <span className="font-medium">Clear</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-all duration-300 flex-1"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">Search</span>
          </Button>
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <MobileDatePicker
              onDateSelect={handleDateSelect}
              onDateChange={handleDateChange}
              onClose={() => {
                setShowDatePicker(false)
                setActiveFilter(null)
              }}
              initialCheckIn={fromDateValue}
              initialCheckOut={toDateValue}
            />
          </div>
        </div>
      )}

      {/* Guests Picker */}
      {showGuestsPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Guests</h3>
                <button
                  onClick={() => {
                    setShowGuestsPicker(false)
                    setActiveFilter(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
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
                      onClick={() => adultCount > 1 && handleAdultChange(adultCount - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={adultCount <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{adultCount}</span>
                    <button
                      onClick={() => handleAdultChange(adultCount + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={adultCount + childrenCount >= 16}
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
                      onClick={() => childrenCount > 0 && handleChildrenChange(childrenCount - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={childrenCount <= 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{childrenCount}</span>
                    <button
                      onClick={() => handleChildrenChange(childrenCount + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={adultCount + childrenCount >= 16}
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
                      onClick={() => infantCount > 0 && handleInfantChange(infantCount - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={infantCount <= 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{infantCount}</span>
                    <button
                      onClick={() => handleInfantChange(infantCount + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={infantCount >= 5}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden form for form handling */}
      <form onSubmit={handleSubmit(onSubmit)} className="hidden">
        <input {...register('destination')} />
        <input {...register('fromDate')} />
        <input {...register('toDate')} />
        <input {...register('guests')} />
      </form>
    </div>
  )
}

export default MobileFilter
