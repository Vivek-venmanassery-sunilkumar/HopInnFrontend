import { Navigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import HotelFillingLoader from '@/components/ui/HotelFillingLoader'
import { fetchUserRoles } from '@/redux/slices/authSlice'

export default function TravellerProtectedRoute({ children }) {
    const { isAuthenticated, isBlocked, isLoading } = useSelector((state) => state.auth)
    const location = useLocation()
    const dispatch = useDispatch()

    // Fetch user roles when component mounts (only for protected routes)
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            dispatch(fetchUserRoles())
        }
    }, [dispatch, isAuthenticated, isLoading])

    // Show loading while checking authentication
    if(isLoading || (!isAuthenticated && !isBlocked)){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F68241]/10 to-[#2D5016]/10">
                <HotelFillingLoader 
                    size="md"
                    showMessage={false}
                />
            </div>
        )
    }

    // Only redirect if we're sure the user is not authenticated (after loading is complete)
    if (!isAuthenticated || isBlocked) {
        // Redirect to login page with the return url
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return children
}
