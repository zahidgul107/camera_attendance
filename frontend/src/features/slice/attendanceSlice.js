import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { signOut } from '../login/userSlice'

//const API_URL = 'https://aca9236bface.ngrok-free.app/api/attendance'
export const API_URL = 'http://localhost:9901/api/attendance'

export const createAttendance = createAsyncThunk(
  'attendance/createAttendance',
  async (attendance, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser
      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
        },
      }

      const resp = await axios.post(
        API_URL + '/mark/' + loggedInUser.id,
        attendance,
        config
      )
      return resp.data
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getPagAttendance = createAsyncThunk(
  'attendance/getPagAttendance',
  async (page = 1, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser
      const params = {
        page: page,
        size: 10,
      }

      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
        },
        params: params,
      }

      const resp = await axios.get(API_URL + '/getPagAttendance', config)
      console.log(resp.data)
      return resp.data
    } catch (error) {
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const searchAttendance = createAsyncThunk(
  'attendance/search',
  async (search, thunkAPI) => {
    console.log(search)
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser

      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
        },
      }

      const resp = await axios.post(API_URL + '/search', search, config)
      return resp.data
    } catch (error) {
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const checkTodayCheckInStatus = createAsyncThunk(
  'attendance/checkTodayCheckInStatus',
  async (_, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser

      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
        },
      }

      const response = await axios.get(
        `${API_URL}/today-checkin-status`,
        config
      )
      console.log(response)
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const initialState = {
  attendanceList: [],
  errorMessage: '',
  successMessage: '',
  failMessage: '',
  isLoading: false,
  attendance: '',
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    removeAttendance: (state, action) => {
      const attendanceId = action.payload
    },
    clearMessages: (state) => {
      state.successMessage = ''
      state.failMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPagAttendance.pending, (state, action) => {
        state.isLoading = true
        state.errorMessage = ''
      })
      .addCase(getPagAttendance.fulfilled, (state, action) => {
        state.isLoading = false
        state.errorMessage = ''
        state.attendanceList = action.payload
      })
      .addCase(getPagAttendance.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
      })
      .addCase(createAttendance.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.isLoading = false
        state.successMessage = action.payload.message
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.isLoading = false
        if (action?.payload?.response?.status === 401)
          state.unauthorizedMessage = action.payload.response.data.message
        if (action?.payload?.response?.status === 400)
          state.failMessage = action.payload.response.data.message
        if (action?.payload?.response?.status === 404)
          state.failMessage = action.payload.response.data
      })
      .addCase(searchAttendance.pending, (state, action) => {
        state.isLoading = true
        state.errorMessage = ''
      })
      .addCase(searchAttendance.fulfilled, (state, action) => {
        state.isLoading = false
        state.errorMessage = ''
        state.attendanceList = action.payload
      })
      .addCase(searchAttendance.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
      })
      .addCase(checkTodayCheckInStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkTodayCheckInStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.errorMessage = ''
        state.attendance = action.payload
      })
      .addCase(checkTodayCheckInStatus.rejected, (state) => {
        state.isLoading = false
        if (action.payload.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
      })
  },
})

export const { removeAttendance, clearMessages } = attendanceSlice.actions

export default attendanceSlice.reducer
