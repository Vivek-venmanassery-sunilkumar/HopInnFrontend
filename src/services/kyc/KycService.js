import {authApi} from "@/axios/auth.axios";

export const addKycDocuments = async(kycData)=>{
    try{
        const response = await authApi.post('/kyc/add', kycData);
        if (response.status === 200){
            return response.data
        }
        throw new Error('Failed to submit KYC documents');
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to submit KYC documents')
    }
}

export const getKycDetails = async()=>{
    try{
        const response = await authApi.get('/kyc/get');
        if (response.status === 200){
            return response.data
        }
        throw new Error('Failed to fetch KYC details');
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to fetch KYC details')
    }
}