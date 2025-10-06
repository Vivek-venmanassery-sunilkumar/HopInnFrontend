import { authApi } from "@/axios/auth.axios";

// HomePage Filter Services - for both properties and guides search

export const searchProperties = async (filterParams) => {
    try {
        // Convert filter params to query string for properties (camelCase)
        const queryParams = new URLSearchParams()
        
        if (filterParams.destination) {
            queryParams.append('destination', filterParams.destination)
        }
        if (filterParams.guests) {
            queryParams.append('guests', filterParams.guests)
        }
        if (filterParams.fromDate) {
            queryParams.append('fromDate', filterParams.fromDate)
        }
        if (filterParams.toDate) {
            queryParams.append('toDate', filterParams.toDate)
        }
        if (filterParams.latitude) {
            queryParams.append('latitude', filterParams.latitude)
        }
        if (filterParams.longitude) {
            queryParams.append('longitude', filterParams.longitude)
        }

        const response = await authApi.get(`property/search?${queryParams.toString()}`)
        if (response.status === 200) {
            return response.data
        }
        throw new Error("Failed to search properties")
    } catch (error) {
        const serverMessage = error.response?.data?.detail?.message
        throw new Error(serverMessage || error.message || 'Failed to search properties')
    }
}

export const searchGuides = async (filterParams) => {
    try {
        // Convert filter params to query string for guides (camelCase)
        const queryParams = new URLSearchParams()
        
        if (filterParams.destination) {
            queryParams.append('destination', filterParams.destination)
        }
        if (filterParams.fromDate) {
            queryParams.append('fromDate', filterParams.fromDate)
        }
        if (filterParams.toDate) {
            queryParams.append('toDate', filterParams.toDate)
        }
        if (filterParams.latitude) {
            queryParams.append('latitude', filterParams.latitude)
        }
        if (filterParams.longitude) {
            queryParams.append('longitude', filterParams.longitude)
        }

        const response = await authApi.get(`guide/search?${queryParams.toString()}`)
        if (response.status === 200) {
            return response.data
        }
        throw new Error("Failed to search guides")
    } catch (error) {
        const serverMessage = error.response?.data?.detail?.message
        throw new Error(serverMessage || error.message || 'Failed to search guides')
    }
}

