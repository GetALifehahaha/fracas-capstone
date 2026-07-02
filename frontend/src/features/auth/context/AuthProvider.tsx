import React, {useState, useEffect, useCallback} from 'react'
import axios, { AxiosError } from 'axios'
import tokenService from '@/app/tokenService'
import apiClient from '@/app/apiClient'
import { decodeJwt, type UserRole } from '@/app/decodeJwt'
import type { Login, AuthContextType } from '../types/authTypes'
import { AuthContext } from './authContext'

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<UserRole>('resident');
    const [isInitializing, setInitializing] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | null>(null);

    /** Store the access token and derive session state from its claims. */
    const applyAccess = useCallback((access: string): void => {
        tokenService.setAccess(access);
        setRole(decodeJwt(access)?.role ?? 'resident');
        setAuthenticated(true);
    }, []);

    const clearAuth = useCallback((): void => {
        tokenService.clearAccess();
        setRole('resident');
        setAuthenticated(false);
    }, []);

    useEffect(() => {
        const initializeAuth = async (): Promise<void> => {
            setInitializing(true);
            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/jwt/refresh/`,
                    {},
                    { withCredentials: true }
                );
                applyAccess(data.access);
            } catch {
                clearAuth();
            } finally {
                setInitializing(false);
            }
        };

        initializeAuth();
    }, [applyAccess, clearAuth]);

    useEffect(() => {
        window.addEventListener('fracas:session-expired', clearAuth);
        return () => window.removeEventListener('fracas:session-expired', clearAuth);
    }, [clearAuth]);

    const login = async (credentials: Login): Promise<void> => {
        setError(null);

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/jwt/create/`,
                credentials,
                { withCredentials: true }
            );

            applyAccess(data.access);
        } catch (error) {
            setError(error as AxiosError);
            throw error;
        }
    }

    const logout = async (): Promise<void> => {
        try {
            await apiClient.post('/api/auth/logout/', {}, { withCredentials: true });
        } finally {
            clearAuth();
        }
    }

    const value: AuthContextType = {
        isAuthenticated,
        role,
        // Admins are a superset of operators, so operator-gated UI admits both.
        isOperator: role === 'operator' || role === 'admin',
        isAdmin: role === 'admin',
        isInitializing,
        error,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}