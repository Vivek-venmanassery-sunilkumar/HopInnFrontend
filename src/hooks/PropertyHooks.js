import { useMutation, useQuery } from "@tanstack/react-query"
import { addProperty, getPropertiesHost, editPropertyDetails } from "@/services/PropertyService"
import toast from "react-hot-toast"


export function useAddProperty(){
    return useMutation({
        mutationFn: addProperty,
        onSuccess: (data)=>{
            const message = data?.message || 'Property added successfully'
            toast.success(message)
        },
        onError: (error)=>{
            const message = error.message || 'Failed to add property'
            toast.error(message)
        }
    })
} 

export function useFetchProperties(){
    return useQuery({
        queryKey: ["properties-host"],
        queryFn:getPropertiesHost,
        staleTime: 5*60*1000
    })
}

export function useUpdatePropertyDetails(){
    return useMutation({
        mutationFn:editPropertyDetails,
        onSuccess: (data)=>{
            const message = data?.message || 'Property details updated successfully'
            toast.success(message)
        },
        onError: (error)=>{
            const message = error.message || 'Failed to update property details'
            toast.error(message)
        }
    })
}


