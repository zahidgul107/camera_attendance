import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/login/userSlice'
import taskReducer from './features/slice/taskListSlice'
import attendanceReducer from './features/slice/attendanceSlice'
import dashboardReducer from './features/dashboard/dashboardSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const reducer = combineReducers({
  user: userReducer,
  tasks: taskReducer,
  attendance: attendanceReducer,
  dashboard: dashboardReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
