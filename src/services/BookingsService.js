import { authApi } from "@/axios/auth.axios";

export const checkPropertyBooking = async (bookingData) => {
    try {
        const response = await authApi.post('booking-properties/check', bookingData)
        if (response.status === 200) {
            return response.data
        }
        throw new Error("Failed to check property booking")
    } catch (error) {
        const serverMessage = error.response?.data?.detail?.message
        throw new Error(serverMessage || error.message || 'Failed to check property booking')
    }
}

export const checkoutPropertyBooking = async (bookingData)=>{
    try{
        const response = await authApi.post('booking-properties/checkout', bookingData)
        if(response.status === 200){
            return response.data
        }
        throw new Error("Failed to checkout property booking")
    } catch (error) {
        const serverMessage = error.response?.data?.detail?.message
        throw new Error(serverMessage || error.message || 'Failed to checkout property booking')
    }
}