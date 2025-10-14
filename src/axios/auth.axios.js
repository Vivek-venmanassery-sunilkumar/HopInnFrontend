import axios from 'axios'
import { store } from '@/redux/store'
import { logout } from '@/redux/slices/authSlice'

const authApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

// Create a separate axios instance for retries to avoid interceptor loops
const retryAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    
    failedQueue = []
}

// Request interceptor
authApi.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
authApi.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Only handle 401 errors and avoid infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('401 error detected, checking if we should attempt refresh...', {
                url: originalRequest.url,
                retry: originalRequest._retry,
                isRefreshing: isRefreshing
            })
            
            // Additional safety check - if this request is already marked as a retry, don't process it
            if (originalRequest._isRetry) {
                console.log('This is already a retry request, not processing...')
                return Promise.reject(error)
            }
            
            // Don't try to refresh for auth-related endpoints (login, signup, etc.)
            if (originalRequest.url?.includes('/auth/') && !originalRequest.url?.includes('/auth/refresh')) {
                console.log('Auth endpoint failed, not attempting refresh...')
                return Promise.reject(error)
            }
            
            // Check if this is a refresh token request itself - avoid infinite loop
            if (originalRequest.url?.includes('/auth/refresh')) {
                console.log('Refresh token request failed, no refresh token available...')
                store.dispatch(logout())
                window.location.href = '/auth'
                return Promise.reject(error)
            }
            
            if (isRefreshing) {
                // If already refreshing, queue the request
                console.log('Token refresh already in progress, queuing request...')
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    // Mark the retry request to prevent infinite loops
                    originalRequest._isRetry = true
                    // Use retryAxios to avoid triggering the interceptor again
                    return retryAxios(originalRequest)
                }).catch(err => {
                    return Promise.reject(err)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                console.log('Attempting to refresh token...')
                // Call refresh endpoint directly to avoid circular dependency
                const refreshResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {}, {
                    withCredentials: true
                })
                console.log('Token refreshed successfully, retrying original request...')
                processQueue(null)
                // Mark the retry request to prevent infinite loops
                originalRequest._isRetry = true
                // Use retryAxios to avoid triggering the interceptor again
                return retryAxios(originalRequest)
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                processQueue(refreshError, null)
                // If refresh fails, logout the user
                store.dispatch(logout())
                // Redirect to login page
                window.location.href = '/auth'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export { authApi }