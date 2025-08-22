import { authApi } from "@/axios/auth.axios";

export const getProfileDetails = async()=>{
    try{
        const response = await authApi.get('/profile/detail');
        if (response.status === 200){
            return response.data
        }
        throw new Error('Failed to fetch profile details');
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to fetch profile details')
    }
}

export const updateProfileDetails = async (profileData) => {
    try {
        const response = await authApi.put('/profile/update', profileData);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to update profile details');
    } catch (error) {
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to update profile details');
    }
}
