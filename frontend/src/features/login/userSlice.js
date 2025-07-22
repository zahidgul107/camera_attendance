import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loggedInUser: '',
  unauthorizedMessage: '',
  isLoading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isLoading = true
    },
    signInSuccess: (state, action) => {
      state.isLoading = false
      state.loggedInUser = action.payload
    },
    signInFailure: (state, action) => {
      state.isLoading = false
      if (action?.payload?.response?.status === 401)
        state.unauthorizedMessage = action.payload.response.data.message
      if (action.payload.code === 'ERR_NETWORK')
        state.unauthorizedMessage = action.payload.message
    },
    signOut: () => {
      return initialState
    },
  },
  extraReducers: (builder) => {},
})

export const { signInStart, signInSuccess, signInFailure, signOut } =
  userSlice.actions

export default userSlice.reducer
