import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


export default function AdminProtectedRoute({children}){
    const {isAuthenticated, user, isLoading} = useSelector((state)=>state.auth) 
    const location = useLocation()

    if(isLoading){
        return <div>loading...</div>
    }

    if(!isAuthenticated || !user.isAdmin){
        return <Navigate to='/auth' state={({from: location})} replace/>
    }
    return children
}