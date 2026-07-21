import React, {useState, useEffect, useCallback} from 'react'
import { AxiosError } from 'axios'
import tokenService from '@/app/tokenService'
import { decodeJwt, type UserRole } from '@/app/decodeJwt'
import { createFakeAccessToken } from '@/mocks/fakeJwt'
import { setCurrentUserRole } from '@/mocks/db'
import type { Login, AuthContextType } from '../types/authTypes'
import { AuthContext } from './authContext'

const SESSION_STORAGE_KEY = 'fracas.mock.session'

/** Demo logins for branch ui-build (no backend): username `admin`, `operator`,
 * or `resident` — any password. Anything else defaults to `resident`. */
const roleForUsername = (username: string): UserRole => {
    const normalized = username.trim().toLowerCase()
    if (normalized === 'admin') return 'admin'
    if (normalized === 'operator') return 'operator'
    return 'resident'
}

/** Reads the mock session out of localStorage (there's no refresh cookie in
 * mock mode), dropping it if expired. Synchronous, so the provider never
 * needs an "initializing" loading phase. */
const readStoredAccess = (): string | null => {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    const claims = decodeJwt(stored);
    if (claims?.exp && claims.exp * 1000 > Date.now()) return stored;
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
};

/** Mints the initial React state and syncs the non-React singletons
 * (tokenService, the mock db's "current user") in one pass, once, before the
 * first render — avoids a loading phase and an effect-based setState. */
const initializeSession = (): { access: string | null; role: UserRole } => {
    const access = readStoredAccess();
    const role = decodeJwt(access)?.role ?? 'resident';
    if (access) {
        tokenService.setAccess(access);
        setCurrentUserRole(role);
    }
    return { access, role };
};

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [initial] = useState(initializeSession);
    const [isAuthenticated, setAuthenticated] = useState<boolean>(initial.access !== null);
    const [role, setRole] = useState<UserRole>(initial.role);
    const [error, setError] = useState<AxiosError | null>(null);

    /** Store the access token and derive session state from its claims. */
    const applyAccess = useCallback((access: string): void => {
        tokenService.setAccess(access);
        const claims = decodeJwt(access);
        setRole(claims?.role ?? 'resident');
        setCurrentUserRole(claims?.role ?? 'resident');
        setAuthenticated(true);
    }, []);

    const clearAuth = useCallback((): void => {
        tokenService.clearAccess();
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        setRole('resident');
        setAuthenticated(false);
    }, []);

    useEffect(() => {
        window.addEventListener('fracas:session-expired', clearAuth);
        return () => window.removeEventListener('fracas:session-expired', clearAuth);
    }, [clearAuth]);

    const login = async (credentials: Login): Promise<void> => {
        setError(null);

        const access = createFakeAccessToken({
            user_id: 1,
            username: credentials.username,
            role: roleForUsername(credentials.username),
        });
        window.localStorage.setItem(SESSION_STORAGE_KEY, access);
        applyAccess(access);
    }

    const logout = async (): Promise<void> => {
        clearAuth();
    }

    const value: AuthContextType = {
        isAuthenticated,
        role,
        // Admins are a superset of operators, so operator-gated UI admits both.
        isOperator: role === 'operator' || role === 'admin',
        isAdmin: role === 'admin',
        // Session restore is synchronous in mock mode, so there's never a
        // loading gap — kept only because ProtectedRoute reads this field.
        isInitializing: false,
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