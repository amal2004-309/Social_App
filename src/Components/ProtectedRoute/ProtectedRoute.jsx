import React from 'react'
import { Navigate } from 'react-router-dom'
import toast from "react-hot-toast";

export default function ProtectedRoute({children}) {

    if (localStorage.getItem('token') == null) {
        toast.error('Login first please!!');
        return <Navigate to='/login'/>
    }

    return (
        <>
            {children}
        </>
    )
}
