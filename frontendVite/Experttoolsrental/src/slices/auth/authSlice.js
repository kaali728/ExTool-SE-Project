import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { appwrite } from '../../utility/appwrite'

const login = createAsyncThunk('auth/login', async (email, password) => {
    try {
        await appwrite.account.createSession(email, password)
        // If all is successful then get the userdata.
        this.getUserdata()
    } catch (err) {
        console.error(err)
    }
})

const getUserdata = createAsyncThunk('auth/getuser', async () => {
    try {
        const response = await appwrite.account.get()
    } catch (err) {
        if (err.toString() === 'Error: Unauthorized') return
        console.error(err)
    }
})

const register = createAsyncThunk('auth/register', async (email, password) => {
    try {
        await appwrite.account.create(email, password)
    } catch (err) {
        console.error(err) // also console error for debugging purposes.
    }
})

const logout = createAsyncThunk('auth/logout', async () => {
    await this.setState({ userprofile: false }) // Remove the local copy of the userprofile causing the app to see that the user is not logged in.
    appwrite.account.deleteSession('current') // Tell appwrite server to remove current session and complete the logout.
})

export const authSlice = createSlice({
    name: 'authState',
    initialState: {
        user: null,
        isError: false,
    },
    reducers: {
        setError: (state, action) => {
            console.log(state.isError)
            state.isError = action.payload
        },
    },
    extraReducers: (builder) => {},
})

/* builder.addCase(login.fulfilled, (state, action) => {
    state.user = action.payload
}),
builder.addCase(login.rejected, (state, action) => {
    state.isError = action.payload
}) */

export const { setErrorTrue } = authSlice.actions

export default authSlice.reducer
