import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCheckoutPropertyBooking } from '@/hooks/BookingsHooks'

const PaymentDetailsSection = ({ property, bookingData, calculatedAmount, previousResponse, guestDetails }) => {
    const checkoutMutation = useCheckoutPropertyBooking()

    const handlePayNow = () => {
        // Prepare checkout data
        const checkoutData = {
            propertyId: previousResponse.propertyId,
            checkInDate: bookingData.checkIn,
            checkOutDate: bookingData.checkOut,
            numAdults: previousResponse.numAdults,
            numChildren: previousResponse.numChildren,
            numInfants: previousResponse.numInfants,
            adults: guestDetails?.adults || [],
            children: guestDetails?.children || []
        }

        // Trigger checkout mutation
        checkoutMutation.mutate(checkoutData, {
            onSuccess: (data) => {
                console.log('Checkout successful:', data)
                // TODO: Handle successful checkout (redirect, show success message, etc.)
            },
            onError: (error) => {
                console.error('Checkout failed:', error)
                // Error handling is already done in the hook
            }
        })
    }
    return (
        <div className="w-full flex-shrink-0 p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F68241] to-[#F3CA62] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
                <p className="text-gray-600">Complete your payment to secure your booking</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Property</span>
                        <span className="font-medium">{property.propertyName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Check-in</span>
                        <span className="font-medium">{bookingData.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Check-out</span>
                        <span className="font-medium">{bookingData.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Guests</span>
                        <span className="font-medium">{bookingData.guests} guests</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Nights</span>
                        <span className="font-medium">{bookingData.nights} nights</span>
                    </div>
                    <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount</span>
                            <span className="text-[#F68241]">₹{calculatedAmount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Amount Display */}
            <div className="bg-gradient-to-r from-[#F68241]/10 to-[#F3CA62]/10 border border-[#F68241]/20 rounded-xl p-6 mb-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Amount</h3>
                    <div className="text-4xl font-bold text-[#F68241] mb-2">
                        ₹{calculatedAmount}
                    </div>
                    <p className="text-sm text-gray-600">Including all taxes and fees</p>
                </div>
            </div>

            {/* Payment Method Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Secure Payment Processing</p>
                        <p className="text-sm text-gray-600">Your payment will be processed securely</p>
                    </div>
                </div>
            </div>

            {/* Pay Now Button */}
            <div className="text-center">
                <Button
                    onClick={handlePayNow}
                    disabled={checkoutMutation.isPending}
                    className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white px-12 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {checkoutMutation.isPending ? 'Processing...' : `Pay Now - ₹${calculatedAmount}`}
                </Button>
            </div>

        </div>
    )
}

export default PaymentDetailsSection