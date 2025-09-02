import { addKycDocuments, approveKyc, getKycDetails, getKycDetailsAdmin, rejectKyc } from "@/services/kyc/KycService";
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
        retry: 1,
        staleTime: 5 *60 *1000,
    })
}

export function useGetKycDetailsAdmin(params){
    return useQuery({
        queryKey: ['kycDetailsAdmin', params.status, params.page],
        queryFn: ()=>getKycDetailsAdmin(params),
    })
}

export function useApproveKyc(status, page){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveKyc,
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: ['kycDetailsAdmin', status, page]
            });
            toast.success('Kyc data approved successfully') 
        },
        onError: (error)=>{
            const message = error?.message
            toast.error(message)
        }
    })
}

export function useRejectKyc(status, page){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectKyc,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['kycDetailsAdmin', status, page]})
            toast.success('Kyc data rejected successfully')
        },
        onError: (error)=>{
            const message = error?.message
            toast.error(message)
        }
    })
}