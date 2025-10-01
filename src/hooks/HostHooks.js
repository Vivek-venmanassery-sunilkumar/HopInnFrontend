import { HostOnBoard, fetchHostProfile, editHostProfile } from "@/services/HostService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useFetchHostProfile(){
    return useQuery({
        queryKey: ['hostprofile'],
        queryFn: fetchHostProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes  
    })
}

export function useUpdateHostProfile(){
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: editHostProfile,
        onSuccess: (data) => {
            const message = data?.message || "Host profile updated successfully";
            toast.success(message);
            // Invalidate and refetch host profile data
            queryClient.invalidateQueries({ queryKey: ['hostprofile'] });
        },
        onError: (error) => {
            const message = error.message || "Failed to update host profile";
            console.error(message);
            toast.error(message);
        }
    });
}