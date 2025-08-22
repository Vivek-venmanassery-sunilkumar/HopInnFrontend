import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth)
    const location = useLocation()

    if(isLoading){
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        // Redirect to login page with the return url
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return children
}
