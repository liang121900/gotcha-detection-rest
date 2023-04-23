import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: null,
    email: null,
    emailVerified: null,
    isAuthenticated: false,
    auth: {
        //Used for validating the redirect from auth server
        authState: null,
        // For storing auth code from authorize endpoint
        authCode: null,

        // For storing tokens from token endpoint
        accessToken: null,
        idToken: null,
        refreshToken: null,
    },
    accessToken: null,
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            return { ...state, ...action.payload }
        },
        resetUser: (state, action) => {
            return { ...initialState }
        },
        setAuthState: (state, action) => {
            return { ...state, auth: { ...state.auth, ...{ authState: action.payload } } }
        }
    }
});

export const {
    setUser,
    resetUser,
    setAuthState
} = userSlice.actions;


export default userSlice.reducer;