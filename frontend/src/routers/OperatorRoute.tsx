import { useAuth } from '@/features/auth/context/useAuth'
import { Navigate } from 'react-router-dom'
import React from 'react'

/**
 * Gate operator-only console routes. Assumes an authenticated user (nest inside
 * `ProtectedRoute`); a signed-in resident is bounced to the dashboard. The API
 * remains the real gate — this only hides UI they can't use.
 */
const OperatorRoute = ({ children }: { children: React.ReactNode }) => {
    const { isOperator } = useAuth()
    return isOperator ? children : <Navigate to={'/'} replace />
}

export default OperatorRoute
