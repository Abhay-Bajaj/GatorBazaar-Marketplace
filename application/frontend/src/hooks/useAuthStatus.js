import { useEffect, useState } from 'react'

export default function useAuthStatus() {

    const [isSignedIn, setIsSignedIn] = useState(false)

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("http://localhost:3000/auth/checkLoggedUser", {
                    credentials: 'include'
                })

                const data = await res.json()

                setIsSignedIn(data.authenticated)
            } catch {
                setIsSignedIn(false)
            }
        }

        checkAuth()
    }, [])

    return {
        isSignedIn
    }
}