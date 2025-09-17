import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


export default function HostProtectedRoute({children}){
    const {isAuthenticated, user, isLoading} = useSelector((state)=>state.auth) 
    const location = useLocation()

    if(isLoading){
        return <div>loading...</div>
    }

    if(!isAuthenticated || !user.isHost || user.isHostBlocked){
        return <Navigate to='/home' state={({from: location})} replace/>
    }
    return children
}