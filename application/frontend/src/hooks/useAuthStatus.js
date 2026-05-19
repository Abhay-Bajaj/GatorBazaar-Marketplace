import { useEffect, useState } from 'react'

export default function useAuthStatus() {

    const [isSignedIn, setIsSignedIn] = useState(false)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("/auth/checkLoggedUser", {
                    credentials: 'include'
                })

                const data = await res.json()

                setIsSignedIn(data.authenticated)
            } catch {
                setIsSignedIn(false)
            } finally {
                setLoadingAuth(false)
            }
        }

        checkAuth()
    }, [])

    return {
        isSignedIn,
        loadingAuth
    }
}