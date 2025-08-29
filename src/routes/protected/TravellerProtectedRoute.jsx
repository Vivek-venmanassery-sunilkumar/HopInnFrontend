import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function TravellerProtectedRoute({ children }) {
    const { isAuthenticated, isBlocked, isLoading } = useSelector((state) => state.auth)
    const location = useLocation()

    if(isLoading){
        return <div>Loading...</div>
    }

    if (!isAuthenticated || isBlocked) {
        // Redirect to login page with the return url
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return children
}
