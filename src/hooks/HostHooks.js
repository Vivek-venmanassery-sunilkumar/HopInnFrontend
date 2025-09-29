import { HostOnBoard } from "@/services/HostService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchHostProfile } from "@/services/HostService";
import { useQuery } from "@tanstack/react-query";



export function useHostOnboard(){
    return useMutation({
        mutationFn: HostOnBoard,
        onSuccess: (data)=>{
            const message = data?.message || "Host onboarding successfull"
            toast.success(message)
        },
        onError: (error)=>{
            const message = error.message || "Host onboarding failed"
            console.log(message)
            toast.error(message)
        }
    })
}

export function useFetchHostProfile(){
    return useQuery({
        queryKey: ['hostprofile'],
        queryFn: fetchHostProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes  
    })
}