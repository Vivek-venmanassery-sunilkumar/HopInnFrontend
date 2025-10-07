import { authApi } from "@/axios/auth.axios";


export const addProperty = async (propertyData)=>{
    try{
        const response = await authApi.post('property/add', propertyData)
        if(response.status === 200){
            return response.data
        }
        throw new Error('Failed to add property');
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to add property')
    }
}

export const getPropertiesHost = async ()=>{
    try{
        const response = await authApi.get('property/get')
        if(response.status === 200){
            return response.data
        }
        throw new Error("Failed to get properties");
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to get properties')
    }
}

export const editPropertyDetails = async (data)=>{
    try{
        const response = await authApi.put('property/edit', data)
        if(response.status === 200){
            return response.data
        }
        throw new Error("Failed to edit the property")
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to edit property') 
    }
}

export const getPropertyById = async (propertyId) => {
    try {
        const response = await authApi.get(`property/get_by_id/${propertyId}`)
        if(response.status === 200){
            return response.data
        }
        throw new Error("Failed to get property details");
    } catch(error) {
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to get property details')
    }
}