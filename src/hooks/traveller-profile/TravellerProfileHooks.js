import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileDetails, updateProfileDetails } from "@/services/traveller-profile/TravellerProfileService";
import {toast} from 'react-hot-toast'


export const useProfile=(options={})=>{
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfileDetails,
        onSuccess:(data)=>{
            toast.success("Profile loaded successfuly")
        },
        onError: (error)=>{
            const message = error?.message || 'Failed to load profile';
            toast.error(message)
        },
        retry: 1,
        staleTime: 5 *60 *1000,
        ...options,
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateProfileDetails,
        onSuccess: (data) => {
            toast.success("Profile updated successfully");
            // Invalidate and refetch profile data
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error) => {
            const message = error?.message || 'Failed to update profile';
            toast.error(message);
        },
    });
};