import { guideOnBoard, fetchGuideProfile, updateGuideProfile } from "@/services/GuideService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";



export function useGuideOnboard(){
    return useMutation({
        mutationFn: guideOnBoard,
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

export function useFetchGuideProfile(){
    return useQuery({
        queryKey: ['guideProfile'],
        queryFn: fetchGuideProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes  
    })
}

export function useUpdateGuideProfile(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateGuideProfile,
        onSuccess: (data)=>{
            const message = data?.message|| "Updated successfully"
            toast.success(message)
            queryClient.invalidateQueries({qyeryKey:['guideProfile']})
        },
        onError: (error)=>{
            const message = error.message || 'Updation failed'
            console.log(message)
            toast.error(message)
        }
    })
}