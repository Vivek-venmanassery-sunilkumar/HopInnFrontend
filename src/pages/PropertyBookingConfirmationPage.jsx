import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, User, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PaymentDetailsSection from '@/components/booking/PaymentDetailsSection'
import GuestDetailsSection from '@/components/booking/GuestDetailsSection'
import HikerLogo from '@/assets/hiker-logo.svg'


export default function PropertyBookingConfirmationPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isGuestDetailsValid, setIsGuestDetailsValid] = useState(false)
    const [guestValidationTrigger, setGuestValidationTrigger] = useState(null)
    const [guestDetails, setGuestDetails] = useState({ adults: [], children: [] })
    
    // Get booking data from navigation state
    const bookingData = location.state?.bookingData || {}
    const property = location.state?.property || {}
    const calculatedAmount = location.state?.calculatedAmount || 0
    const previousResponse = location.state?.previousResponse || {}
    
    const totalSteps = 2

    const handleNext = () => {
        if (currentStep < totalSteps) {
            // If we're on step 1 (Guest Details), validate before proceeding
            if (currentStep === 1) {
                if (guestValidationTrigger) {
                    const isValid = guestValidationTrigger()
                    if (!isValid) {
                        return // Don't proceed if validation fails
                    }
                } else if (!isGuestDetailsValid) {
                    return // Don't proceed if not valid
                }
            }
            
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep(currentStep + 1)
                setIsAnimating(false)
            }, 300)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep(currentStep - 1)
                setIsAnimating(false)
            }, 300)
        }
    }

    const handleGuestValidationChange = (isValid, triggerValidation, guestData) => {
        setIsGuestDetailsValid(isValid)
        if (triggerValidation) {
            setGuestValidationTrigger(() => triggerValidation)
        }
        if (guestData) {
            setGuestDetails(guestData)
        }
    }


    const steps = [
        {
            id: 1,
            title: 'Guest Details',
            icon: User,
            description: 'Provide guest information'
        },
        {
            id: 2,
            title: 'Payment',
            icon: CreditCard,
            description: 'Complete your payment'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button 
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-[#F68241]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-gray-900">Complete Booking</h1>
                        <p className="text-sm text-gray-500">{property.propertyName}</p>
                    </div>
                    <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate("/home")}
                    >
                        <img 
                            src={HikerLogo} 
                            alt="HopInn" 
                            className="h-8 w-8 transition-transform duration-300 hover:scale-105" 
                        />
                        <span className="text-lg font-bold text-[#2D5016]">HopInn</span>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id
                            
                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                            ${isCompleted 
                                                ? 'bg-green-500 border-green-500 text-white' 
                                                : isActive 
                                                    ? 'bg-[#F68241] border-[#F68241] text-white' 
                                                    : 'bg-white border-gray-300 text-gray-400'
                                            }
                                        `}>
                                            {isCompleted ? (
                                                <CheckCircle className="h-6 w-6" />
                                            ) : (
                                                <IconComponent className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className={`text-sm font-medium ${isActive ? 'text-[#F68241]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-500">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                                            currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Slider Container */}
                    <div className="relative">
                        <div className="flex transition-transform duration-300 ease-in-out" style={{
                            transform: `translateX(-${(currentStep - 1) * 100}%)`
                        }}>
                            {/* Step 1: Guest Details */}
                            <GuestDetailsSection 
                                previousResponse={previousResponse}
                                bookingData={bookingData}
                                onValidationChange={handleGuestValidationChange}
                            />

                            {/* Step 2: Payment */}
                            <PaymentDetailsSection 
                                property={property}
                                bookingData={bookingData}
                                calculatedAmount={calculatedAmount}
                                previousResponse={previousResponse}
                                guestDetails={guestDetails}
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="bg-gray-50 px-8 py-6 flex justify-between">
                        <Button
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        
                        {currentStep < totalSteps && (
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white flex items-center gap-2"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
