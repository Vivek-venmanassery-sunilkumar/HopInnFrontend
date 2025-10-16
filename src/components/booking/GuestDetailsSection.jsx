import { useState, useEffect, useCallback, useRef } from 'react'
import { User } from 'lucide-react'

const GuestDetailsSection = ({ previousResponse, bookingData, onValidationChange }) => {
    // Get number of adults and children from the API response or booking data
    const numAdults = previousResponse?.numAdults || bookingData?.adultCount || 1
    const numChildren = previousResponse?.numChildren || bookingData?.childrenCount || 0
    
    // State for guest details
    const [adultGuests, setAdultGuests] = useState([])
    const [childGuests, setChildGuests] = useState([])
    const [isValid, setIsValid] = useState(false)
    const [showValidation, setShowValidation] = useState(false)
    const onValidationChangeRef = useRef(onValidationChange)
    
    // Initialize guest arrays based on the number of adults and children
    useEffect(() => {
        // Initialize adult guests
        const initialAdults = Array.from({ length: numAdults }, (_, index) => ({
            id: `adult-${index}`,
            name: '',
            age: '',
            gender: ''
        }))
        setAdultGuests(initialAdults)
        
        // Initialize child guests
        const initialChildren = Array.from({ length: numChildren }, (_, index) => ({
            id: `child-${index}`,
            name: '',
            age: '',
            gender: ''
        }))
        setChildGuests(initialChildren)
    }, [numAdults, numChildren])
    
    // Validation functions
    const isAgeValid = (age, isAdult = true) => {
        const ageNum = parseInt(age)
        if (isNaN(ageNum) || age === '') return false
        if (isAdult) {
            return ageNum >= 13 && ageNum <= 100
        } else {
            return ageNum >= 2 && ageNum <= 12
        }
    }

    const isFieldValid = (guest, field) => {
        if (field === 'name') return guest.name.trim() !== ''
        if (field === 'age') {
            const isAdult = adultGuests.some(adult => adult.id === guest.id)
            return guest.age.trim() !== '' && isAgeValid(guest.age, isAdult)
        }
        if (field === 'gender') return guest.gender !== ''
        return true
    }

    const validateAllGuests = () => {
        // Check if all adult guests have required fields filled and valid ages
        const adultsValid = adultGuests.every(guest => 
            guest.name.trim() !== '' && 
            guest.age.trim() !== '' && 
            guest.gender !== '' &&
            isAgeValid(guest.age, true)
        )
        
        // Check if all child guests have required fields filled and valid ages
        const childrenValid = childGuests.every(guest => 
            guest.name.trim() !== '' && 
            guest.age.trim() !== '' && 
            guest.gender !== '' &&
            isAgeValid(guest.age, false)
        )
        
        return adultsValid && childrenValid
    }

    // Update ref when onValidationChange changes
    useEffect(() => {
        onValidationChangeRef.current = onValidationChange
    }, [onValidationChange])

    // Expose validation function to parent
    const triggerValidation = useCallback(() => {
        setShowValidation(true)
        return validateAllGuests()
    }, [adultGuests, childGuests])

    // Update validation state whenever guests change
    useEffect(() => {
        const valid = validateAllGuests()
        setIsValid(valid)
        if (onValidationChangeRef.current) {
            // Prepare guest data for parent
            const guestData = {
                adults: adultGuests.map(guest => ({
                    name: guest.name,
                    age: parseInt(guest.age) || 0,
                    gender: guest.gender
                })),
                children: childGuests.map(guest => ({
                    name: guest.name,
                    age: parseInt(guest.age) || 0,
                    gender: guest.gender
                }))
            }
            onValidationChangeRef.current(valid, triggerValidation, guestData)
        }
    }, [adultGuests, childGuests, triggerValidation])

    // Update adult guest details
    const updateAdultGuest = (index, field, value) => {
        const updated = [...adultGuests]
        updated[index] = { ...updated[index], [field]: value }
        setAdultGuests(updated)
        // Hide validation when user starts typing
        if (showValidation) {
            setShowValidation(false)
        }
    }
    
    // Update child guest details
    const updateChildGuest = (index, field, value) => {
        const updated = [...childGuests]
        updated[index] = { ...updated[index], [field]: value }
        setChildGuests(updated)
        // Hide validation when user starts typing
        if (showValidation) {
            setShowValidation(false)
        }
    }
    return (
        <div className="w-full flex-shrink-0 p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F68241] to-[#F3CA62] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Details</h2>
                <p className="text-gray-600">Provide information about all guests ({numAdults + numChildren} total)</p>
            </div>

            {/* Adult Guests */}
            {adultGuests.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Adult Guests ({adultGuests.length})</h3>
                    <div className="space-y-4">
                        {adultGuests.map((guest, index) => (
                            <div key={guest.id} className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Adult {index + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={guest.name}
                                            onChange={(e) => updateAdultGuest(index, 'name', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent ${
                                                showValidation && !isFieldValid(guest, 'name') 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="Enter full name"
                                        />
                                        {showValidation && !isFieldValid(guest, 'name') && (
                                            <p className="mt-1 text-xs text-red-600">Name is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Age *
                                        </label>
                                        <input
                                            type="number"
                                            min="13"
                                            max="100"
                                            value={guest.age}
                                            onChange={(e) => updateAdultGuest(index, 'age', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent ${
                                                showValidation && !isFieldValid(guest, 'age') 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="Age"
                                        />
                                        {showValidation && !isFieldValid(guest, 'age') && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {guest.age.trim() === '' ? 'Age is required' : 'Age must be 13-100 years'}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gender *
                                        </label>
                                        <select
                                            value={guest.gender}
                                            onChange={(e) => updateAdultGuest(index, 'gender', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent ${
                                                showValidation && !isFieldValid(guest, 'gender') 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {showValidation && !isFieldValid(guest, 'gender') && (
                                            <p className="mt-1 text-xs text-red-600">Gender is required</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Child Guests */}
            {childGuests.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Child Guests ({childGuests.length})</h3>
                    <div className="space-y-4">
                        {childGuests.map((guest, index) => (
                            <div key={guest.id} className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Child {index + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={guest.name}
                                            onChange={(e) => updateChildGuest(index, 'name', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent ${
                                                showValidation && !isFieldValid(guest, 'name') 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="Enter full name"
                                        />
                                        {showValidation && !isFieldValid(guest, 'name') && (
                                            <p className="mt-1 text-xs text-red-600">Name is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Age *
                                        </label>
                                        <input
                                            type="number"
                                            min="2"
                                            max="12"
                                            value={guest.age}
                                            onChange={(e) => updateChildGuest(index, 'age', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent ${
                                                showValidation && !isFieldValid(guest, 'age') 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="Age"
                                        />
                                        {showValidation && !isFieldValid(guest, 'age') && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {guest.age.trim() === '' ? 'Age is required' : 'Age must be 2-12 years'}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gender *
                                        </label>
                                        <select
                                            value={guest.gender}
                                            onChange={(e) => updateChildGuest(index, 'gender', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent ${
                                                showValidation && !isFieldValid(guest, 'gender') 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {showValidation && !isFieldValid(guest, 'gender') && (
                                            <p className="mt-1 text-xs text-red-600">Gender is required</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GuestDetailsSection
