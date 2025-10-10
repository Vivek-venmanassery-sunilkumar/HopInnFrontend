import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Star, User, Languages, Calendar, Send, MessageCircle, Phone, Mail, Shield, Award, Heart, Home, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HotelFillingLoader from '@/components/ui/HotelFillingLoader'
import NotFound from '@/components/common/NotFound'
import GuideMap from '@/components/home-page/GuideMap'
import { useGetGuideById } from '@/hooks/GuideHooks'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function GuideDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    
    // Fetch guide data from API
    const { data: guideData, isLoading, error } = useGetGuideById(id)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [duration, setDuration] = useState(4)
    const [showBookingForm, setShowBookingForm] = useState(false)

    // Check if the current user is the guide themselves
    const isGuide = user.isGuide && user.guideId && guideData?.id && user.guideId === guideData.id

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F68241]/10 to-[#2D5016]/10">
                <HotelFillingLoader 
                    size="lg"
                    showMessage={true}
                    message="Loading guide details..."
                />
            </div>
        )
    }

    if (error) {
        return (
            <NotFound 
                title="Guide Not Found"
                message={error.message || "The guide you're looking for doesn't exist or has been removed."}
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
                            Search Guides
                        </Button>
                    </div>
                }
            />
        )
    }

    if (!guideData) {
        return (
            <NotFound 
                title="Guide Not Found"
                message="The guide you're looking for doesn't exist or has been removed."
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
                            Search Guides
                        </Button>
                    </div>
                }
            />
        )
    }

    const fullName = `${guideData.firstName} ${guideData.lastName || ''}`.trim()
    const location = `${guideData.district}, ${guideData.state}, ${guideData.country}`
    const totalPrice = (parseFloat(guideData.hourlyRate) * duration).toFixed(2)

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
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Guide Profile Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Profile Image */}
                            <div className="flex-shrink-0">
                                {guideData.profileImage ? (
                                    <img 
                                        src={guideData.profileImage} 
                                        alt={fullName}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-[#F68241]/20"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F68241]/20 to-[#2D5016]/20 flex items-center justify-center border-4 border-[#F68241]/20">
                                        <User className="h-16 w-16 text-[#F68241]" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Guide Info */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {fullName}
                                        </h1>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <MapPin className="h-5 w-5 mr-2" />
                                            <span className="text-lg">{location}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Price */}
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-3xl font-bold text-[#F68241]">
                                                ₹{guideData.hourlyRate}
                                            </span>
                                            <span className="text-gray-600">per hour</span>
                                        </div>
                                        <p className="text-sm text-gray-500">Flexible pricing</p>
                                    </div>
                                </div>
                                
                                {/* Languages */}
                                {guideData.knownLanguages && guideData.knownLanguages.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Languages className="h-4 w-4 text-[#F68241]" />
                                            <span className="font-medium text-gray-700">Languages</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {guideData.knownLanguages.map((language, index) => (
                                                <span 
                                                    key={index}
                                                    className="px-3 py-1 bg-[#F68241]/10 text-[#F68241] rounded-full text-sm font-medium"
                                                >
                                                    {language}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-1 ${isGuide ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
                    {/* Main Content */}
                    <div className={`${isGuide ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-8`}>
                        {/* About Guide */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About {guideData.firstName}</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {guideData.bio}
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-medium text-gray-900">Profession: </span>
                                    <span className="text-gray-700">{guideData.profession}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Expertise: </span>
                                    <span className="text-gray-700">{guideData.expertise}</span>
                                </div>
                            </div>
                        </div>


                        {/* Location Details */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-[#F68241]" />
                                        <span className="font-medium">{guideData.houseName}</span>
                                    </div>
                                    {guideData.landmark && (
                                        <p className="text-gray-600 ml-6">Near {guideData.landmark}</p>
                                    )}
                                    <p className="text-gray-600 ml-6">
                                        {guideData.pincode}, {guideData.district}, {guideData.state}, {guideData.country}
                                    </p>
                                </div>
                                
                                {/* Map Component */}
                                {guideData.latitude && guideData.longitude ? (
                                    <div className="mt-4">
                                        <GuideMap 
                                            guides={[{
                                                ...guideData,
                                                latitude: guideData.latitude,
                                                longitude: guideData.longitude,
                                                district: guideData.district,
                                                state: guideData.state,
                                                country: guideData.country
                                            }]} 
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-4 h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-400">Map location not available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guide Message - Only show if user is the guide themselves */}
                        {isGuide && (
                            <div className="bg-gradient-to-r from-[#F68241]/10 to-[#F3CA62]/10 border border-[#F68241]/20 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <User className="h-6 w-6 text-[#F68241]" />
                                    <h2 className="text-xl font-semibold text-[#2D5016]">Your Profile</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    This is your guide profile. You can manage your availability, update your profile details, 
                                    and view your bookings from your guide dashboard.
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <Button 
                                        onClick={() => navigate('/guide-settings')}
                                        className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white"
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Manage Profile
                                    </Button>
                                    <Button 
                                        onClick={() => navigate('/home')}
                                        variant="outline"
                                        className="border-[#F68241] text-[#F68241] hover:bg-[#F68241] hover:text-white"
                                    >
                                        <Home className="h-4 w-4 mr-2" />
                                        View Other Guides
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Sidebar - Only show if user is not the guide */}
                    {!isGuide && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                <div className="bg-white rounded-xl shadow-lg border p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    ₹{guideData.hourlyRate}
                                                </span>
                                            </div>
                                            <span className="text-gray-600">per hour</span>
                                        </div>
                                    </div>

                                    {!showBookingForm ? (
                                        <Button 
                                            onClick={() => setShowBookingForm(true)}
                                            className="w-full bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white py-3 text-lg font-semibold"
                                        >
                                            <Calendar className="h-5 w-5 mr-2" />
                                            Book Guide
                                        </Button>
                                    ) : (
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">Book {guideData.firstName}</h3>
                                                <Button 
                                                    onClick={() => setShowBookingForm(false)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Select Date
                                                </label>
                                                <input 
                                                    type="date" 
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Select Time
                                                </label>
                                                <select 
                                                    value={selectedTime}
                                                    onChange={(e) => setSelectedTime(e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent"
                                                >
                                                    <option value="">Choose time</option>
                                                    <option value="09:00">9:00 AM</option>
                                                    <option value="10:00">10:00 AM</option>
                                                    <option value="11:00">11:00 AM</option>
                                                    <option value="12:00">12:00 PM</option>
                                                    <option value="13:00">1:00 PM</option>
                                                    <option value="14:00">2:00 PM</option>
                                                    <option value="15:00">3:00 PM</option>
                                                    <option value="16:00">4:00 PM</option>
                                                    <option value="17:00">5:00 PM</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Duration (hours)
                                                </label>
                                                <select 
                                                    value={duration}
                                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F68241] focus:border-transparent"
                                                >
                                                    <option value={2}>2 hours</option>
                                                    <option value={4}>4 hours</option>
                                                    <option value={6}>6 hours</option>
                                                    <option value={8}>8 hours</option>
                                                </select>
                                            </div>

                                            {/* Price calculation */}
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm text-gray-600">₹{guideData.hourlyRate} × {duration} hours</span>
                                                    <span className="font-medium">₹{totalPrice}</span>
                                                </div>
                                                <div className="flex justify-between items-center font-semibold text-lg">
                                                    <span>Total</span>
                                                    <span className="text-[#F68241]">₹{totalPrice}</span>
                                                </div>
                                            </div>

                                            <Button 
                                                className="w-full bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white py-3 text-lg font-semibold"
                                                disabled={!selectedDate || !selectedTime}
                                            >
                                                <Send className="h-5 w-5 mr-2" />
                                                Send Booking Request
                                            </Button>
                                        </div>
                                    )}

                                    <div className="mt-4 space-y-3">
                                        <Button 
                                            variant="outline" 
                                            className="w-full border-[#F68241] text-[#F68241] hover:bg-[#F68241] hover:text-white"
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Message Guide
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call Guide
                                        </Button>
                                    </div>

                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        You won't be charged until the guide confirms
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-white/90 backdrop-blur-sm border-t border-[#D4B5A0] py-3 mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-600">
                        © 2024 HopInn. Copyright Protected. Developed by Vivek V S
                    </p>
                </div>
            </footer>
        </div>
    )
}
