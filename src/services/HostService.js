import { authApi } from "@/axios/auth.axios"



export const HostOnBoard = async (data) =>{
    try{
        const response =await authApi.post('/onboard/host', {...data});
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}

export const fetchHostProfile = async ()=>{
    try{
        const response = await authApi.get('/host-profile/detail')
        if (response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}


export const editHostProfile = async (data) =>{
    try{
        const response = await authApi.put('/host-profile/update', {...data});
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        const serverMessage = error.response?.data?.detail?.message;
        throw new Error(serverMessage || error.message)
    }
}