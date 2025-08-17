import axios from 'axios'


const authApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export {authApi}