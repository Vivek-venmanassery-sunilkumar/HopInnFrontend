import { GuideOnBoard } from "@/services/GuideService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";



export function useGuideOnboard(){
    return useMutation({
        mutationFn: GuideOnBoard,
        onSuccess: (data)=>{
            const message = data?.message || "Guide onboarding successfull"
            toast.success(message)
        },
        onError: (error)=>{
            const message = error.message || "Guide onboarding failed"
            console.log(message)
            toast.error(message)
        }
    })
}