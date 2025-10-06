import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, MapPin, Users, Calendar, ChevronDown } from 'lucide-react'

const HomePageFilter = ({ onFilter, onClear, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedCoordinates, setSelectedCoordinates] = useState(null)
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

  // Clear check-out date if it's before or equal to the new check-in date
  useEffect(() => {
    if (fromDateValue && toDateValue && toDateValue <= fromDateValue) {
      setValue('toDate', '')
    }
  }, [fromDateValue, toDateValue, setValue])

  const searchPlaces = async (query) => {
    if (!mapboxToken) {
      console.warn('Mapbox access token not found')
      return
    }

    setIsLoadingSuggestions(true)
    try {
      // First search with India bias
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=10&types=place,locality,neighborhood,address&country=IN&proximity=77.2090,28.6139`
      )
      
      if (response.ok) {
        const data = await response.json()
        let suggestions = data.features || []
        
        // If we have less than 5 results from India, search globally
        if (suggestions.length < 5) {
          const globalResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=5&types=place,locality,neighborhood,address`
          )
          
          if (globalResponse.ok) {
            const globalData = await globalResponse.json()
            const globalSuggestions = globalData.features || []
            
            // Filter out India results from global search to avoid duplicates
            const nonIndiaSuggestions = globalSuggestions.filter(suggestion => {
              const country = suggestion.context?.find(ctx => ctx.id.startsWith('country'))
              return country && country.short_code !== 'IN'
            })
            
            // Combine India results first, then global results
            suggestions = [...suggestions, ...nonIndiaSuggestions].slice(0, 5)
          }
        } else {
          // If we have enough India results, limit to 5
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
  }

  const handleDestinationInputChange = (e) => {
    const value = e.target.value
    setValue('destination', value)
    
    // Clear selected destination and coordinates if user is typing something different
    if (selectedDestination && value !== selectedDestination) {
      setSelectedDestination('')
      setSelectedCoordinates(null)
    }
  }

  const handleFromDateChange = (e) => {
    const selectedDate = e.target.value
    if (selectedDate && selectedDate < today) {
      // Reset to today if user tries to select a past date
      setValue('fromDate', today)
    } else {
      setValue('fromDate', selectedDate)
    }
  }

  const handleToDateChange = (e) => {
    const selectedDate = e.target.value
    const fromDate = fromDateValue
    
    if (selectedDate && fromDate && selectedDate <= fromDate) {
      // Reset to day after check-in if user tries to select invalid date
      const nextDay = new Date(new Date(fromDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      setValue('toDate', nextDay)
    } else {
      setValue('toDate', selectedDate)
    }
  }

  const onSubmit = (data) => {
    // Convert dates to ISO format for backend and include coordinates
    const filterData = {
      ...data,
      fromDate: data.fromDate ? new Date(data.fromDate).toISOString() : null,
      toDate: data.toDate ? new Date(data.toDate).toISOString() : null,
      guests: data.guests ? parseInt(data.guests) : null,
      latitude: selectedCoordinates?.latitude || null,
      longitude: selectedCoordinates?.longitude || null
    }
    
    onFilter(filterData)
  }

  const handleClear = () => {
    reset()
    setSelectedDestination('')
    setSelectedCoordinates(null)
    setDestinationSuggestions([])
    setShowSuggestions(false)
    onClear()
  }

  return (
    <Card className="p-6 shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Find Your Perfect Stay & Guides</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="space-y-2 relative">
            <Label htmlFor="destination" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination
            </Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="destination"
                type="text"
                placeholder="Where are you going?"
                value={destinationValue || ''}
                onChange={handleDestinationInputChange}
                {...register('destination', {
                  required: 'Destination is required'
                })}
                className={`pr-8 ${errors.destination ? 'border-red-500' : ''}`}
                autoComplete="off"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {isLoadingSuggestions ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && destinationSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  {destinationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.place_name}
                          </p>
                          {suggestion.context && (
                            <p className="text-xs text-gray-500 truncate">
                              {suggestion.context.map(ctx => ctx.text).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.destination && (
              <p className="text-sm text-red-500">{errors.destination.message}</p>
            )}
          </div>

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              placeholder="How many guests?"
              {...register('guests', {
                required: 'Number of guests is required',
                min: {
                  value: 1,
                  message: 'At least 1 guest is required'
                }
              })}
              className={errors.guests ? 'border-red-500' : ''}
            />
            {errors.guests && (
              <p className="text-sm text-red-500">{errors.guests.message}</p>
            )}
          </div>

          {/* From Date */}
          <div className="space-y-2">
            <Label htmlFor="fromDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Check-in
            </Label>
            <Input
              id="fromDate"
              type="date"
              min={today}
              value={fromDateValue || ''}
              onChange={handleFromDateChange}
              {...register('fromDate', {
                required: 'Check-in date is required',
                validate: (value) => {
                  if (value && value < today) {
                    return 'Check-in date cannot be in the past'
                  }
                  return true
                }
              })}
              className={errors.fromDate ? 'border-red-500' : ''}
            />
            {errors.fromDate && (
              <p className="text-sm text-red-500">{errors.fromDate.message}</p>
            )}
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label htmlFor="toDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Check-out
            </Label>
            <Input
              id="toDate"
              type="date"
              min={fromDateValue ? new Date(new Date(fromDateValue).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : today}
              value={toDateValue || ''}
              onChange={handleToDateChange}
              {...register('toDate', {
                required: 'Check-out date is required',
                validate: (value) => {
                  const fromDate = fromDateValue
                  if (fromDate && value && value <= fromDate) {
                    return 'Check-out date must be after check-in date'
                  }
                  return true
                }
              })}
              className={errors.toDate ? 'border-red-500' : ''}
            />
            {errors.toDate && (
              <p className="text-sm text-red-500">{errors.toDate.message}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            className="flex-1 md:flex-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Properties & Guides
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear Filters
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default HomePageFilter
