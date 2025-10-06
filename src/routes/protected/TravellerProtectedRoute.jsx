import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HotelFillingLoader from '@/components/ui/HotelFillingLoader'

export default function TravellerProtectedRoute({ children }) {
    const { isAuthenticated, isBlocked, isLoading } = useSelector((state) => state.auth)
    const location = useLocation()

    if(isLoading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F68241]/10 to-[#2D5016]/10">
                <HotelFillingLoader 
                    size="md"
                    showMessage={false}
                />
            </div>
        )
    }

    if (!isAuthenticated || isBlocked) {
        // Redirect to login page with the return url
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return children
}
