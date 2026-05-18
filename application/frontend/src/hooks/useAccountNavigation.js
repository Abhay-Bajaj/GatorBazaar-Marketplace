import { useNavigate } from 'react-router-dom'

export default function useAccountNavigation({ isSignedIn, setLoginModalOpen }) {

    const navigate = useNavigate()

    function handleAccountClick() {
        if (isSignedIn) {
            navigate('/account')
        } else {
            setLoginModalOpen(true)
        }
    }

    return {
        handleAccountClick,
    }
}