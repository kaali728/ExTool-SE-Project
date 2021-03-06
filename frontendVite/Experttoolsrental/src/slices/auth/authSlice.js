import { createSlice } from '@reduxjs/toolkit'
import { auth } from '../../firebase'

export const slice = createSlice({
    name: 'auth',
    initialState: {
        userData: null,
        initialized: false,
    },
    reducers: {
        SET_INITIALIZED: (state, { payload }) => {
            state.initialized = payload
        },
        LOGIN: (state, { payload }) => {
            state.userData = payload.user
        },
        CREATE_USER: (state, { payload }) => {
            state.userData = payload.user
        },
        LOGOUT: (state, action) => {
            state.userData = null
        },
        SET_USER_DATA: (state, { payload }) => {
            state.userData = { ...state.userData, ...payload.userData }
        },
    },
})

export const { SET_INITIALIZED, LOGIN, LOGOUT, SET_USER_DATA, CREATE_USER } =
    slice.actions

export const setAuthListener = () => (dispatch, state) => {
    auth.onAuthStateChanged((user) => {
        if (user && !state().userAuth.initialized) {
            dispatch(LOGIN({ user: auth.currentUser.toJSON() }))
            dispatch(getUser())
        }

        !state().userAuth.initialized && dispatch(SET_INITIALIZED(true))
    })
}

export const login =
    ({ email, password }) =>
    async (dispatch, state) => {
        await auth.signInWithEmailAndPassword(email, password)

        dispatch(LOGIN({ user: auth.currentUser.toJSON() }))
        dispatch(getUser())

        return state().userAuth.userData
    }

/**
 *
 */
export const logOut = () => async (dispatch, state) => {
    await auth.signOut()
    dispatch(LOGOUT())
}

/**
 *
 */
export const getUser = () => async (dispatch, state) => {
    let userData = null
    const uid = auth.currentUser.uid

    // query user data
    const resp = await auth.firestore().collection('users').doc(uid).get()
    if (resp.exists) {
        userData = {
            id: resp.id,
            ...resp.data(),
        }
    }

    // update store
    dispatch(SET_USER_DATA({ userData }))
    return state().userAuth.userData
}

/**
 *
 */
export const createUser =
    ({ email, password }) =>
    async (dispatch, state) => {
        // create auth user
        const resp = await auth
            .auth()
            .createUserWithEmailAndPassword(email, password)

        // add user to user collection
        const uid = auth.currentUser.uid
        await auth.firestore().collection('users').doc(uid).set({
            id: uid,
            email: resp.user.email,
        })

        // update store
        dispatch(CREATE_USER({ user: auth.currentUser.toJSON() }))
        const userData = {
            ...auth.currentUser.toJSON(),
            id: uid,
            email: resp.user.email,
        }
        dispatch(SET_USER_DATA({ userData }))
    }

// The function below is called a selector and allows us to select a value from
// the state.
export const selectUser = (state) => {
    return state.userAuth.userData
}

export default slice.reducer
