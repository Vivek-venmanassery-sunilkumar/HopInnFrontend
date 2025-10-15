import { useState, useRef, useEffect } from 'react'
import { Calendar, Users, ChevronDown, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BookingDatePicker from './BookingDatePicker'

const PropertyBookingForm = ({ 
    property, 
    onBookingSubmit, 
    isLoading = false,
    initialValues = {}
}) => {
    const [selectedDates, setSelectedDates] = useState({
        checkIn: initialValues.checkIn || '',
        checkOut: initialValues.checkOut || ''
    })
    const [guests, setGuests] = useState(initialValues.guests || 1)
    const [adultCount, setAdultCount] = useState(initialValues.adultCount || 1)
    const [childrenCount, setChildrenCount] = useState(initialValues.childrenCount || 0)
    const [infantCount, setInfantCount] = useState(initialValues.infantCount || 0)

    // Update state when initialValues change
    useEffect(() => {
        if (initialValues.checkIn || initialValues.checkOut) {
            // Validate that pre-filled dates are not in the past
            const today = new Date().toISOString().split('T')[0]
            const checkInDate = initialValues.checkIn || ''
            const checkOutDate = initialValues.checkOut || ''
            
            // Only set dates if they are today or in the future
            if (checkInDate >= today && checkOutDate >= today) {
                setSelectedDates({
                    checkIn: checkInDate,
                    checkOut: checkOutDate
                })
            } else {
                // Clear dates if they are in the past
                setSelectedDates({
                    checkIn: '',
                    checkOut: ''
                })
            }
        }
        if (initialValues.guests) {
            setGuests(initialValues.guests)
        }
        if (initialValues.adultCount) {
            setAdultCount(initialValues.adultCount)
        }
        if (initialValues.childrenCount !== undefined) {
            setChildrenCount(initialValues.childrenCount)
        }
        if (initialValues.infantCount !== undefined) {
            setInfantCount(initialValues.infantCount)
        }
    }, [initialValues])
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showGuestsPicker, setShowGuestsPicker] = useState(false)
    const datePickerRef = useRef(null)
    const guestsPickerRef = useRef(null)

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close guests picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guestsPickerRef.current && !guestsPickerRef.current.contains(event.target)) {
                setShowGuestsPicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleDateChange = (dates) => {
        setSelectedDates(dates)
    }

    const handleDateButtonClick = () => {
        setShowDatePicker(true)
    }

    const updateGuestCount = () => {
        const total = adultCount + childrenCount
        setGuests(total)
    }

    useEffect(() => {
        updateGuestCount()
    }, [adultCount, childrenCount])

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        })
    }

    const calculateNights = () => {
        if (!selectedDates.checkIn || !selectedDates.checkOut) return 0
        const checkIn = new Date(selectedDates.checkIn)
        const checkOut = new Date(selectedDates.checkOut)
        const diffTime = checkOut - checkIn
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const calculateTotalPrice = () => {
        const nights = calculateNights()
        return nights * (property?.pricePerNight || 0)
    }

    const handleSubmit = () => {
        // Validate that dates are selected
        if (!selectedDates.checkIn || !selectedDates.checkOut) {
            alert('Please select both check-in and check-out dates before proceeding.')
            return
        }
        
        // Validate that check-out is after check-in
        const checkInDate = new Date(selectedDates.checkIn)
        const checkOutDate = new Date(selectedDates.checkOut)
        
        if (checkOutDate <= checkInDate) {
            alert('Check-out date must be after check-in date.')
            return
        }
        
        const bookingData = {
            checkIn: selectedDates.checkIn,
            checkOut: selectedDates.checkOut,
            guests,
            adultCount,
            childrenCount,
            infantCount,
            nights: calculateNights(),
            totalPrice: calculateTotalPrice()
        }
        
        onBookingSubmit(bookingData)
    }

    const isBookingValid = selectedDates.checkIn && selectedDates.checkOut && guests > 0
    
    // Check if dates are pre-filled from search filters
    const hasPreFilledDates = initialValues.checkIn && initialValues.checkOut

    return (
        <div className="bg-white rounded-xl shadow-lg border p-6">
            {/* Prices Include All Fees Banner */}
            <div className="flex items-center justify-center mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Tag className="h-5 w-5 text-pink-500" />
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Prices include all fees</span>
                </div>
            </div>

            {/* Pre-filled Dates Indicator */}
            {hasPreFilledDates && (
                <div className="mb-6 p-3 bg-gradient-to-r from-[#F68241]/10 to-[#F3CA62]/10 border border-[#F68241]/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#F68241]" />
                        <span className="text-sm font-medium text-[#2D5016]">
                            Dates pre-filled from your search
                        </span>
                    </div>
                </div>
            )}

            {/* Price Display */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                            ₹{property?.pricePerNight || 0}
                        </span>
                    </div>
                    <span className="text-gray-600">per night</span>
                </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
                <div className="relative" ref={datePickerRef}>
                    {/* Single Date Selection Button */}
                    <button
                        type="button"
                        onClick={handleDateButtonClick}
                        className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                            showDatePicker
                                ? 'border-[#F68241] ring-2 ring-[#F68241]/20 bg-[#F68241]/5'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">Dates</div>
                                <div className="text-sm">
                                    {selectedDates.checkIn && selectedDates.checkOut 
                                        ? `${formatDate(selectedDates.checkIn)} - ${formatDate(selectedDates.checkOut)}`
                                        : 'Select dates'
                                    }
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* Date Picker Modal */}
                    {showDatePicker && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                            <BookingDatePicker
                                selectedDates={selectedDates}
                                onDateChange={handleDateChange}
                                onClose={() => setShowDatePicker(false)}
                            />
                        </div>
                    )}
                </div>

                {/* Guests Selection */}
                <div className="relative" ref={guestsPickerRef}>
                    <button
                        type="button"
                        onClick={() => setShowGuestsPicker(!showGuestsPicker)}
                        className="w-full p-3 text-left border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">Guests</div>
                                <div className="text-sm">
                                    {guests} {guests === 1 ? 'guest' : 'guests'}
                                    {infantCount > 0 && `, ${infantCount} ${infantCount === 1 ? 'infant' : 'infants'}`}
                                </div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                    </button>

                    {/* Guests Picker Modal */}
                    {showGuestsPicker && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                                <div className="space-y-4">
                                    {/* Adults */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">Adults</div>
                                            <div className="text-sm text-gray-500">Ages 13 or above</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => adultCount > 1 && setAdultCount(adultCount - 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={adultCount <= 1}
                                            >
                                                <span className="text-gray-600">-</span>
                                            </button>
                                            <span className="w-8 text-center transition-all duration-200">{adultCount}</span>
                                            <button
                                                onClick={() => setAdultCount(adultCount + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={adultCount + childrenCount >= (property?.maxGuests || 10)}
                                            >
                                                <span className="text-gray-600">+</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">Children</div>
                                            <div className="text-sm text-gray-500">Ages 2-12</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => childrenCount > 0 && setChildrenCount(childrenCount - 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={childrenCount <= 0}
                                            >
                                                <span className="text-gray-600">-</span>
                                            </button>
                                            <span className="w-8 text-center transition-all duration-200">{childrenCount}</span>
                                            <button
                                                onClick={() => setChildrenCount(childrenCount + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={adultCount + childrenCount >= (property?.maxGuests || 10)}
                                            >
                                                <span className="text-gray-600">+</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Infants */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">Infants</div>
                                            <div className="text-sm text-gray-500">Under 2</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => infantCount > 0 && setInfantCount(infantCount - 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={infantCount <= 0}
                                            >
                                                <span className="text-gray-600">-</span>
                                            </button>
                                            <span className="w-8 text-center transition-all duration-200">{infantCount}</span>
                                            <button
                                                onClick={() => setInfantCount(infantCount + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={infantCount >= 5}
                                            >
                                                <span className="text-gray-600">+</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            {adultCount + childrenCount >= (property?.maxGuests || 10) ? (
                                                <span className="text-orange-600 font-medium">{property?.maxGuests || 10}+ guests</span>
                                            ) : (
                                                <span>
                                                    {adultCount + childrenCount} {adultCount + childrenCount === 1 ? 'guest' : 'guests'}
                                                    {infantCount > 0 && `, ${infantCount} ${infantCount === 1 ? 'infant' : 'infants'}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Price Summary */}
                {isBookingValid && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>₹{property?.pricePerNight || 0} × {calculateNights()} nights</span>
                            <span>₹{calculateTotalPrice()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Cleaning fee</span>
                            <span>₹0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Service fee</span>
                            <span>₹0</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{calculateTotalPrice()}</span>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={!isBookingValid || isLoading}
                    className="w-full bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Reserve'}
                </Button>

                <p className="text-center text-sm text-gray-500">
                    You won't be charged yet
                </p>
            </div>
        </div>
    )
}

export default PropertyBookingForm
