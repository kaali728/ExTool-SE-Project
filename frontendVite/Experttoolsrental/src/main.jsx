import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { configureStore } from '@reduxjs/toolkit'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {
    Provider as ReduxProvider,
    useDispatch as reduxUseDispatch,
    useSelector as reduxUseSelector,
} from 'react-redux'
import { history } from './utility/history'
import authSlice from './slices/auth/authSlice'

// firebase
import { firebaseConfig } from './firebase'
import { FirebaseAppProvider } from 'reactfire'

export const store = configureStore({
    reducer: {
        auths: authSlice,
        router: connectRouter(history),
    },
    middleware: [routerMiddleware(history)],
})

export const useSelector = reduxUseSelector
export const useDispatch = reduxUseDispatch
export const Provider = ReduxProvider

//TODO:Connected react router funktioniert nicht

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <FirebaseAppProvider firebaseConfig={firebaseConfig}>
                <App />
            </FirebaseAppProvider>
        </Provider>
    </React.StrictMode>
)
