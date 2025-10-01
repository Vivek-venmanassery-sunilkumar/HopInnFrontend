import { authApi } from '@/axios/auth.axios';

// Get all travellers
export const getTravellers = async () => {
    try {
        const response = await authApi.get('/admin/users/travellers');
        return response.data;
    } catch (error) {
        console.error('Error fetching travellers:', error);
        throw new Error('Failed to fetch travellers');
    }
};

// Get all guides
export const getGuides = async () => {
    try {
        const response = await authApi.get('/admin/users/guides');
        return response.data;
    } catch (error) {
        console.error('Error fetching guides:', error);
        throw new Error('Failed to fetch guides');
    }
};

// Get all hosts
export const getHosts = async () => {
    try {
        const response = await authApi.get('/admin/users/hosts');
        return response.data;
    } catch (error) {
        console.error('Error fetching hosts:', error);
        throw new Error('Failed to fetch hosts');
    }
};

// Deactivate traveller account
export const deactivateTraveller = async (userId) => {
    try {
        const response = await authApi.put(`/admin/users/travellers/${userId}/deactivate`);
        return response.data;
    } catch (error) {
        console.error('Error deactivating traveller:', error);
        throw new Error('Failed to deactivate traveller');
    }
};

// Remove host privileges
export const removeHostPrivileges = async (userId) => {
    try {
        const response = await authApi.put(`/admin/users/hosts/${userId}/remove-privileges`);
        return response.data;
    } catch (error) {
        console.error('Error removing host privileges:', error);
        throw new Error('Failed to remove host privileges');
    }
};

// Remove guide privileges
export const removeGuidePrivileges = async (userId) => {
    try {
        const response = await authApi.put(`/admin/users/guides/${userId}/remove-privileges`);
        return response.data;
    } catch (error) {
        console.error('Error removing guide privileges:', error);
        throw new Error('Failed to remove guide privileges');
    }
};

// Get user details
export const getUserDetails = async (userId) => {
    try {
        const response = await authApi.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw new Error('Failed to fetch user details');
    }
};


// Reactivate traveller account
export const reactivateTraveller = async (userId) => {
    try {
        const response = await authApi.put(`/admin/users/travellers/${userId}/reactivate`);
        return response.data;
    } catch (error) {
        console.error('Error reactivating traveller:', error);
        throw new Error('Failed to reactivate traveller');
    }
};

// Reinstate host privileges
export const reinstateHostPrivileges = async (userId) => {
    try {
        const response = await authApi.put(`/admin/users/hosts/${userId}/reinstate-privileges`);
        return response.data;
    } catch (error) {
        console.error('Error reinstating host privileges:', error);
        throw new Error('Failed to reinstate host privileges');
    }
};

// Reinstate guide privileges
export const reinstateGuidePrivileges = async (userId) => {
    try {
        const response = await authApi.put(`/admin/users/guides/${userId}/reinstate-privileges`);
        return response.data;
    } catch (error) {
        console.error('Error reinstating guide privileges:', error);
        throw new Error('Failed to reinstate guide privileges');
    }
};
