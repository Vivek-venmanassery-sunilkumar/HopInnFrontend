import { getUsersByRole, updateTravellerStatus, updateGuideStatus, updateHostStatus } from "@/services/UserManagementService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetUsersByRole(role) {
    return useQuery({
        queryKey: ['usersByRole', role],
        queryFn: () => getUsersByRole(role),
        enabled: !!role,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdateTravellerStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ email, isActive }) => updateTravellerStatus(email, isActive),
        onSuccess: (data, variables) => {
            // Invalidate all user role queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['usersByRole'] });
            const message = data?.message || 'Traveller status updated successfully';
            toast.success(message);
        },
        onError: (error) => {
            const message = error.message || 'Failed to update traveller status';
            toast.error(message);
        }
    });
}

export function useUpdateGuideStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ email, isBlocked }) => updateGuideStatus(email, isBlocked),
        onSuccess: (data, variables) => {
            // Invalidate all user role queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['usersByRole'] });
            const message = data?.message || 'Guide status updated successfully';
            toast.success(message);
        },
        onError: (error) => {
            // Check if it's the specific inactive user error
            if (error.message.includes('User account must be active first')) {
                toast.error('Cannot unblock guide privileges for inactive user. User account must be activated first.');
            } else {
                const message = error.message || 'Failed to update guide status';
                toast.error(message);
            }
        }
    });
}

export function useUpdateHostStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ email, isBlocked }) => updateHostStatus(email, isBlocked),
        onSuccess: (data, variables) => {
            // Invalidate all user role queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['usersByRole'] });
            const message = data?.message || 'Host status updated successfully';
            toast.success(message);
        },
        onError: (error) => {
            // Check if it's the specific inactive user error
            if (error.message.includes('User account must be active first')) {
                toast.error('Cannot unblock host privileges for inactive user. User account must be activated first.');
            } else {
                const message = error.message || 'Failed to update host status';
                toast.error(message);
            }
        }
    });
}
