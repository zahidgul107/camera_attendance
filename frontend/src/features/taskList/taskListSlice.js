import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { signOut } from '../login/userSlice'

//const API_URL = 'https://2e08-203-129-216-146.ngrok-free.app/api/task'
const API_URL = 'http://localhost:9099/api/task'

export const createTask = createAsyncThunk(
  'task/createTask',
  async (task, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser
      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
        },
      }

      const resp = await axios.post(API_URL + '/add', task, config)
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async (payload, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser
      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
        },
      }
      const resp = await axios.put(
        API_URL + '/updateTask/' + payload.id,
        payload,
        config
      )
      return resp.data
    } catch (error) {
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getAllTasks = createAsyncThunk(
  'tasks/getAllTasks',
  async (page = 0, thunkAPI) => {
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

      const resp = await axios.get(API_URL + '/getAllTasks', config)
      return resp.data
    } catch (error) {
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getPagTasks = createAsyncThunk(
  'tasks/getPagTask',
  async (page = 0, thunkAPI) => {
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

      const resp = await axios.get(API_URL + '/getPagTasks', config)
      return resp.data
    } catch (error) {
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (payload, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState()
      const loggedInUser = user.loggedInUser

      const config = {
        headers: {
          Authorization: `${loggedInUser.tokenType} ${loggedInUser.accessToken}`,
        },
      }
      const resp = await axios.delete(
        API_URL + '/deleteTask/' + payload.id,
        config
      )
      if (resp.status === 200) {
        thunkAPI.dispatch(getPagTasks(payload.currentPage))
      }
      return resp.data
    } catch (error) {
      if (error.response?.status === 400) {
        thunkAPI.dispatch(getPagTasks(payload.currentPage))
      }
      if (error?.response?.status === 401) {
        thunkAPI.dispatch(signOut())
      }
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const searchTask = createAsyncThunk(
  'tasks/search',
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

const initialState = {
  taskList: [],
  errorMessage: '',
  successMessage: '',
  failMessage: '',
  isLoading: true,
}

const taskListSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTask: (state, action) => {
      const taskId = action.payload
    },
    clearMessages: (state) => {
      state.successMessage = ''
      state.failMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPagTasks.pending, (state, action) => {
        state.isLoading = true
        state.errorMessage = ''
      })
      .addCase(getPagTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.errorMessage = ''
        state.taskList = action.payload
      })
      .addCase(getPagTasks.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
        state.errorMessage = ''
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.errorMessage = ''
        state.successMessage = action.payload
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        if (action?.payload?.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
        if (action?.payload?.response?.status === 400)
          state.failMessage = action.payload.response.data
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.successMessage = action.payload.message
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        if (action?.payload?.response?.status === 401)
          state.unauthorizedMessage = action.payload.response.data.message
        if (action?.payload?.response?.status === 400)
          state.failMessage = action.payload.response.data.message
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
        state.errorMessage = ''
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.errorMessage = ''
        state.successMessage = action.payload.message
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
        if (action.payload.response.status === 400)
          state.failMessage = action.payload.response.data
      })
      .addCase(searchTask.pending, (state, action) => {
        state.isLoading = true
        state.errorMessage = ''
      })
      .addCase(searchTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.errorMessage = ''
        state.taskList = action.payload
      })
      .addCase(searchTask.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload.code === 'ERR_NETWORK')
          state.errorMessage = action.payload.message
      })
  },
})

export const { removeTask, clearMessages } = taskListSlice.actions

export default taskListSlice.reducer
