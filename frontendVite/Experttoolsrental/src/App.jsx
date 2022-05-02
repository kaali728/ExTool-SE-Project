import { Route, Routes } from 'react-router-dom'
import Login from './components/pages/auth/Login'
import Signup from './components/pages/auth/Signup'
import Dashboard from './components/pages/Dashboard'
import '@findnlink/neuro-ui/lib/style.css'
import { StoreProvider } from '@findnlink/neuro-ui'
import ForgetPassword from './components/pages/auth/ForgetPassword'
import { AuthProvider, useFirebaseApp, useInitPerformance } from 'reactfire'
import { getAuth } from 'firebase/auth'
import AuthWrapper from './components/AuthWrapper'

function App() {
    const firebaseApp = useFirebaseApp()
    const auth = getAuth(firebaseApp)

    useInitPerformance(
        async (firebaseApp) => {
            const { getPerformance } = await import('firebase/performance')
            return getPerformance(firebaseApp)
        },
        { suspense: false } // false because we don't want to stop render while we wait for perf
    )

    return (
        <AuthProvider sdk={auth}>
            <StoreProvider disableSplashScreen defaultTheme="dark">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/forgetPassword"
                        element={<ForgetPassword />}
                    />
                </Routes>
            </StoreProvider>
        </AuthProvider>
    )
}

export default App
