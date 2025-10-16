import { useMutation } from "@tanstack/react-query"
import { checkPropertyBooking, checkoutPropertyBooking } from "@/services/BookingsService"
import toast from "react-hot-toast"


export function useCheckPropertyBooking() {
    return useMutation({
        mutationFn: checkPropertyBooking,
        onSuccess: (data) => {
            const message = data?.message || 'Property is available for booking'
        },
        onError: (error) => {
            const message = error.message || 'Failed to check property booking'
            toast.error(message)
        }
    })
}

export function useCheckoutPropertyBooking() {
    return useMutation({
        mutationFn: checkoutPropertyBooking,
        onSuccess: (data) => {
            const message = data?.message || 'Booking completed successfully!'
            toast.success(message)
        },
        onError: (error) => {
            const message = error.message || 'Failed to complete checkout'
            toast.error(message)
        }
    })
}