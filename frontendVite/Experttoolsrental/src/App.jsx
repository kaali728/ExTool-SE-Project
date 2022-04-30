import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Login from './components/pages/auth/Login'
import Signup from './components/pages/auth/Signup'
import Dashboard from './components/pages/Dashboard'
import '@findnlink/neuro-ui/lib/style.css'
import { StoreProvider } from '@findnlink/neuro-ui'
import ForgetPassword from './components/pages/auth/ForgetPassword'
import { useSigninCheck } from 'reactfire'
import { useDispatch } from 'react-redux'
import { setAuthListener } from './slices/auth/authSlice'
import { Text } from '@findnlink/neuro-ui'

function App() {
    const { status, data: signInCheckResult } = useSigninCheck()

    const dispatch = useDispatch()

    ;(async () => await dispatch(setAuthListener()))()

    if (status === 'loading') {
        return <Text>loading...</Text>
    }

    return (
        <StoreProvider disableSplashScreen defaultTheme="dark">
            <Router>
                <div className="App">
                    {signInCheckResult.signedIn ? (
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                        </Routes>
                    ) : (
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route
                                path="/forgetPassword"
                                element={<ForgetPassword />}
                            />
                        </Routes>
                    )}
                </div>
            </Router>
        </StoreProvider>
    )
}

export default App
