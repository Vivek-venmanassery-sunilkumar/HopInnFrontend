import { authApi } from "@/axios/auth.axios";

export const getUsersByRole = async (role) => {
    try {
        const response = await authApi.get(`admin/users?role=${role}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        const serverMessage = error.response?.data?.detail;
        throw new Error(serverMessage || error.message);
    }
};

export const updateTravellerStatus = async (email, isActive) => {
    try {
        const response = await authApi.put(`admin/users/traveller/status`, {
            email,
            is_active: isActive,
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        const serverMessage = error.response?.data?.detail;
        throw new Error(serverMessage || error.message);
    }
};

export const updateGuideStatus = async (email, isBlocked) => {
    try {
        const response = await authApi.put(`admin/users/guide/status`, {
            email,
            is_blocked: isBlocked,
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        const serverMessage = error.response?.data?.detail;
        throw new Error(serverMessage || error.message);
    }
};

export const updateHostStatus = async (email, isBlocked) => {
    try {
        const response = await authApi.put(`admin/users/host/status`, {
            email,
            is_blocked: isBlocked,
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        const serverMessage = error.response?.data?.detail;
        throw new Error(serverMessage || error.message);
    }
};
