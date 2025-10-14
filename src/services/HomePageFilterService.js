import { authApi } from "@/axios/auth.axios";

// HomePage Filter Services - for both properties and guides search

export const searchProperties = async (filterParams) => {
    try {
        // Convert filter params to query string for properties (camelCase)
        // All parameters are mandatory for the filter to work properly
        const queryParams = new URLSearchParams()
        
        queryParams.append('destination', filterParams.destination || '')
        queryParams.append('guests', filterParams.guests || '')
        queryParams.append('fromDate', filterParams.fromDate || '')
        queryParams.append('toDate', filterParams.toDate || '')
        queryParams.append('latitude', filterParams.latitude || '')
        queryParams.append('longitude', filterParams.longitude || '')
        queryParams.append('childrenOnboard', filterParams.children_onboard || false)
        queryParams.append('all', filterParams.all || false)
        queryParams.append('page', filterParams.page || 1)
        queryParams.append('pageSize', filterParams.pageSize || 10)

        const response = await authApi.get(`search/properties?${queryParams.toString()}`)
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
        // All parameters are mandatory for the filter to work properly
        const queryParams = new URLSearchParams()
        
        queryParams.append('destination', filterParams.destination || '')
        queryParams.append('fromDate', filterParams.fromDate || '')
        queryParams.append('toDate', filterParams.toDate || '')
        queryParams.append('latitude', filterParams.latitude || '')
        queryParams.append('longitude', filterParams.longitude || '')
        queryParams.append('childrenOnboard', filterParams.children_onboard || false)
        queryParams.append('all', filterParams.all || false)
        queryParams.append('page', filterParams.page || 1)
        queryParams.append('pageSize', filterParams.pageSize || 10)

        const response = await authApi.get(`search/guides?${queryParams.toString()}`)
        if (response.status === 200) {
            return response.data
        }
        throw new Error("Failed to search guides")
    } catch (error) {
        const serverMessage = error.response?.data?.detail?.message
        throw new Error(serverMessage || error.message || 'Failed to search guides')
    }
}

