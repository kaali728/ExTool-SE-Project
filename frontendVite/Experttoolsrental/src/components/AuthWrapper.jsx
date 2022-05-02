import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSigninCheck } from 'reactfire'

function AuthWrapper({ children }) {
    const { data: signinResult } = useSigninCheck()

    let navigate = useNavigate()

    useEffect(() => {
        console.log('CHECK IF THE USER IS AUTH')
        if (signinResult.signedIn === true) {
            navigate('/')
        } else {
            navigate('/login')
        }
    }, [signinResult.signedIn])
    return children
}

export default AuthWrapper
