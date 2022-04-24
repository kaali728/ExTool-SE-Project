import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Login from './components/pages/auth/Login'
import Signup from './components/pages/auth/Signup'
import Dashboard from './components/pages/Dashboard'
import '@findnlink/neuro-ui/lib/style.css'
import { StoreProvider } from '@findnlink/neuro-ui'

function App() {
    return (
        <StoreProvider disableSplashScreen defaultTheme="dark">
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </Router>
        </StoreProvider>
    )
}

export default App
