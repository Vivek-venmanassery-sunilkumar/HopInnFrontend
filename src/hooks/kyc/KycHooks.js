import { addKycDocuments, getKycDetails } from "@/services/kyc/KycService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAddKycDocuments(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addKycDocuments,
        onSuccess: (data)=>{
            queryClient.invalidateQueries({ queryKey: ['kycDetails'] });
            const message = data?.message || 'KYC documents submitted successfully'
            toast.success(message)
        },
        onError: (error)=>{
            const message = error.message || 'Failed to submit KYC documents'
            toast.error(message)
        }
    })
} 


export function useGetKycDetails(){
    return useQuery({
        queryKey: ['kycDetails'],
        queryFn: getKycDetails,
        onSuccess: (data)=>{
            toast.success("KYC details loaded successfully")
        },
        onError: (error)=>{
            const message = error?.message || 'Failed to load KYC details';
            toast.error(message)
        },
        retry: 1,
        staleTime: 5 *60 *1000,
    })
}