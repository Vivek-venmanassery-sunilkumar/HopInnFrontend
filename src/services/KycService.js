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
        console.log("I am inside the getKycDetails gonna pass the data to the hook")
        if (response.status === 200){
            return response.data
        }
        throw new Error('Failed to fetch KYC details');
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to fetch KYC details')
    }
}

export const getKycDetailsAdmin = async(params)=>{
    try{
        const response = await authApi.get(`/kyc/get-admin/`,{
            params: {
                status: params.status,
                page: params.page || 1,
                limit:10 
            }
        })
        if(response.status == 200){
            return response.data
        }
        throw new Error('Failed to fetch KYC details');
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to fetch KYC details')
    }
};

export const approveKyc = async(userId)=>{
    try{
        const response = await authApi.put('/kyc/accept-kyc', userId);
        if(response.status == 200){
            return response.data
        }
        throw new Error('Failed to approve the KYC details')
    }catch(error){
        const serverMessage = error.response?.data?.detial?.message;
        throw new Error(serverMessage || error.message || 'Failed to approve KYC detials')
    }
}

export const rejectKyc = async(data)=>{
    try{
        const response = await authApi.put('/kyc/reject-kyc', data);
        if(response.status == 200){
            return response.data
        }
        throw new Error('Failed to reject the kyc details')
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message || 'Failed to reject KYC detials')
    }
}