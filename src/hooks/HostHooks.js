import { HostOnBoard } from "@/services/HostService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";



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