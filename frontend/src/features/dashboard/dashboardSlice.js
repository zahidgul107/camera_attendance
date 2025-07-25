import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { signOut } from '../login/userSlice'

const API_URL = 'https://aca9236bface.ngrok-free.app/api/dashboard'
//const API_URL = 'http://localhost:9901/api/dashboard'

export const getCount = createAsyncThunk(
  'attendance/getCount',
  async (arg, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser
      console.log(loggedInUser)
      console.log(`${loggedInUser.tokenType} ${loggedInUser.accessToken}`)
      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
      }

      const resp = await axios.get(API_URL + '/getDashboardCount', config)
      console.log('response:     ', resp.data)
      return resp.data
    } catch (error) {
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const initialState = {
  count: null,
  unauthorizedMessage: '',
  isLoading: false,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCount.pending, (state) => {
        state.isLoading = true
        state.count = null
      })
      .addCase(getCount.fulfilled, (state, action) => {
        state.isLoading = false
        state.count = action.payload
      })
      .addCase(getCount.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
      })
  },
})

export default dashboardSlice.reducer
