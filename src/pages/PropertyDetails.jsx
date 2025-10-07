import { useParams, useNavigate } from 'react-router-dom'
import { useGetPropertyById } from '@/hooks/PropertyHooks'
import { ArrowLeft, MapPin, Users, Bed, IndianRupee, Star, Wifi, Car, Coffee, Utensils, Waves, Mountain, Home, Shield, Heart, Calendar, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HotelFillingLoader from '@/components/ui/HotelFillingLoader'
import NotFound from '@/components/common/NotFound'
import { useState } from 'react'

export default function PropertyDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: propertyData, isLoading, error } = useGetPropertyById(id)
    const [selectedDates, setSelectedDates] = useState({
        checkIn: '',
        checkOut: ''
    })
    const [guests, setGuests] = useState(1)
    const [showBookingForm, setShowBookingForm] = useState(false)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F68241]/10 to-[#2D5016]/10">
                <HotelFillingLoader 
                    size="lg"
                    showMessage={true}
                    message="Loading property details..."
                />
            </div>
        )
    }

    if (error) {
        return (
            <NotFound 
                title="Property Not Found"
                message={error.message || "The property you're looking for doesn't exist or has been removed."}
                customActions={
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="flex items-center gap-2 border-[#F68241] text-[#F68241] hover:bg-[#F68241] hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </Button>
                        <Button 
                            onClick={() => navigate('/home')}
                            className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white flex items-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Search Properties
                        </Button>
                    </div>
                }
            />
        )
    }

    const property = propertyData?.data || propertyData

    if (!property) {
        return (
            <NotFound 
                title="Property Not Found"
                message="The property you're looking for doesn't exist or has been removed."
                customActions={
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="flex items-center gap-2 border-[#F68241] text-[#F68241] hover:bg-[#F68241] hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </Button>
                        <Button 
                            onClick={() => navigate('/home')}
                            className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white flex items-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Search Properties
                        </Button>
                    </div>
                }
            />
        )
    }

    // Get all images
    const allImages = property.propertyImages || []
    const primaryImage = allImages.find(img => img.isPrimary)?.imageUrl || allImages[0]?.imageUrl || ''
    const otherImages = allImages.filter(img => !img.isPrimary)
    
    // Get location info
    const location = `${property.propertyAddress?.district || property.district}, ${property.propertyAddress?.state || property.state}, ${property.propertyAddress?.country || property.country}`
    const coordinates = property.propertyAddress?.coordinates || { latitude: null, longitude: null }

    // Amenity icons mapping
    const amenityIcons = {
        'WiFi': Wifi,
        'Parking': Car,
        'Kitchen': Coffee,
        'Dining': Utensils,
        'Pool': Waves,
        'Mountain View': Mountain,
        'Garden': Home,
        'Security': Shield,
        'Air Conditioning': Heart
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button 
                        onClick={() => navigate('/home')}
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-[#F68241]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Search
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="text-gray-600 hover:text-[#F68241]">
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                        <Button variant="ghost" className="text-gray-600 hover:text-[#F68241]">
                            <Star className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Property Images Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Images</h2>
                    {allImages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Primary image - larger */}
                            {primaryImage && (
                                <div className="md:col-span-2 lg:col-span-2">
                                    <div className="relative h-64 w-full rounded-xl overflow-hidden">
                                        <img 
                                            src={primaryImage} 
                                            alt={property.propertyName}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Primary
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Other images */}
                            {otherImages.map((image, index) => (
                                <div key={index} className="relative h-32 w-full rounded-xl overflow-hidden">
                                    <img 
                                        src={image.imageUrl} 
                                        alt={`${property.propertyName} ${index + 2}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                            <span className="text-gray-400 text-lg">No Images Available</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Property Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {property.propertyName}
                            </h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span className="text-lg">{location}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>{property.maxGuests} guests</span>
                                </div>
                                <div className="flex items-center">
                                    <Bed className="h-4 w-4 mr-1" />
                                    <span>{property.bedrooms} bedrooms</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="capitalize">{property.propertyType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Property Description */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this place</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {property.propertyDescription}
                            </p>
                        </div>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What this place offers</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {property.amenities.map((amenity, index) => {
                                        const IconComponent = amenityIcons[amenity] || Home
                                        return (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                                <IconComponent className="h-5 w-5 text-[#F68241]" />
                                                <span className="text-gray-700">{amenity}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Location Details */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Where you'll be</h2>
                            <div className="bg-white rounded-lg border p-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-[#F68241]" />
                                            <span className="font-medium">{property.propertyAddress?.houseName || property.houseName}</span>
                                        </div>
                                        {property.propertyAddress?.landmark && (
                                            <p className="text-gray-600 ml-6">Near {property.propertyAddress.landmark}</p>
                                        )}
                                        <p className="text-gray-600 ml-6">
                                            {property.propertyAddress?.pincode || property.pincode}, {property.propertyAddress?.district || property.district}, {property.propertyAddress?.state || property.state}, {property.propertyAddress?.country || property.country}
                                        </p>
                                    </div>
                                    
                                    {/* Map Component */}
                                    {coordinates.latitude && coordinates.longitude ? (
                                        <div className="mt-4">
                                            <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center border">
                                                <div className="text-center">
                                                    <MapPin className="h-8 w-8 text-[#F68241] mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600">Interactive Map</p>
                                                    <p className="text-xs text-gray-500">
                                                        {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400">Map location not available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-xl shadow-lg border p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="h-6 w-6 text-[#F68241]" />
                                            <span className="text-3xl font-bold text-gray-900">
                                                {property.pricePerNight}
                                            </span>
                                        </div>
                                        <span className="text-gray-600">per night</span>
                                    </div>
                                </div>

                                {!showBookingForm ? (
                                    <Button 
                                        onClick={() => setShowBookingForm(true)}
                                        className="w-full bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white py-3 text-lg font-semibold"
                                    >
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Select Dates
                                    </Button>
                                ) : (
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
                                            <Button 
                                                onClick={() => setShowBookingForm(false)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Check-in
                                                </label>
                                                <input 
                                                    type="date" 
                                                    value={selectedDates.checkIn}
                                                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkIn: e.target.value }))}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Check-out
                                                </label>
                                                <input 
                                                    type="date" 
                                                    value={selectedDates.checkOut}
                                                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkOut: e.target.value }))}
                                                    min={selectedDates.checkIn || new Date().toISOString().split('T')[0]}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Guests
                                            </label>
                                            <select 
                                                value={guests}
                                                onChange={(e) => setGuests(parseInt(e.target.value))}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent"
                                            >
                                                {Array.from({ length: property.maxGuests }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1} {i === 0 ? 'guest' : 'guests'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <Button 
                                            className="w-full bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white py-3 text-lg font-semibold"
                                            disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                                        >
                                            <Send className="h-5 w-5 mr-2" />
                                            Send Booking Request
                                        </Button>
                                    </div>
                                )}

                                <p className="text-center text-sm text-gray-500 mt-4">
                                    You won't be charged yet
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
