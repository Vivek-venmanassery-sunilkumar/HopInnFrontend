import { authApi } from "@/axios/auth.axios"



export const guideOnBoard = async (data) =>{
    try{
        const response =await authApi.post('/onboard/guide', {...data});
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}

export const fetchGuideProfile = async()=>{
    try{
        const response = await authApi.get('/guide-profile/detail');
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}

export const updateGuideProfile = async(data)=>{
    try{
        const response = await authApi.put('/gide-profile/update', {...data});
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}