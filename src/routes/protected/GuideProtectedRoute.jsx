import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


export default function GuideProtectedRoute({children}){
    const {isAuthenticated, user, isLoading} = useSelector((state)=>state.auth) 
    const location = useLocation()

    if(isLoading){
        return <div>loading...</div>
    }

    if(!isAuthenticated || !user.isGuide || user.isGUideBlocked){
        return <Navigate to='/home' state={({from: location})} replace/>
    }
    return children
}