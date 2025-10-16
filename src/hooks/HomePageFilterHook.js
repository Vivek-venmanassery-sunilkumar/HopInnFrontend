import { useQuery } from "@tanstack/react-query"
import { searchProperties, searchGuides } from "@/services/HomePageFilterService"
import toast from "react-hot-toast"

// HomePage Filter Hooks - for both properties and guides search

export function useSearchProperties(filterParams, enabled = false){
    return useQuery({
        queryKey: ["searchProperties", filterParams],
        queryFn: () => searchProperties(filterParams),
        enabled: enabled && (!!(filterParams?.destination || filterParams?.fromDate || filterParams?.toDate) || filterParams?.all === true),
        staleTime: 5 * 60 * 1000, // 5 minutes
        onSuccess: (data) => {
            const message = data?.message || 'Properties found successfully'
            toast.success(message)
        },
        onError: (error) => {
            const message = error.message || 'Failed to search properties'
            toast.error(message)
        }
    })
}

export function useSearchGuides(filterParams, enabled = false){
    return useQuery({
        queryKey: ["searchGuides", filterParams],
        queryFn: () => searchGuides(filterParams),
        enabled: enabled && (!!(filterParams?.destination || filterParams?.latitude || filterParams?.longitude) || filterParams?.all === true),
        staleTime: 5 * 60 * 1000, // 5 minutes
        onSuccess: (data) => {
            const message = data?.message || 'Guides found successfully'
            toast.success(message)
        },
        onError: (error) => {
            const message = error.message || 'Failed to search guides'
            toast.error(message)
        }
    })
}

