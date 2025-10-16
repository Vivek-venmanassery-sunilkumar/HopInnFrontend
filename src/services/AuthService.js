import { authApi } from "@/axios/auth.axios";

export const initiateSignUp = async (data)=>{
    try{
        const response = await authApi.post('auth/signup/initiate', {...data});
        if (response.status === 202){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}


export const verifyOTP = async (data)=>{
    try{
        const response = await authApi.post('auth/signup/otp-verify', {...data});
        if(response.status === 201){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}


export const retryOTP = async (data) =>{
    try{
        const response = await authApi.post('auth/signup/otp-retry', {...data});
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}


export const login  = async (data)=>{
    try{
        const response = await authApi.post('auth/login', {...data});
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}

export const googleLogin = async (data)=>{
    try{
        const response = await authApi.post('auth/google', data)
        if(response.status == 200){
        return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage)
    }
}
 