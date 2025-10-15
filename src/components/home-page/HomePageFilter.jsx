import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Calendar, ChevronDown, X } from 'lucide-react'
import DatePicker from './DatePicker'
import GuestSelector from '@/components/common/GuestSelector'

const HomePageFilter = ({ onFilter, onClear, isLoading = false, initialValues = {} }) => {
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
  const [currentDateField, setCurrentDateField] = useState('checkin') // 'checkin' or 'checkout'
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


  // Update form state when initialValues change
  useEffect(() => {
    if (initialValues) {
      setValue('destination', initialValues.destination || '')
      setValue('fromDate', initialValues.fromDate || '')
      setValue('toDate', initialValues.toDate || '')
      setValue('guests', initialValues.guests || 1)
      
      setSelectedDestination(initialValues.destination || '')
      setSelectedCoordinates(initialValues.latitude && initialValues.longitude ? {
        latitude: initialValues.latitude,
        longitude: initialValues.longitude
      } : null)
      
      setGuestCount(initialValues.guests || 1)
      setAdultCount(initialValues.adultCount || 1)
      setChildrenCount(initialValues.childrenCount || 0)
      setInfantCount(initialValues.infantCount || 0)
    }
  }, [initialValues, setValue])

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
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=10&types=place,locality,neighborhood,address&country=IN&proximity=77.2090,28.6139`
      )
      
      if (response.ok) {
        const data = await response.json()
        let suggestions = data.features || []
        
        if (suggestions.length < 5) {
          const globalResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=5&types=place,locality,neighborhood,address`
          )
          
          if (globalResponse.ok) {
            const globalData = await globalResponse.json()
            const globalSuggestions = globalData.features || []
            
            const nonIndiaSuggestions = globalSuggestions.filter(suggestion => {
              const country = suggestion.context?.find(ctx => ctx.id.startsWith('country'))
              return country && country.short_code !== 'IN'
            })
            
            suggestions = [...suggestions, ...nonIndiaSuggestions].slice(0, 5)
          }
        } else {
          suggestions = suggestions.slice(0, 5)
        }
        
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

  const handleDestinationFocus = (e) => {
    // Select all text when focusing on the input
    e.target.select()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      // Handle YYYY-MM-DD format directly to avoid timezone issues
      if (dateString.includes('-') && dateString.length === 10) {
        const [year, month, day] = dateString.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
      // Fallback for ISO strings
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
    // Close other filters when switching
    if (filterType !== 'dates' && showDatePicker) {
      setShowDatePicker(false)
    }
    if (filterType !== 'where' && activeFilter === 'where') {
      setShowSuggestions(false)
    }
    
    setActiveFilter(filterType)
    
    if (filterType === 'dates') {
      setShowDatePicker(true)
    }
  }

  const handleDateFieldClick = (fieldType) => {
    handleFilterClick('dates')
    
    // Set the current field without clearing other fields
    if (fieldType === 'checkin') {
      setCurrentDateField('checkin')
    } else if (fieldType === 'checkout') {
      if (fromDateValue && toDateValue) {
        setCurrentDateField('checkout')
      } else if (fromDateValue && !toDateValue) {
        setCurrentDateField('checkout')
      } else {
        // If no check-in date, start with check-in first
        setCurrentDateField('checkin')
      }
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
    
    // Update current field based on what's being selected
    if (!checkIn && !checkOut) {
      setCurrentDateField('checkin') // No dates selected, start with check-in
    } else if (checkIn && !checkOut) {
      setCurrentDateField('checkout') // Check-in selected, now selecting check-out
    } else if (checkIn && checkOut) {
      setCurrentDateField('checkout') // Both selected, keep focus on check-out for modifications
    }
  }


  const handleGuestsChange = (guestData) => {
    setGuestCount(guestData.guests)
    setAdultCount(guestData.adultCount)
    setChildrenCount(guestData.childrenCount)
    setInfantCount(guestData.infantCount)
    setValue('guests', guestData.guests)
  }

  // Check if there are any active filters
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

  const handleSearch = () => {

    // Create dates in UTC to avoid timezone conversion issues
    const createUTCDate = (dateString) => {
      if (!dateString || dateString.trim() === '') return null
      
      try {
        let date
        
        // Handle different date formats
        if (dateString.includes('T') && dateString.includes('Z')) {
          // Handle ISO string format (2025-10-15T00:00:00.000Z)
          date = new Date(dateString)
        } else if (dateString.includes('-') && dateString.length === 10) {
          // Handle YYYY-MM-DD format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (!dateRegex.test(dateString)) {
            return null
          }
          
          const [year, month, day] = dateString.split('-').map(Number)
          
          // Validate date components
          if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return null
          }
          
          // Validate date range
          if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
            return null
          }
          
          // Create date in UTC to avoid timezone shifts
          date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
        } else {
          // Try to parse as a general date string
          date = new Date(dateString)
        }
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return null
        }
        
        return date.toISOString()
      } catch (error) {
        return null
      }
    }

    // Check if this is a "show all" search (no specific filters)
    const isShowAllSearch = !destinationValue && !fromDateValue && !toDateValue && guestCount === 1

    // If not a "show all" search, validate that all required fields are filled
    if (!isShowAllSearch) {
      const hasDestination = destinationValue && destinationValue.trim() !== ''
      const hasFromDate = fromDateValue && fromDateValue.trim() !== ''
      const hasToDate = toDateValue && toDateValue.trim() !== ''
      
      if (!hasDestination || !hasFromDate || !hasToDate) {
        alert('Please fill in all required fields: destination, check-in date, and check-out date.')
        return
      }
    }

    // Use current state values instead of form data to ensure we have the latest values
    const filterData = {
      destination: destinationValue || '',
      fromDate: createUTCDate(fromDateValue),
      toDate: createUTCDate(toDateValue),
      guests: guestCount,
      adultCount: adultCount,
      childrenCount: childrenCount,
      infantCount: infantCount,
      latitude: selectedCoordinates?.latitude || null,
      longitude: selectedCoordinates?.longitude || null,
      children_onboard: (childrenCount > 0 || infantCount > 0),
      all: isShowAllSearch // Add all parameter to indicate if this is a "show all" search
    }
    
    onFilter(filterData)
    
    setActiveFilter(null)
    setShowDatePicker(false)
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
    setCurrentDateField('checkin')
    onClear()
  }

  return (
    <div className="relative">
      {/* Main Filter Bar */}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1 flex items-center max-w-4xl mx-auto transition-all duration-300 ease-in-out hover:shadow-xl">
        {/* Where */}
        <div className="relative flex-1">
          <div className={`w-full px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
            activeFilter === 'where' 
              ? 'bg-gray-100' 
              : 'hover:bg-gray-50'
          }`}>
            <div className="text-sm font-medium text-gray-900 transition-colors duration-200 mb-1">Where</div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search destinations"
              value={destinationValue || ''}
              onChange={handleDestinationInputChange}
              onFocus={(e) => {
                handleFilterClick('where')
                handleDestinationFocus(e)
              }}
              className="w-full text-sm text-gray-500 bg-transparent border-none outline-none placeholder-gray-500"
            />
          </div>
          
          {/* Destination Suggestions */}
          {activeFilter === 'where' && showSuggestions && destinationSuggestions.length > 0 && (
            <div ref={suggestionsRef} className="absolute top-full left-0 mt-3 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 max-h-64 overflow-y-auto w-80 sm:w-96 min-w-80 sm:min-w-96">
                <div className="p-3">
                  {destinationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gradient-to-r hover:from-[#F68241]/10 hover:to-[#F3CA62]/10 cursor-pointer rounded-lg transition-all duration-200 hover:shadow-sm group w-full"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#F68241] to-[#F3CA62] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#2D5016] transition-colors duration-200">
                            {suggestion.place_name}
                          </p>
                          {suggestion.context && (
                            <p className="text-xs text-gray-500 mt-1">
                              {suggestion.context.map(ctx => ctx.text).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#F68241] to-[#F3CA62] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-2 transition-all duration-300"></div>

        {/* Check in */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleDateFieldClick('checkin')}
            className={`px-4 py-2 text-left rounded-full transition-all duration-300 ease-in-out ${
              activeFilter === 'dates' && currentDateField === 'checkin'
                ? 'bg-gray-100 ring-2 ring-blue-500' 
                : activeFilter === 'dates'
                ? 'bg-gray-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-sm font-medium text-gray-900 transition-colors duration-200">Check in</div>
            <div className="text-sm text-gray-500 transition-colors duration-200">
              {getCheckInText()}
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-2 transition-all duration-300"></div>

        {/* Check out */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleDateFieldClick('checkout')}
            className={`px-4 py-2 text-left rounded-full transition-all duration-300 ease-in-out ${
              activeFilter === 'dates' && currentDateField === 'checkout'
                ? 'bg-gray-100 ring-2 ring-blue-500' 
                : activeFilter === 'dates'
                ? 'bg-gray-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-sm font-medium text-gray-900 transition-colors duration-200">Check out</div>
            <div className="text-sm text-gray-500 transition-colors duration-200">
              {getCheckOutText()}
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-2 transition-all duration-300"></div>

        {/* Who */}
        <div className="relative">
          <GuestSelector
            initialValues={{
              guests: guestCount,
              adultCount,
              childrenCount,
              infantCount
            }}
            onGuestsChange={handleGuestsChange}
            maxGuests={16}
            className={`px-4 py-2 text-left rounded-full transition-all duration-300 ease-in-out ${
              activeFilter === 'guests' 
                ? 'bg-gray-100' 
                : 'hover:bg-gray-50'
            }`}
            buttonClassName="w-full"
            isOpen={activeFilter === 'guests'}
            onToggle={(isOpen) => {
              if (isOpen) {
                setActiveFilter('guests')
              } else {
                setActiveFilter(null)
              }
            }}
          />
        </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-2">
              {/* Clear Button - Only show if there are active filters */}
              {hasActiveFilters() && (
                <Button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-4 py-3 flex items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300"
                  title="Clear all filters"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:block font-medium">Clear</span>
                </Button>
              )}

              {/* Search Button */}
              <Button
                type="button"
                onClick={handleSearch}
                className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:block font-medium">Search</span>
              </Button>
            </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
              <DatePicker
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
        </div>
      )}


    </div>
  )
}

export default HomePageFilter