import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    getTravellers,
    getGuides,
    getHosts,
    deactivateTraveller,
    removeHostPrivileges,
    removeGuidePrivileges,
    getUserDetails,
    reactivateTraveller,
    reinstateHostPrivileges,
    reinstateGuidePrivileges
} from '@/services/AdminUserManagementService';

// Query hooks for fetching users by role
export function useTravellers() {
    return useQuery({
        queryKey: ['admin', 'travellers'],
        queryFn: getTravellers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });
}

export function useGuides() {
    return useQuery({
        queryKey: ['admin', 'guides'],
        queryFn: getGuides,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });
}

export function useHosts() {
    return useQuery({
        queryKey: ['admin', 'hosts'],
        queryFn: getHosts,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });
}

export function useUserDetails(userId) {
    return useQuery({
        queryKey: ['admin', 'user', userId],
        queryFn: () => getUserDetails(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });
}

// Mutation hooks for user actions
export function useDeactivateTraveller() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deactivateTraveller,
        onSuccess: (data) => {
            const message = data?.message || 'Traveller deactivated successfully';
            toast.success(message);
            // Invalidate and refetch travellers data
            queryClient.invalidateQueries({ queryKey: ['admin', 'travellers'] });
        },
        onError: (error) => {
            const message = error.message || 'Failed to deactivate traveller';
            console.error(message);
            toast.error(message);
        }
    });
}

export function useRemoveHostPrivileges() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: removeHostPrivileges,
        onSuccess: (data) => {
            const message = data?.message || 'Host privileges removed successfully';
            toast.success(message);
            // Invalidate and refetch hosts data
            queryClient.invalidateQueries({ queryKey: ['admin', 'hosts'] });
        },
        onError: (error) => {
            const message = error.message || 'Failed to remove host privileges';
            console.error(message);
            toast.error(message);
        }
    });
}

export function useRemoveGuidePrivileges() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: removeGuidePrivileges,
        onSuccess: (data) => {
            const message = data?.message || 'Guide privileges removed successfully';
            toast.success(message);
            // Invalidate and refetch guides data
            queryClient.invalidateQueries({ queryKey: ['admin', 'guides'] });
        },
        onError: (error) => {
            const message = error.message || 'Failed to remove guide privileges';
            console.error(message);
            toast.error(message);
        }
    });
}


export function useReactivateTraveller() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: reactivateTraveller,
        onSuccess: (data) => {
            const message = data?.message || 'Traveller reactivated successfully';
            toast.success(message);
            // Invalidate and refetch travellers data
            queryClient.invalidateQueries({ queryKey: ['admin', 'travellers'] });
        },
        onError: (error) => {
            const message = error.message || 'Failed to reactivate traveller';
            console.error(message);
            toast.error(message);
        }
    });
}

export function useReinstateHostPrivileges() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: reinstateHostPrivileges,
        onSuccess: (data) => {
            const message = data?.message || 'Host privileges reinstated successfully';
            toast.success(message);
            // Invalidate and refetch hosts data
            queryClient.invalidateQueries({ queryKey: ['admin', 'hosts'] });
        },
        onError: (error) => {
            const message = error.message || 'Failed to reinstate host privileges';
            console.error(message);
            toast.error(message);
        }
    });
}

export function useReinstateGuidePrivileges() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: reinstateGuidePrivileges,
        onSuccess: (data) => {
            const message = data?.message || 'Guide privileges reinstated successfully';
            toast.success(message);
            // Invalidate and refetch guides data
            queryClient.invalidateQueries({ queryKey: ['admin', 'guides'] });
        },
        onError: (error) => {
            const message = error.message || 'Failed to reinstate guide privileges';
            console.error(message);
            toast.error(message);
        }
    });
}
