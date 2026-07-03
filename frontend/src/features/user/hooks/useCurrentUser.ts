import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { changePassword, getCurrentUser, updateCurrentUser } from '../api/userApi'
import type { CurrentUser } from '../types'

/** Query key for the signed-in user's profile. */
export const currentUserKey = ['currentUser'] as const

/** The signed-in user's profile. Cached app-wide (Header + AccountPage share it). */
export const useCurrentUser = () =>
    useQuery({
        queryKey: currentUserKey,
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
    })

/** Edit name/email; primes the cache with the server's echo. */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateCurrentUser,
        onSuccess: (user: CurrentUser) => {
            queryClient.setQueryData(currentUserKey, user)
        },
    })
}

/** Change the account password. */
export const useChangePassword = () =>
    useMutation({
        mutationFn: changePassword,
    })
